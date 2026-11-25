# 전투 시험장 분석 도구

프로젝트 루트에서 Node.js 22 이상과 `npm ci`로 의존성을 준비한다. 아래 명령은 브라우저 없이 실행할 수 있다. 예시 파일은 두 탄창분의 재고로 최대 세 턴을 진행한다. [조우 설정 예시](combat-analysis-example.json)

```sh
npm run combat -- catalog
npm run combat -- ordered --config docs/combat-analysis-example.json --out combat.local/encounter.json
npm run combat -- single --out combat.local/single.json
npm run combat -- compare --sequence "serrated_round,split_round,pulse_round,convergence_round" --against "convergence_round,pulse_round,split_round,serrated_round"
npm run combat -- search --seed 20261125 --limit 500 --out combat.local/search.json
npm run combat -- search --config docs/combat-analysis-example.json --out combat.local/fixed.json
npm run combat -- stress --seed 20261125 --limit 5000 --out combat.local/stress.json
npm run combat -- trace --config docs/combat-analysis-example.json --stream combat.local/events.ndjson --out combat.local/trace.json
```

기계가 표준 출력을 직접 읽을 때는 `node tools/combat-analysis.mjs`를 쓰거나 `npm run --silent combat --`를 쓴다. `--out`은 결과를 UTF-8 JSON 파일로 쓴다. 출력에는 명령, 소스 커밋, 분석 소스의 미커밋 변경 여부가 들어간다. 실측 보고서의 실험 전체는 다음 명령으로 다시 실행할 수 있다. [실측 보고서](combat-analysis-report.md)

```sh
node docs/validation/combat-analysis/reproduce.mjs combat.local/results.json
```

## 시나리오 구성

JSON의 최상위 `scenario`에 다음 필드를 넣는다. `catalog`가 현재 게임의 등록 탄약 ID와 무기를 보여 준다.

| 필드 | 동작과 기본값 |
| --- | --- |
| `mode` | `analysis`는 체력 100,000의 분석 표적, `encounter`는 게임 기본 무한 체력으로 시작한다. 두 모드 모두 실제 감염체의 접근과 접촉 패배를 처리한다. 유한 조우에는 `maxHp`를 지정한다. |
| `weapon`, `capacity`, `sequence` | 현재 P220 한 종류, 정확히 네 칸. 기본은 표준탄 네 발이다. 같은 순서를 매 턴 다시 장전한다. |
| `inventory` | 탄약 ID별 사용 가능 수량. 생략하면 해당 순서 한 탄창분이다. 다음 탄창 전체를 채울 수 없으면 사격 전에 `inventory-exhausted`로 멈춘다. 처치 시 실제 발사한 탄만 차감한다. 명시적으로 `"unlimited"`를 지정하면 재고 제한을 해제한다. |
| `maxHp`, `hp` | 양의 정수. 현재 체력은 최대 체력 이하이며 기본은 최대 체력이다. 무한 표적은 JSON 문자열 `"infinite"`를 쓴다. 이 표적의 유효 체력 감소는 0이다. |
| `distance`, `approach` | 시작 거리와 턴당 접근량. 기본은 3과 1. 거리는 적 행동과 조우의 남은 턴 수를 결정한다. |
| `wound`, `vulnerable`, `heat` | 기본은 상처 0, 취약 없음, 열 0. 예를 들어 `"vulnerable":{"percent":25,"remaining":1}`로 현재 취약탄의 남은 한 턴을 설정한다. 가열된 무기나 이미 상처 입은 표적도 비교할 수 있다. |
| `turns`, `seed` | 기본 한 턴과 시드 1. 전투 판정은 동일한 입력에서 결정적이다. 검색과 스트레스 조우 생성에만 지역 난수기를 쓴다. |

