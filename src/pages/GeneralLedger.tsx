import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
  Search,
  MoreVertical,
  Download,
  RefreshCw,
  Calculator,
  TrendingUp,
  TrendingDown,
  Eye,
  Calendar,
  FileText,
  CheckCircle,
  Clock,
  RotateCcw,
  XCircle,
  Filter,
  Check,
  X,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { glEntries as mockGLEntries } from "@/data/mockData";
import { useBankingStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { SkeletonCard, SkeletonTable } from "@/components/ui/skeleton";
import { EmptyState, SearchEmptyState } from "@/components/ui/empty-state";

type PostingStatus = "pending" | "posted" | "reversed";

interface ExtendedGLEntry {
  id: string;
  entryNumber: string;
  accountCode: string;
  accountName: string;
  type: "debit" | "credit";
  amount: number;
  description: string;
  transactionRef: string;
  postingDate: string;
  branch: string;
  postingStatus: PostingStatus;
  postedBy?: string;
  postedAt?: string;
  reversedBy?: string;
  reversedAt?: string;
  reversalReason?: string;
}

const postingStatusConfig: Record<PostingStatus, { label: string; color: string; icon: typeof CheckCircle }> = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  posted: { label: "Posted", color: "bg-green-100 text-green-800", icon: CheckCircle },
  reversed: { label: "Reversed", color: "bg-red-100 text-red-800", icon: RotateCcw },
};

