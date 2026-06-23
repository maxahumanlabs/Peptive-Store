const fs = require('fs');

const file = 'lib/translations.ts';
let content = fs.readFileSync(file, 'utf8');

const enGifts = `      bottle: "bottle",
      bottles: "bottles",
      free_gifts: "Free Gifts"`;

const arGifts = `      bottle: "عبوة",
      bottles: "عبوات",
      free_gifts: "هدايا مجانية"`;

content = content.replace('      free_gifts: "Free Gifts"', enGifts);
content = content.replace('      free_gifts: "هدايا مجانية"', arGifts);

fs.writeFileSync(file, content);
console.log('Translations updated successfully');