`ordered`의 최상위 `repetitions`(1~1,000)는 완전히 같은 초기 상태에서 다시 시작한다. 첫 실행의 프레임 전체와 각 반복의 총피해를 반환한다. `turns` 배열의 시작·끝 상태와 피해로 상처, 발열, 냉각, 적 행동, 누적 피해를 추적한다. 결과는 승리·패배·설정한 턴 상한·재고 소진으로 구분한다. 현재 시험장의 단일 표적, 네 칸, 자유 탄약 선택이 측정 범위다. 기존 탐험 모드의 탄가, 희귀도, 부착물, 반동은 이 경로의 변수가 아니다.

## 분석값 읽기

- `single`의 `cold`는 첫 칸에서 측정한 탄의 직접 피해와 그 탄에서 예약한 지연 피해다. 뒤의 세 표준탄은 해당 탄의 수치에서 제외한다. `prepared`는 톱니탄 → 취약탄 → 매개탄 다음의 마지막 칸을 측정한다. 유한 표적의 시작 체력도 처형 기준 이하로 맞춘다. 여러 조건이 동시에 바뀌므로 두 수치의 차이 하나만으로 개별 특성의 효과를 분리할 수 없다. 취약·상처 부여와 순수 피해, 처치나 재고로 인한 미발사(`shots: 0`)를 함께 본다.
- `ordered`의 `metrics.totalDamage = modifiedDamage + woundDamage + impactDamage`다. `modifiedDamage`에는 원시 피해, 조건부 기본 보너스, 취약·열·최종 반올림에 따른 변화가 들어간다. 추격 조건의 추가 타격은 별도의 실제 타격으로 집계된다. `directDamage + delayedDamage`도 같은 총피해이며 지연 피해를 성분 합에 다시 더하면 중복이다. `effectiveDamage`는 실제로 줄어든 체력이고 `shots`는 소모 탄 수, `hits`는 반향을 포함한 독립 타격 수다.
- `compare`의 `delta`는 선택 탄창에서 기준 탄창을 뺀 총피해 차이다. `orderOnly`가 참이면 같은 탄종과 수량의 순서 비교다. `--against` 생략 시 표준탄 네 발이 기준이다. 각 칸을 하나만 바꾼 결과도 같이 구한다. `interactionDelta`는 전체 차이에서 한 칸씩 바꾼 차이들의 합을 뺀 수치로, 해당 기준과 배치에 의존한다. 상처, 발열, 처치 시점 등 여러 요인이 함께 작용한다.
- `search`의 `pool`은 허용 탄약, `fixed`는 고정할 네 칸(`null`은 자유), `scenario.inventory`는 사용할 수량이다. 합법 순서를 먼저 세고 예산 이하면 전수, 예산을 넘으면 시드로 중복 없이 표본을 뽑는다. 기본 예산은 500이며 `--limit 5000` 등으로 늘릴 수 있다. 선택적 `search.maxMs`는 시나리오 사이에서 확인하는 시간 상한이다. 같은 표본 전체를 재현하려면 시간 상한을 생략한다. `exhaustive`가 참일 때만 검색 공간의 최댓값으로 읽는다.
- 검색 결과는 최저·최고·평균, 선형 보간한 중앙값·10/90백분위, 상하위 탄창을 담는다. `upperDecile.ammoCounts`는 상위 10% 경계와 동점인 순서까지 포함해 센 **탄창 내 등장 횟수**다.

단탄 결과의 `cold.scenario`와 `prepared.scenario`에는 그 행에서 실제 사용한 순서와 재고가 있다. `conditionalBaseDamage`는 첫 타격에 더한 조건부 기본값이고, `conditionalHits`와 `conditionalHitDamage`는 계열 조건으로 추가된 타격의 횟수와 그 타격의 최종 피해다. 이 피해는 총피해에 이미 포함된다. 탄창 비교에서 재고 부족으로 대조군을 발사할 수 없거나 재고 때문에 관찰 턴 수가 달라지면 해당 차이는 `null`이다. 한 칸 대조가 성립하지 않아도 원래 두 순서가 모두 실행되면 두 결과의 차이는 확인할 수 있다.

