import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { DataTable, type Column } from "@/components/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MoreVertical,
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  Eye,
  Loader2,
  History,
} from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import { users } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { useBankingStore, PERMISSIONS } from "@/lib/store";
import type { Workflow } from "@/data/mockData";

export function Workflows() {
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [approveDialog, setApproveDialog] = useState<{ open: boolean; workflow: Workflow | null }>({ open: false, workflow: null });
  const [rejectDialog, setRejectDialog] = useState<{ open: boolean; workflow: Workflow | null }>({ open: false, workflow: null });
  const [escalateDialog, setEscalateDialog] = useState<{ open: boolean; workflow: Workflow | null }>({ open: false, workflow: null });
  const [remarks, setRemarks] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [escalateTo, setEscalateTo] = useState("");
  const [escalateReason, setEscalateReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Store hooks
  const workflows = useBankingStore((state) => state.workflows);
  const approveWorkflow = useBankingStore((state) => state.approveWorkflow);
  const rejectWorkflow = useBankingStore((state) => state.rejectWorkflow);
  const escalateWorkflow = useBankingStore((state) => state.escalateWorkflow);
  const hasPermission = useBankingStore((state) => state.hasPermission);

  // Permission checks
  const canApprove = hasPermission(PERMISSIONS.WORKFLOW_APPROVE);
  const canReject = hasPermission(PERMISSIONS.WORKFLOW_REJECT);
  const canEscalate = hasPermission(PERMISSIONS.WORKFLOW_ESCALATE);

  const handleApprove = async () => {
    if (!approveDialog.workflow) return;
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      approveWorkflow(approveDialog.workflow.id);

      const isLastLevel = approveDialog.workflow.level >= approveDialog.workflow.totalLevels;
      toast({
        title: isLastLevel ? "Workflow Fully Approved" : "Workflow Approved",
        description: isLastLevel
          ? `${approveDialog.workflow.workflowNumber} has been fully approved.`
          : `${approveDialog.workflow.workflowNumber} approved at level ${approveDialog.workflow.level}. Moved to next approver.`,
        variant: "success",
      });
      setApproveDialog({ open: false, workflow: null });
      setRemarks("");
    } catch {
      toast({ title: "Error", description: "Failed to approve workflow.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!rejectDialog.workflow || !rejectReason.trim()) return;
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      rejectWorkflow(rejectDialog.workflow.id, rejectReason);

      toast({
        title: "Workflow Rejected",
        description: `${rejectDialog.workflow.workflowNumber} has been rejected.`,
        variant: "success",
      });
      setRejectDialog({ open: false, workflow: null });
      setRejectReason("");
    } catch {
      toast({ title: "Error", description: "Failed to reject workflow.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEscalate = async () => {
    if (!escalateDialog.workflow || !escalateTo || !escalateReason.trim()) return;
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      escalateWorkflow(escalateDialog.workflow.id);

      toast({
        title: "Workflow Escalated",
        description: `${escalateDialog.workflow.workflowNumber} has been escalated to Head Office.`,
        variant: "success",
      });
      setEscalateDialog({ open: false, workflow: null });
      setEscalateTo("");
      setEscalateReason("");
    } catch {
      toast({ title: "Error", description: "Failed to escalate workflow.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter workflows
  const filteredWorkflows = useMemo(() => {
    return workflows.filter((workflow) => {
      const matchesType = typeFilter === "all" || workflow.type === typeFilter;
      const matchesStatus = statusFilter === "all" || workflow.status === statusFilter;
      return matchesType && matchesStatus;
    });
  }, [workflows, typeFilter, statusFilter]);

  // Stats
  const stats = useMemo(() => ({
    pending: workflows.filter((w) => w.status === "pending").length,
    approved: workflows.filter((w) => w.status === "approved").length,
    rejected: workflows.filter((w) => w.status === "rejected").length,
    escalated: workflows.filter((w) => w.status === "escalated").length,
  }), [workflows]);

  // Table columns
  const columns: Column<Workflow>[] = [
    {
      key: "workflowNumber",
      header: "Workflow ID",
      render: (workflow) => (
        <span className="font-mono">{workflow.workflowNumber}</span>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: (workflow) => (
        <Badge variant="outline" className="capitalize">
          {workflow.type.replace(/_/g, " ")}
        </Badge>
      ),
    },
    {
      key: "description",
      header: "Description",
      render: (workflow) => (
        <span className="max-w-xs truncate block">{workflow.description}</span>
      ),
    },
    {
      key: "initiatedBy",
      header: "Initiated By",
    },
    {
      key: "currentApprover",
      header: "Current Approver",
    },
    {
      key: "level",
      header: "Progress",
      render: (workflow) => (
        <div className="flex items-center gap-2">
          <Progress
            value={(workflow.level / workflow.totalLevels) * 100}
            className="h-2 w-20"
          />
          <span className="text-xs text-muted-foreground">
            {workflow.level}/{workflow.totalLevels}
          </span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (workflow) => (
        <Badge
          variant={
            workflow.status === "approved" ? "success" :
            workflow.status === "rejected" ? "destructive" :
            workflow.status === "escalated" ? "warning" : "secondary"
          }
        >
          {workflow.status}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      header: "Created",
      render: (workflow) => (
        <span className="text-muted-foreground text-sm">
          {formatDateTime(workflow.createdAt)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      sortable: false,
      render: (workflow) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setSelectedWorkflow(workflow)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSelectedWorkflow(workflow)}>
              <History className="mr-2 h-4 w-4" />
              View History
            </DropdownMenuItem>
            {workflow.status === "pending" && (
              <>
                <DropdownMenuSeparator />
                {canApprove && (
                  <DropdownMenuItem
                    className="text-green-600"
                    onClick={() => setApproveDialog({ open: true, workflow })}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve
                  </DropdownMenuItem>
                )}
                {canReject && (
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() => setRejectDialog({ open: true, workflow })}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject
                  </DropdownMenuItem>
                )}
                {canEscalate && (
                  <DropdownMenuItem onClick={() => setEscalateDialog({ open: true, workflow })}>
                    <ArrowUpRight className="mr-2 h-4 w-4" />
                    Escalate
                  </DropdownMenuItem>
                )}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workflows</h1>
          <p className="text-muted-foreground">
            Manage approval workflows and pending tasks
          </p>
        </div>
        <Button variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Escalated</p>
                <p className="text-2xl font-bold text-orange-600">{stats.escalated}</p>
              </div>
              <ArrowUpRight className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-4">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Workflow Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="account_opening">Account Opening</SelectItem>
                <SelectItem value="loan_approval">Loan Approval</SelectItem>
                <SelectItem value="kyc_update">KYC Update</SelectItem>
                <SelectItem value="limit_change">Limit Change</SelectItem>
                <SelectItem value="payment_approval">Payment Approval</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="escalated">Escalated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Workflow Queue</CardTitle>
          <CardDescription>
            {filteredWorkflows.length} workflows found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={filteredWorkflows}
            columns={columns}
            rowKey="id"
            searchable
            searchPlaceholder="Search workflows..."
            searchKeys={["workflowNumber", "description", "initiatedBy", "currentApprover"]}
            pagination
            pageSize={10}
            exportable
            exportFileName="workflows"
            emptyMessage="No workflows found"
          />
        </CardContent>
      </Card>

      {/* Workflow Detail Dialog */}
      <Dialog open={!!selectedWorkflow} onOpenChange={() => setSelectedWorkflow(null)}>
        <DialogContent className="max-w-lg">
          {selectedWorkflow && (
            <>
              <DialogHeader>
                <DialogTitle>Workflow Details</DialogTitle>
                <DialogDescription>{selectedWorkflow.workflowNumber}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p className="font-medium capitalize">{selectedWorkflow.type.replace(/_/g, " ")}</p>
                  </div>
                  <Badge
                    variant={
                      selectedWorkflow.status === "approved" ? "success" :
                      selectedWorkflow.status === "rejected" ? "destructive" :
                      selectedWorkflow.status === "escalated" ? "warning" : "secondary"
                    }
                    className="text-lg px-3 py-1"
                  >
                    {selectedWorkflow.status}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Description</span>
                    <span className="text-right max-w-[250px]">{selectedWorkflow.description}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Initiated By</span>
                    <span>{selectedWorkflow.initiatedBy}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Current Approver</span>
                    <span>{selectedWorkflow.currentApprover}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Progress</span>
                    <div className="flex items-center gap-2">
                      <Progress value={(selectedWorkflow.level / selectedWorkflow.totalLevels) * 100} className="w-20 h-2" />
                      <span className="text-sm">{selectedWorkflow.level}/{selectedWorkflow.totalLevels}</span>
                    </div>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Created</span>
                    <span>{formatDateTime(selectedWorkflow.createdAt)}</span>
                  </div>
                </div>

                {/* Approval History */}
                <div>
                  <Label className="text-muted-foreground">Approval History</Label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-start gap-3 p-2 bg-muted/50 rounded">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Created by {selectedWorkflow.initiatedBy}</p>
                        <p className="text-xs text-muted-foreground">{formatDateTime(selectedWorkflow.createdAt)}</p>
                      </div>
                    </div>
                    {selectedWorkflow.level > 1 && (
                      <div className="flex items-start gap-3 p-2 bg-muted/50 rounded">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Level 1 Approved by Branch Manager</p>
                          <p className="text-xs text-muted-foreground">Approved with remarks: "Verified"</p>
                        </div>
                      </div>
                    )}
                    {selectedWorkflow.status === "approved" && (
                      <div className="flex items-start gap-3 p-2 bg-green-50 rounded">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-green-700">Workflow Fully Approved</p>
                          <p className="text-xs text-green-600">All approval levels completed</p>
                        </div>
                      </div>
                    )}
                    {selectedWorkflow.status === "rejected" && (
                      <div className="flex items-start gap-3 p-2 bg-red-50 rounded">
                        <XCircle className="h-4 w-4 text-red-500 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-red-700">Workflow Rejected</p>
                          <p className="text-xs text-red-600">Request was not approved</p>
                        </div>
                      </div>
                    )}
                    {selectedWorkflow.status === "escalated" && (
                      <div className="flex items-start gap-3 p-2 bg-orange-50 rounded">
                        <ArrowUpRight className="h-4 w-4 text-orange-500 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-orange-700">Escalated to Head Office</p>
                          <p className="text-xs text-orange-600">Pending higher authority review</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedWorkflow(null)}>Close</Button>
                {selectedWorkflow.status === "pending" && (
                  <>
                    {canReject && (
                      <Button
                        variant="destructive"
                        onClick={() => {
                          setSelectedWorkflow(null);
                          setRejectDialog({ open: true, workflow: selectedWorkflow });
                        }}
                      >
                        Reject
                      </Button>
                    )}
                    {canApprove && (
                      <Button
                        onClick={() => {
                          setSelectedWorkflow(null);
                          setApproveDialog({ open: true, workflow: selectedWorkflow });
                        }}
                      >
                        Approve
                      </Button>
                    )}
                  </>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Approve Dialog */}
      <Dialog open={approveDialog.open} onOpenChange={(open) => setApproveDialog({ open, workflow: open ? approveDialog.workflow : null })}>
        <DialogContent className="max-w-md">
          {approveDialog.workflow && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  Approve Workflow
                </DialogTitle>
                <DialogDescription>
                  Approve {approveDialog.workflow.workflowNumber}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm font-medium">{approveDialog.workflow.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Type: {approveDialog.workflow.type.replace(/_/g, " ")} | Level {approveDialog.workflow.level} of {approveDialog.workflow.totalLevels}
                  </p>
                </div>
                {approveDialog.workflow.level < approveDialog.workflow.totalLevels && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-700">
                      This workflow will move to the next approval level after your approval.
                    </p>
                  </div>
                )}
                <div className="space-y-2">
                  <Label>Remarks (Optional)</Label>
                  <Textarea
                    placeholder="Add any remarks or comments..."
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setApproveDialog({ open: false, workflow: null })} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button onClick={handleApprove} disabled={isSubmitting} className="bg-green-600 hover:bg-green-700">
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Approve
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialog.open} onOpenChange={(open) => setRejectDialog({ open, workflow: open ? rejectDialog.workflow : null })}>
        <DialogContent className="max-w-md">
          {rejectDialog.workflow && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-red-600">
                  <XCircle className="h-5 w-5" />
                  Reject Workflow
                </DialogTitle>
                <DialogDescription>
                  Reject {rejectDialog.workflow.workflowNumber}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm font-medium">{rejectDialog.workflow.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    This action cannot be undone. The initiator will be notified.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Rejection Reason *</Label>
                  <Textarea
                    placeholder="Please provide a reason for rejection..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    rows={3}
                  />
                  {!rejectReason.trim() && (
                    <p className="text-xs text-destructive">Rejection reason is required</p>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setRejectDialog({ open: false, workflow: null })} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleReject}
                  disabled={isSubmitting || !rejectReason.trim()}
                >
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Reject
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Escalate Dialog */}
      <Dialog open={escalateDialog.open} onOpenChange={(open) => setEscalateDialog({ open, workflow: open ? escalateDialog.workflow : null })}>
        <DialogContent className="max-w-md">
          {escalateDialog.workflow && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-orange-600">
                  <ArrowUpRight className="h-5 w-5" />
                  Escalate Workflow
                </DialogTitle>
                <DialogDescription>
                  Escalate {escalateDialog.workflow.workflowNumber} to a higher authority
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="text-sm font-medium">{escalateDialog.workflow.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Current approver: {escalateDialog.workflow.currentApprover}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Escalate To *</Label>
                  <Select value={escalateTo} onValueChange={setEscalateTo}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select approver" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.filter(u => u.role === "System Admin" || u.role === "Branch Manager").map(user => (
                        <SelectItem key={user.id} value={user.id}>{user.name} - {user.role}</SelectItem>
                      ))}
                      <SelectItem value="head_office">Head Office</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Escalation Reason *</Label>
                  <Textarea
                    placeholder="Please provide a reason for escalation..."
                    value={escalateReason}
                    onChange={(e) => setEscalateReason(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setEscalateDialog({ open: false, workflow: null })} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button
                  onClick={handleEscalate}
                  disabled={isSubmitting || !escalateTo || !escalateReason.trim()}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Escalate
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
