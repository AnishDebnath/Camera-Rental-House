type ProductStatsProps = {
  totalItems: number;
  rentedItems: number;
  inStockItems: number;
};

const ProductStats = ({ totalItems, rentedItems, inStockItems }: ProductStatsProps) => {
  const stats = [
    { label: 'Total Products', value: totalItems, tone: 'bg-sky-50' },
    { label: 'Active Rentals', value: rentedItems, tone: 'bg-amber-50' },
    { label: 'Available in Stock', value: inStockItems, tone: 'bg-emerald-50' },
  ];

  return (
    <section className="grid grid-cols-3 gap-2 sm:gap-4">
      {stats.map((item) => (
        <article
          key={item.label}
          className={`flex flex-col items-center justify-between rounded-card border border-white/70 p-3 text-center shadow-card sm:p-4 ${item.tone}`}
        >
          <p className="flex min-h-[24px] items-center text-[9px] font-bold uppercase tracking-wider text-tertiary sm:text-xs">
            {item.label}
          </p>
          <p className="mt-1 text-2xl font-bold text-ink sm:mt-2 sm:text-3xl">{item.value}</p>
        </article>
      ))}
    </section>
  );
};

export default ProductStats;
