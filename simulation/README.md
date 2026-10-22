# 독립 탄약 검증

Node22 이상과 저장소의 `npm ci` 의존성만 사용한다. Vite/Three.js 앱에서는 이 디렉터리를 가져오지 않는다. 원본 TS 전투 계산기는 esbuild로 메모리에서 번들하며 파일을 쓰거나 원본 객체를 수정하지 않는다. 후보의 사격 계산은 독립 구현, 적 행동은 원본 계산기를 재사용한다.

```sh
npm ci
node simulation/baseline.mjs
node --test simulation/model.check.mjs
node simulation/evaluate.mjs v7 exploratory all
node simulation/evaluate.mjs v7 holdout all
node simulation/report.mjs
node simulation/confirm-niches.mjs
node simulation/report.mjs
node simulation/verify.mjs
```

부분 조사: `all` 대신 `potential`, `combat`, `acquisition`. 홀드아웃은 부분 실행을 금지한다. 저장된 시드930001~930100은 **이미 최종 후보를 평가한 자료**이므로 후속 설계의 새로운 홀드아웃으로 쓰지 않는다. 같은 코드·후보·규약의 결정론적 재현만 허용한다. 다른 후보로 사용하면 레지스트리가 거부한다.

한 사례의 실제 탄약 소모·상태·피해·생존 trace:

```sh
node simulation/replay.mjs 11001 9 wound groundshaker 3
```

인자 순서는 시드, 전투 전 단계1/9/18, 빌드ID, 적ID, 거리다. `utility`는 생존·소모 고려, `theoretical`은 HP를 자르지 않은 전체 탄창 피해만 최대화한 선택이다. 둘 다 실제 발사는 원래 HP와 유한 재고를 쓴다.

결과 구성:

- `baseline.json`: 원본 전투 규칙 기준 측정과 탐험 프로토타입 감사.
- `v7-*-all.json.gz`: 모든 게이트와 셀별 수치, 획득 런 원자료. 계산된 G는 최종 검증기에서 테스트·문서와 합쳐 판정한다.
- `v7-*-potential-raw.json.gz`: 시드별 자연 재고·제작 등급·부착물·탄창·잠재 피해.
- `v7-*-combat-pairs.json.gz`: 유틸리티/이론 피해 전략의 모든 생존·경제 쌍 비교.
- `combat_cells.csv`: 전 적·거리·단계·빌드·전략의 승률, 구간과 탄수. 실패 셀도 포함한다.
- `historical-*.json.gz`: 실패한 후보를 포함한 당시 결과. v3 중단은 미완료로 명시한다.
- `holdout-registry.json`: 노출 시드와 동결 평가 해시.
- `niche-confirmation.json`: 발견한 네 주축 시나리오를 새1000시드·24000조우로 추가 확인한 수치와 쌍 신뢰구간.
- `final-validation.json`: 양쪽 평가와 실제 단위 검사·문서 검사를 합친 최종 판정.

`archive-results.mjs`는 완료 후 중복 중간 파일을 압축 정리한다. 같은 결과는 다시 계산할 수 있다. 빌드·프로덕션 테스트는 기존 `npm test`, `npm run lint`, `npm run build`를 별도 실행한다. UI/에셋 변경이 없어 렌더 브라우저 검사는 적용 대상이 아니다.

범위: P220 자연 용량4~6이 주 평가, 8발은 획득 불가능한 확장 시험. 다른3종 총은 반동·거리·특성의 원본 동치 검사까지이며 전체 런의 균형 검증을 완료한 것은 아니다. 18전투 및 제작 보상은 현행9노드 탐험에 없는 제안 의존성이다.
