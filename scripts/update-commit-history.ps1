# Regenerates COMMIT_HISTORY.md from the real `git log`. Run this after
# pushing, then commit the refreshed file too. Never hand-edit COMMIT_HISTORY.md.
$ErrorActionPreference = "Stop"

$repoRoot = git rev-parse --show-toplevel
Set-Location $repoRoot

$header = "# Commit History`n`nAuto-generated from ``git log`` by ``scripts\update-commit-history.ps1``. Do not hand-edit — re-run the script instead.`n"
$entries = git log --date=short --pretty=format:"- **%ad** ``%h`` %s"

($header + "`n" + ($entries -join "`n") + "`n") | Set-Content -Path "COMMIT_HISTORY.md" -Encoding UTF8

Write-Host "COMMIT_HISTORY.md updated."
Write-Host "Next: git add COMMIT_HISTORY.md; git commit -m 'Update commit history'; git push"
