import { EmptyState } from "@/components/shared/EmptyState";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export interface Column<T> {
  header: string;
  cell: (item: T) => React.ReactNode;
  className?: string;
}

export function DataTable<T>({ data, columns, emptyTitle = "Sin registros" }: { data: T[]; columns: Column<T>[]; emptyTitle?: string }) {
  if (!data.length) return <EmptyState title={emptyTitle} description="Cuando existan registros aparecerán aquí." />;

  return (
    <div className="rounded-lg border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.header} className={column.className}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={String((item as { id?: string }).id ?? index)}>
              {columns.map((column) => (
                <TableCell key={column.header} className={column.className}>
                  {column.cell(item)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
