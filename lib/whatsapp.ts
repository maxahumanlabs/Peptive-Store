import { formatPrice } from './utils';

// WhatsApp number for orders (international format, no '+' or spaces — required by wa.me)
export const WHATSAPP_NUMBER = '971558225919';

export interface OrderLine {
  name: string;
  arabicName?: string;
  price: string | number; // unit price
  quantity: number;
  bundleLabel?: string;
}

const LABELS = {
  en: { 
    intro: "Hello, I'd like to order:", 
    total: 'Total:', 
    tax: '+ Tax' 
  },
  ar: { 
    intro: "مرحباً، أود طلب:", 
    total: 'الإجمالي:', 
    tax: '+ ضريبة' 
  },
} as const;

const toNumber = (price: string | number): number =>
  typeof price === 'string' ? parseFloat(price) : price;

// Build the order message text in the site's current language
export function buildWhatsAppOrderMessage(
  lines: OrderLine[],
  language: 'en' | 'ar' = 'en'
): string {
  const L = language === 'ar' ? LABELS.ar : LABELS.en;

  const lineStrings = lines.map((line) => {
    const displayName =
      language === 'ar' && line.arabicName ? line.arabicName : line.name;
    const title = line.bundleLabel
      ? `${displayName} (${line.bundleLabel})`
      : displayName;
    const unit = toNumber(line.price);
    const lineTotal = unit * line.quantity;
    
    const qtyStr = line.quantity > 1 ? `${line.quantity} × ` : '';
    return `• ${qtyStr}${title} — ${formatPrice(lineTotal)} ${L.tax}`;
  });

  if (lines.length === 1) {
    return `${L.intro} ${lineStrings[0]}`;
  }

  const total = lines.reduce(
    (sum, line) => sum + toNumber(line.price) * line.quantity,
    0
  );

  return `${L.intro}\n\n${lineStrings.join('\n')}\n\n${L.total} ${formatPrice(total)} ${L.tax}`;
}

// Build the order message and open WhatsApp in a new tab
export function openWhatsAppOrder(
  lines: OrderLine[],
  language: 'en' | 'ar' = 'en'
): void {
  if (!lines || lines.length === 0) return;
  const message = buildWhatsAppOrderMessage(lines, language);
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  if (typeof window !== 'undefined') {
    window.open(url, '_blank');
  }
}
