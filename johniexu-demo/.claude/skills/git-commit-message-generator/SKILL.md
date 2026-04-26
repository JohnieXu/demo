---
name: git-commit-message-generator
description: Generate commit messages from git diff or staged changes by analyzing project history. Use this skill whenever the user asks to create a commit message, generate a commit, write a commit message for changes, or needs help composing a git commit message. This skill first examines the project's existing commit history to infer the conventions (types, scopes, formatting style), then applies those conventions to generate a properly formatted commit message. Only creates the commit locally - does NOT push to remote.
---

# Git Commit Message Generator

Analyzes git log to infer project conventions, then generates commit messages from git diff/staged changes.

## Workflow

### Step 1: Analyze Project History

First, examine the existing commit history to understand the project's conventions:

```bash
# Get recent commits to understand patterns
git log --oneline -20

# See commit message formats used in this project
git log --format="%s" -10
```

From the history, identify:
- **Types used**: feat, fix, refactor, docs, chore, etc.
- **Scope patterns**: how scopes are formatted (e.g., `feat(component)`, `feat(component-name)`)
- **Description style**: sentence case vs lowercase, imperative mood, length limits
- **Body/footer conventions**: whether commit messages have bodies, footers, or are single-line

### Step 2: Gather Changes

```bash
# Check current git status
git status

# Get staged changes
git diff --cached --stat

# Get unstaged changes
git diff --stat

# Detailed diff for analysis
git diff --cached
```

### Step 3: Generate Commit Message

Apply the conventions inferred from Step 1:

1. **Match the type** to what the change does (based on project history patterns)
2. **Derive scope** from file paths or module names
3. **Write description** following the project's style (imperative mood, appropriate casing)

**General guidelines (adjust to match project style):**
- Use imperative mood: "add feature" not "added feature"
- First line under 72 characters
- Match the project's case style (check git log for examples)
- Scope is optional - only use if the project uses scopes

### Step 4: Create the Commit

```bash
git add <files>
git commit -m "<generated message>"
```

**IMPORTANT:** Only create the commit locally. Do NOT push to remote.
