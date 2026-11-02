import { build } from 'esbuild';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const bundle = await build({ entryPoints: [fileURLToPath(new URL('src/simulation/SpecialInfectedBalance.ts', root))], bundle: true, write: false, platform: 'node', format: 'esm' });
try {
  const { specialBehaviorReport } = await import('data:text/javascript;base64,' + Buffer.from(bundle.outputFiles[0].text).toString('base64'));
  const report = specialBehaviorReport();
  const output = new URL('docs/validation/special-infected/', root);
  await mkdir(output, { recursive: true });
  await writeFile(new URL('balance.json', output), JSON.stringify(report, null, 2) + '\n');
  console.table(report.scenarios.map(({ label, turns, shots, specialSpent, hpPerShot, interruptions, won }) =>
    ({ 사례: label, 턴: turns, 발수: shots, 특수탄: specialSpent, 발당피해: hpPerShot, 중단: interruptions, 승리: won })));
  console.log(`같은 거리 ${report.sameDistance.distance} m: 방어 ${report.sameDistance.guard}, 준비 노출 ${report.sameDistance.windup}`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
