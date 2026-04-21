import { useState, useMemo } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  isWithinInterval,
  isBefore,
  startOfDay
} from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

interface CustomCalendarProps {
  pickupDate: Date | null;
  dropDate: Date | null;
  onDateClick: (date: Date) => void;
}

const CustomCalendar = ({ pickupDate, dropDate, onDateClick }: CustomCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between px-2 pb-4">
        <div className="flex flex-col">
          <span className="text-sm font-bold text-ink">{format(currentMonth, 'MMMM yyyy')}</span>
          <span className="text-[10px] font-medium text-muted uppercase tracking-wider">Select Rental Period</span>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-white border border-line hover:bg-page transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-white border border-line hover:bg-page transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <div className="grid grid-cols-7 mb-2">
        {days.map((day) => (
          <div key={day} className="text-center text-[10px] font-black text-muted uppercase">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    const today = startOfDay(new Date());

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, "d");
        const cloneDay = day;
        
        const isSelected = (pickupDate && isSameDay(day, pickupDate)) || (dropDate && isSameDay(day, dropDate));
        const isInRange = pickupDate && dropDate && isWithinInterval(day, { start: pickupDate, end: dropDate });
        const isDisabled = isBefore(day, today);
        const isCurrentMonth = isSameMonth(day, monthStart);

        days.push(
          <div
            key={day.toString()}
            className={`relative flex h-10 items-center justify-center text-sm font-bold transition-all cursor-pointer rounded-xl
              ${!isCurrentMonth ? 'text-line opacity-20' : 'text-ink'}
              ${isSelected ? 'bg-primary text-white shadow-lg shadow-primary/30 z-10' : ''}
              ${isInRange && !isSelected ? 'bg-primary/10 text-primary' : ''}
              ${isDisabled ? 'cursor-not-allowed opacity-10' : 'hover:bg-page'}
            `}
            onClick={() => !isDisabled && onDateClick(cloneDay)}
          >
            <span className="relative z-10">{formattedDate}</span>
            {isInRange && !isSelected && (
               <div className="absolute inset-0 bg-primary/5 rounded-none" />
            )}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7 gap-1" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="space-y-1">{rows}</div>;
  };

  return (
    <div className="p-4 rounded-3xl bg-white/50 backdrop-blur-md border border-white/60 shadow-inner">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
      
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-[10px] font-black text-muted uppercase tracking-wider">Pickup</p>
          <div className="flex h-12 items-center rounded-2xl bg-white/60 backdrop-blur-md border border-white/60 shadow-sm px-3 gap-3 transition-colors hover:bg-white/80">
             <CalendarIcon className="h-4 w-4 text-primary" />
             <span className="text-xs font-bold text-ink">
               {pickupDate ? format(pickupDate, 'MMM dd, yyyy') : 'Select date'}
             </span>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-black text-muted uppercase tracking-wider">Drop</p>
          <div className="flex h-12 items-center rounded-2xl bg-white/60 backdrop-blur-md border border-white/60 shadow-sm px-3 gap-3 transition-colors hover:bg-white/80">
             <CalendarIcon className="h-4 w-4 text-primary" />
             <span className="text-xs font-bold text-ink">
               {dropDate ? format(dropDate, 'MMM dd, yyyy') : 'Select date'}
             </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomCalendar;
