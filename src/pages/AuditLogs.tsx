import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable, type Column } from "@/components/ui/data-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  History,
  User,
  FileEdit,
  Trash2,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  LogIn,
  LogOut,
} from "lucide-react";
import { useBankingStore, type AuditLog } from "@/lib/store";

const formatDateTime = (timestamp: string) => {
  return new Date(timestamp).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const getActionIcon = (action: AuditLog["action"]) => {
  switch (action) {
    case "create":
      return <FileEdit className="h-4 w-4 text-green-500" />;
    case "update":
      return <FileEdit className="h-4 w-4 text-blue-500" />;
    case "delete":
      return <Trash2 className="h-4 w-4 text-red-500" />;
    case "approve":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "reject":
      return <XCircle className="h-4 w-4 text-red-500" />;
    case "view":
      return <Eye className="h-4 w-4 text-gray-500" />;
    case "export":
      return <Download className="h-4 w-4 text-purple-500" />;
    case "login":
      return <LogIn className="h-4 w-4 text-green-500" />;
    case "logout":
      return <LogOut className="h-4 w-4 text-gray-500" />;
    default:
      return <History className="h-4 w-4" />;
  }
};

const getActionBadgeVariant = (action: AuditLog["action"]): "default" | "success" | "destructive" | "secondary" | "warning" => {
  switch (action) {
    case "create":
    case "approve":
    case "login":
      return "success";
    case "delete":
    case "reject":
      return "destructive";
    case "update":
      return "default";
    default:
      return "secondary";
  }
};

export function AuditLogs() {
  const [actionFilter, setActionFilter] = useState("all");
  const [entityFilter, setEntityFilter] = useState("all");
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  const auditLogs = useBankingStore((state) => state.auditLogs);

  // Get unique entities
  const entities = useMemo(() => {
    const uniqueEntities = new Set(auditLogs.map((log) => log.entity));
    return Array.from(uniqueEntities).sort();
  }, [auditLogs]);

  // Filter logs
  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      const matchesAction = actionFilter === "all" || log.action === actionFilter;
      const matchesEntity = entityFilter === "all" || log.entity === entityFilter;
      const matchesDateStart = !dateRange.start || log.timestamp >= dateRange.start;
      const matchesDateEnd = !dateRange.end || log.timestamp <= dateRange.end + "T23:59:59";
      return matchesAction && matchesEntity && matchesDateStart && matchesDateEnd;
    });
  }, [auditLogs, actionFilter, entityFilter, dateRange]);

  // Stats
  const stats = useMemo(() => ({
    total: auditLogs.length,
    today: auditLogs.filter((l) => l.timestamp.startsWith(new Date().toISOString().split("T")[0])).length,
    creates: auditLogs.filter((l) => l.action === "create").length,
    updates: auditLogs.filter((l) => l.action === "update").length,
  }), [auditLogs]);

  const columns: Column<AuditLog>[] = [
    {
      key: "timestamp",
      header: "Timestamp",
      render: (log) => (
        <span className="text-sm">{formatDateTime(log.timestamp)}</span>
      ),
    },
    {
      key: "userName",
      header: "User",
      render: (log) => (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <span>{log.userName}</span>
        </div>
      ),
    },
    {
      key: "action",
      header: "Action",
      render: (log) => (
        <div className="flex items-center gap-2">
          {getActionIcon(log.action)}
          <Badge variant={getActionBadgeVariant(log.action)}>
            {log.action}
          </Badge>
        </div>
      ),
    },
    {
      key: "entity",
      header: "Entity",
      render: (log) => (
        <Badge variant="outline" className="capitalize">
          {log.entity}
        </Badge>
      ),
    },
    {
      key: "entityName",
      header: "Target",
      render: (log) => (
        <span className="font-mono text-sm">{log.entityName || log.entityId}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (log) => (
        <Badge variant={log.status === "success" ? "success" : "destructive"}>
          {log.status}
        </Badge>
      ),
    },
    {
      key: "details",
      header: "Details",
      render: (log) => (
        <span className="text-sm text-muted-foreground truncate max-w-[200px] block">
          {log.details || "-"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      sortable: false,
      render: (log) => (
        <Button variant="ghost" size="sm" onClick={() => setSelectedLog(log)}>
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
          <p className="text-muted-foreground">
            Track all user activities and system changes
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Logs</p>
                <p className="text-2xl font-bold">{stats.total.toLocaleString()}</p>
              </div>
              <History className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Today's Activity</p>
                <p className="text-2xl font-bold">{stats.today.toLocaleString()}</p>
              </div>
              <History className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Creates</p>
                <p className="text-2xl font-bold">{stats.creates.toLocaleString()}</p>
              </div>
              <FileEdit className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Updates</p>
                <p className="text-2xl font-bold">{stats.updates.toLocaleString()}</p>
              </div>
              <FileEdit className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-4">
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="create">Create</SelectItem>
                <SelectItem value="update">Update</SelectItem>
                <SelectItem value="delete">Delete</SelectItem>
                <SelectItem value="approve">Approve</SelectItem>
                <SelectItem value="reject">Reject</SelectItem>
                <SelectItem value="view">View</SelectItem>
                <SelectItem value="export">Export</SelectItem>
                <SelectItem value="login">Login</SelectItem>
                <SelectItem value="logout">Logout</SelectItem>
              </SelectContent>
            </Select>
            <Select value={entityFilter} onValueChange={setEntityFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Entity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Entities</SelectItem>
                {entities.map((entity) => (
                  <SelectItem key={entity} value={entity} className="capitalize">
                    {entity}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">From:</span>
              <Input
                type="date"
                className="w-[150px]"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">To:</span>
              <Input
                type="date"
                className="w-[150px]"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              />
            </div>
            {(actionFilter !== "all" || entityFilter !== "all" || dateRange.start || dateRange.end) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setActionFilter("all");
                  setEntityFilter("all");
                  setDateRange({ start: "", end: "" });
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Audit Log Table */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
          <CardDescription>
            {filteredLogs.length} entries found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={filteredLogs}
            columns={columns}
            rowKey="id"
            searchable
            searchPlaceholder="Search logs..."
            searchKeys={["userName", "entity", "entityName", "details"]}
            pagination
            pageSize={20}
            exportable
            exportFileName="audit_logs"
            emptyMessage="No audit logs found"
          />
        </CardContent>
      </Card>

      {/* Log Detail Dialog */}
      <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <DialogContent className="max-w-2xl">
          {selectedLog && (
            <>
              <DialogHeader>
                <DialogTitle>Audit Log Details</DialogTitle>
                <DialogDescription>
                  Log ID: {selectedLog.id}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Timestamp</p>
                    <p>{formatDateTime(selectedLog.timestamp)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">User</p>
                    <p>{selectedLog.userName} (ID: {selectedLog.userId})</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Action</p>
                    <div className="flex items-center gap-2">
                      {getActionIcon(selectedLog.action)}
                      <Badge variant={getActionBadgeVariant(selectedLog.action)}>
                        {selectedLog.action}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <Badge variant={selectedLog.status === "success" ? "success" : "destructive"}>
                      {selectedLog.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Entity</p>
                    <Badge variant="outline" className="capitalize">{selectedLog.entity}</Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Target</p>
                    <p className="font-mono">{selectedLog.entityName || selectedLog.entityId}</p>
                  </div>
                </div>

                {selectedLog.details && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Details</p>
                    <p className="mt-1 p-3 bg-muted rounded-md">{selectedLog.details}</p>
                  </div>
                )}

                {selectedLog.changes && Object.keys(selectedLog.changes).length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Changes</p>
                    <div className="border rounded-md overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-muted">
                          <tr>
                            <th className="px-4 py-2 text-left">Field</th>
                            <th className="px-4 py-2 text-left">Old Value</th>
                            <th className="px-4 py-2 text-left">New Value</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(selectedLog.changes).map(([field, change]) => (
                            <tr key={field} className="border-t">
                              <td className="px-4 py-2 font-medium">{field}</td>
                              <td className="px-4 py-2 text-red-600">{String(change.old)}</td>
                              <td className="px-4 py-2 text-green-600">{String(change.new)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {selectedLog.ipAddress && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">IP Address</p>
                      <p className="font-mono">{selectedLog.ipAddress}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">User Agent</p>
                      <p className="text-xs text-muted-foreground truncate">{selectedLog.userAgent}</p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
