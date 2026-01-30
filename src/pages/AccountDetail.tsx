import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
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
  ArrowLeft,
  MoreVertical,
  Edit,
  Download,
  Eye,
  Plus,
  Calendar,
  TrendingUp,
  TrendingDown,
  Wallet,
  Lock,
  Unlock,
  Ban,
  RefreshCw,
  FileText,
  CreditCard,
  Clock,
  User,
  CheckCircle,
  AlertTriangle,
  Send,
  ArrowUpRight,
  ArrowDownRight,
  Copy,
  Percent,
  Users,
  Settings,
  Loader2,
  Mail,
  FileSpreadsheet,
  File,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency, formatDate, formatDateTime, maskAccountNumber } from "@/lib/utils";
import { accounts, transactions, customers } from "@/data/mockData";

// Mock additional data
const standingInstructions = [
  { id: "1", type: "recurring_transfer", beneficiary: "LIC Premium", amount: 15000, frequency: "Monthly", nextDate: "2024-02-05", status: "active" },
  { id: "2", type: "sweep", targetAccount: "XXXX5678", threshold: 100000, status: "active" },
  { id: "3", type: "auto_pay", beneficiary: "Credit Card Bill", amount: null, frequency: "Monthly", nextDate: "2024-02-10", status: "active" },
];

const nominations = [
  { id: "1", name: "Sunita Sharma", relationship: "Spouse", share: 50, dob: "1988-05-20" },
  { id: "2", name: "Rohan Sharma", relationship: "Son", share: 50, dob: "2010-03-15" },
];

const linkedServices = [
  { id: "1", type: "debit_card", number: "XXXX XXXX XXXX 9012", status: "active" },
  { id: "2", type: "cheque_book", series: "100001-100050", issued: "2024-01-15", status: "active" },
  { id: "3", type: "net_banking", status: "enabled" },
  { id: "4", type: "mobile_banking", status: "enabled" },
  { id: "5", type: "upi", vpa: "rajesh@bank", status: "active" },
];

const interestHistory = [
  { period: "Jan 2024", openingBalance: 2400000, avgBalance: 2450000, interest: 9188, closingBalance: 2547890 },
  { period: "Dec 2023", openingBalance: 2300000, avgBalance: 2350000, interest: 8813, closingBalance: 2400000 },
  { period: "Nov 2023", openingBalance: 2200000, avgBalance: 2250000, interest: 8438, closingBalance: 2300000 },
];

const holdsList = [
  { id: "1", type: "lien", amount: 50000, reason: "Loan Collateral", createdAt: "2023-06-15", expiryDate: "2025-06-15" },
];

