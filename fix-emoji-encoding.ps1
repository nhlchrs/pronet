# Fix emoji encoding issues in JSX files
$files = Get-ChildItem -Path "src" -Filter "*.jsx" -Recurse

$replacements = @(
    @('ðŸ"…', '📅'),
    @('ðŸ"¢', '📢'),
    @('ðŸ'¥', '👥'),
    @('ðŸ'³', '💳'),
    @('ðŸ"§', '📧'),
    @('ðŸŒ³', '🌳'),
    @('ðŸ'°', '💰'),
    @('ðŸ"'', '🔑'),
    @('ðŸ†', '🏆'),
    @('ðŸ"‹', '📋'),
    @('ðŸ¢', '🏢'),
    @('ðŸ"Š', '📊'),
    @('ðŸŽ¯', '🎯'),
    @('ðŸ"ˆ', '📈'),
    @('ðŸŽ¬', '🎬'),
    @('ðŸ"„', '📄'),
    @('ðŸ'¡', '💡'),
    @('âœ¨', '✨'),
    @('ðŸ'', '🏁'),
    @('ðŸ·ï¸', '🏷️'),
    @('ðŸŽ¥', '🎥'),
    @('ðŸ•', '🕐'),
    @('ðŸŒ', '🌐'),
    @('ðŸ"š', '📚'),
    @('ðŸ'µ', '💵'),
    @('ðŸ"', '📝'),
    @('ðŸ—'ï¸', '🗑️'),
    @('ðŸš€', '🚀')
)

$fixedCount = 0

foreach ($file in $files) {
    $modified = $false
    # Read file with UTF-8 encoding
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    
    # Apply all replacements
    foreach ($pair in $replacements) {
        $oldText = $pair[0]
        $newText = $pair[1]
        
        if ($content -match [regex]::Escape($oldText)) {
            $content = $content -replace [regex]::Escape($oldText), $newText
            $modified = $true
        }
    }
    
    # Write back if modified
    if ($modified) {
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
        Write-Host "Fixed: $($file.Name)" -ForegroundColor Green
        $fixedCount++
    }
}

Write-Host "`nTotal files fixed: $fixedCount" -ForegroundColor Cyan
