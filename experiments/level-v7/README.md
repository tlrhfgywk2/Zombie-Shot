# 레벨 v7 격리 플레이 후보

최종 후보는 candidate-6.json이다. 생산 게임과 원래 v7 명세·평가 결과를 바꾸지 않는다. 자동 판정은 A/B/C/D/F 통과, E/G 실패다. 출시/재미 입증으로 해석하지 않는다. 자동 병합과 배포는 금지돼 있다.

프로젝트 루트에서 개발 서버를 실행한다.

```sh
npm ci
npm run dev -- --host 127.0.0.1
```

후보 주소: `http://127.0.0.1:5173/Zombie-Shot/experiments/level-v7/?seed=21002`

일반 게임은 원래 루트 주소다. 실험 페이지는 일반 프로덕션 빌드의 진입점에 포함되지 않는다. 별도 검증 페이지에서 원래 Three.js 모델·장전·사격 연출을 그대로 사용하며 소작탄은 기존 화염 탄약 연출을 재사용한다. 플레이어 손/팔 모델은 추가하지 않았다.

재현 명령, 시드, 실제 입력 시나리오는 루트 playtest_scenarios.md에 있다. 검증 자동화 참조는 `?validation=1`, 연출 진단은 기존 `?presentationDebug=1`일 때만 나타난다.

- 설계: ../../level_design_v7.md
- 비교: ../../progression_comparison.md
- 판정과 실행 근거: ../../gameplay_validation_report.md
- 빌드/보상 분석: ../../build_usage_report.md
- 실패와 반복 기록: ../../iteration_log.md

지문/레지스트리는 이미 사용한 홀드아웃 구간을 보호한다. 현재 후보·평가의 변경 뒤에는3730001~3730080을 새 독립 검증으로 재사용할 수 없다. 이전1730001/2730001 구간도 노출된 자료다. 현재 지문은 results/candidate-6-holdout-summary.json과 results/holdout-registry.json에 있다. 과거 체크포인트는 b4aa5ad와 e45b24f다.

E: 숙련/초보의 급격한 격차와 목표 상한 초과. G: 생산 v7 미이식 및 거리 경계 모델 차이. 다음 작업에서 이 한계를 숨기지 말고 먼저 검증 보고서를 읽는다.
