const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');
const rootFiles = ['index.html'];
const rootDirs = ['js', 'images', 'textures'];

// Ensure dist exists
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
}

// Copy files
rootFiles.forEach(file => {
    const src = path.join(__dirname, file);
    const dest = path.join(distDir, file);
    if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
        console.log(`Copied ${file} to dist/`);
    }
});

// Copy directories
rootDirs.forEach(dir => {
    const src = path.join(__dirname, dir);
    const dest = path.join(distDir, dir);

    if (fs.existsSync(src)) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }

        const copyRecursive = (source, destination) => {
            const items = fs.readdirSync(source);
            items.forEach(item => {
                const s = path.join(source, item);
                const d = path.join(destination, item);
                if (fs.lstatSync(s).isDirectory()) {
                    if (!fs.existsSync(d)) fs.mkdirSync(d);
                    copyRecursive(s, d);
                } else {
                    fs.copyFileSync(s, d);
                }
            });
        };

        copyRecursive(src, dest);
        console.log(`Copied directory ${dir} to dist/`);
    }
});

console.log('Build complete: dist folder is now synchronized.');
