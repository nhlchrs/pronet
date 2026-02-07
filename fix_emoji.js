const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Map of malformed emoji to correct emoji
const emojiMap = {
  'icon="ðŸ"…"': 'icon="📅"',
  'icon="ðŸ"¢"': 'icon="📢"',
  'icon="ðŸ'¥"': 'icon="👥"',
  'icon="ðŸ'³"': 'icon="💳"',
  'Welcome, {user?.fname}! ðŸ'‹': 'Welcome, {user?.fname}! 👋',
};

// Find all JSX files
const files = glob.sync('src/**/*.jsx');

files.forEach(file => {
  try {
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;
    
    // Replace all malformed emoji
    for (const [bad, good] of Object.entries(emojiMap)) {
      if (content.includes(bad)) {
        content = content.replace(new RegExp(bad.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), good);
        modified = true;
      }
    }
    
    // Write back if modified
    if (modified) {
      fs.writeFileSync(file, content, 'utf8');
      console.log(`Fixed: ${file}`);
    }
  } catch (error) {
    console.error(`Error processing ${file}:`, error.message);
  }
});

console.log('\nEmoji encoding fixed!');
