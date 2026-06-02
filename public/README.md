# Placeholder for product images and static assets

Place your images in this directory:

- Product images
- Logo files
- Icons
- Banner images
- Favicon

Example structure:
```
public/
├── logo.svg
├── favicon.ico
├── products/
│   ├── product-1.jpg
│   └── product-2.jpg
└── banners/
    └── hero.jpg
```

Images can be referenced in your components like:
```tsx
import Image from 'next/image';

<Image src="/logo.svg" alt="Logo" width={200} height={50} />
```
