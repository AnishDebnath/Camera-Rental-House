const PrintLabel = ({ product }) => (
  <div className="card-surface space-y-4 p-6 text-center md:p-8">
    <p className="text-sm font-medium text-muted">Print-ready label</p>
    <h2 className="text-2xl font-bold text-ink">{product.name}</h2>
    <p className="font-mono text-3xl font-bold text-primary">{product.unique_code}</p>
    <img
      src={product.qr_base64}
      alt={product.name}
      className="mx-auto h-48 w-48 rounded-card border border-line bg-white p-4 shadow-sm"
    />
    <button type="button" onClick={() => window.print()} className="primary-button w-full">
      Print Label
    </button>
  </div>
);

export default PrintLabel;
