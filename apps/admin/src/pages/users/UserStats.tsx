type UserStatsProps = {
  totalUsers: number;
  activeUsers: number;
};

const UserStats = ({ totalUsers, activeUsers }: UserStatsProps) => (
  <section className="grid gap-3 md:grid-cols-3">
    <article className="rounded-card border border-white/70 bg-sky-50 p-4 shadow-card">
      <p className="text-sm font-bold text-ink">Total Customers</p>
      <p className="mt-3 text-3xl font-bold text-ink">{totalUsers}</p>
    </article>
    <article className="rounded-card border border-white/70 bg-emerald-50 p-4 shadow-card">
      <p className="text-sm font-bold text-ink">Verified</p>
      <p className="mt-3 text-3xl font-bold text-ink">{activeUsers}</p>
    </article>
    <article className="rounded-card border border-white/70 bg-amber-50 p-4 shadow-card">
      <p className="text-sm font-bold text-ink">Needs Review</p>
      <p className="mt-3 text-3xl font-bold text-ink">{totalUsers - activeUsers}</p>
    </article>
  </section>
);

export default UserStats;
