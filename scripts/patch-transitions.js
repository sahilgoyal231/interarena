const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir(path.join(__dirname, '../src'), (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.jsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    content = content.replace(/transition=\{\{\s*duration:\s*0\.3/g, 'transition={{ duration: 0.1');
    content = content.replace(/transition=\{\{\s*duration:\s*0\.5/g, 'transition={{ duration: 0.1');
    content = content.replace(/<AnimatePresence mode="wait">/g, '<AnimatePresence mode="popLayout">');

    if (content !== original) {
      fs.writeFileSync(filePath, content);
      console.log(`Updated ${filePath}`);
    }
  }
});
