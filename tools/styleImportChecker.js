import glob from 'glob';
import fs from 'fs';
import 'colors';

const write = ::process.stdout.write;
const difference = (a, b) => new Set([...a].filter(x => !b.has(x)));
const jsFiles = glob.sync('**/*.js', { ignore: '**/node_modules/**' });
const jsFilesImportingStyle = jsFiles.filter(file => {
  try {
    fs.accessSync(`${file.slice(0, -3)}.scss`);
    return true;
  } catch (e) {
    return false;
  }
});

let problemCount = 0;

const validateStyles = file => {
  const jsFile = file;
  const styleFile = `${file.slice(0, -3)}.scss`;

  const jsFileContent = fs.readFileSync(jsFile).toString();
  const styleFileContent = fs.readFileSync(styleFile).toString();

  const jsRe = /{\s*s\.(\w*)\s*}/g;
  const styleRe = /[^\w]\.(\w*).*{\s*\n/g;

  const jsFileClasses = new Set();
  const styleFileClasses = new Set();

  let match;
  while (match = jsRe.exec(jsFileContent)) { // eslint-disable-line
    jsFileClasses.add(match[1]);
  }

  while (match = styleRe.exec(styleFileContent)) { // eslint-disable-line
    styleFileClasses.add(match[1]);
  }

  const unusedStyles = difference(styleFileClasses, jsFileClasses);
  const nonExistingStyles = difference(jsFileClasses, styleFileClasses);

  if (unusedStyles.size) {
    problemCount += 1;
    write('\nUnused styles: '.magenta);
    write(`${file.slice(0, -3)}.scss\n`.blue);
    console.log(unusedStyles);
  }
  if (nonExistingStyles.size) {
    problemCount += 1;
    write('\nNon existing styles used: '.red);
    write(`${file.slice(0, -3)}.js\n`.blue);
    console.log(nonExistingStyles);
  }
};

jsFilesImportingStyle.forEach(validateStyles);
if (problemCount) {
  console.log(`\n\n\n\n${problemCount} problem(s) found`.red);
}
