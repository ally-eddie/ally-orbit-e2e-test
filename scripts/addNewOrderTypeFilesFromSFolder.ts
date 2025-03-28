const fs = require('fs');
const path = require('path');

// Function to copy a directory and replace text in files
function copyDirectory(src, dest, newName) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDirectory(srcPath, destPath, newName);
        } else {
            fs.copyFileSync(srcPath, destPath);
            // Read the content of the file
            let content = fs.readFileSync(destPath, 'utf-8');
            // Replace the specified text
            content = content.replace(/customerOrderType\s*([=:])\s*'[^']*'/, (match, operator) => `customerOrderType${operator} '${newName}'`);
            // Write the updated content back to the file
            fs.writeFileSync(destPath, content, 'utf-8');
        }
    }
}

// Function to find and copy all S folders
function copySFolders(baseDir, newName) {
    const entries = fs.readdirSync(baseDir, { withFileTypes: true });    
    for (const entry of entries) {        
        if (entry.isDirectory() && entry.name === 'S') {
            const srcPath = path.join(baseDir, entry.name);
            const destPath = path.join(baseDir, newName);

            copyDirectory(srcPath, destPath, newName);
            console.log(`Copied ${srcPath} to ${destPath}`);
        } else if (entry.isDirectory()) {
            copySFolders(path.join(baseDir, entry.name), newName);
        }
    }
}

// Get the new folder name from command line arguments
const newFolderName = process.argv[2];

if (!newFolderName) {
    console.error('Please provide a new folder name as an argument.');
    process.exit(1);
}
// Define the base directory (project root)
const baseDir = path.resolve(__dirname, '../tests');

// Run the function
copySFolders(baseDir, newFolderName);