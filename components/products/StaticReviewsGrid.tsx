'use client';

import React, { useState, useEffect } from 'react';

interface StaticReview {
  id: number;
  name: string;
  date: string;
  rating: number;
  text: string;
  verified: boolean;
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

export default function StaticReviewsGrid() {
  const [reviews, setReviews] = useState<StaticReview[]>([]);
  const [visibleCount, setVisibleCount] = useState(24);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the static reviews JSON file
    fetch('/data/static-reviews.json')
      .then((res) => res.json())
      .then((data) => {
        setReviews(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load static reviews', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="py-12 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (reviews.length === 0) return null;

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 24, reviews.length));
  };

  return (
    <div className="mt-8">
      <div className="mx-auto w-full">
        {/* Masonry Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          {reviews.slice(0, visibleCount).map((review) => (
            <div 
              key={review.id} 
              className="break-inside-avoid bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col"
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
              <div className="text-xs text-gray-400 mt-0.5 mb-3">
                {review.date}
              </div>
              
              <div className="flex items-center mb-3">
                {[0, 1, 2, 3, 4].map((rating) => (
                  <StarIcon
                    key={rating}
                    className="text-yellow-400 h-4 w-4 flex-shrink-0"
                  />
                ))}
              </div>
              
              <p className="text-gray-700 text-sm leading-relaxed">
                {review.text}
              </p>
            </div>
          ))}
        </div>

        {visibleCount < reviews.length && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={handleLoadMore}
              className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-colors"
            >
              Load More Reviews
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
