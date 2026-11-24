# Zombie Shot agent guide

## Project guardrails

Zombie Shot is a TypeScript, Vite, and Three.js browser/WebGL game supporting desktop and smartphone portrait layouts. Its primary design focus is ammunition choice and firing order. Do not casually change combat rules during presentation, infrastructure, or debugging work.

Preserve presentation diagnostics. Markers, anchors, bounds, effect diagnostics, and labels must remain behind an explicit option such as `?presentationDebug=1` and must never appear in ordinary play.

Keep visible UI copy minimal. Prefer icons, values, bars, disabled states, and direct manipulation over explanatory sentences or action logs. Add text only when the player cannot reasonably infer a mechanic or make a meaningful choice without it; avoid restating animations, previews, button labels, or immediately visible results.

플레이어의 손·손가락·팔 모델은 게임에 표시하지 않는다. 총기와 탄창의 조작은 해당 물체의 움직임으로만 표현한다.

PC의 전투 의사결정 정보는 한눈에 읽혀야 한다. 체력, 화력, 방어 파괴, 충격, 행동 중단 임계치, 거리와 같은 핵심 수치에 작은 보조 텍스트 크기를 사용하지 않는다. 새 전투 UI는 `--combat-value-size`와 `--combat-value-prominent` 같은 공용 전투 수치 토큰을 우선 사용하고, 기존의 읽기 쉬운 전투 수치 또는 용어 툴팁을 최소 가독성 기준으로 삼는다.

## Branch and deployment policy

- `develop` is the authoritative integration branch and the target for normal feature/fix PRs.
- `release` is the validated promotion branch; do not modify it during normal development.
- `main` is the stable baseline; do not modify it during normal development.
- Use `develop -> task branch -> PR -> develop` for normal feature/fix work.
- 작업 브랜치에서 구현·로컬 검증·커밋·푸시 후 PR을 연다. 최신 기준에 대한 필수 CI 통과와 검토 대화 해결을 확인하고 사용자의 명시적 병합 결정까지 PR을 열어 둔다. 자동 병합을 예약하지 않는다.
- After merging into `develop`, verify that the new `develop` head contains the merged work and that the GitHub Pages deployment for that exact integration revision completes successfully. If deployment fails because of the submitted change or repository workflow, investigate and fix it before reporting the task complete.
- Do not auto-merge into `release` or `main`. Promotion to those branches remains a separate explicit user decision unless the user specifically instructs otherwise.
- Exactly one workflow may publish `develop` to `gh-pages`. Task branches must not overwrite public Pages.
- The deployed game must retain its subtle visible `BUILD <short-sha>` marker. The marker and deployment must identify the same source revision; never hard-code or remove it. Local previews may show `BUILD LOCAL`.

- 병합 뒤 작업 브랜치의 로컬·원격 끝 커밋을 각각 확인한다. 통합 브랜치의 조상이거나 병합된 PR의 정확한 헤드이며 병합 커밋이 통합 이력에 남아 있는 경우에만 정리한다. 활성 작업 트리·열린 PR·보호 브랜치·배포 브랜치를 보존하고 삭제 직전 끝 커밋을 다시 확인한다.

## Validation

For normal source changes, run where applicable: `npm test`, `npm run lint`, and `npm run build`. Visual work additionally requires rendered-browser validation at desktop `1440x900` and portrait `390x844`.

For visual acceptance, the rendered result is the source of truth. Tests, matching transforms, object existence, state transitions, and spawn logs are supplementary evidence only. If preview and Pages differ, first compare the visible BUILD SHA and deployment source revision, then investigate runtime differences rather than assuming cache.

UI/UX 변경은 정상 상태만 보지 말고 해당 기능의 대표적인 경계 상태까지 실제 렌더링으로 검증한다. 반복 카드·슬롯 UI는 빈 상태, 모든 슬롯이 채워진 상태, 긴 이름, 수치 조합, 예상 처치로 뒤쪽 탄이 미발사되는 상태를 포함해 정렬과 오버플로를 확인한다. 요소 존재나 텍스트 값만으로 시각 검증을 대체하지 말고, 데스크톱과 세로 화면에서 탄 그림·제목·핵심 수치의 기준선과 컨테이너 경계를 직접 확인한다.

## Cross-account handoff

Never assume the next Codex session can read a previous conversation. GitHub is the persistent handoff layer. Stable rules belong here; task-specific progress belongs in the task PR description. Before stopping substantial or incomplete work, commit useful logical checkpoints and update the PR without falsely claiming completion or unrun validation.

Use a concise, technically sufficient PR section (do not paste source files or refer to prior chats):

```md
## Codex Handoff
### Goal
### Current status
### Completed
### Remaining
### Confirmed findings
### Failed / rejected approaches
### Validation completed
- Tests:
- Lint:
- Build:
- Browser:
- Pages:
### Important files
### Exact next step
### Resume instructions
Start from this PR's head branch. Read AGENTS.md, this PR description,
recent commits, and the current diff before editing.
```

When resuming another account's task: (1) read this file; (2) read the PR title and description; (3) identify its head and base branches; (4) inspect recent task-branch commits; (5) inspect the diff against `develop`; (6) read the listed Important files; (7) read recorded test/build results; (8) check repository status; and (9) follow Exact next step. Repository evidence and the PR handoff are authoritative. Do not restart or repeat completed work unless investigation proves it unusable.
