const SkeletonCard = () => (
  <article className="flex flex-col overflow-hidden rounded-[26px] bg-white border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] w-full">
    <div className="p-2.5 pb-0">
      <div className="aspect-[5/4] animate-pulse rounded-[18px] bg-slate-100" />
    </div>
    
    <div className="flex flex-1 flex-col justify-between p-3.5 pt-2.5">
      <div className="space-y-2">
        <div className="h-2 w-16 animate-pulse rounded-full bg-slate-100" />
        <div className="space-y-1">
          <div className="h-4 w-full animate-pulse rounded-md bg-slate-100" />
          <div className="h-4 w-2/3 animate-pulse rounded-md bg-slate-100" />
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <div className="h-5 w-24 animate-pulse rounded-full bg-slate-100" />
        <div className="h-9 w-full animate-pulse rounded-[12px] bg-slate-100" />
      </div>
    </div>
  </article>
);

export default SkeletonCard;
