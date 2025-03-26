Write-Host "Cleaning project..."

Remove-Item -Recurse -Force node_modules, dist
Remove-Item -Force package-lock.json

Write-Host "Reinstalling dependencies..."
npm install

Write-Host "Done!"
