'use client';

import React, { useState, useEffect } from 'react';
import Masonry from 'react-masonry-css';
import { ProductReview } from '@/types';
import WriteReviewForm from './WriteReviewForm';

interface ProductReviewsProps {
  productId: number;
  reviews: ProductReview[];
}

interface CombinedReview {
  id: string;
  name: string;
  date: string;
  rating: number;
  text: string;
  verified: boolean;
  images: string[];
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const StarIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
      clipRule="evenodd"
    />
  </svg>
);

const VerifiedBadge = () => (
  <svg className="w-4 h-4 text-black inline-block ml-1" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
  </svg>
);

export default function ProductReviews({ productId, reviews }: ProductReviewsProps) {
  const [showForm, setShowForm] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [visibleReviews, setVisibleReviews] = useState(6);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [staticReviews, setStaticReviews] = useState<CombinedReview[]>([]);

  useEffect(() => {
    fetch('/data/static-reviews.json')
      .then((res) => res.json())
      .then((data) => setStaticReviews(data))
      .catch((err) => console.error('Failed to load static reviews', err));
  }, []);

  const loadMore = () => {
    setVisibleReviews((prev) => prev + 6);
  };

  const combinedReviews: CombinedReview[] = [
    ...(reviews || []).map((r) => ({
      id: `real-${r.id}`,
      name: r.reviewer,
      date: r.date_created ? (() => {
        const d = new Date(r.date_created);
        return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
      })() : '',
      rating: r.rating || 5,
      text: r.review, // Can be HTML
      verified: r.verified || true, 
      images: (r as any).cusrev_images || []
    })),
    ...staticReviews.map((r: any) => ({
      id: `static-${r.id}`,
      name: r.name,
      date: r.date,
      rating: r.rating,
      text: r.text,
      verified: r.verified,
      images: r.images || []
    }))
  ];

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Customer Reviews</h2>
          {!showForm && !submitSuccess && (
            <button
              onClick={() => setShowForm(true)}
              className="hidden rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              Write a Review
            </button>
          )}
        </div>

        {submitSuccess && (
          <div className="mt-6 rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  Thank you! Your review has been submitted and is pending approval.
                </p>
              </div>
            </div>
          </div>
        )}

        {showForm && !submitSuccess && (
          <WriteReviewForm 
            productId={productId} 
            onSuccess={() => {
              setShowForm(false);
              setSubmitSuccess(true);
            }} 
            onCancel={() => setShowForm(false)} 
          />
        )}
        
        {combinedReviews && combinedReviews.length > 0 && (
          <div className="mt-8">
            <Masonry
              breakpointCols={{ default: 3, 1024: 3, 768: 2, 640: 1 }}
              className="flex w-auto -ml-6"
              columnClassName="pl-6 bg-clip-padding flex flex-col space-y-6"
            >
              {combinedReviews.slice(0, visibleReviews).map((review) => (
                <div 
                key={review.id} 
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col"
              >
                <div className="flex items-center text-sm">
                  <span className="font-semibold text-gray-900">{review.name}</span>
                  {review.verified && (
                    <span className="flex items-center ml-1 text-gray-900 font-medium">
                      <VerifiedBadge />
                      <span className="ml-1 text-xs">Verified</span>
                    </span>
                  )}
                </div>
                {review.date && (
                  <div className="text-xs text-gray-400 mt-0.5 mb-3">
                    {review.date}
                  </div>
                )}
                
                <div className="flex items-center mb-3">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <StarIcon
                      key={rating}
                      className={classNames(
                        review.rating > rating ? 'text-yellow-400' : 'text-gray-200',
                        'h-4 w-4 flex-shrink-0'
                      )}
                    />
                  ))}
                </div>
                
                <div 
                  className="text-gray-700 text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: review.text }}
                />

                {review.images.length > 0 && (
                  <div className="mt-4 flex gap-2 sm:gap-4 overflow-x-auto pb-2">
                    {review.images.map((imgUrl: string, index: number) => (
                      <button 
                        key={index} 
                        onClick={() => setSelectedImage(imgUrl)}
                        className="relative h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0 rounded-lg border-2 border-gray-200 overflow-hidden cursor-pointer hover:border-primary focus:outline-none focus:border-primary transition-colors"
                      >
                        <img
                          src={imgUrl}
                          alt={`Review image ${index + 1}`}
                          className="object-cover w-full h-full"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            </Masonry>
          </div>
        )}
        
        {visibleReviews < combinedReviews.length && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={loadMore}
              className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-colors"
            >
              Load More Reviews
            </button>
          </div>
        )}
      </div>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-80 p-4 sm:p-6"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full flex items-center justify-center">
            <div className="relative inline-block">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-2 right-2 text-white hover:text-gray-200 transition-colors focus:outline-none z-10"
                aria-label="Close image preview"
              >
                <svg className="h-8 w-8 drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <img 
                src={selectedImage} 
                alt="Review preview" 
                className="max-w-full max-h-[85vh] object-contain rounded-md bg-white"
                onClick={(e) => e.stopPropagation()} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
