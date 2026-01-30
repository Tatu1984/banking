import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Search,
  MoreVertical,
  Download,
  RefreshCw,
  Upload,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  FileText,
  ArrowLeftRight,
  Building2,
  CreditCard,
  Wallet,
  Play,
  Eye,
  Link2,
  Plus,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useState } from "react";
import { reconciliationItems } from "@/data/mockData";

const reconciliationExceptions = [
  {
    id: "1",
    exceptionNumber: "EXC2024010001",
    reconciliationType: "nostro",
    accountName: "Citibank New York - USD",
    bookAmount: 25000,
    counterpartyAmount: 0,
    difference: 25000,
    currency: "USD",
    transactionRef: "TXN202401250001",
    transactionDate: "2024-01-25",
    agingDays: 3,
    status: "open",
    reason: "Credit not received from counterparty",
    assignedTo: "Treasury Team"
  },
  {
    id: "2",
    exceptionNumber: "EXC2024010002",
    reconciliationType: "nostro",
    accountName: "Citibank New York - USD",
    bookAmount: 0,
    counterpartyAmount: 8500,
    difference: -8500,
    currency: "USD",
    transactionRef: "MT103-2024012501",
    transactionDate: "2024-01-25",
    agingDays: 3,
    status: "investigating",
    reason: "Debit in statement not in books",
    assignedTo: "Reconciliation Team"
  },
  {
    id: "3",
    exceptionNumber: "EXC2024010003",
    reconciliationType: "vostro",
    accountName: "Bank of America - INR",
    bookAmount: 150000,
    counterpartyAmount: 150250,
    difference: -250,
    currency: "INR",
    transactionRef: "TXN202401260001",
    transactionDate: "2024-01-26",
    agingDays: 2,
    status: "pending_approval",
    reason: "Rounding difference - auto-adjustment proposed",
    assignedTo: "Supervisor"
  },
  {
    id: "4",
    exceptionNumber: "EXC2024010004",
    reconciliationType: "atm",
    accountName: "ATM Switch Settlement",
    bookAmount: 50000,
    counterpartyAmount: 49800,
    difference: 200,
    currency: "INR",
    transactionRef: "ATM202401270001",
    transactionDate: "2024-01-27",
    agingDays: 1,
    status: "open",
    reason: "ATM cash difference - investigation needed",
    assignedTo: "Operations Team"
  },
  {
    id: "5",
    exceptionNumber: "EXC2024010005",
    reconciliationType: "pos",
    accountName: "POS Merchant Settlement",
    bookAmount: 35000,
    counterpartyAmount: 34950,
    difference: 50,
    currency: "INR",
    transactionRef: "POS202401270001",
    transactionDate: "2024-01-27",
    agingDays: 1,
    status: "resolved",
    reason: "Merchant fee adjustment - resolved",
    assignedTo: "Cards Team"
  }
];

const matchingRules = [
  { id: "1", ruleName: "Exact Amount Match", description: "Match transactions with exact amount", matchRate: 75.5, status: "active" },
  { id: "2", ruleName: "Reference Number Match", description: "Match by transaction reference", matchRate: 85.2, status: "active" },
  { id: "3", ruleName: "Date + Amount Match", description: "Match by date and amount combination", matchRate: 92.1, status: "active" },
  { id: "4", ruleName: "Fuzzy Amount Match", description: "Match amounts within 0.1% tolerance", matchRate: 95.8, status: "active" },
  { id: "5", ruleName: "Many-to-One Match", description: "Match multiple items to single entry", matchRate: 88.5, status: "active" }
];

