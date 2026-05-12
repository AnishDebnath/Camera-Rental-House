import { Building2, PlusCircle, ChevronRight, Wallet, TrendingUp, ShieldCheck, Loader2, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import DataTable from '../../components/DataTable';

type HouseCardProps = {
  houses: any[];
};

const HouseCard = ({ houses }: HouseCardProps) => {
  const columns = [
    {
      key: 'house',
      label: 'Production House',
      className: 'min-w-[280px]',
      render: (row: any) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded bg-primary-light text-primary border border-primary/10">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <p className="font-bold text-ink leading-tight whitespace-nowrap">{row.name}</p>
            <p className="text-[11px] font-semibold text-muted/60 tracking-wide uppercase">{row.ownerName}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'contact',
      label: 'Contact No.',
      render: (row: any) => (
        <p className="text-sm font-medium text-ink">{row.phone}</p>
      ),
    },
    {
      key: 'totalBusiness',
      label: 'Total Business',
      render: (row: any) => (
        <div className="flex items-center gap-2">
          <TrendingUp className="h-3.5 w-3.5 text-success" />
          <span className="font-bold text-ink">{row.totalBusiness}</span>
        </div>
      ),
    },
    {
      key: 'dueAmount',
      label: 'Due Amount',
      render: (row: any) => (
        <div className="flex items-center gap-2">
          <Wallet className="h-3.5 w-3.5 text-danger" />
          <span className={`font-bold ${row.dueAmount === '₹0' ? 'text-muted/40' : 'text-danger'}`}>
            {row.dueAmount}
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Rental Status',
      render: (row: any) => (
        <span
          className={`inline-flex items-center gap-1.5 rounded-pill px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider ${row.status === 'Active' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
            }`}
        >
          {row.status === 'Active' ? <ShieldCheck className="h-3.5 w-3.5" /> : <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          {row.status}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row: any) => (
        <div className="flex items-center gap-2">
          <Link
            to={`/admin-booking?houseId=${row.id}`}
            className="flex h-10 items-center justify-center rounded-card border border-emerald-500/20 bg-emerald-500/5 px-4 text-xs font-bold text-emerald-600 transition hover:bg-emerald-500 hover:text-white hover:border-emerald-500"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Book
          </Link>
          <button className="flex h-10 items-center justify-center rounded-card border border-line bg-white px-4 text-xs font-bold text-ink transition hover:bg-sky-500 hover:text-white hover:border-sky-500 group">
            View
            <ChevronRight className="ml-1.5 h-4 w-4 text-muted transition group-hover:text-white" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="card-surface overflow-hidden">
      <DataTable
        columns={columns}
        rows={houses}
        renderMobileCard={(row) => (
          <article key={row.id} className="relative rounded-2xl border border-line bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-start gap-4">
              <div className="relative h-14 w-14 shrink-0">
                <div className="flex h-full w-full items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 text-indigo-600 shadow-inner border border-white/50">
                  <Building2 className="h-7 w-7" />
                </div>
                <div className={`absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white ${row.status === 'Active' ? 'bg-success text-white' : 'bg-warning text-white'
                  }`}>
                  {row.status === 'Active' ? <ShieldCheck className="h-2.5 w-2.5" /> : <Loader2 className="h-2.5 w-2.5 animate-spin" />}
                </div>
              </div>

              <div className="flex-1 min-w-0 pt-0.5">
                <h3 className="text-base font-black text-ink truncate tracking-tight">{row.name}</h3>
                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                    {row.ownerName}
                  </span>
                  <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[9px] font-black uppercase tracking-widest ${row.status === 'Active' ? 'bg-success/10 text-emerald-700' : 'bg-warning/10 text-amber-600'
                    }`}>
                    {row.status}
                  </span>
                </div>
                <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-bold text-tertiary">
                  <Phone className="h-3 w-3 text-sky-500 fill-sky-500/20" />
                  <span className="tracking-wide">{row.phone}</span>
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-4 border border-line/60">
              <div className="flex flex-col gap-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted">Total Business</p>
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5 text-success" />
                  <p className="text-sm font-black text-ink">{row.totalBusiness}</p>
                </div>
              </div>
              <div className="flex flex-col gap-1 text-right items-end">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted">Due Amount</p>
                <div className="flex items-center gap-1.5 justify-end">
                  <Wallet className="h-3.5 w-3.5 text-danger" />
                  <p className={`text-sm font-black ${row.dueAmount === '₹0' ? 'text-muted/40' : 'text-danger'}`}>{row.dueAmount}</p>
                </div>
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <Link
                to={`/admin-booking?houseId=${row.id}`}
                className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-[13px] font-black uppercase tracking-wide text-emerald-600 transition-all active:scale-[0.98]"
              >
                <PlusCircle className="h-4 w-4" />
                Book
              </Link>
              <button className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-line bg-white text-[13px] font-black uppercase tracking-wide text-ink transition-all active:scale-[0.98]">
                Details
                <ChevronRight className="h-4 w-4 opacity-60" />
              </button>
            </div>
          </article>
        )}
      />
    </div>
  );
};

export default HouseCard;
