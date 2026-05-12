type HouseStatsProps = {
  totalHouses: number;
  activeRentals: number;
  revenue: string;
};

const HouseStats = ({ totalHouses, activeRentals, revenue }: HouseStatsProps) => {
  const stats = [
    { label: 'Total Partners', value: totalHouses, tone: 'bg-sky-50' },
    { label: 'Active Rentals', value: activeRentals, tone: 'bg-emerald-50' },
    { label: 'Business (Qtr)', value: revenue, tone: 'bg-indigo-50' },
  ];

  return (
    <section className="grid grid-cols-3 gap-3 sm:gap-4">
      {stats.map((item) => (
        <article
          key={item.label}
          className={`flex flex-col items-center justify-between rounded-card border border-white/70 p-3 text-center shadow-card sm:p-4 ${item.tone}`}
        >
          <p className="flex min-h-[24px] items-center text-[9px] font-bold uppercase tracking-widest text-tertiary sm:text-xs">
            {item.label}
          </p>
          <p className="mt-1 text-xl font-bold text-ink sm:mt-2 sm:text-2xl">{item.value}</p>
        </article>
      ))}
    </section>
  );
};

export default HouseStats;
