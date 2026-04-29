const DataTable = ({ columns, rows, renderMobileCard }) => (
  <>
    <div className="hidden overflow-hidden rounded-card border border-white/70 bg-white/[0.86] shadow-card backdrop-blur-xl lg:block">
      <table className="min-w-full divide-y divide-line">
        <thead className="bg-white/70">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-3 py-4 text-left text-xs font-bold uppercase tracking-[0.16em] text-tertiary"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((row) => (
            <tr key={row.id} className="transition hover:bg-primary-light/70">
              {columns.map((column) => (
                <td key={column.key} className="px-3 py-4 text-sm font-medium text-muted">
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:hidden">
      {rows.map((row) => renderMobileCard(row))}
    </div>
  </>
);

export default DataTable;
