# spicetify-visualizer — installer
# Run from the project folder or anywhere; requires Spicetify installed.

$ErrorActionPreference = "Stop"

$themeName   = "spicetify-visualizer"
$projectPath = $PSScriptRoot
$themesDir   = "$env:APPDATA\spicetify\Themes"
$themeTarget = "$themesDir\$themeName"

Write-Host ""
Write-Host "=== spicetify-visualizer installer ===" -ForegroundColor Cyan
Write-Host ""

# 1. Check spicetify
if (-not (Get-Command spicetify -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] spicetify not found in PATH." -ForegroundColor Red
    Write-Host "Install it first: https://spicetify.app/docs/getting-started"
    exit 1
}
Write-Host "[OK] spicetify found" -ForegroundColor Green

# 2. Ensure themes directory exists
if (-not (Test-Path $themesDir)) {
    New-Item -ItemType Directory -Force -Path $themesDir | Out-Null
    Write-Host "[OK] Created themes directory" -ForegroundColor Green
} else {
    Write-Host "[OK] Themes directory exists" -ForegroundColor Green
}

# 3. Copy theme files
if (Test-Path $themeTarget) {
    Write-Host "Removing existing theme folder..." -ForegroundColor Yellow
    Remove-Item $themeTarget -Recurse -Force
}
Copy-Item -Path $projectPath -Destination $themeTarget -Recurse -Force
Write-Host "[OK] Files copied to $themeTarget" -ForegroundColor Green

# 4. Configure spicetify
Write-Host ""
Write-Host "Configuring spicetify..." -ForegroundColor Cyan
spicetify config current_theme $themeName
spicetify config color_scheme Base
Write-Host "[OK] Theme and color scheme set" -ForegroundColor Green

# 5. Apply
Write-Host ""
Write-Host "Applying theme..." -ForegroundColor Cyan
spicetify apply
Write-Host ""
Write-Host "=== Done! ===" -ForegroundColor Green
Write-Host ""
Write-Host "Open Spotify and press Ctrl+Shift+R for a hard reload." -ForegroundColor Yellow
Write-Host ""
