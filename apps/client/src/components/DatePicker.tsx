type DatePickerProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  min?: string;
};

const DatePicker = ({ label, value, onChange, min }: DatePickerProps) => (
  <label className="space-y-2">
    <span className="text-sm font-medium text-ink">{label}</span>
    <div className="input-shell">
      <input
        type="date"
        value={value}
        min={min}
        onChange={(event) => onChange(event.target.value)}
        className="w-full border-0 bg-transparent p-0 text-sm focus:ring-0"
      />
    </div>
  </label>
);

export default DatePicker;
