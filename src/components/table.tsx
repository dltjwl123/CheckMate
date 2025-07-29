import React from "react";

interface TableProps {
  className?: string;
  children: React.ReactNode;
}

export function TableHeader({ className = "", children }: TableProps) {
  return <thead className={`border-b ${className}`}>{children}</thead>;
}

export function TableBody({ className = "", children }: TableProps) {
  return (
    <tbody className={`[&_tr:last-child]:border-0 ${className}`}>
      {children}
    </tbody>
  );
}

export function TableRow({
  className = "",
  children,
  ...props
}: TableProps & React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr className={`border-b transition-colors ${className}`} {...props}>
      {children}
    </tr>
  );
}

export function TableHead({ className = "", children }: TableProps) {
  return (
    <th
      className={`h-12 px-4 text-left align-middle font-medium text-gray-900 ${className}`}
    >
      {children}
    </th>
  );
}

export function TableCell({
  className = "",
  children,
  ...props
}: TableProps & React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={`p-4 align-middle ${className}`} {...props}>
      {children}
    </td>
  );
}

function Table({ className = "", children }: TableProps) {
  return (
    <div className="w-full overflow-auto">
      <table className={`w-full caption-bottom text-sm ${className}`}>
        {children}
      </table>
    </div>
  );
}

export default Table;
