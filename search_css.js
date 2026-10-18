const fs = require('fs');
const css = fs.readFileSync('style.css', 'utf8');

const terms = [
  'lantern-cursor-glow',
  'hidden-constellations-layer',
  'lantern-beam-pill',
  'stardust-toy-card',
  'falling-star-spark',
  'returning-visitor'
];

terms.forEach(t => {
  const idx = css.indexOf(t);
  console.log(t, idx !== -1 ? 'FOUND at ' + idx : 'NOT FOUND');
});
