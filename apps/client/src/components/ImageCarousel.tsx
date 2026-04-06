import { useState } from 'react';

const ImageCarousel = ({ images }) => {
  const [index, setIndex] = useState(0);

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-[28px] bg-white">
        <img src={images[index]?.image_url} alt="" className="aspect-[4/3] w-full object-cover" />
      </div>
      <div className="hide-scrollbar flex gap-3 overflow-x-auto">
        {images.map((image, imageIndex) => (
          <button
            key={image.id}
            type="button"
            onClick={() => setIndex(imageIndex)}
            className={`overflow-hidden rounded-2xl border-2 ${index === imageIndex ? 'border-primary' : 'border-transparent'}`}
          >
            <img src={image.image_url} alt="" className="h-16 w-16 object-cover md:h-20 md:w-20" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
