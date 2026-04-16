/**
 * Compresses an image file by resizing and reducing quality.
 * Returns a new File object (JPEG format).
 */
export const compressImage = async (file: File, { maxWidth = 1000, quality = 0.6 } = {}): Promise<File> => {
  return new Promise((resolve) => {
    // If not an image, skip compression
    if (!file.type.startsWith('image/')) {
      return resolve(file);
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Maintain aspect ratio while constraining to maxWidth
        if (width > maxWidth || height > maxWidth) {
          if (width > height) {
            height = (maxWidth / width) * height;
            width = maxWidth;
          } else {
            width = (maxWidth / height) * width;
            height = maxWidth;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob && blob.size < file.size) {
              const fileName = file.name ? file.name.replace(/\.[^/.]+$/, "") + ".jpg" : `image-${Date.now()}.jpg`;
              const compressedFile = new File([blob], fileName, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              // Fallback to original if blob failed or (rarely) got larger
              resolve(file);
            }
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = () => resolve(file); // Fallback
    };
    reader.onerror = () => resolve(file); // Fallback
  });
};
