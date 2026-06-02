import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="px-6 sm:px-8 lg:px-12 py-12">
      <div className="max-w-2xl mx-auto text-center py-16">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          Sorry, the page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link href="/">
          <Button size="lg" variant="primary">
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
