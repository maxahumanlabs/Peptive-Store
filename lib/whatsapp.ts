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
  en: { header: '🛒 New Order — Peptive', total: 'Total', tax: '+ Tax' },
  ar: { header: '🛒 طلب جديد — Peptive', total: 'الإجمالي', tax: '+ ضريبة' },
} as const;

const toNumber = (price: string | number): number =>
  typeof price === 'string' ? parseFloat(price) : price;

// Build the order message text in the site's current language
export function buildWhatsAppOrderMessage(
  lines: OrderLine[],
  language: 'en' | 'ar' = 'en'
): string {
  const L = language === 'ar' ? LABELS.ar : LABELS.en;

  const lineStrings = lines.map((line, i) => {
    const displayName =
      language === 'ar' && line.arabicName ? line.arabicName : line.name;
    const title = line.bundleLabel
      ? `${displayName} — ${line.bundleLabel}`
      : displayName;
    const unit = toNumber(line.price);
    const lineTotal = unit * line.quantity;
    return `${i + 1}) ${title}\n   ${line.quantity} × ${formatPrice(unit)} ${L.tax} = ${formatPrice(lineTotal)} ${L.tax}`;
  });

  const total = lines.reduce(
    (sum, line) => sum + toNumber(line.price) * line.quantity,
    0
  );

  return `${L.header}\n\n${lineStrings.join('\n\n')}\n\n${L.total}: ${formatPrice(total)} ${L.tax}`;
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
