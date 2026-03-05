# CLAUDE.md — ClaudeMobile

This file provides context and instructions for AI assistants (Claude, Copilot, etc.) working in this repository.

---

## Repository Status

> **Note:** This repository is newly initialized and currently empty. This file was created to establish conventions before code is added. Update each section as the project is built out.

- **Repository:** `byscars/ClaudeMobile`
- **Primary branch:** `main` (or `master` — update once established)
- **Development branch pattern:** `claude/<description>-<session-id>`

---

## Project Overview

**ClaudeMobile** — *(fill in a one-paragraph description once the project is defined)*

Likely a mobile application project. Until source code is committed, the following sections serve as conventions to follow when code is added.

---

## Repository Structure

*(Update this section once files exist)*

```
ClaudeMobile/
├── CLAUDE.md          # This file — AI assistant guidance
├── README.md          # Human-facing project documentation
├── .gitignore         # Files excluded from version control
└── ...                # Source directories to be added
```

Typical mobile project layouts to follow:

- **React Native:** `src/`, `android/`, `ios/`, `__tests__/`
- **Flutter:** `lib/`, `android/`, `ios/`, `test/`
- **Native Android:** `app/src/main/`, `app/src/test/`
- **Native iOS:** `<AppName>/`, `<AppName>Tests/`

---

## Development Setup

*(Fill in once the tech stack is chosen)*

### Prerequisites

- [ ] Runtime/SDK version (e.g., Node 20+, Flutter 3.x, JDK 17)
- [ ] Package manager (npm/yarn/pnpm, pub, gradle)
- [ ] Mobile emulator/simulator setup

### Install Dependencies

```bash
# Example — replace with actual commands
npm install
# or
flutter pub get
```

### Environment Variables

- Copy `.env.example` to `.env` and fill in values.
- Never commit `.env` files with real secrets.

---

## Common Commands

*(Fill in once scripts are defined — examples below)*

| Task | Command |
|------|---------|
| Install deps | `npm install` |
| Start dev server | `npm start` |
| Run on Android | `npm run android` |
| Run on iOS | `npm run ios` |
| Run tests | `npm test` |
| Run linter | `npm run lint` |
| Type check | `npm run typecheck` |
| Build release | `npm run build` |

---

## Code Conventions

### General

- Prefer small, focused functions with a single responsibility.
- Do not add comments unless the logic is non-obvious.
- Do not introduce error handling for scenarios that cannot happen.
- Do not add docstrings, type annotations, or refactoring beyond what was directly requested.
- Avoid over-engineering — the right complexity is the minimum needed.

### Naming

- Use descriptive, intention-revealing names.
- Follow the naming convention of the surrounding code (camelCase, snake_case, PascalCase as appropriate).

### File Organization

- Co-locate related files (tests next to source, styles next to components).
- Keep individual files reasonably small; split when a file grows unwieldy.

### Security

- Never commit secrets, API keys, or credentials.
- Validate at system boundaries (user input, external APIs); trust internal code.
- Avoid common vulnerabilities: SQL injection, XSS, command injection (OWASP Top 10).

---

## Testing

*(Fill in once test framework is chosen)*

- Write tests for new functionality and bug fixes.
- Tests live alongside source files or in a dedicated `__tests__/` / `test/` directory.
- Run the full test suite before committing.
- Aim for meaningful coverage, not 100% line coverage for its own sake.

---

## Git Workflow

### Branch Naming

- Feature branches: `feature/<short-description>`
- Bug fixes: `fix/<short-description>`
- AI-assisted branches: `claude/<description>-<session-id>`

### Commit Messages

- Use the imperative mood: "Add feature" not "Added feature".
- Keep the subject line under 72 characters.
- Reference issue numbers where applicable: `Fix login crash (#42)`.

### Pull Requests

- Keep PRs focused and small where possible.
- Include a description of what changed and why.
- Ensure tests and linting pass before requesting review.

### Protected Branches

- Never force-push to `main` or `master`.
- Never skip pre-commit hooks (`--no-verify`) without explicit approval.

---

## AI Assistant Instructions

When working in this repository:

1. **Read before editing.** Always read existing files before modifying them.
2. **Minimal changes.** Only change what was explicitly requested.
3. **No speculative improvements.** Do not refactor, add comments, or improve surrounding code unless asked.
4. **Confirm destructive actions.** Deleting files, force-pushing, or dropping data requires user confirmation.
5. **Develop on the correct branch.** Check `git branch` before committing. Use the branch specified in the task.
6. **Commit clearly.** Write descriptive commit messages that explain *why*, not just *what*.
7. **Push explicitly.** Use `git push -u origin <branch-name>`. Never push to a different branch without permission.
8. **Update this file.** When significant structural changes are made to the project, update the relevant sections of CLAUDE.md.

---

## CI/CD

*(Fill in once CI is configured)*

- CI platform: GitHub Actions / GitLab CI / Bitrise / Fastlane / other
- Pipeline stages: lint → test → build → deploy
- Config file location: `.github/workflows/`, `.gitlab-ci.yml`, etc.

---

## Known Issues / Gotchas

*(Document quirks, workarounds, or non-obvious behaviour here as the project grows)*

- *(none yet)*

---

*Last updated: 2026-03-04 — repository initialization*
