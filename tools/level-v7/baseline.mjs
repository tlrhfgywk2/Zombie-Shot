import { mkdir, writeFile } from 'node:fs/promises';
import { production, root } from './runtime.mjs';
import { rng, shuffle, pick } from '../../experiments/level-v7/random.mjs';
const p = await production();
const strategies = ['random', 'damage', 'heuristic', 'competent', 'optimized'];
const rows = [];
for (const strategy of strategies) {
  for (let seed = 21001; seed <= 21080; seed++) {
    const run = new p.ExplorationRun(`level-${seed}`), player = new p.Player();
    player.startRun('exploration', 'p220');
    const random = rng(seed), resolver = new p.CombatResolver(random), logs = [], rewards = [];
    let died = false;
    for (const layer of run.layers) {
      const route = run.enter(0);
      if (route !== layer[0]) throw new Error('경로 재현 실패');
      if (route.kind === 'combat') {
        player.startStage(); let enemy = p.createEnemyState(route.enemy);
        for (let turn = 1; turn <= 12; turn++) {
          const cap = player.magazine.capacity;
          const pool = [...Object.entries(player.getStock()).flatMap(([id, n]) => Array(n).fill(id)), ...Array(cap).fill('ball')];
          const context = { weaponId: 'p220', loadout: player.loadout.getSnapshot(), playerState: player.getCombatState(), magazineCapacity: cap };
          let rounds;
          if (strategy === 'random') rounds = shuffle(pool, random).slice(0, cap);
          else if (strategy === 'damage') rounds = [...pool].sort((a, b) => p.AMMO_DEFINITIONS[b].firepower - p.AMMO_DEFINITIONS[a].firepower).slice(0, cap);
          else {
            const candidates = [Array(cap).fill('ball'), ...Array.from({ length: strategy === 'optimized' ? 128 : strategy === 'competent' ? 12 : 3 }, () => shuffle(pool, random).slice(0, cap))];
            const score = r => {
              const shot = resolver.resolveSequence(r, enemy, context), action = resolver.resolveEnemyAction(shot.finalState, context.playerState, context.loadout);
              return (shot.killed ? 1e6 : 0) - (action.playerKilled ? 1e7 : 0) + shot.totalHpDamage * 10 - shot.shots.filter(s => s.ammoType !== 'ball').length;
            };
            rounds = candidates.sort((a, b) => score(b) - score(a))[0];
          }
          for (const id of rounds) if (!player.addAmmo(id)) throw new Error('기준 탄약 예약 실패');
          const shot = resolver.resolveSequence(rounds, enemy, context);
          for (const fired of shot.shots) player.fireRound(fired);
          player.magazine.clear(); enemy = shot.finalState;
          const action = shot.killed ? null : resolver.resolveEnemyAction(enemy, context.playerState, context.loadout);
          logs.push({ depth: run.depth, enemy: route.enemy, turn, rounds, fired: shot.shots.map(s => s.ammoType), damage: shot.totalHpDamage, died: action?.playerKilled ?? false });
          if (shot.killed) {
            run.settleCombat(); player.endEncounter();
            if (route.attachment) player.claimAttachment(route.attachment);
            const chosen = strategy === 'random' ? pick(route.rewards, random) : [...route.rewards].sort((a, b) => p.AMMO_DEFINITIONS[b].firepower - p.AMMO_DEFINITIONS[a].firepower)[0];
            if (chosen) player.exchangeAmmo([], [chosen]);
            rewards.push({ depth: run.depth, chosen, rejected: route.rewards.filter(id => id !== chosen) });
            break;
          }
          if (action.playerKilled || turn === 12) { died = true; break; }
          enemy = action.after; player.applyCombatState(action.playerAfter);
        }
      }
      // 명시적인 대조 경로: 양 갈림길 중 왼쪽, 사건/상인 거래는 건너뛴다. 전체 경로 최적 승률이 아니다.
      run.leave(); if (died) break;
    }
    rows.push({ seed, strategy, won: !died, reached: run.depth, logs, rewards });
  }
}
const summary = Object.fromEntries(strategies.map(strategy => { const cell = rows.filter(r => r.strategy === strategy); return [strategy, { n: cell.length, wins: cell.filter(r => r.won).length,
  winRate: cell.filter(r => r.won).length / cell.length, turnsPerRun: cell.flatMap(r => r.logs).length / cell.length }]; }));
await mkdir(new URL('experiments/level-v7/results/', root), { recursive: true });
await writeFile(new URL('experiments/level-v7/results/production-baseline.json', root), JSON.stringify({ revision: '85e6d22', path: '왼쪽 고정/사건·거래 생략/보상 실제 획득/원래 Player와 CombatResolver', summary, rows }, null, 2));
console.log(JSON.stringify(summary));
