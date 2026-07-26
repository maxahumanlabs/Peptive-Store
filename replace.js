const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else if (f.endsWith('.tsx') || f.endsWith('.ts')) {
      callback(dirPath);
    }
  });
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Replace next/link
  if (content.includes("import Link from 'next/link'")) {
    content = content.replace(/import Link from 'next\/link';?/g, "import Link from '@/components/ui/LocalizedLink';");
    changed = true;
  }

  // Replace next/navigation useRouter
  if (content.includes("useRouter")) {
    const match = content.match(/import \{[^}]*useRouter[^}]*\} from 'next\/navigation';?/);
    if (match) {
      const originalImport = match[0];
      const otherImports = originalImport
        .replace(/import \{/, '')
        .replace(/\} from 'next\/navigation';?/, '')
        .split(',')
        .map(i => i.trim())
        .filter(i => i !== 'useRouter' && i !== '');

      let replacement = "import { useLocalizedRouter as useRouter } from '@/hooks/useLocalizedRouter';\n";
      if (otherImports.length > 0) {
        replacement += "import { " + otherImports.join(', ') + " } from 'next/navigation';";
      }
      content = content.replace(originalImport, replacement.trim());
      changed = true;
    }
  }

  // Remove the manual prefix hacks
  if (content.includes("const prefix = language === 'ar' ? '/ar' : '';")) {
    content = content.replace("const prefix = language === 'ar' ? '/ar' : '';\n", "");
    content = content.replace(/\`\$\{prefix\}/g, '\`');
    changed = true;
  }
  
  if (content.includes("${language === 'ar' ? '/ar' : ''}")) {
    content = content.replace(/\$\{language === 'ar' \? '\/ar' : ''\}/g, "");
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated', filePath);
  }
}

walkDir('app', processFile);
walkDir('components', processFile);
