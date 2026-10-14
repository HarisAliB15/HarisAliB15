const fs = require('node:fs');
for (const file of ['assets/github-snake.svg', 'assets/github-snake-dark.svg']) {
  let svg = fs.readFileSync(file, 'utf8');
  // Keep all animation tracks synchronized and make consumed cells disappear.
  svg = svg.replace(/\b\d+ms\b/g, '20000ms');
  svg = svg.replace(/fill:var\(--ce\)\}\}/g, 'fill:var(--ce);opacity:0}}');
  svg = svg.replace('</style>', '.s{stroke:#ffffff;stroke-width:0.6px}</style>');
  fs.writeFileSync(file, svg);
}
