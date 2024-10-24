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

function compileMetalFile(file, sdk) {
  const filePath = path.join(FILTERS_DIR, file);
  const fileName = path.basename(filePath).replace('.metal', '');
  const filePathWithoutExt = path.join(FILTERS_DIR, file).replace('.metal', '');
  console.log('* for ' + sdk);
  exec(
    `xcrun -sdk ${sdk} metal -fcikernel -c ${filePathWithoutExt}.metal -o ${filePathWithoutExt}.${sdk}.air`
  );
  console.log(` ├─ ${fileName}.${sdk}.air`);
  exec(
    `xcrun -sdk ${sdk} metallib -cikernel ${filePathWithoutExt}.${sdk}.air -o ${filePathWithoutExt}.${sdk}.metallib`
  );
  console.log(` └─ ${fileName}.${sdk}.metallib`);
}

function generateMetallib() {
  const files = fs.readdirSync(FILTERS_DIR);
  files.forEach((file) => {
    const fileExtension = path.extname(file);
    if (fileExtension === '.metal') {
      const fileName = path.basename(file).replace('.metal', '');
      console.log('Compiling:', fileName + '.metal');
      compileMetalFile(file, 'macosx');
      compileMetalFile(file, 'iphoneos');
      compileMetalFile(file, 'appletvos');
      compileMetalFile(file, 'xros');
    }
  });
}

clearGeneratedFiles();
generateMetallib();
