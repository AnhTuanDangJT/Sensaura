@echo off
REM Command Prompt: run-local.bat  |  PowerShell: .\run-local.ps1
REM If SERVER_PORT is already set, it is used as-is.
setlocal
set SPRING_PROFILES_ACTIVE=local

if defined SERVER_PORT goto :run

REM Pick first free port among 8080, 8081, 8082, 8083
set SERVER_PORT=8080
netstat -ano | findstr ":8080 " | findstr "LISTENING" >nul
if errorlevel 1 goto :picked
echo Port 8080 is in use. Trying 8081...
set SERVER_PORT=8081
netstat -ano | findstr ":8081 " | findstr "LISTENING" >nul
if errorlevel 1 goto :picked
echo Port 8081 is in use. Trying 8082...
set SERVER_PORT=8082
netstat -ano | findstr ":8082 " | findstr "LISTENING" >nul
if errorlevel 1 goto :picked
echo Port 8082 is in use. Trying 8083...
set SERVER_PORT=8083

:picked
echo Starting ai-backend ^(profile=local^). API: http://localhost:%SERVER_PORT%
goto :run

:run
call gradlew.bat bootRun --no-daemon
