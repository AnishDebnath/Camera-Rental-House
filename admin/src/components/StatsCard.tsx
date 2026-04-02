import { Box, CalendarRange, IndianRupee, Users } from 'lucide-react';

const icons = {
  box: Box,
  calendar: CalendarRange,
  users: Users,
  'indian-rupee': IndianRupee,
};

const StatsCard = ({ item }) => {
  const Icon = icons[item.icon] || Box;

  return (
    <article className="card-surface p-5">
      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-light text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <span className="rounded-pill bg-success/10 px-3 py-1 text-xs font-semibold text-success">
          {item.change}
        </span>
      </div>
      <p className="mt-5 text-3xl font-bold text-ink">{item.value}</p>
      <p className="mt-2 text-sm text-muted">{item.label}</p>
    </article>
  );
};

export default StatsCard;
