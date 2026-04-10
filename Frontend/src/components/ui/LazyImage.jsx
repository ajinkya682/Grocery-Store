import React, { useState, useEffect, useRef } from 'react';

/**
 * LazyImage Component
 * Features:
 * - Intersection Observer for scroll-based loading
 * - State management for loading/error
 * - Shimmer placeholder
 * - Smooth fade-in and scale-in animations
 * - srcSet support for responsiveness
 * - loading="lazy" fallback
 */
const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  placeholderSrc = '', 
  srcSet = '', 
  sizes = '',
  aspectRatio = 'aspect-square',
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(imgRef.current);
        }
      },
      {
        rootMargin: '200px', // Start loading 200px before it enters viewport
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
  };

  return (
    <div 
      ref={imgRef}
      className={`relative overflow-hidden ${aspectRatio} ${className} bg-gray-100 flex items-center justify-center`}
      {...props}
    >
      {/* Skeleton / Shimmer */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 z-10 shimmer" />
      )}

      {/* Error Fallback */}
      {hasError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 bg-gray-50 p-4 text-center">
          <span className="text-2xl mb-1">📷</span>
          <p className="text-[10px] font-bold uppercase tracking-widest">Image Unavailable</p>
        </div>
      ) : (
        <>
          {/* Main Image */}
          {isInView && (
            <img
              src={src}
              alt={alt}
              srcSet={srcSet}
              sizes={sizes}
              loading="lazy"
              onLoad={handleLoad}
              onError={handleError}
              className={`
                w-full h-full object-cover transition-all duration-700 ease-out
                ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105 blur-sm'}
              `}
            />
          )}

          {/* Low Res Blur Placeholder (Optional) */}
          {placeholderSrc && !isLoaded && (
            <img 
              src={placeholderSrc} 
              alt=""
              className="absolute inset-0 w-full h-full object-cover blur-lg scale-110 opacity-50"
            />
          )}
        </>
      )}
    </div>
  );
};

export default LazyImage;
