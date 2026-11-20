import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const root = new URL('../../', import.meta.url);
const source = (await readFile(new URL('simulation/model.mjs', root), 'utf8')).replace(/\r\n/g, '\n');
const config = JSON.parse(await readFile(new URL('simulation/candidates.json', root), 'utf8')).v7;
const hash = createHash('sha256').update(source).digest('hex');
await writeFile(new URL('experiments/level-v7/model-portable.mjs', root), `// 생성 파일: tools/level-v7/prepare.mjs, 원본 SHA256 ${hash}\n` + source.replace("'./common.mjs'", "'./random.mjs'"));
let intervention = source.replace("'./common.mjs'", "'./random.mjs'");
for (const [from, to] of [
  ['converted = recoil * (config.ventFactor + rank)', "converted = options.ablateEngine === 'recoil' ? 0 : recoil * (config.ventFactor + rank)"],
  ['const vulnerableFactor = wasVulnerable ?', "const vulnerableFactor = wasVulnerable && options.ablateEngine !== 'wound' ?"],
  ['thermal = Math.floor(heatConsumed *', "thermal = options.ablateEngine === 'heat' || options.ablateEngine === 'cauterize' && id === 'cauterize' ? 0 : Math.floor(heatConsumed *"],
  ["if (id === 'resonance' && after.explosive > 0 && !options.ablate)", "if (id === 'resonance' && after.explosive > 0 && !options.ablate && options.ablateEngine !== 'concussion')"],
  ['const explosion = chargeConsumed * config.explosionFactor', "const explosion = options.ablateEngine === 'blast' ? 0 : chargeConsumed * config.explosionFactor"],
]) {
  if (intervention.split(from).length !== 2) throw new Error(`반사실 생성 위치 불일치: ${from}`);
  intervention = intervention.replace(from, to);
}
await writeFile(new URL('experiments/level-v7/model-ablation.mjs', root), `// 반사실 전용: 실플레이 사용 금지. 원본 SHA256 ${hash}\n` + intervention);
await writeFile(new URL('experiments/level-v7/v7-config.json', root), JSON.stringify(config, null, 2) + '\n');
console.log(JSON.stringify({ originalModelSHA256: hash, change: '가져오기 경로만 교체, v7 수치 보존' }));
