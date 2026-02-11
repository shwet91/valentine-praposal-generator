import { useState, useEffect } from "react";

/**
 * Preloads an array of image URLs and tracks loading progress.
 * Returns { imagesLoaded, progress } where:
 * - imagesLoaded: true when ALL images are loaded (or errored, to not block forever)
 * - progress: 0-100 percentage of images loaded so far
 */
export function useImagePreloader(imageUrls: string[]) {
  const [loadedCount, setLoadedCount] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const total = imageUrls.length;
  const progress = total === 0 ? 100 : Math.round((loadedCount / total) * 100);

  useEffect(() => {
    if (total === 0) {
      setImagesLoaded(true);
      return;
    }

    let mounted = true;
    let loaded = 0;

    const onLoad = () => {
      loaded++;
      if (mounted) {
        setLoadedCount(loaded);
        if (loaded >= total) {
          setImagesLoaded(true);
        }
      }
    };

    imageUrls.forEach((src) => {
      const img = new Image();
      img.onload = onLoad;
      img.onerror = onLoad; // count errors too so we don't block forever
      img.src = src;
    });

    // Safety timeout — if images take too long (10s), show the app anyway
    const timeout = setTimeout(() => {
      if (mounted && !imagesLoaded) {
        setImagesLoaded(true);
      }
    }, 10000);

    return () => {
      mounted = false;
      clearTimeout(timeout);
    };
  }, []); // Run once on mount

  return { imagesLoaded, progress };
}

// All image paths used across the app — single source of truth
export const ALL_APP_IMAGES = [
  "/gif/crying.gif",
  "/gif/cutting.gif",
  "/gif/empathy.gif",
  "/gif/escaping.gif",
  "/gif/funny.gif",
  "/gif/hugging.gif",
  "/gif/kissing.gif",
  "/gif/loving.gif",
  "/gif/no.gif",
  "/gif/riding.gif",
  "/gif/rose.gif",
  "/gif/rotating.gif",
  "/gif/upset.gif",
  "/gif/bathing.gif",
  "/gif/spank.gif",
  "/gif/kis2.gif",
  "/gif/cooking.gif",
  "/gif/holding.gif",
  "/gif/medicine.gif",
  "/gif/massage.gif",
  "/gif/pushing.gif",
  "/gif/angry2.gif",
  "/gif/angry3.gif",
  "/gif/gun.jpg",
  "/gif/teasing.gif",
];
