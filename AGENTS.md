# Zombie Shot agent guide

## Project guardrails

Zombie Shot is a TypeScript, Vite, and Three.js browser/WebGL game supporting desktop and smartphone portrait layouts. Its primary design focus is ammunition choice and firing order. Do not casually change combat rules during presentation, infrastructure, or debugging work.

Preserve presentation diagnostics. Markers, anchors, bounds, effect diagnostics, and labels must remain behind an explicit option such as `?presentationDebug=1` and must never appear in ordinary play.

## Branch and deployment policy

- `develop` is the authoritative integration branch and the target for normal feature/fix PRs.
- `release` is the validated promotion branch; do not modify it during normal development.
- `main` is the stable baseline; do not modify it during normal development.
- Use `develop -> task branch -> PR -> develop` for normal feature/fix work.
- For PRs whose base is `develop`, the agent is explicitly authorized and expected to complete integration without waiting for manual user approval: push the task branch, open or update the PR, wait for all required PR checks, and when every required check passes and the PR is mergeable with no unresolved blocking issue, merge the PR into `develop` itself.
- After merging into `develop`, verify that the new `develop` head contains the merged work and that the GitHub Pages deployment for that exact integration revision completes successfully. If deployment fails because of the submitted change or repository workflow, investigate and fix it before reporting the task complete.
- Do not auto-merge into `release` or `main`. Promotion to those branches remains a separate explicit user decision unless the user specifically instructs otherwise.
- Exactly one workflow may publish `develop` to `gh-pages`. Task branches must not overwrite public Pages.
- The deployed game must retain its subtle visible `BUILD <short-sha>` marker. The marker and deployment must identify the same source revision; never hard-code or remove it. Local previews may show `BUILD LOCAL`.

## Validation

For normal source changes, run where applicable: `npm test`, `npm run lint`, and `npm run build`. Visual work additionally requires rendered-browser validation at desktop `1440x900` and portrait `390x844`.

For visual acceptance, the rendered result is the source of truth. Tests, matching transforms, object existence, state transitions, and spawn logs are supplementary evidence only. If preview and Pages differ, first compare the visible BUILD SHA and deployment source revision, then investigate runtime differences rather than assuming cache.

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
