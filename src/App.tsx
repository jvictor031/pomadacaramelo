import { useState, useEffect, useCallback, useRef } from 'react';

// Product images
const productImages = [
  'https://image.qwenlm.ai/generated-images/83f26811-a021-402b-877d-1ef5a14e24fa/_result.png',
  'https://image.qwenlm.ai/generated-images/0a20a93f-6cc5-4abf-aa60-e6c68203a521/_result.png',
  'https://image.qwenlm.ai/generated-images/2787e6bb-5a9c-49bf-819c-4e5f9be07360/_result.png',
  'https://image.qwenlm.ai/generated-images/a6aa184e-a86e-4413-b9fc-fc8f48719301/_result.png',
];

// Configuration
const SLIDE_DURATION = 5000;
const TEXT_DELAY = 2000;

export default function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [showText, setShowText] = useState(false);
  const [progressKey, setProgressKey] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const slideInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const textTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const totalSlides = productImages.length;

  // Preload images
  useEffect(() => {
    let loaded = 0;
    productImages.forEach((src) => {
      const img = new Image();
      img.onload = img.onerror = () => {
        loaded++;
        if (loaded === productImages.length) {
          setImagesLoaded(true);
        }
      };
      img.src = src;
    });
    // Safety timeout
    const timeout = setTimeout(() => {
      setImagesLoaded(true);
    }, 3000);
    return () => clearTimeout(timeout);
  }, []);

  // Show text after delay
  const showTextAfterDelay = useCallback(() => {
    if (textTimeout.current) clearTimeout(textTimeout.current);
    setShowText(false);
    textTimeout.current = setTimeout(() => {
      setShowText(true);
    }, TEXT_DELAY);
  }, []);

  // Start slideshow
  const startSlideshow = useCallback(() => {
    showTextAfterDelay();
    setProgressKey((prev) => prev + 1);

    if (slideInterval.current) clearInterval(slideInterval.current);
    slideInterval.current = setInterval(() => {
      setCurrentSlide((prev) => {
        const next = (prev + 1) % totalSlides;
        return next;
      });
    }, SLIDE_DURATION);
  }, [showTextAfterDelay, totalSlides]);

  // Initialize loading screen
  useEffect(() => {
    if (imagesLoaded) {
      const timer = setTimeout(() => {
        setIsLoading(false);
        startSlideshow();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [imagesLoaded, startSlideshow]);

  // Handle slide change
  useEffect(() => {
    if (!isLoading) {
      showTextAfterDelay();
      setProgressKey((prev) => prev + 1);
    }
  }, [currentSlide, isLoading, showTextAfterDelay]);

  // Click to pause/resume
  const handleClick = useCallback(() => {
    setIsPaused((prev) => {
      if (!prev) {
        // Pausing
        if (slideInterval.current) clearInterval(slideInterval.current);
        if (textTimeout.current) clearTimeout(textTimeout.current);
      } else {
        // Resuming
        setCurrentSlide((p) => (p + 1) % totalSlides);
      }
      return !prev;
    });
  }, [totalSlides]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (slideInterval.current) clearInterval(slideInterval.current);
      if (textTimeout.current) clearTimeout(textTimeout.current);
    };
  }, []);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden cursor-none" onClick={handleClick}>
      {/* Loading Screen */}
      <div
        className={`fixed inset-0 bg-black flex items-center justify-center z-[9999] transition-opacity duration-500 ${
          isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="loading-pulse text-2xl text-[#d4af37] font-light tracking-[5px]">
          CARREGANDO...
        </div>
      </div>

      {/* Logo */}
      <div className="absolute top-10 left-10 text-[1.8rem] text-[#d4af37] font-black tracking-[3px] uppercase z-[100] drop-shadow-[2px_2px_4px_rgba(0,0,0,0.8)]">
        BARBEARIA
      </div>

      {/* Slide Indicators */}
      <div className="absolute top-10 right-10 flex gap-3 z-[100]">
        {productImages.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-[#d4af37] shadow-[0_0_10px_rgba(212,175,55,0.8)] scale-[1.3]'
                : 'bg-white/30'
            }`}
          />
        ))}
      </div>

      {/* Slideshow Container */}
      <div className="relative w-full h-full flex items-center justify-center">
        {productImages.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-[800ms] ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={img}
              alt={`Pomada Caramelo ${index + 1}`}
              className={`w-full h-full object-contain bg-[#0a0a0a] ${
                index === currentSlide ? 'slide-zoom' : ''
              }`}
            />
          </div>
        ))}
      </div>

      {/* Overlay gradient */}
      <div className="absolute bottom-0 left-0 w-full h-[40%] bg-gradient-to-t from-black/95 via-black/70 to-transparent pointer-events-none" />

      {/* Text Container */}
      <div
        className={`absolute bottom-20 left-1/2 -translate-x-1/2 text-center z-10 transition-opacity duration-[600ms] ease-in-out ${
          showText ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Brand Name */}
        <div className="text-[2rem] text-[#d4af37] font-semibold tracking-[8px] mb-[30px] drop-shadow-[2px_2px_4px_rgba(0,0,0,0.8)]">
          TWO BROTHERS
        </div>

        {/* Product Name */}
        <h1 className="text-[4.5rem] font-black text-white uppercase tracking-[5px] mb-5 drop-shadow-[4px_4px_8px_rgba(0,0,0,0.9)] slide-up max-[1366px]:text-[3rem] max-[1920px]:text-[4rem]">
          Pomada Caramelo
        </h1>

        {/* Product Price */}
        <div className="text-[5rem] font-black text-[#d4af37] drop-shadow-[4px_4px_10px_rgba(0,0,0,0.9)] relative inline-block max-[1366px]:text-[3.5rem] max-[1920px]:text-[4.5rem] price-line-left price-line-right">
          R$ 35,00
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-[5px] bg-white/10 z-[100]">
        <div
          key={progressKey}
          className={`h-full bg-gradient-to-r from-[#d4af37] to-[#f4d03f] shadow-[0_0_15px_rgba(212,175,55,0.8)] ${
            !isPaused ? 'progress-animate' : ''
          }`}
          style={isPaused ? { width: '50%' } : undefined}
        />
      </div>

      {/* Pause indicator */}
      {isPaused && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] opacity-50">
          <div className="flex gap-3">
            <div className="w-4 h-16 bg-white/60 rounded" />
            <div className="w-4 h-16 bg-white/60 rounded" />
          </div>
        </div>
      )}
    </div>
  );
}
