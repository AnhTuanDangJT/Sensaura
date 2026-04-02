# ai-backend

## Run locally (easiest)

**Command Prompt (cmd.exe)** — use this if `.\run-local.ps1` fails:

```bat
cd ai-backend
run-local.bat
```

**PowerShell:**

```powershell
cd ai-backend
.\run-local.ps1
```

Uses **H2 in-memory** and a **dev-only JWT secret** (see `application-local.yml`). No Postgres required.

- Port **8080** in use? `run-local.bat` / `run-local.ps1` **auto-use 8081→8083**. To force a port: **cmd** `set SERVER_PORT=9090` then `run-local.bat`. To free **8080**: Task Manager → end the old **Java** process, or run `netstat -ano | findstr :8080` and `taskkill /PID <pid> /F`.

## Run against PostgreSQL (production-like)

Set env vars, then **do not** use profile `local`:

| Variable | Example |
|----------|---------|
| `DB_URL` | `jdbc:postgresql://localhost:5432/yourdb` |
| `DB_USERNAME` | `postgres` |
| `DB_PASSWORD` | your password |
| `JWT_SECRET` | at least **32 UTF-8 characters** |

```powershell
$env:DB_URL = "..."
$env:DB_USERNAME = "..."
$env:DB_PASSWORD = "..."
$env:JWT_SECRET = "0123456789abcdef0123456789abcdef0123456789abcdef"
.\gradlew.bat bootRun
```

## Common failures

| Symptom | Fix |
|---------|-----|
| `JwtService` / bean creation error | Set `JWT_SECRET` **or** run with profile `local` (`run-local.ps1`) |
| Port 8080 already in use | Stop the other process or set `SERVER_PORT=8081` (local profile) |
| Postgres auth failed | Fix `DB_*` credentials |
