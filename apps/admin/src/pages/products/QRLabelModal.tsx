import { X } from 'lucide-react';
import PrintLabel from '../../components/PrintLabel';

type QRLabelModalProps = {
  product: any;
  onClose: () => void;
};

const QRLabelModal = ({ product, onClose }: QRLabelModalProps) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/50 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-card bg-white p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-muted transition hover:text-ink"
        >
          <X className="h-5 w-5" />
        </button>
        <h2 className="mb-6 text-xl font-bold text-ink">Product Label Preview</h2>
        <PrintLabel product={product} />
      </div>
    </div>
  );
};

export default QRLabelModal;
