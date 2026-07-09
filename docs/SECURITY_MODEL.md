# Security Model

SingularityForge treats security as an operating constraint, not a final checklist.

## Security Principles

1. Never commit secrets.
2. Never expose `.env` or private keys in prompts.
3. Destructive commands require explicit user approval.
4. Scanner output is stored as files, not pasted into chat.
5. Tool status must be evidence-based.
6. Hooks guard obvious dangerous actions.

## Protected Paths

Agent and hooks must treat these paths as sensitive:

```txt
.env
.env.*
*.pem
*.key
id_rsa
id_ed25519
.aws/
.ssh/
.gnupg/
*.p12
*.pfx
```

## Blocked or Approval Required Commands

Hard block examples:

```bash
rm -rf /
rm -rf ~
rm -rf $HOME
cat ~/.ssh/id_rsa
cat ~/.ssh/id_ed25519
cat .env
```

Approval required examples:

```bash
git reset --hard
git clean -fdx
git push --force
docker system prune -af
```

## Security Tooling

| Tool | Default | Notes |
|---|---:|---|
| Gitleaks | opt-in CI/security profile | Secret scanning |
| Semgrep CE | opt-in CI/security profile | Static analysis |
| OSV-Scanner | opt-in, network-dependent | Dependency vulnerability scan |
| pre-commit | supported | Local quality hooks |

## Report Output Rules

Do not commit raw large outputs unless explicitly intended.

Ignored outputs:

```txt
semgrep-results.json
osv-results.json
gitleaks-report.json
coverage/
playwright-report/
test-results/
repomix-output.*
```

## Secret Handling

If a secret is detected:

1. Stop the operation.
2. Do not repeat the secret.
3. Report the filename and type only.
4. Recommend rotation if the secret may have been exposed.
5. Remove it from tracked files before continuing.

## Security Definition of Done

A security-related change is done only when:

1. Risk is identified.
2. Fix is applied.
3. Relevant scanner/check is run or documented as unavailable.
4. Residual risk is reported.