export function AccountDetail() {
  const { id } = useParams();
  const { toast } = useToast();
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const [isSIDialogOpen, setIsSIDialogOpen] = useState(false);
  const [isNominationDialogOpen, setIsNominationDialogOpen] = useState(false);
  const [isStatementDialogOpen, setIsStatementDialogOpen] = useState(false);
  const [statementForm, setStatementForm] = useState({
    fromDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    toDate: new Date().toISOString().split('T')[0],
    format: "pdf",
    statementType: "detailed",
    includeNarration: true,
    sendEmail: false,
  });
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadStatement = async () => {
    setIsDownloading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast({
        title: "Statement Generated",
        description: statementForm.sendEmail
          ? `Statement has been sent to ${customer?.email}`
          : `${statementForm.statementType.charAt(0).toUpperCase() + statementForm.statementType.slice(1)} statement downloaded successfully`,
      });
      setIsStatementDialogOpen(false);
    } catch {
      toast({
        title: "Error",
        description: "Failed to generate statement. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  // Find account
  const account = accounts.find(a => a.id === id) || accounts[0];
  const customer = customers.find(c => c.id === account.customerId);
  const accountTransactions = transactions.filter(t => t.accountId === account.id);

  const availableBalance = account.balance - holdsList.reduce((sum, h) => sum + h.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/accounts">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10">
              <Wallet className="h-8 w-8 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold font-mono">{account.accountNumber}</h1>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-muted-foreground">
                {account.type.toUpperCase()} Account • {account.branch}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setIsStatementDialogOpen(true)}>
            <FileText className="mr-2 h-4 w-4" />
            Statement
          </Button>
          <Button onClick={() => setIsTransferDialogOpen(true)}>
            <Send className="mr-2 h-4 w-4" />
            Transfer
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Edit Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard className="mr-2 h-4 w-4" />
                Request Cheque Book
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Manage Services
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {account.status === "active" ? (
                <DropdownMenuItem>
                  <Lock className="mr-2 h-4 w-4" />
                  Freeze Account
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem>
                  <Unlock className="mr-2 h-4 w-4" />
                  Unfreeze Account
                </DropdownMenuItem>
              )}
              <DropdownMenuItem className="text-destructive">
                <Ban className="mr-2 h-4 w-4" />
                Close Account
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Balance Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-primary to-primary/80 text-white">
          <CardContent className="pt-6">
            <p className="text-sm opacity-80">Current Balance</p>
            <p className="text-3xl font-bold">{formatCurrency(account.balance)}</p>
            <p className="text-sm opacity-80 mt-2">
              As of {formatDateTime(new Date().toISOString())}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Available Balance</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(availableBalance)}</p>
                {holdsList.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {formatCurrency(account.balance - availableBalance)} on hold
                  </p>
                )}
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Interest Rate</p>
                <p className="text-2xl font-bold">{account.interestRate}% p.a.</p>
                <p className="text-xs text-muted-foreground">Quarterly compounding</p>
              </div>
              <Percent className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge
                  variant={account.status === "active" ? "success" : "warning"}
                  className="mt-1 text-lg px-3 py-1"
                >
                  {account.status}
                </Badge>
              </div>
              {account.status === "active" ? (
                <CheckCircle className="h-8 w-8 text-green-500" />
              ) : (
                <AlertTriangle className="h-8 w-8 text-yellow-500" />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="standing-instructions">Standing Instructions</TabsTrigger>
          <TabsTrigger value="nominations">Nominations</TabsTrigger>
          <TabsTrigger value="services">Linked Services</TabsTrigger>
          <TabsTrigger value="interest">Interest History</TabsTrigger>
          <TabsTrigger value="holds">Holds & Liens</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Account Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Account Type</Label>
                    <p className="font-medium capitalize">{account.type}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Currency</Label>
                    <p className="font-medium">{account.currency}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Branch</Label>
                    <p className="font-medium">{account.branch}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">IFSC Code</Label>
                    <p className="font-mono">SBIN0001234</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Opened On</Label>
                    <p className="font-medium">{formatDate(account.openDate)}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Last Transaction</Label>
                    <p className="font-medium">{formatDate(account.lastTransaction)}</p>
                  </div>
                </div>
                <Separator />
                <div>
                  <Label className="text-muted-foreground">Account Holder</Label>
                  <Link to={`/customers/${customer?.id}`} className="block mt-1">
                    <div className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{customer?.name}</p>
                        <p className="text-sm text-muted-foreground">CIF: {customer?.cif}</p>
                      </div>
                    </div>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Mini Statement */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Mini Statement</CardTitle>
                <Button variant="ghost" size="sm">View All</Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {accountTransactions.slice(0, 5).map(txn => (
                    <div key={txn.id} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${txn.type === "credit" ? "bg-green-100" : "bg-red-100"}`}>
                          {txn.type === "credit" ? (
                            <ArrowDownRight className="h-4 w-4 text-green-600" />
                          ) : (
                            <ArrowUpRight className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium truncate max-w-[200px]">{txn.description}</p>
                          <p className="text-xs text-muted-foreground">{formatDateTime(txn.timestamp)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${txn.type === "credit" ? "text-green-600" : "text-red-600"}`}>
                          {txn.type === "credit" ? "+" : "-"}{formatCurrency(txn.amount)}
                        </p>
                        <p className="text-xs text-muted-foreground">{formatCurrency(txn.balanceAfter)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-green-50">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      <span className="text-sm text-green-600">Total Credits</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600 mt-2">{formatCurrency(250000)}</p>
                    <p className="text-sm text-green-600">5 transactions</p>
                  </div>
                  <div className="p-4 rounded-lg bg-red-50">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="h-5 w-5 text-red-600" />
                      <span className="text-sm text-red-600">Total Debits</span>
                    </div>
                    <p className="text-2xl font-bold text-red-600 mt-2">{formatCurrency(125000)}</p>
                    <p className="text-sm text-red-600">12 transactions</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Linked Services Quick View */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Linked Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {linkedServices.slice(0, 4).map(service => (
                    <div key={service.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        {service.type === "debit_card" && <CreditCard className="h-5 w-5 text-muted-foreground" />}
                        {service.type === "net_banking" && <Wallet className="h-5 w-5 text-muted-foreground" />}
                        {service.type === "upi" && <Send className="h-5 w-5 text-muted-foreground" />}
                        {service.type === "cheque_book" && <FileText className="h-5 w-5 text-muted-foreground" />}
                        {service.type === "mobile_banking" && <Wallet className="h-5 w-5 text-muted-foreground" />}
                        <div>
                          <p className="font-medium capitalize">{service.type.replace("_", " ")}</p>
                          {service.number && <p className="text-xs text-muted-foreground">{service.number}</p>}
                          {service.vpa && <p className="text-xs text-muted-foreground">{service.vpa}</p>}
                        </div>
                      </div>
                      <Badge variant={service.status === "active" || service.status === "enabled" ? "success" : "secondary"}>
                        {service.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>Complete transaction history for this account</CardDescription>
              </div>
              <div className="flex gap-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="credit">Credits Only</SelectItem>
                    <SelectItem value="debit">Debits Only</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Channel</TableHead>
                    <TableHead>Debit</TableHead>
                    <TableHead>Credit</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accountTransactions.map(txn => (
                    <TableRow key={txn.id}>
                      <TableCell>{formatDateTime(txn.timestamp)}</TableCell>
                      <TableCell className="font-mono text-sm">{txn.referenceNumber}</TableCell>
                      <TableCell>{txn.description}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{txn.channel}</Badge>
                      </TableCell>
                      <TableCell className="text-red-600">
                        {txn.type === "debit" ? formatCurrency(txn.amount) : "-"}
                      </TableCell>
                      <TableCell className="text-green-600">
                        {txn.type === "credit" ? formatCurrency(txn.amount) : "-"}
                      </TableCell>
                      <TableCell>{formatCurrency(txn.balanceAfter)}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Standing Instructions Tab */}
        <TabsContent value="standing-instructions">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Standing Instructions</CardTitle>
                <CardDescription>Automated recurring transactions</CardDescription>
              </div>
              <Button onClick={() => setIsSIDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Instruction
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Next Execution</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {standingInstructions.map(si => (
                    <TableRow key={si.id}>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {si.type.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {si.beneficiary || `Target: ${si.targetAccount}`}
                        {si.threshold && <span className="text-sm text-muted-foreground"> (Min: {formatCurrency(si.threshold)})</span>}
                      </TableCell>
                      <TableCell>{si.amount ? formatCurrency(si.amount) : "Variable"}</TableCell>
                      <TableCell>{si.frequency || "Auto"}</TableCell>
                      <TableCell>{si.nextDate ? formatDate(si.nextDate) : "On Threshold"}</TableCell>
                      <TableCell>
                        <Badge variant={si.status === "active" ? "success" : "secondary"}>{si.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>View History</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
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

        {/* Nominations Tab */}
        <TabsContent value="nominations">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Nominations</CardTitle>
                <CardDescription>Nominated beneficiaries for this account</CardDescription>
              </div>
              <Button onClick={() => setIsNominationDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Nominee
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Relationship</TableHead>
                    <TableHead>Date of Birth</TableHead>
                    <TableHead>Share %</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {nominations.map(nominee => (
                    <TableRow key={nominee.id}>
                      <TableCell className="font-medium">{nominee.name}</TableCell>
                      <TableCell>{nominee.relationship}</TableCell>
                      <TableCell>{formatDate(nominee.dob)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={nominee.share} className="w-20 h-2" />
                          <span>{nominee.share}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Remove</DropdownMenuItem>
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

        {/* Linked Services Tab */}
        <TabsContent value="services">
          <Card>
            <CardHeader>
              <CardTitle>Linked Services</CardTitle>
              <CardDescription>Services connected to this account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {linkedServices.map(service => (
                  <div key={service.id} className="p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {service.type === "debit_card" && <CreditCard className="h-5 w-5" />}
                        {service.type === "net_banking" && <Wallet className="h-5 w-5" />}
                        {service.type === "upi" && <Send className="h-5 w-5" />}
                        {service.type === "cheque_book" && <FileText className="h-5 w-5" />}
                        {service.type === "mobile_banking" && <Wallet className="h-5 w-5" />}
                        <span className="font-medium capitalize">{service.type.replace("_", " ")}</span>
                      </div>
                      <Badge variant={service.status === "active" || service.status === "enabled" ? "success" : "secondary"}>
                        {service.status}
                      </Badge>
                    </div>
                    {service.number && <p className="text-sm font-mono">{service.number}</p>}
                    {service.vpa && <p className="text-sm font-mono">{service.vpa}</p>}
                    {service.series && <p className="text-sm text-muted-foreground">Series: {service.series}</p>}
                    <div className="mt-3 flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">Manage</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Interest History Tab */}
        <TabsContent value="interest">
          <Card>
            <CardHeader>
              <CardTitle>Interest History</CardTitle>
              <CardDescription>Monthly interest credits</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Period</TableHead>
                    <TableHead>Opening Balance</TableHead>
                    <TableHead>Avg Monthly Balance</TableHead>
                    <TableHead>Interest Earned</TableHead>
                    <TableHead>Closing Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {interestHistory.map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{row.period}</TableCell>
                      <TableCell>{formatCurrency(row.openingBalance)}</TableCell>
                      <TableCell>{formatCurrency(row.avgBalance)}</TableCell>
                      <TableCell className="text-green-600">+{formatCurrency(row.interest)}</TableCell>
                      <TableCell>{formatCurrency(row.closingBalance)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Holds Tab */}
        <TabsContent value="holds">
          <Card>
            <CardHeader>
              <CardTitle>Holds & Liens</CardTitle>
              <CardDescription>Amounts blocked or held on this account</CardDescription>
            </CardHeader>
            <CardContent>
              {holdsList.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Expiry</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {holdsList.map(hold => (
                      <TableRow key={hold.id}>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">{hold.type}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">{formatCurrency(hold.amount)}</TableCell>
                        <TableCell>{hold.reason}</TableCell>
                        <TableCell>{formatDate(hold.createdAt)}</TableCell>
                        <TableCell>{formatDate(hold.expiryDate)}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">Release</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No holds or liens on this account
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Transfer Dialog */}
      <Dialog open={isTransferDialogOpen} onOpenChange={setIsTransferDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Fund Transfer</DialogTitle>
            <DialogDescription>Transfer funds from this account</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Available Balance</p>
              <p className="text-xl font-bold">{formatCurrency(availableBalance)}</p>
            </div>
            <div className="space-y-2">
              <Label>Transfer Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="internal">Internal Transfer</SelectItem>
                  <SelectItem value="neft">NEFT</SelectItem>
                  <SelectItem value="rtgs">RTGS</SelectItem>
                  <SelectItem value="imps">IMPS</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Beneficiary Account</Label>
              <Input placeholder="Enter account number" />
            </div>
            <div className="space-y-2">
              <Label>Amount</Label>
              <Input type="number" placeholder="0.00" />
            </div>
            <div className="space-y-2">
              <Label>Remarks</Label>
              <Input placeholder="Payment description" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTransferDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => setIsTransferDialogOpen(false)}>Transfer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Statement Dialog */}
      <Dialog open={isStatementDialogOpen} onOpenChange={setIsStatementDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Generate Account Statement</DialogTitle>
            <DialogDescription>
              Download or email your account statement
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-5">
            {/* Account Info */}
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Account</p>
                  <p className="font-mono font-medium">{maskAccountNumber(account.accountNumber)}</p>
                </div>
                <Badge variant="outline">{account.type.toUpperCase()}</Badge>
              </div>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>From Date</Label>
                <Input
                  type="date"
                  value={statementForm.fromDate}
                  onChange={(e) => setStatementForm({ ...statementForm, fromDate: e.target.value })}
                  max={statementForm.toDate}
                />
              </div>
              <div className="space-y-2">
                <Label>To Date</Label>
                <Input
                  type="date"
                  value={statementForm.toDate}
                  onChange={(e) => setStatementForm({ ...statementForm, toDate: e.target.value })}
                  min={statementForm.fromDate}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            {/* Quick Date Selection */}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const today = new Date();
                  const lastMonth = new Date(today.setMonth(today.getMonth() - 1));
                  setStatementForm({
                    ...statementForm,
                    fromDate: lastMonth.toISOString().split('T')[0],
                    toDate: new Date().toISOString().split('T')[0],
                  });
                }}
              >
                Last Month
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const today = new Date();
                  const threeMonths = new Date(today.setMonth(today.getMonth() - 3));
                  setStatementForm({
                    ...statementForm,
                    fromDate: threeMonths.toISOString().split('T')[0],
                    toDate: new Date().toISOString().split('T')[0],
                  });
                }}
              >
                Last 3 Months
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const today = new Date();
                  const sixMonths = new Date(today.setMonth(today.getMonth() - 6));
                  setStatementForm({
                    ...statementForm,
                    fromDate: sixMonths.toISOString().split('T')[0],
                    toDate: new Date().toISOString().split('T')[0],
                  });
                }}
              >
                Last 6 Months
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const today = new Date();
                  const startOfYear = new Date(today.getFullYear(), 0, 1);
                  setStatementForm({
                    ...statementForm,
                    fromDate: startOfYear.toISOString().split('T')[0],
                    toDate: new Date().toISOString().split('T')[0],
                  });
                }}
              >
                YTD
              </Button>
            </div>

            {/* Statement Type */}
            <div className="space-y-2">
              <Label>Statement Type</Label>
              <Select
                value={statementForm.statementType}
                onValueChange={(value) => setStatementForm({ ...statementForm, statementType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="detailed">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <div>
                        <p>Detailed Statement</p>
                        <p className="text-xs text-muted-foreground">All transactions with full details</p>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="summary">
                    <div className="flex items-center gap-2">
                      <File className="h-4 w-4" />
                      <div>
                        <p>Summary Statement</p>
                        <p className="text-xs text-muted-foreground">Opening, closing balance & totals</p>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="mini">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <div>
                        <p>Mini Statement</p>
                        <p className="text-xs text-muted-foreground">Last 10 transactions only</p>
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Format Selection */}
            <div className="space-y-2">
              <Label>Download Format</Label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { value: "pdf", label: "PDF", icon: FileText },
                  { value: "excel", label: "Excel", icon: FileSpreadsheet },
                  { value: "csv", label: "CSV", icon: File },
                  { value: "mt940", label: "MT940", icon: File },
                ].map((format) => (
                  <Button
                    key={format.value}
                    type="button"
                    variant={statementForm.format === format.value ? "default" : "outline"}
                    className="flex flex-col h-auto py-3"
                    onClick={() => setStatementForm({ ...statementForm, format: format.value })}
                  >
                    <format.icon className="h-5 w-5 mb-1" />
                    <span className="text-xs">{format.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Options */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeNarration"
                  checked={statementForm.includeNarration}
                  onCheckedChange={(checked) => setStatementForm({ ...statementForm, includeNarration: checked as boolean })}
                />
                <label htmlFor="includeNarration" className="text-sm">
                  Include transaction narration
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="sendEmail"
                  checked={statementForm.sendEmail}
                  onCheckedChange={(checked) => setStatementForm({ ...statementForm, sendEmail: checked as boolean })}
                />
                <label htmlFor="sendEmail" className="text-sm">
                  Send to registered email ({customer?.email})
                </label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStatementDialogOpen(false)} disabled={isDownloading}>
              Cancel
            </Button>
            <Button onClick={handleDownloadStatement} disabled={isDownloading}>
              {isDownloading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : statementForm.sendEmail ? (
                <Mail className="mr-2 h-4 w-4" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              {statementForm.sendEmail ? "Send Statement" : "Download Statement"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Standing Instruction Dialog */}
      <Dialog open={isSIDialogOpen} onOpenChange={setIsSIDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Standing Instruction</DialogTitle>
            <DialogDescription>Set up a recurring instruction</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Instruction Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recurring">Recurring Transfer</SelectItem>
                  <SelectItem value="sweep">Sweep</SelectItem>
                  <SelectItem value="auto_pay">Auto Pay</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Beneficiary Account</Label>
              <Input placeholder="Enter account number" />
            </div>
            <div className="space-y-2">
              <Label>Amount</Label>
              <Input type="number" placeholder="0.00" />
            </div>
            <div className="space-y-2">
              <Label>Frequency</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input type="date" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSIDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => setIsSIDialogOpen(false)}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