## 실패 재현과 피해 추적

스트레스 검사는 고정 회귀 사례를 먼저 실행하고, 그 뒤에 `--limit`만큼 무작위 조우를 검사한다. `--limit 0`은 고정 검사만 실행한다. 설정의 `stress.maxFailures`는 수집할 실패 수다. 실패 JSON에는 시드·순서·초기 상태, 턴·발사·타격, 실패 직전과 관측값, 기대값, 스택이 들어간다. 재현은 원래 생성 배치 없이 저장한 개별 설정을 다시 검사한다. 첫 실패를 재현하는 명령은 다음과 같다.

```sh
npm run combat -- replay --config combat.local/stress.json --index 0 --out combat.local/replay.json
npm test -- src/prototype/analysis/stress.test.ts
```

검사 또는 재현에서 위반을 발견하면 명령 종료 코드는 1이다. 테스트는 관측값 한 곳에 의도적으로 오류를 주입해 JSON 왕복 후 같은 타격에서 검출되는지도 확인한다. 현재 P220은 네 칸이 모두 차야 발사할 수 있어 재현 자료는 합법적인 원래 탄창 전체를 보존한다.

브라우저에서는 `npm run dev`가 표시한 주소에 `?combatTrace=1`을 붙이고 사격한다. 개발자 콘솔에서 다음 명령을 사용할 수 있다.

```js
window.combatTrace.recent({ turn: 1, ammo: 'pulse_round' }, 20)
window.combatTrace.recent({ targetId: 'target-1', source: 'echo' })
copy(JSON.stringify(window.combatTrace.export(), null, 2))
```

마지막 줄의 `copy`는 Chrome·Edge 개발자 콘솔 명령이다. 브라우저는 최신 2,048건을 보관한다. 내보낸 `recorded`는 전체 발생 수, `dropped`는 보관 한도를 넘어간 수다. CLI는 `trace.capacity`로 보관량을 정하고, `trace.filter`로 전투·표적·탄약·턴·피해원(`combatId`, `targetId`, `ammo`, `turn`, `source`)을 고른다. 전체 전투가 길면 `--stream`이 필터와 버퍼 한도에 관계없이 메타데이터 한 줄, 실제 이벤트들, 마지막 집계 한 줄을 NDJSON으로 기록한다.

발사·타격·턴 번호는 추적에서 1부터 시작한다. 지연 타격은 같은 전투·표적·턴의 `shot`과 `effectId`로 원래 발사에 연결한다. `pending`은 생성·해결·취소 기록이고 실제 피해는 `kind: "hit"`에서 센다. `appliedTransferBps`는 이 연결에 쓴 전이율, `ownTransferBps`는 이번 타격의 고유율이다. 4,000은 40%다. `turn-end`의 전후 상태에서 반향 처리 뒤 이루어지는 상처 감쇠, 타격 이력 초기화, 냉각을 확인할 수 있다.

## 새 규칙 연결

활성 진입점은 `src/main.ts` → `CombatView` → `CombatController`다. 분석 어댑터는 같은 `startEncounter`, `lockMagazine`, `resolveVolley`를 실행하고 생성되는 프레임을 집계한다. 등록된 새 탄약은 `src/prototype/rules.ts`의 `ammo`를 통해 자동으로 단탄·검색·스트레스 대상이 된다. 일반 게임과 분석용 열·상처·충격 계산식은 한 곳에 있다.

새 피해원이 필요하면 실제 규칙에 피해원 ID와 판정 시점을 추가하고 `resolveDamage`의 실제 결과를 관측 프레임으로 전달한다. 신규 프레임 종류는 시뮬레이터의 타격 집계와 스트레스 검사에 연결한다. 상태 누적·예약과 독립 타격을 구별하고, 기여 성분의 합과 실제 타격 합이 일치하는 회귀 사례를 추가한다. 시각 연출이나 진단 화면은 이 계산 경로를 호출하는 쪽에 둔다.
