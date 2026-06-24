const fs = require('fs');

// 1. Add decodeHtmlEntities to lib/utils.ts
let file = 'lib/utils.ts';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('decodeHtmlEntities')) {
  content += `
// Decode HTML entities
export function decodeHtmlEntities(str: string): string {
  if (!str) return str;
  return str.replace(/&#(\\d+);/g, (match, dec) => {
    return String.fromCharCode(dec);
  }).replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#038;/g, '&');
}
`;
  fs.writeFileSync(file, content);
}

// 2. Use decodeHtmlEntities in ProductCard.tsx
file = 'components/products/ProductCard.tsx';
content = fs.readFileSync(file, 'utf8');

if (!content.includes('decodeHtmlEntities')) {
  if (!content.includes('decodeHtmlEntities,')) {
    content = content.replace("import { Product } from '@/types';", "import { Product } from '@/types';\nimport { decodeHtmlEntities } from '@/lib/utils';");
  }
  
  const oldProductNameLogic = `  const productName = language === 'ar' && (product as any).arabic_name
    ? (product as any).arabic_name
    : product.name;`;

  const newProductNameLogic = `  const rawProductName = language === 'ar' && (product as any).arabic_name
    ? (product as any).arabic_name
    : product.name;
  const productName = decodeHtmlEntities(rawProductName);`;

  content = content.replace(oldProductNameLogic, newProductNameLogic);
  fs.writeFileSync(file, content);
}

console.log('Entities decoding added to peptive-master.');
