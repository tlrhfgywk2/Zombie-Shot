// 최초 레벨 평가의 지문 범위를 보강한다. 후보/계산/보상/시드/기준 수치 변경은 허용하지 않는다.
import { readFile, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { levelFingerprint } from './provenance.mjs';
import { root } from './runtime.mjs';
const frozenRevision = 'b4aa5ad';
for (const file of ['experiments/level-v7/engine.mjs', 'experiments/level-v7/design.mjs', 'experiments/level-v7/model-portable.mjs', 'experiments/level-v7/model-ablation.mjs', 'experiments/level-v7/random.mjs', 'experiments/level-v7/protocol.json', 'experiments/level-v7/candidate-4.json']) {
  const old = spawnSync('git', ['show', `${frozenRevision}:${file}`], { cwd: fileURLToPath(root), encoding: 'utf8' });
  const current = await readFile(new URL(file, root), 'utf8');
  if (old.status !== 0 || old.stdout.replace(/\r\n/g, '\n') !== current.replace(/\r\n/g, '\n')) throw new Error(`동결 소스 변경: ${file}`);
}
const settings = JSON.parse(await readFile(new URL('experiments/level-v7/candidate-4.json', root)));
const proof = await levelFingerprint(settings), path = new URL('experiments/level-v7/results/holdout-registry.json', root);
const registry = JSON.parse(await readFile(path));
registry[0].portableHash = proof.hash;
registry[0].provenanceMigration = '지문 입력 그래프 확장과 노출 구간 중첩 검사만 수정. 수치 루프와 후보는 b4aa5ad 동치.';
await writeFile(path, JSON.stringify(registry, null, 2));
await writeFile(new URL('experiments/level-v7/results/provenance.json', root), JSON.stringify({ frozenRevision, originalHash: registry[0].hash, ...proof }, null, 2));
console.log(proof.hash);
