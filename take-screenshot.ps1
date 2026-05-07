$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$indexPath = Join-Path $projectRoot "index.html"
$outputPath = Join-Path $projectRoot "preview.png"

$browserCandidates = @(
  "$Env:ProgramFiles\Microsoft\Edge\Application\msedge.exe",
  "$Env:ProgramFiles(x86)\Microsoft\Edge\Application\msedge.exe",
  "$Env:ProgramFiles\Google\Chrome\Application\chrome.exe",
  "$Env:ProgramFiles(x86)\Google\Chrome\Application\chrome.exe"
)

$browserPath = $browserCandidates | Where-Object { Test-Path $_ } | Select-Object -First 1

if (-not $browserPath) {
  throw "No supported browser found. Install Edge/Chrome or update path in take-screenshot.ps1."
}

$uri = (New-Object System.Uri($indexPath)).AbsoluteUri

& $browserPath --headless --disable-gpu "--screenshot=$outputPath" --window-size=1600,5000 $uri

Write-Host "Screenshot saved to $outputPath"
