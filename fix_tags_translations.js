const fs = require('fs');

const file = 'lib/translations.ts';
let content = fs.readFileSync(file, 'utf8');

const enGifts = `      buy_now: "Buy it now",
      tag_three_months: "Faster & Durable Results",
      tag_two_months: "Most Ordered",
      tag_one_month: "Just to try",
      free_gifts: "Free Gifts"`;

const arGifts = `      buy_now: "اشتري الآن",
      tag_three_months: "نتائج أسرع وأطول",
      tag_two_months: "الأكثر طلباً",
      tag_one_month: "للتجربة فقط",
      free_gifts: "هدايا مجانية"`;

content = content.replace('      buy_now: "Buy it now",\n      free_gifts: "Free Gifts"', enGifts);
content = content.replace('      buy_now: "اشتري الآن",\n      free_gifts: "هدايا مجانية"', arGifts);

fs.writeFileSync(file, content);
console.log('Translations updated successfully');
