const SkeletonCard = () => (
  <div className="overflow-hidden rounded-card border border-line bg-white shadow-card">
    <div className="aspect-[4/3] animate-pulse bg-slate-200" />
    <div className="space-y-3 p-4 md:p-5">
      <div className="h-4 w-2/3 animate-pulse rounded-full bg-slate-200" />
      <div className="h-4 w-1/2 animate-pulse rounded-full bg-slate-200" />
      <div className="h-11 w-full animate-pulse rounded-pill bg-slate-200" />
    </div>
  </div>
);

export default SkeletonCard;
