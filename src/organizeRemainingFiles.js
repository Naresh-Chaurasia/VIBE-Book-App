const fs = require('fs');
const path = require('path');

// Define categories and their associated files
const categories = {
  'books': [
    'musicality-training.json',
    'courage-disliked.json'
  ],
  'personal': [
    'me.json',
    'self-care.json',
    'top-3-life-goals.json'
  ],
  'resources': [
    'emojis.json'
  ]
};

const dataDir = path.join(__dirname, 'src/data');

// Create category directories if they don't exist
Object.keys(categories).forEach(category => {
  const dir = path.join(dataDir, category);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${category}`);
  }
});

// Move files to their respective category folders
let movedFiles = 0;

Object.entries(categories).forEach(([category, files]) => {
  files.forEach(file => {
    const source = path.join(dataDir, file);
    const destination = path.join(dataDir, category, file);
    
    // Only move if source exists and destination doesn't
    if (fs.existsSync(source)) {
      try {
        fs.renameSync(source, destination);
        console.log(`✓ Moved ${file} to ${category}/`);
        movedFiles++;
      } catch (error) {
        console.error(`Error moving ${file}:`, error.message);
      }
    } else {
      console.log(`- ${file} not found in root data directory`);
    }
  });
});

console.log('\nOrganization complete!');
console.log(`Moved ${movedFiles} files to their respective category folders.`);

// List remaining files in the data directory
console.log('\nRemaining files in data directory:');
const remainingFiles = fs.readdirSync(dataDir)
  .filter(item => {
    const itemPath = path.join(dataDir, item);
    return fs.statSync(itemPath).isFile() && item.endsWith('.json');
  });

if (remainingFiles.length > 0) {
  remainingFiles.forEach(file => console.log(`- ${file}`));
} else {
  console.log('No remaining JSON files in the root data directory.');
}
