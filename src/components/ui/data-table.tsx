import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Download,
  Search,
  Loader2,
} from "lucide-react";

export interface Column<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  render?: (item: T, index: number) => React.ReactNode;
  className?: string;
  headerClassName?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchable?: boolean;
  searchPlaceholder?: string;
  searchKeys?: (keyof T)[];
  pagination?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
  sortable?: boolean;
  selectable?: boolean;
  onSelectionChange?: (selectedItems: T[]) => void;
  exportable?: boolean;
  exportFileName?: string;
  loading?: boolean;
  emptyMessage?: string;
  rowKey: keyof T;
  onRowClick?: (item: T) => void;
  stickyHeader?: boolean;
  compact?: boolean;
}

type SortDirection = "asc" | "desc" | null;

interface SortState {
  key: string;
  direction: SortDirection;
}

function getNestedValue<T>(obj: T, path: string): unknown {
  return path.split(".").reduce((acc: unknown, part) => {
    if (acc && typeof acc === "object" && part in acc) {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, obj);
}

export function DataTable<T extends object>({
  data,
  columns,
  searchable = true,
  searchPlaceholder = "Search...",
  searchKeys,
  pagination = true,
  pageSize: initialPageSize = 10,
  pageSizeOptions = [10, 20, 50, 100],
  sortable = true,
  selectable = false,
  onSelectionChange,
  exportable = true,
  exportFileName = "export",
  loading = false,
  emptyMessage = "No data found",
  rowKey,
  onRowClick,
  stickyHeader = false,
  compact = false,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(initialPageSize);
  const [sortState, setSortState] = React.useState<SortState>({ key: "", direction: null });
  const [selectedKeys, setSelectedKeys] = React.useState<Set<unknown>>(new Set());

  // Reset page when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, pageSize]);

  // Filter data based on search
  const filteredData = React.useMemo(() => {
    if (!searchTerm) return data;

    const keys = searchKeys || columns.map((c) => c.key as keyof T);
    const lowerSearch = searchTerm.toLowerCase();

    return data.filter((item) =>
      keys.some((key) => {
        const value = getNestedValue(item, key as string);
        return value?.toString().toLowerCase().includes(lowerSearch);
      })
    );
  }, [data, searchTerm, searchKeys, columns]);

  // Sort data
  const sortedData = React.useMemo(() => {
    if (!sortState.key || !sortState.direction) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = getNestedValue(a, sortState.key);
      const bVal = getNestedValue(b, sortState.key);

      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      const comparison = aVal < bVal ? -1 : 1;
      return sortState.direction === "asc" ? comparison : -comparison;
    });
  }, [filteredData, sortState]);

  // Paginate data
  const paginatedData = React.useMemo(() => {
    if (!pagination) return sortedData;

    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize, pagination]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  const handleSort = (key: string) => {
    if (!sortable) return;

    setSortState((prev) => {
      if (prev.key !== key) {
        return { key, direction: "asc" };
      }
      if (prev.direction === "asc") {
        return { key, direction: "desc" };
      }
      return { key: "", direction: null };
    });
  };

  const handleSelectAll = () => {
    if (selectedKeys.size === paginatedData.length) {
      setSelectedKeys(new Set());
      onSelectionChange?.([]);
    } else {
      const newSelection = new Set(paginatedData.map((item) => item[rowKey]));
      setSelectedKeys(newSelection);
      onSelectionChange?.(paginatedData);
    }
  };

  const handleSelectRow = (item: T) => {
    const key = item[rowKey];
    const newSelection = new Set(selectedKeys);

    if (newSelection.has(key)) {
      newSelection.delete(key);
    } else {
      newSelection.add(key);
    }

    setSelectedKeys(newSelection);
    onSelectionChange?.(data.filter((d) => newSelection.has(d[rowKey])));
  };

  const exportToCSV = () => {
    const headers = columns.map((c) => c.header).join(",");
    const rows = sortedData.map((item) =>
      columns
        .map((col) => {
          const value = getNestedValue(item, col.key as string);
          const strValue = value?.toString() || "";
          // Escape quotes and wrap in quotes if contains comma
          if (strValue.includes(",") || strValue.includes('"')) {
            return `"${strValue.replace(/"/g, '""')}"`;
          }
          return strValue;
        })
        .join(",")
    );

    const csv = [headers, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${exportFileName}_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  const getSortIcon = (key: string) => {
    if (sortState.key !== key) {
      return <ArrowUpDown className="ml-1 h-3 w-3 opacity-50" />;
    }
    return sortState.direction === "asc" ? (
      <ArrowUp className="ml-1 h-3 w-3" />
    ) : (
      <ArrowDown className="ml-1 h-3 w-3" />
    );
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        {searchable && (
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}
        <div className="flex items-center gap-2">
          {selectable && selectedKeys.size > 0 && (
            <span className="text-sm text-muted-foreground">
              {selectedKeys.size} selected
            </span>
          )}
          {exportable && (
            <Button variant="outline" size="sm" onClick={exportToCSV}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className={`rounded-md border ${stickyHeader ? "max-h-[600px] overflow-auto" : ""}`}>
        <Table>
          <TableHeader className={stickyHeader ? "sticky top-0 bg-background z-10" : ""}>
            <TableRow>
              {selectable && (
                <TableHead className="w-12">
                  <Checkbox
                    checked={paginatedData.length > 0 && selectedKeys.size === paginatedData.length}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
              )}
              {columns.map((column) => (
                <TableHead
                  key={column.key as string}
                  className={`${column.headerClassName || ""} ${
                    column.sortable !== false && sortable ? "cursor-pointer select-none" : ""
                  }`}
                  onClick={() => column.sortable !== false && handleSort(column.key as string)}
                >
                  <div className="flex items-center">
                    {column.header}
                    {column.sortable !== false && sortable && getSortIcon(column.key as string)}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length + (selectable ? 1 : 0)} className="h-32 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Loading...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="h-32 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((item, index) => (
                <TableRow
                  key={String(item[rowKey])}
                  className={onRowClick ? "cursor-pointer hover:bg-muted/50" : ""}
                  onClick={() => onRowClick?.(item)}
                >
                  {selectable && (
                    <TableCell className="w-12" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedKeys.has(item[rowKey])}
                        onCheckedChange={() => handleSelectRow(item)}
                      />
                    </TableCell>
                  )}
                  {columns.map((column) => (
                    <TableCell
                      key={`${item[rowKey]}-${column.key as string}`}
                      className={`${column.className || ""} ${compact ? "py-2" : ""}`}
                    >
                      {column.render
                        ? column.render(item, index)
                        : (getNestedValue(item, column.key as string) as React.ReactNode) || "-"}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination && !loading && sortedData.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Rows per page:</span>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => setPageSize(Number(value))}
            >
              <SelectTrigger className="w-16 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span>
              {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, sortedData.length)}{" "}
              of {sortedData.length}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-2 text-sm">
              Page {currentPage} of {totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
