# Local backend: H2 + dev JWT. Auto-picks 8081+ if 8080 is busy (unless SERVER_PORT is set).
$env:SPRING_PROFILES_ACTIVE = "local"

function Test-PortListening([int]$port) {
	$out = netstat -ano 2>$null | Select-String ":$port\s" | Select-String "LISTENING"
	return $null -ne $out
}

if (-not $env:SERVER_PORT) {
	foreach ($p in @(8080, 8081, 8082, 8083)) {
		if (-not (Test-PortListening $p)) {
			$env:SERVER_PORT = "$p"
			if ($p -ne 8080) { Write-Host "Port 8080 in use. Using $p instead." -ForegroundColor Yellow }
			break
		}
	}
	if (-not $env:SERVER_PORT) { $env:SERVER_PORT = "8083" }
}

Write-Host "Starting ai-backend (profile=local). API: http://localhost:$($env:SERVER_PORT)" -ForegroundColor Green
.\gradlew.bat bootRun --no-daemon
