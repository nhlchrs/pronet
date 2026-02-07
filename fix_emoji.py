import os
import glob

# Map of malformed emoji to correct emoji
emoji_map = {
    'ðŸ"…': '📅',
    'ðŸ"¢': '📢',
    'ðŸ'¥': '👥',
    'ðŸ'³': '💳',
    'ðŸ'‹': '👋',
    'ðŸ"§': '📧',
    'ðŸŒ³': '🌳',
    'ðŸ'°': '💰',
    'ðŸ"'': '🔑',
    'ðŸ†': '🏆',
    'ðŸ"‹': '📋',
    'ðŸ¢': '🏢',
    'ðŸ"Š': '📊',
    'ðŸŽ¯': '🎯',
    'ðŸ"ˆ': '📈',
    'ðŸŽ¬': '🎬',
    'ðŸ"„': '📄',
    'ðŸ'¡': '💡',
    'âœ¨': '✨',
    'ðŸ'': '🏁',
    'ðŸ·ï¸': '🏷️',
    'ðŸŽ¥': '🎥',
    'ðŸ•': '🕐',
    'ðŸŒ': '🌐'
}

# Find all JSX files
jsx_files = glob.glob('src/**/*.jsx', recursive=True)

for file_path in jsx_files:
    try:
        with open(file_path, 'r', encoding='utf-8', errors='replace') as f:
            content = f.read()
        
        # Replace all malformed emoji
        modified = False
        for bad_emoji, good_emoji in emoji_map.items():
            if bad_emoji in content:
                content = content.replace(bad_emoji, good_emoji)
                modified = True
        
        # Write back if modified
        if modified:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f'Fixed: {file_path}')
    except Exception as e:
        print(f'Error processing {file_path}: {e}')

print('\\nEmoji encoding fixed!')
