# Contributing to Code.HP

Thank you for your interest in contributing to Code.HP!

We welcome bug reports, feature ideas, documentation improvements, and code contributions.

---

## Before You Start

Before making major changes, please open an issue to discuss your idea. This helps avoid duplicated work and ensures the feature fits the project's direction.

---

## Development Setup

### Requirements

- Node.js 22+
- npm
- Git

### Clone the repository

```bash
git clone https://github.com/lorik440/Code.HP.git
cd Code.HP
```

### Install dependencies

```bash
npm install
```

### Run the application

Development:

```bash
npm run dev
```

Production build:

```bash
npm run build
```

---

## Project Structure

```
app/
├── assets/
├── main/
│   ├── services/
│   ├── windows/
│   └── ...
└── renderer/
```

- `main/` contains Electron's main process.
- `renderer/` contains the UI.
- `assets/` contains icons, fonts, and images.

---

## Coding Guidelines

Please keep code:

- Modular
- Readable
- Well named
- Consistent with the existing architecture

### JavaScript

- Use `const` whenever possible.
- Use `let` only when reassignment is required.
- Avoid global variables.
- Keep functions focused on one responsibility.
- Prefer async/await over Promise chains.

---

## Commit Messages

Use clear commit messages.

Examples:

```
Fix startup crash

Improve updater logging

Add search filter

Refactor Kernel initialization
```

Avoid messages like:

```
fix

update

stuff
```

---

## Pull Requests

Before opening a Pull Request:

- Ensure the application runs.
- Test your changes.
- Keep Pull Requests focused on one feature or bug.
- Update documentation if needed.

Please include:

- A short description
- Screenshots (if UI changes)
- Related issue number (if applicable)

---

## Reporting Bugs

Include:

- Operating system
- Code.HP version
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)

---

## Feature Requests

When suggesting a feature, explain:

- The problem
- Your proposed solution
- Any alternatives you've considered

---

## Code of Conduct

Be respectful and constructive.

Everyone is expected to maintain a welcoming and friendly environment.

---

Thank you for helping improve Code.HP.
