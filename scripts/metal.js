const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '..');
const FILTERS_DIR = path.resolve(ROOT_DIR, 'apple/Filters/MetalCI');

function exec(command) {
  execSync(command);
}

function clearGeneratedFiles() {
  const files = fs.readdirSync(FILTERS_DIR);
  console.log('Removing generated files...');
  files.forEach((file) => {
    const filePath = path.join(FILTERS_DIR, file);
    const fileExtension = path.extname(file);
    if (fileExtension === '.air' || fileExtension === '.metallib') {
      exec(`rm -rf ${filePath}`);
    }
  });
  console.log('Generated files removed.');
}

function generateMetallib() {
  const files = fs.readdirSync(FILTERS_DIR);
  files.forEach((file) => {
    const filePath = path.join(FILTERS_DIR, file);
    const filePathWithoutExt = path
      .join(FILTERS_DIR, file)
      .replace('.metal', '');
    const fileName = path.basename(filePath).replace('.metal', '');
    const fileExtension = path.extname(file);
    if (fileExtension === '.metal') {
      console.log('Compiling Metal file:', fileName + '.metal');
      exec(
        `xcrun -sdk iphoneos metal -fcikernel -c ${filePathWithoutExt}.metal -o ${filePathWithoutExt}.air`
      );
      console.log(' ├─', fileName + '.air');
      exec(
        `xcrun -sdk iphoneos metallib -cikernel ${filePathWithoutExt}.air -o ${filePathWithoutExt}.metallib`
      );
      console.log(' └─', fileName + '.metallib');
    }
  });
}

clearGeneratedFiles();
generateMetallib();
