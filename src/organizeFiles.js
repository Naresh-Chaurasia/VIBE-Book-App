const fs = require('fs');
const path = require('path');

// Define categories and their associated files
const categories = {
  'books': [
    'emotional-intelligence.json',
    'hear-the-beat-james-joseph.json',
    'musicality-training.json'
  ],
  'personal': [
    'me.json',
    'self-care.json',
    'top-3-life-goals.json'
  ],
  'resources': [
    'emojis.json',
    'courage-disliked.json'
  ]
};

const dataDir = path.join(__dirname, 'src/data');

// First, create a backup of all JSON files in the data directory
console.log('Creating backup of JSON files...');
const backupDir = path.join(__dirname, 'src/data_backup');
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

// Copy all JSON files to backup
fs.readdirSync(dataDir)
  .filter(file => file.endsWith('.json'))
  .forEach(file => {
    const source = path.join(dataDir, file);
    const destination = path.join(backupDir, file);
    fs.copyFileSync(source, destination);
    console.log(`Backed up ${file}`);
  });

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
    
    if (fs.existsSync(source)) {
      // Ensure the file isn't already in the destination
      if (source !== destination) {
        fs.renameSync(source, destination);
        console.log(`✓ Moved ${file} to ${category}/`);
        movedFiles++;
      } else {
        console.log(`- ${file} is already in ${category}/`);
      }
    } else {
      // Check if file is already in a subdirectory
      const alreadyMoved = fs.readdirSync(dataDir)
        .filter(item => fs.statSync(path.join(dataDir, item)).isDirectory())
        .some(dir => fs.existsSync(path.join(dataDir, dir, file)));
      
      if (!alreadyMoved) {
        console.warn(`⚠️  File not found: ${file}`);
      } else {
        console.log(`- ${file} is already in a subdirectory`);
      }
    }
  });
});

console.log('\nFile organization complete!');
console.log(`Moved ${movedFiles} files to their respective category folders.`);
console.log(`A backup of all JSON files has been saved to: ${backupDir}`);
console.log('\nYou may now delete the backup directory if everything looks good.');
