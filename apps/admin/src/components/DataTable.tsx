const DataTable = ({ columns, rows, renderMobileCard }) => (
  <>
    <div className="hidden overflow-hidden rounded-card border border-line bg-white shadow-card lg:block">
      <table className="min-w-full divide-y divide-line">
        <thead className="bg-page">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-tertiary"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((row) => (
            <tr key={row.id} className="hover:bg-page/60">
              {columns.map((column) => (
                <td key={column.key} className="px-4 py-4 text-sm text-muted">
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="space-y-3 lg:hidden">
      {rows.map((row) => renderMobileCard(row))}
    </div>
  </>
);

export default DataTable;
