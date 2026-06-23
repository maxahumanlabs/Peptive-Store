const fs = require('fs');

const file = 'lib/translations.ts';
let content = fs.readFileSync(file, 'utf8');

const enGifts = `      buy_now: "Buy it now",
      free_gifts: "Free Gifts",
      gift_free_shipping: "Free Shipping",
      gift_bac_water: "BAC Water",
      gift_ebook: "Peptide Ebook",
      gift_ai_coach: "AI Peptide Coach",
      gift_mystery: "1 Mystery Supplement",
      unlock_gifts: "Unlock Free gifts with your order"`;

const arGifts = `      buy_now: "اشتري الآن",
      free_gifts: "هدايا مجانية",
      gift_free_shipping: "شحن مجاني",
      gift_bac_water: "ماء BAC ",
      gift_ebook: "كتاب الببتيدات ",
      gift_ai_coach: "مدرّب الببتيدات بالذكاء الاصطناعي",
      gift_mystery: "مكمّل غذائي مفاجأة",
      unlock_gifts: "افتح الهدايا المجانية مع طلبك"`;

content = content.replace('      buy_now: "Buy it now"', enGifts);
content = content.replace('      buy_now: "اشتري الآن"', arGifts);

fs.writeFileSync(file, content);
console.log('Translations updated successfully');
