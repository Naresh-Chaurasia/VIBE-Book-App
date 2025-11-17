const fs = require('fs');
const path = require('path');

// Current files and their target categories
const filesToMove = [
  { file: 'emojis.json', category: 'resources' },
  { file: 'me.json', category: 'personal' },
  { file: 'musicality-training.json', category: 'books' },
  { file: 'self-care.json', category: 'personal' },
  { file: 'top-3-life-goals.json', category: 'personal' }
];

const dataDir = path.join(__dirname, 'src/data');
let movedCount = 0;

console.log('Starting file organization...\n');

filesToMove.forEach(({ file, category }) => {
  const source = path.join(dataDir, file);
  const targetDir = path.join(dataDir, category);
  const destination = path.join(targetDir, file);
  
  // Create target directory if it doesn't exist
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
    console.log(`Created directory: ${category}`);
  }
  
  // Move the file if it exists
  if (fs.existsSync(source)) {
    try {
      fs.renameSync(source, destination);
      console.log(`✓ Moved ${file} to ${category}/`);
      movedCount++;
    } catch (error) {
      console.error(`Error moving ${file}:`, error.message);
    }
  } else {
    console.log(`- ${file} not found in root data directory`);
  }
});

console.log('\nOrganization complete!');
console.log(`Moved ${movedCount} files to their respective category folders.`);

// Verify the final structure
console.log('\nFinal directory structure:');
console.log('------------------------');

function listDir(dir, indent = '') {
  const items = fs.readdirSync(dir);
  items.forEach((item, index) => {
    const itemPath = path.join(dir, item);
    const isLast = index === items.length - 1;
    const prefix = isLast ? '└── ' : '├── ';
    
    console.log(indent + prefix + item);
    
    if (fs.statSync(itemPath).isDirectory()) {
      listDir(itemPath, indent + (isLast ? '    ' : '│   '));
    }
  });
}

listDir(dataDir);
