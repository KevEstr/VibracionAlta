# Script para comentar todos los backdrop-filter en Home.css excepto los de media queries
$cssFile = "src\pages\Home.css"
$content = Get-Content $cssFile -Raw

# Reemplazar backdrop-filter: blur(...); por comentarios
# No tocar los que están en @media ni en .is-desktop / .is-mobile
$content = $content -replace '(?<!\/\*\s*)(\s+)(backdrop-filter:\s*blur\([^)]+\);)', '$1/* $2 */ /* Movido a .is-desktop para evitar FOUC */'

Set-Content $cssFile $content -NoNewline
Write-Host "✅ backdrop-filter comentados en $cssFile"
