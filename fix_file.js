const fs = require('fs');

const targetFile = 'app/products/[slug]/page.tsx';
let targetContent = fs.readFileSync(targetFile, 'utf8');

const badStartStr = '          <div className="order-5 pt-4">\n            <div className="relative text-center mb-4">\n              <div className="absolute inset-0 flex items-center">';
const badStartIdx = targetContent.indexOf(badStartStr);
if (badStartIdx === -1) throw new Error('Bad start not found');

const myInjectedStr = '<div className="order-5 w-full mt-1 mb-4 bg-[#fff] rounded-2xl p-5 md:p-6 pt-0 md:pt-0 pb-0 md:pb-4">';
const badEndIdx = targetContent.indexOf(myInjectedStr, badStartIdx);
if (badEndIdx === -1) throw new Error('Bad end not found');

const exactEndIdx = targetContent.lastIndexOf('          ', badEndIdx);

targetContent = targetContent.substring(0, badStartIdx) + targetContent.substring(exactEndIdx);

fs.writeFileSync(targetFile, targetContent);
console.log('Successfully removed the broken block');
