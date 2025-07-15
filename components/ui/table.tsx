import React from 'react';

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
    children: React.ReactNode;
}

interface TableSectionProps extends React.HTMLAttributes<HTMLTableSectionElement> {
    children: React.ReactNode;
}

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
    children: React.ReactNode;
}

interface TableCellProps extends React.ThHTMLAttributes<HTMLTableHeaderCellElement> {
    children: React.ReactNode;
}

interface TableDataCellProps extends React.TdHTMLAttributes<HTMLTableDataCellElement> {
    children: React.ReactNode;
}

export const Table = ({ children, className = '', ...props }: TableProps) => (
    <table className={`border-collapse border border-gray-800 bg-gray-900 ${className}`} {...props}>
        {children}
    </table>
);

export const Thead = ({ children, className = '', ...props }: TableSectionProps) => (
    <thead className={`bg-black text-white ${className}`} {...props}>
        {children}
    </thead>
);

export const Tbody = ({ children, className = '', ...props }: TableSectionProps) => (
    <tbody className={`bg-gray-900 ${className}`} {...props}>
        {children}
    </tbody>
);

export const Tr = ({ children, className = '', ...props }: TableRowProps) => (
    <tr className={`border-b border-gray-800 hover:bg-gray-800 ${className}`} {...props}>
        {children}
    </tr>
);

export const Th = ({ children, className = '', ...props }: TableCellProps) => (
    <th className={`px-4 py-2 text-left font-semibold text-gray-100 ${className}`} {...props}>
        {children}
    </th>
);

export const Td = ({ children, className = '', ...props }: TableDataCellProps) => (
    <td className={`px-4 py-2 text-gray-200 ${className}`} {...props}>
        {children}
    </td>
);