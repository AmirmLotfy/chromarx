import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import archiver from 'archiver';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create dist-zip directory if it doesn't exist
const distZipPath = path.join(__dirname, '../dist-zip');
if (!fs.existsSync(distZipPath)) {
  fs.mkdirSync(distZipPath);
}

// Create a write stream for the zip file
const output = fs.createWriteStream(path.join(distZipPath, 'chromarx-extension.zip'));
const archive = archiver('zip', {
  zlib: { level: 9 }
});

// Listen for archive events
output.on('close', () => {
  console.log('Extension package created successfully!');
  console.log('Total bytes:', archive.pointer());
});

archive.on('error', (err) => {
  throw err;
});

// Pipe archive data to the file
archive.pipe(output);

// Add the built files to the archive
archive.directory('dist/', false);

// Create icons directory in dist
if (!fs.existsSync('dist/icons')) {
  fs.mkdirSync('dist/icons', { recursive: true });
}

// Copy icons to dist/icons
fs.copyFileSync('public/icons/icon16.png', 'dist/icons/icon16.png');
fs.copyFileSync('public/icons/icon48.png', 'dist/icons/icon48.png');
fs.copyFileSync('public/icons/icon128.png', 'dist/icons/icon128.png');

// Add manifest.json from public directory
archive.file('public/manifest.json', { name: 'manifest.json' });

// Add icons
archive.file('public/icons/icon16.png', { name: 'icons/icon16.png' });
archive.file('public/icons/icon48.png', { name: 'icons/icon48.png' });
archive.file('public/icons/icon128.png', { name: 'icons/icon128.png' });

// Add background script
archive.file('src/background.js', { name: 'background.js' });

// Finalize the archive
archive.finalize();