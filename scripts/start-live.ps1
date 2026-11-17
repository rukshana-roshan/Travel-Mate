param(
    [switch]$InitializeDatabase,
    [switch]$PreviewData,
    [int]$Port = 8081
)

$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path $PSScriptRoot -Parent
Set-Location $projectRoot

$mysql = Get-Command mysql.exe -ErrorAction SilentlyContinue
$mysqlPath = if ($mysql) { $mysql.Source } else { 'C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe' }
if (!(Test-Path -LiteralPath $mysqlPath)) { throw 'MySQL CLI not found. Add its bin directory to PATH.' }

$service = Get-Service MySQL80 -ErrorAction SilentlyContinue
if ($service -and $service.Status -ne 'Running') {
    throw 'MySQL80 is stopped. Run Start-Service MySQL80 in an Administrator PowerShell, then run this script again.'
}

# Use the same local credentials as Spring Boot; never print the password.
$properties = Get-Content 'src/main/resources/application.properties' -Raw
$dbUser = if ($env:SPRING_DATASOURCE_USERNAME) { $env:SPRING_DATASOURCE_USERNAME } else {
    [regex]::Match($properties, '(?m)^spring.datasource.username=(.*)$').Groups[1].Value.Trim()
}
$dbPassword = if ($env:SPRING_DATASOURCE_PASSWORD) { $env:SPRING_DATASOURCE_PASSWORD } else {
    [regex]::Match($properties, '(?m)^spring.datasource.password=(.*)$').Groups[1].Value.Trim()
}
$dbUrl = if ($env:SPRING_DATASOURCE_URL) { $env:SPRING_DATASOURCE_URL } else {
    [regex]::Match($properties, '(?m)^spring.datasource.url=(.*)$').Groups[1].Value.Trim()
}
if ($dbUrl -notmatch '^jdbc:mysql://(?:localhost|127\.0\.0\.1):3306/travel_mate_db(?:\?|$)') {
    throw 'This helper is for local travel_mate_db on port 3306 only. Use your database tools for a custom datasource.'
}
if ($env:SPRING_PROFILES_ACTIVE -match 'prod') { throw 'Unset SPRING_PROFILES_ACTIVE=prod before using the local startup helper.' }
$previousMysqlPassword = $env:MYSQL_PWD
try {
    $env:MYSQL_PWD = $dbPassword
    & $mysqlPath --host=127.0.0.1 --port=3306 "--user=$dbUser" --execute='SELECT CURRENT_USER() AS authenticated_user;'
    if ($LASTEXITCODE -ne 0) { throw 'MySQL connection failed. Check the datasource username and password.' }

    if ($InitializeDatabase) {
        Get-Content 'src/main/resources/sql/schema_and_seed_data.sql' -Raw | & $mysqlPath --host=127.0.0.1 --port=3306 "--user=$dbUser" --default-character-set=utf8mb4
        if ($LASTEXITCODE -ne 0) { throw 'Seed import failed; backend was not started.' }
    }
    if ($PreviewData) {
        Get-Content 'src/main/resources/sql/preview_live_data.sql' -Raw | & $mysqlPath --host=127.0.0.1 --port=3306 "--user=$dbUser" --table
        if ($LASTEXITCODE -ne 0) { throw 'Database preview failed.' }
    }
} finally {
    $env:MYSQL_PWD = $previousMysqlPassword
}

Write-Host "Open http://localhost:$Port/frontend/manage-attractions.html after Spring Boot starts."
& mvn spring-boot:run "-Dspring-boot.run.arguments=--server.port=$Port"
if ($LASTEXITCODE -ne 0) { throw 'Spring Boot failed to start. See the error above.' }
