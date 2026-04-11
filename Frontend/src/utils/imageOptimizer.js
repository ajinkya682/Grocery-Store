/**
 * SaaS v4 Image Optimization Utility
 * Handles client-side resizing and compression to ensure fast uploads and backend compatibility.
 */

/**
 * Optimizes an image file by resizing and compressing it using the Canvas API.
 * @param {File} file - The original image file.
 * @param {Object} options - Optimization options (maxWidth, quality).
 * @returns {Promise<File>} - The optimized image file.
 */
export const optimizeImage = (file, options = {}) => {
  const { maxWidth = 800, quality = 0.7 } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        // Calculate new dimensions
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (maxWidth / width) * height;
          width = maxWidth;
        }

        // Create canvas and draw image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to Blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Canvas to Blob conversion failed'));
              return;
            }
            // Create a new file from the blob
            const optimizedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(optimizedFile);
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = () => reject(new Error('Image loading failed'));
    };
    reader.onerror = () => reject(new Error('File reading failed'));
  });
};

/**
 * Optimizes an array of files.
 * @param {File[]} files - Array of image files.
 * @param {Object} options - Optimization options.
 * @returns {Promise<File[]>} - Array of optimized image files.
 */
export const optimizeImages = async (files, options = {}) => {
  return Promise.all(Array.from(files).map(file => optimizeImage(file, options)));
};