export function GeneralLedger() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [startDate, setStartDate] = useState("2024-01-01");
  const [endDate, setEndDate] = useState("2024-01-31");
  const [showPeriodSelector, setShowPeriodSelector] = useState(false);

  // Dialog state for reversals
  const [isReversalDialogOpen, setIsReversalDialogOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<ExtendedGLEntry | null>(null);
  const [reversalReason, setReversalReason] = useState("");

  const { currentUser } = useBankingStore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Extend mock entries with posting status
  const [entries, setEntries] = useState<ExtendedGLEntry[]>(() =>
    mockGLEntries.map((entry, index) => ({
      ...entry,
      postingStatus: (index % 5 === 0 ? "pending" : index % 7 === 0 ? "reversed" : "posted") as PostingStatus,
      postedBy: index % 5 !== 0 ? "System" : undefined,
      postedAt: index % 5 !== 0 ? entry.postingDate : undefined,
    }))
  );

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      entry.entryNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.accountCode.includes(searchTerm);
    const matchesType = typeFilter === "all" || entry.type === typeFilter;
    const matchesStatus = statusFilter === "all" || entry.postingStatus === statusFilter;
    const entryDate = new Date(entry.postingDate);
    const matchesDateRange = entryDate >= new Date(startDate) && entryDate <= new Date(endDate);
    return matchesSearch && matchesType && matchesStatus && matchesDateRange;
  });

  const totalDebits = filteredEntries
    .filter((e) => e.type === "debit" && e.postingStatus === "posted")
    .reduce((sum, e) => sum + e.amount, 0);
  const totalCredits = filteredEntries
    .filter((e) => e.type === "credit" && e.postingStatus === "posted")
    .reduce((sum, e) => sum + e.amount, 0);
  const pendingCount = entries.filter((e) => e.postingStatus === "pending").length;

  const handlePost = (entry: ExtendedGLEntry) => {
    setEntries((prev) =>
      prev.map((e) =>
        e.id === entry.id
          ? {
              ...e,
              postingStatus: "posted" as PostingStatus,
              postedBy: currentUser.name,
              postedAt: new Date().toISOString().split("T")[0],
            }
          : e
      )
    );
    toast({
      title: "Entry Posted",
      description: `Entry ${entry.entryNumber} has been posted successfully.`,
    });
  };

  const handlePostAll = () => {
    const pendingEntries = filteredEntries.filter((e) => e.postingStatus === "pending");
    if (pendingEntries.length === 0) {
      toast({
        title: "No Pending Entries",
        description: "There are no pending entries to post.",
        variant: "destructive",
      });
      return;
    }

    setEntries((prev) =>
      prev.map((e) =>
        e.postingStatus === "pending"
          ? {
              ...e,
              postingStatus: "posted" as PostingStatus,
              postedBy: currentUser.name,
              postedAt: new Date().toISOString().split("T")[0],
            }
          : e
      )
    );
    toast({
      title: "Batch Post Complete",
      description: `${pendingEntries.length} entries have been posted successfully.`,
    });
  };

  const openReversalDialog = (entry: ExtendedGLEntry) => {
    setSelectedEntry(entry);
    setReversalReason("");
    setIsReversalDialogOpen(true);
  };

  const handleReverse = () => {
    if (!selectedEntry || !reversalReason.trim()) return;

    setEntries((prev) =>
      prev.map((e) =>
        e.id === selectedEntry.id
          ? {
              ...e,
              postingStatus: "reversed" as PostingStatus,
              reversedBy: currentUser.name,
              reversedAt: new Date().toISOString().split("T")[0],
              reversalReason: reversalReason,
            }
          : e
      )
    );

    toast({
      title: "Entry Reversed",
      description: `Entry ${selectedEntry.entryNumber} has been reversed.`,
    });

    setIsReversalDialogOpen(false);
    setSelectedEntry(null);
  };

  const formatPeriodDisplay = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const startMonth = start.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    const endMonth = end.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    return startMonth === endMonth ? startMonth : `${startMonth} - ${endMonth}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">General Ledger</h1>
          <p className="text-muted-foreground">
            View and manage general ledger entries
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPeriodSelector(!showPeriodSelector)}
            >
              <Calendar className="mr-2 h-4 w-4" />
              {formatPeriodDisplay()}
            </Button>
            {showPeriodSelector && (
              <div className="absolute right-0 top-full mt-2 z-50 bg-background border rounded-lg shadow-lg p-4 space-y-4 min-w-[300px]">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Select Period</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => setShowPeriodSelector(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      const now = new Date();
                      setStartDate(new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0]);
                      setEndDate(new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0]);
                    }}
                  >
                    This Month
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      const now = new Date();
                      setStartDate(new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split("T")[0]);
                      setEndDate(new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split("T")[0]);
                    }}
                  >
                    Last Month
                  </Button>
                </div>
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => setShowPeriodSelector(false)}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Apply
                </Button>
              </div>
            )}
          </div>
          {pendingCount > 0 && (
            <Button size="sm" onClick={handlePostAll}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Post All ({pendingCount})
            </Button>
          )}
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Entries</p>
                  <p className="text-2xl font-bold">{filteredEntries.length}</p>
                  {pendingCount > 0 && (
                    <p className="text-xs text-yellow-600">{pendingCount} pending</p>
                  )}
                </div>
                <Calculator className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Debits</p>
                  <p className="text-2xl font-bold text-red-600">
                    {formatCurrency(totalDebits)}
                  </p>
                  <p className="text-xs text-muted-foreground">Posted only</p>
                </div>
                <TrendingDown className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Credits</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(totalCredits)}
                  </p>
                  <p className="text-xs text-muted-foreground">Posted only</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Balance</p>
                  <p className={`text-2xl font-bold ${totalCredits - totalDebits >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {formatCurrency(Math.abs(totalCredits - totalDebits))}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {totalCredits - totalDebits >= 0 ? "Credit" : "Debit"}
                  </p>
                </div>
                <Calculator className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[300px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by entry number, account code, or name..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Entry Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="debit">Debit</SelectItem>
                <SelectItem value="credit">Credit</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="posted">Posted</SelectItem>
                <SelectItem value="reversed">Reversed</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>GL Entries</CardTitle>
          <CardDescription>
            {isLoading ? "Loading..." : `${filteredEntries.length} entries found for selected period`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <SkeletonTable rows={5} columns={9} />
          ) : filteredEntries.length === 0 ? (
            searchTerm ? (
              <SearchEmptyState query={searchTerm} />
            ) : (
              <EmptyState
                icon={Calculator}
                title="No GL Entries"
                description="No general ledger entries found for the selected period and filters."
              />
            )
          ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Entry Number</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Posting Date</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead className="w-8"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEntries.map((entry) => {
                const statusConfig = postingStatusConfig[entry.postingStatus];
                const StatusIcon = statusConfig.icon;

                return (
                  <TableRow key={entry.id} className={entry.postingStatus === "reversed" ? "opacity-60" : ""}>
                    <TableCell className="font-mono">{entry.entryNumber}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-mono text-sm">{entry.accountCode}</p>
                        <p className="text-xs text-muted-foreground">{entry.accountName}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={entry.type === "credit" ? "success" : "destructive"}>
                        {entry.type}
                      </Badge>
                    </TableCell>
                    <TableCell className={`font-medium ${entry.type === "credit" ? "text-green-600" : "text-red-600"}`}>
                      {formatCurrency(entry.amount)}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusConfig.color} variant="secondary">
                        <StatusIcon className="mr-1 h-3 w-3" />
                        {statusConfig.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate" title={entry.description}>
                      {entry.description}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p>{formatDate(entry.postingDate)}</p>
                        {entry.postedBy && entry.postingStatus === "posted" && (
                          <p className="text-xs text-muted-foreground">By: {entry.postedBy}</p>
                        )}
                        {entry.reversedBy && entry.postingStatus === "reversed" && (
                          <p className="text-xs text-red-600">Reversed: {entry.reversedBy}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{entry.branch}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileText className="mr-2 h-4 w-4" />
                            View Transaction
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {entry.postingStatus === "pending" && (
                            <DropdownMenuItem onClick={() => handlePost(entry)}>
                              <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                              Post Entry
                            </DropdownMenuItem>
                          )}
                          {entry.postingStatus === "posted" && (
                            <DropdownMenuItem
                              onClick={() => openReversalDialog(entry)}
                              className="text-red-600"
                            >
                              <RotateCcw className="mr-2 h-4 w-4" />
                              Reverse Entry
                            </DropdownMenuItem>
                          )}
                          {entry.postingStatus === "reversed" && entry.reversalReason && (
                            <DropdownMenuItem disabled>
                              <XCircle className="mr-2 h-4 w-4" />
                              Reason: {entry.reversalReason}
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          )}
        </CardContent>
      </Card>

      {/* Reversal Dialog */}
      <Dialog open={isReversalDialogOpen} onOpenChange={setIsReversalDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reverse GL Entry</DialogTitle>
            <DialogDescription>
              {selectedEntry && (
                <>
                  You are about to reverse entry <strong>{selectedEntry.entryNumber}</strong>
                  {" "}for {formatCurrency(selectedEntry.amount)}. This action cannot be undone.
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reversalReason">Reason for Reversal *</Label>
              <Input
                id="reversalReason"
                placeholder="Enter reason for reversal..."
                value={reversalReason}
                onChange={(e) => setReversalReason(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReversalDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReverse}
              disabled={!reversalReason.trim()}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reverse Entry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
