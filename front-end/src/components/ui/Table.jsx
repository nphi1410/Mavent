import React from "react";
import { classNames } from "../utils";

const Table = ({ className, children, ...props }) => (
  <div className="relative w-full overflow-auto">
    <table
      className={classNames("w-full caption-bottom text-sm", className)}
      {...props}
    >
      {children}
    </table>
  </div>
);

const TableHeader = ({ className, children, ...props }) => (
  <thead className={classNames("[&_tr]:border-b", className)} {...props}>
    {children}
  </thead>
);

const TableBody = ({ className, children, ...props }) => (
  <tbody
    className={classNames("[&_tr:last-child]:border-0", className)}
    {...props}
  >
    {children}
  </tbody>
);

const TableFooter = ({ className, children, ...props }) => (
  <tfoot
    className={classNames("border-t bg-gray-100 font-medium", className)}
    {...props}
  >
    {children}
  </tfoot>
);

const TableRow = ({ className, children, ...props }) => (
  <tr
    className={classNames(
      "border-b transition-colors hover:bg-gray-50 data-[state=selected]:bg-gray-100",
      className
    )}
    {...props}
  >
    {children}
  </tr>
);

const TableHead = ({ className, children, ...props }) => (
  <th
    className={classNames(
      "h-12 px-4 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  >
    {children}
  </th>
);

const TableCell = ({ className, children, ...props }) => (
  <td
    className={classNames(
      "p-4 align-middle [&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  >
    {children}
  </td>
);

const TableCaption = ({ className, children, ...props }) => (
  <caption
    className={classNames("mt-4 text-sm text-gray-500", className)}
    {...props}
  >
    {children}
  </caption>
);

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};

export default Table;