export function Reconciliation() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showMatchDialog, setShowMatchDialog] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "matched": return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "unmatched": return <XCircle className="h-4 w-4 text-red-500" />;
      case "pending": return <Clock className="h-4 w-4 text-yellow-500" />;
      case "exception": return <AlertCircle className="h-4 w-4 text-orange-500" />;
      default: return null;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "nostro": return <Building2 className="h-4 w-4" />;
      case "vostro": return <ArrowLeftRight className="h-4 w-4" />;
      case "gl": return <FileText className="h-4 w-4" />;
      case "atm": return <Wallet className="h-4 w-4" />;
      case "pos": return <CreditCard className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(reconciliationItems.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, id]);
    } else {
      setSelectedItems(selectedItems.filter(item => item !== id));
    }
  };

  const totalMatched = reconciliationItems.filter(i => i.status === "matched").length;
  const totalUnmatched = reconciliationItems.filter(i => i.status !== "matched").length;
  const overallMatchRate = reconciliationItems.reduce((acc, i) => acc + i.matchRate, 0) / reconciliationItems.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reconciliation Workbench</h1>
          <p className="text-muted-foreground">
            Automated matching, exception handling, and account reconciliation
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Upload Statement
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Bank Statement</DialogTitle>
                <DialogDescription>
                  Upload counterparty statement for reconciliation
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Account</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select account" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="citi-usd">Citibank New York - USD</SelectItem>
                      <SelectItem value="deutsche-eur">Deutsche Bank Frankfurt - EUR</SelectItem>
                      <SelectItem value="boa-inr">Bank of America - INR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Statement Date</Label>
                  <Input type="date" />
                </div>
                <div className="grid gap-2">
                  <Label>File Format</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mt940">MT940 (SWIFT)</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="bai2">BAI2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Statement File</Label>
                  <Input type="file" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setShowUploadDialog(false)}>
                  Upload & Process
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button>
            <Play className="mr-2 h-4 w-4" />
            Run Matching
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overall Match Rate</p>
                <p className="text-2xl font-bold text-green-600">{overallMatchRate.toFixed(1)}%</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
            <Progress value={overallMatchRate} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Matched Accounts</p>
                <p className="text-2xl font-bold">{totalMatched}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Exceptions</p>
                <p className="text-2xl font-bold text-orange-600">{totalUnmatched}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Open Items</p>
                <p className="text-2xl font-bold">{reconciliationExceptions.filter(e => e.status === "open").length}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="accounts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="accounts">Account Reconciliation</TabsTrigger>
          <TabsTrigger value="exceptions">Exceptions</TabsTrigger>
          <TabsTrigger value="rules">Matching Rules</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="accounts" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by account name or number..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Account Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="nostro">Nostro</SelectItem>
                    <SelectItem value="vostro">Vostro</SelectItem>
                    <SelectItem value="gl">GL</SelectItem>
                    <SelectItem value="atm">ATM</SelectItem>
                    <SelectItem value="pos">POS</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="matched">Matched</SelectItem>
                    <SelectItem value="unmatched">Unmatched</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="exception">Exception</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {selectedItems.length > 0 && (
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">{selectedItems.length} selected</span>
              <Button variant="outline" size="sm">Run Matching</Button>
              <Button variant="outline" size="sm">Export</Button>
              <Button variant="ghost" size="sm" onClick={() => setSelectedItems([])}>Clear Selection</Button>
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Reconciliation Status</CardTitle>
              <CardDescription>Account-wise reconciliation summary</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-8">
                      <Checkbox
                        checked={selectedItems.length === reconciliationItems.length}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Account</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Book Balance</TableHead>
                    <TableHead className="text-right">Counterparty</TableHead>
                    <TableHead className="text-right">Difference</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Match Rate</TableHead>
                    <TableHead>Last Recon</TableHead>
                    <TableHead className="w-8"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reconciliationItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedItems.includes(item.id)}
                          onCheckedChange={(checked) => handleSelectItem(item.id, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.accountName}</p>
                          <p className="text-sm text-muted-foreground font-mono">{item.accountNumber}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTypeIcon(item.reconciliationType)}
                          <Badge variant="outline" className="capitalize">
                            {item.reconciliationType}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {item.currency} {item.bookBalance.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {item.currency} {item.counterpartyBalance.toLocaleString()}
                      </TableCell>
                      <TableCell className={`text-right font-mono font-medium ${item.difference === 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {item.difference === 0 ? '-' : `${item.difference > 0 ? '+' : ''}${item.currency} ${item.difference.toLocaleString()}`}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          {getStatusIcon(item.status)}
                          <Badge
                            variant={
                              item.status === "matched" ? "success" :
                              item.status === "exception" ? "warning" :
                              item.status === "unmatched" ? "destructive" : "secondary"
                            }
                          >
                            {item.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <Progress value={item.matchRate} className="w-16 h-2" />
                          <span className="text-sm">{item.matchRate}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(item.lastReconDate)}
                      </TableCell>
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
                            <DropdownMenuItem>Run Matching</DropdownMenuItem>
                            <DropdownMenuItem>View Exceptions</DropdownMenuItem>
                            <DropdownMenuItem>Upload Statement</DropdownMenuItem>
                            <DropdownMenuItem>Download Report</DropdownMenuItem>
                            <DropdownMenuItem>View History</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exceptions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Open Exceptions</CardTitle>
              <CardDescription>Unmatched items requiring investigation or manual action</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Exception #</TableHead>
                    <TableHead>Account</TableHead>
                    <TableHead className="text-right">Book Amount</TableHead>
                    <TableHead className="text-right">Counterparty</TableHead>
                    <TableHead className="text-right">Difference</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Aging</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead className="w-8"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reconciliationExceptions.map((exc) => (
                    <TableRow key={exc.id}>
                      <TableCell className="font-mono">{exc.exceptionNumber}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{exc.accountName}</p>
                          <p className="text-xs text-muted-foreground">{exc.transactionRef}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {exc.currency} {exc.bookAmount.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {exc.currency} {exc.counterpartyAmount.toLocaleString()}
                      </TableCell>
                      <TableCell className={`text-right font-mono font-medium ${exc.difference > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {exc.difference > 0 ? '+' : ''}{exc.currency} {exc.difference.toLocaleString()}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate" title={exc.reason}>
                        {exc.reason}
                      </TableCell>
                      <TableCell>
                        <Badge variant={exc.agingDays > 2 ? "destructive" : exc.agingDays > 1 ? "warning" : "secondary"}>
                          {exc.agingDays} day{exc.agingDays !== 1 ? 's' : ''}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            exc.status === "resolved" ? "success" :
                            exc.status === "investigating" ? "info" :
                            exc.status === "pending_approval" ? "warning" : "secondary"
                          }
                        >
                          {exc.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{exc.assignedTo}</TableCell>
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
                              <Link2 className="mr-2 h-4 w-4" />
                              Manual Match
                            </DropdownMenuItem>
                            <DropdownMenuItem>Assign</DropdownMenuItem>
                            <DropdownMenuItem>Add Comment</DropdownMenuItem>
                            <DropdownMenuItem>Write Off</DropdownMenuItem>
                            <DropdownMenuItem>Escalate</DropdownMenuItem>
                            {exc.status !== "resolved" && (
                              <DropdownMenuItem className="text-green-600">
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Mark Resolved
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Matching Rules</CardTitle>
                  <CardDescription>Configure automated matching criteria</CardDescription>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Rule
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rule Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Match Rate</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-8"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {matchingRules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell className="font-medium">{rule.ruleName}</TableCell>
                      <TableCell className="text-muted-foreground">{rule.description}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <Progress value={rule.matchRate} className="w-20 h-2" />
                          <span className="font-medium">{rule.matchRate}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={rule.status === "active" ? "success" : "secondary"}>
                          {rule.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit Rule</DropdownMenuItem>
                            <DropdownMenuItem>Test Rule</DropdownMenuItem>
                            <DropdownMenuItem>View Statistics</DropdownMenuItem>
                            <DropdownMenuItem>
                              {rule.status === "active" ? "Disable" : "Enable"}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reconciliation History</CardTitle>
              <CardDescription>Past reconciliation runs and their results</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Run Date</TableHead>
                    <TableHead>Account</TableHead>
                    <TableHead>Total Items</TableHead>
                    <TableHead>Matched</TableHead>
                    <TableHead>Exceptions</TableHead>
                    <TableHead>Match Rate</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-8"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>{formatDate("2024-01-28")}</TableCell>
                    <TableCell>Citibank New York - USD</TableCell>
                    <TableCell>1,245</TableCell>
                    <TableCell className="text-green-600">1,235</TableCell>
                    <TableCell className="text-orange-600">10</TableCell>
                    <TableCell>
                      <Badge variant="success">99.2%</Badge>
                    </TableCell>
                    <TableCell>2m 15s</TableCell>
                    <TableCell><Badge variant="success">Completed</Badge></TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{formatDate("2024-01-28")}</TableCell>
                    <TableCell>Deutsche Bank Frankfurt - EUR</TableCell>
                    <TableCell>856</TableCell>
                    <TableCell className="text-green-600">856</TableCell>
                    <TableCell className="text-green-600">0</TableCell>
                    <TableCell>
                      <Badge variant="success">100%</Badge>
                    </TableCell>
                    <TableCell>1m 42s</TableCell>
                    <TableCell><Badge variant="success">Completed</Badge></TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{formatDate("2024-01-27")}</TableCell>
                    <TableCell>ATM Switch Settlement</TableCell>
                    <TableCell>5,678</TableCell>
                    <TableCell className="text-green-600">5,550</TableCell>
                    <TableCell className="text-orange-600">128</TableCell>
                    <TableCell>
                      <Badge variant="warning">97.7%</Badge>
                    </TableCell>
                    <TableCell>8m 32s</TableCell>
                    <TableCell><Badge variant="success">Completed</Badge></TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
