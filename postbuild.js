const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, 'dist', 'krokodili-fe');
const browserPath = path.join(distPath, 'browser');
const tempPath = path.join(distPath, 'app_temp');
const finalAppPath = path.join(browserPath, 'app');

// Check if the browser path exists to avoid errors on repeated runs
if (!fs.existsSync(browserPath)) {
  console.log('Build output directory not found. Skipping post-build script.');
  process.exit(0);
}

try {
  // 1. Rename browser to a temporary name
  fs.renameSync(browserPath, tempPath);
  console.log(`Renamed ${browserPath} to ${tempPath}`);

  // 2. Recreate the browser directory
  fs.mkdirSync(browserPath);
  console.log(`Created empty directory ${browserPath}`);

  // 3. Move the temp directory into the new browser directory, renaming it to 'app'
  fs.renameSync(tempPath, finalAppPath);
  console.log(`Moved ${tempPath} to ${finalAppPath}`);

  console.log('Post-build script finished successfully.');
} catch (error) {
  console.error('Error during post-build script:', error);
  process.exit(1);
}
