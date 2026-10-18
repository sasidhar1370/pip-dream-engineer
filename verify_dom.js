const fs = require('fs');
const js = fs.readFileSync('app.js', 'utf8');
const html = fs.readFileSync('index.html', 'utf8');

const idRegex = /getElementById\(['"]([^'"]+)['"]\)/g;
const ids = [];
let match;
while ((match = idRegex.exec(js)) !== null) {
  ids.push(match[1]);
}

const missing = ids.filter(id => !html.includes(`id="${id}"`));
console.log('Total checked IDs:', ids.length);
console.log('Missing IDs:', missing);

const classRegex = /querySelector\(['"]\.([^'"]+)['"]\)|querySelectorAll\(['"]\.([^'"]+)['"]\)/g;
const classes = [];
while ((match = classRegex.exec(js)) !== null) {
  classes.push(match[1] || match[2]);
}
const missingClasses = classes.filter(cls => !html.includes(`class="`) || !html.includes(cls));
console.log('Checked classes:', classes);
console.log('Missing classes:', missingClasses);
