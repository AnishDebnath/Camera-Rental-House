import { useState } from 'react';
import LazyImage from './feature/LazyImage';

const ImageCarousel = ({ images }) => {
  const [index, setIndex] = useState(0);

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-[28px] bg-white">
        <LazyImage
          src={images[index]?.image_url}
          alt=""
          aspectRatio="aspect-[4/3]"
          className="w-full"
        />
      </div>
      <div className="hide-scrollbar flex gap-3 overflow-x-auto">
        {images.map((image, imageIndex) => (
          <button
            key={image.id}
            type="button"
            onClick={() => setIndex(imageIndex)}
            className={`overflow-hidden rounded-2xl border-2 transition-all ${index === imageIndex ? 'border-primary' : 'border-transparent'}`}
          >
            <LazyImage
              src={image.image_url}
              alt=""
              aspectRatio="h-16 w-16 md:h-20 md:w-20"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
