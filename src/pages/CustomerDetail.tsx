import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
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
  Phone,
  Mail,
  MapPin,
  Calendar,
  Shield,
  FileText,
  CreditCard,
  Wallet,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Upload,
  Eye,
  Plus,
  User,
  Building2,
  Briefcase,
  MessageSquare,
  History,
  Link as LinkIcon,
  Ban,
  RefreshCw,
  Loader2,
  X,
  File,
  Image as ImageIcon,
} from "lucide-react";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils";
import { customers, accounts, transactions, loans, cards } from "@/data/mockData";

// Mock additional data for customer 360
const customerDocuments = [
  { id: "1", name: "PAN Card", type: "identity", status: "verified", uploadedAt: "2020-01-15", expiryDate: null },
  { id: "2", name: "Aadhaar Card", type: "identity", status: "verified", uploadedAt: "2020-01-15", expiryDate: null },
  { id: "3", name: "Address Proof", type: "address", status: "verified", uploadedAt: "2020-01-15", expiryDate: null },
  { id: "4", name: "Photo", type: "photo", status: "verified", uploadedAt: "2020-01-15", expiryDate: null },
  { id: "5", name: "Signature", type: "signature", status: "verified", uploadedAt: "2020-01-15", expiryDate: null },
  { id: "6", name: "Income Proof", type: "financial", status: "pending", uploadedAt: "2024-01-10", expiryDate: "2025-01-10" },
];

const customerInteractions = [
  { id: "1", type: "call", subject: "Account inquiry", agent: "Priya Sharma", date: "2024-01-28T10:30:00Z", duration: "5 min", status: "resolved" },
  { id: "2", type: "email", subject: "Statement request", agent: "System", date: "2024-01-25T14:00:00Z", duration: null, status: "completed" },
  { id: "3", type: "branch", subject: "Cheque book request", agent: "Rahul Verma", date: "2024-01-20T11:00:00Z", duration: "15 min", status: "completed" },
  { id: "4", type: "chat", subject: "Card activation help", agent: "Bot + Agent", date: "2024-01-15T16:45:00Z", duration: "8 min", status: "resolved" },
];

const relatedParties = [
  { id: "1", name: "Sunita Sharma", relationship: "Spouse", cif: "CIF001234599", status: "active" },
  { id: "2", name: "Rohan Sharma", relationship: "Son", cif: "CIF001234600", status: "active" },
];

const alerts = [
  { id: "1", type: "kyc", message: "Income proof document expiring in 30 days", severity: "warning", date: "2024-01-28" },
  { id: "2", type: "risk", message: "Large transaction pattern detected", severity: "info", date: "2024-01-25" },
];

export function CustomerDetail() {
  const { id } = useParams();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDocumentDialogOpen, setIsDocumentDialogOpen] = useState(false);
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);

  // Document upload state
  const [documentForm, setDocumentForm] = useState({
    type: "",
    name: "",
    expiryDate: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    setUploadError(null);

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File size must be less than 5MB");
      return;
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      setUploadError("Only JPG, PNG, GIF, and PDF files are allowed");
      return;
    }

    setSelectedFile(file);
    // Auto-fill document name from filename if empty
    if (!documentForm.name) {
      setDocumentForm({ ...documentForm, name: file.name.replace(/\.[^/.]+$/, "") });
    }
  };

  const handleDocumentUpload = async () => {
    if (!selectedFile || !documentForm.type) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload with progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise((resolve) => setTimeout(resolve, 150));
        setUploadProgress(i);
      }

      // Reset form
      setSelectedFile(null);
      setDocumentForm({ type: "", name: "", expiryDate: "" });
      setUploadProgress(0);
      setIsDocumentDialogOpen(false);
    } catch {
      setUploadError("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const resetDocumentDialog = () => {
    setSelectedFile(null);
    setDocumentForm({ type: "", name: "", expiryDate: "" });
    setUploadProgress(0);
    setUploadError(null);
    setIsUploading(false);
  };

  // Find customer (in real app, this would be an API call)
  const customer = customers.find(c => c.id === id) || customers[0];
  const customerAccounts = accounts.filter(a => a.customerId === customer.id);
  const customerCards = cards.filter(c => c.customerId === customer.id);
  const customerLoans = loans.filter(l => l.customerId === customer.id);
  const customerTransactions = transactions.filter(t =>
    customerAccounts.some(a => a.id === t.accountId)
  ).slice(0, 10);

  const totalBalance = customerAccounts.reduce((sum, a) => sum + a.balance, 0);
  const totalLoanOutstanding = customerLoans.reduce((sum, l) => sum + l.outstandingAmount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/customers">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-xl bg-primary/10 text-primary">
                {customer.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{customer.name}</h1>
                <Badge variant={customer.type === "individual" ? "secondary" : "outline"}>
                  {customer.type === "individual" ? <User className="mr-1 h-3 w-3" /> : <Building2 className="mr-1 h-3 w-3" />}
                  {customer.type}
                </Badge>
              </div>
              <p className="text-muted-foreground font-mono">CIF: {customer.cif}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <MessageSquare className="mr-2 h-4 w-4" />
            Add Note
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsEditDialogOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <RefreshCw className="mr-2 h-4 w-4" />
                Initiate Re-KYC
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LinkIcon className="mr-2 h-4 w-4" />
                Link Family Member
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                Export Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Ban className="mr-2 h-4 w-4" />
                Deactivate Customer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Alerts Banner */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map(alert => (
            <div
              key={alert.id}
              className={`flex items-center gap-3 p-3 rounded-lg ${
                alert.severity === "warning" ? "bg-yellow-50 border border-yellow-200" :
                alert.severity === "error" ? "bg-red-50 border border-red-200" :
                "bg-blue-50 border border-blue-200"
              }`}
            >
              <AlertTriangle className={`h-5 w-5 ${
                alert.severity === "warning" ? "text-yellow-600" :
                alert.severity === "error" ? "text-red-600" : "text-blue-600"
              }`} />
              <span className="flex-1 text-sm">{alert.message}</span>
              <Button variant="ghost" size="sm">Dismiss</Button>
              <Button variant="ghost" size="sm">Take Action</Button>
            </div>
          ))}
        </div>
      )}

      {/* Status Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">KYC Status</p>
                <div className="flex items-center gap-2 mt-1">
                  {customer.kycStatus === "verified" ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <Clock className="h-5 w-5 text-yellow-500" />
                  )}
                  <span className="font-semibold capitalize">{customer.kycStatus}</span>
                </div>
              </div>
              <Shield className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Risk Category</p>
                <Badge
                  variant={
                    customer.riskCategory === "low" ? "success" :
                    customer.riskCategory === "medium" ? "warning" : "destructive"
                  }
                  className="mt-1"
                >
                  {customer.riskCategory}
                </Badge>
              </div>
              <AlertTriangle className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Balance</p>
                <p className="text-xl font-bold text-green-600">{formatCurrency(totalBalance)}</p>
              </div>
              <Wallet className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Loan Outstanding</p>
                <p className="text-xl font-bold">{formatCurrency(totalLoanOutstanding)}</p>
              </div>
              <Briefcase className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Relationship Age</p>
                <p className="text-xl font-bold">4 Years</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="accounts">Accounts ({customerAccounts.length})</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="loans">Loans ({customerLoans.length})</TabsTrigger>
          <TabsTrigger value="cards">Cards ({customerCards.length})</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="interactions">Interactions</TabsTrigger>
          <TabsTrigger value="related">Related Parties</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Full Name</Label>
                    <p className="font-medium">{customer.name}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Date of Birth</Label>
                    <p className="font-medium">{customer.dateOfBirth ? formatDate(customer.dateOfBirth) : "N/A"}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">PAN</Label>
                    <p className="font-mono">{customer.pan || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Aadhaar</Label>
                    <p className="font-mono">{customer.aadhaar || "N/A"}</p>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{customer.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{customer.phone}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span>{customer.address}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* KYC & Compliance */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">KYC & Compliance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    {customer.kycStatus === "verified" ? (
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    ) : (
                      <Clock className="h-8 w-8 text-yellow-500" />
                    )}
                    <div>
                      <p className="font-medium">KYC Status: {customer.kycStatus}</p>
                      <p className="text-sm text-muted-foreground">Last verified: {formatDate(customer.lastUpdated)}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Update KYC</Button>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Risk Score</span>
                    <span className="font-medium">72/100</span>
                  </div>
                  <Progress value={72} className="h-2" />
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-muted-foreground">PEP Status</Label>
                    <p className="font-medium">No</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Sanctions Check</Label>
                    <p className="font-medium text-green-600">Clear</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">FATCA Status</Label>
                    <p className="font-medium">Non-US Person</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">AML Alerts</Label>
                    <p className="font-medium">0</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Summary */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Account Summary</CardTitle>
                <Button variant="outline" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Open Account
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {customerAccounts.slice(0, 3).map(account => (
                    <div key={account.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{account.type.toUpperCase()} - {account.accountNumber.slice(-4)}</p>
                        <p className="text-sm text-muted-foreground">{account.branch}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{formatCurrency(account.balance)}</p>
                        <Badge variant={account.status === "active" ? "success" : "secondary"} className="text-xs">
                          {account.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {customerTransactions.slice(0, 5).map(txn => (
                    <div key={txn.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${txn.type === "credit" ? "bg-green-100" : "bg-red-100"}`}>
                          <TrendingUp className={`h-4 w-4 ${txn.type === "credit" ? "text-green-600" : "text-red-600 rotate-180"}`} />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{txn.description}</p>
                          <p className="text-xs text-muted-foreground">{formatDateTime(txn.timestamp)}</p>
                        </div>
                      </div>
                      <span className={`font-medium ${txn.type === "credit" ? "text-green-600" : "text-red-600"}`}>
                        {txn.type === "credit" ? "+" : "-"}{formatCurrency(txn.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Accounts Tab */}
        <TabsContent value="accounts">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Customer Accounts</CardTitle>
                <CardDescription>All accounts held by this customer</CardDescription>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Open New Account
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Account Number</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Branch</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Interest Rate</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Transaction</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customerAccounts.map(account => (
                    <TableRow key={account.id}>
                      <TableCell className="font-mono">{account.accountNumber}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">{account.type}</Badge>
                      </TableCell>
                      <TableCell>{account.branch}</TableCell>
                      <TableCell className="font-medium">{formatCurrency(account.balance)}</TableCell>
                      <TableCell>{account.interestRate}%</TableCell>
                      <TableCell>
                        <Badge variant={account.status === "active" ? "success" : "secondary"}>
                          {account.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(account.lastTransaction)}</TableCell>
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
                            <DropdownMenuItem>View Statement</DropdownMenuItem>
                            <DropdownMenuItem>Standing Instructions</DropdownMenuItem>
                            <DropdownMenuItem>Nominations</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Freeze Account</DropdownMenuItem>
                            <DropdownMenuItem>Close Account</DropdownMenuItem>
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

        {/* Transactions Tab */}
        <TabsContent value="transactions">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>All transactions across customer accounts</CardDescription>
              </div>
              <div className="flex gap-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Account" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Accounts</SelectItem>
                    {customerAccounts.map(a => (
                      <SelectItem key={a.id} value={a.id}>...{a.accountNumber.slice(-4)}</SelectItem>
                    ))}
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
                    <TableHead>Account</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customerTransactions.map(txn => (
                    <TableRow key={txn.id}>
                      <TableCell>{formatDateTime(txn.timestamp)}</TableCell>
                      <TableCell className="font-mono text-sm">{txn.referenceNumber}</TableCell>
                      <TableCell>{txn.description}</TableCell>
                      <TableCell className="font-mono">...{txn.accountNumber.slice(-4)}</TableCell>
                      <TableCell>
                        <Badge variant={txn.type === "credit" ? "success" : "destructive"}>
                          {txn.type}
                        </Badge>
                      </TableCell>
                      <TableCell className={`font-medium ${txn.type === "credit" ? "text-green-600" : "text-red-600"}`}>
                        {txn.type === "credit" ? "+" : "-"}{formatCurrency(txn.amount)}
                      </TableCell>
                      <TableCell>{formatCurrency(txn.balanceAfter)}</TableCell>
                      <TableCell>
                        <Badge variant={txn.status === "completed" ? "success" : "warning"}>
                          {txn.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Loans Tab */}
        <TabsContent value="loans">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Loan Portfolio</CardTitle>
                <CardDescription>Active and closed loans</CardDescription>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Apply for Loan
              </Button>
            </CardHeader>
            <CardContent>
              {customerLoans.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Loan Number</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Principal</TableHead>
                      <TableHead>Outstanding</TableHead>
                      <TableHead>EMI</TableHead>
                      <TableHead>Next EMI Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customerLoans.map(loan => (
                      <TableRow key={loan.id}>
                        <TableCell className="font-mono">{loan.loanNumber}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">{loan.type}</Badge>
                        </TableCell>
                        <TableCell>{formatCurrency(loan.principalAmount)}</TableCell>
                        <TableCell>{formatCurrency(loan.outstandingAmount)}</TableCell>
                        <TableCell>{formatCurrency(loan.emiAmount)}</TableCell>
                        <TableCell>{formatDate(loan.nextEmiDate)}</TableCell>
                        <TableCell>
                          <Badge variant={loan.status === "active" ? "success" : "secondary"}>
                            {loan.status}
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
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>EMI Schedule</DropdownMenuItem>
                              <DropdownMenuItem>Prepayment</DropdownMenuItem>
                              <DropdownMenuItem>Foreclosure Quote</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No loans found for this customer
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cards Tab */}
        <TabsContent value="cards">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Cards</CardTitle>
                <CardDescription>Debit and credit cards</CardDescription>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Issue New Card
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {customerCards.map(card => (
                  <div
                    key={card.id}
                    className={`p-6 rounded-xl text-white ${
                      card.variant === "platinum" ? "bg-gradient-to-br from-slate-700 to-slate-900" :
                      card.variant === "gold" ? "bg-gradient-to-br from-yellow-500 to-yellow-700" :
                      "bg-gradient-to-br from-gray-500 to-gray-700"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-6">
                      <CreditCard className="h-8 w-8" />
                      <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                        {card.type}
                      </Badge>
                    </div>
                    <p className="font-mono text-lg tracking-wider mb-4">{card.maskedNumber}</p>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-xs opacity-70">Card Holder</p>
                        <p className="font-medium">{card.customerName}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs opacity-70">Expires</p>
                        <p className="font-medium">{card.expiryDate}</p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/20 flex justify-between">
                      <Badge variant={card.status === "active" ? "success" : "destructive"}>
                        {card.status}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>View Transactions</DropdownMenuItem>
                          <DropdownMenuItem>Manage Limits</DropdownMenuItem>
                          <DropdownMenuItem>Set PIN</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {card.status === "active" ? (
                            <DropdownMenuItem className="text-destructive">Block Card</DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem>Unblock Card</DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Documents</CardTitle>
                <CardDescription>KYC and supporting documents</CardDescription>
              </div>
              <Button onClick={() => setIsDocumentDialogOpen(true)}>
                <Upload className="mr-2 h-4 w-4" />
                Upload Document
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Uploaded</TableHead>
                    <TableHead>Expiry</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customerDocuments.map(doc => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">{doc.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">{doc.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={doc.status === "verified" ? "success" : "warning"}>
                          {doc.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(doc.uploadedAt)}</TableCell>
                      <TableCell>{doc.expiryDate ? formatDate(doc.expiryDate) : "N/A"}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Interactions Tab */}
        <TabsContent value="interactions">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Interaction History</CardTitle>
                <CardDescription>Customer service interactions</CardDescription>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Log Interaction
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Channel</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Agent</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customerInteractions.map(interaction => (
                    <TableRow key={interaction.id}>
                      <TableCell>{formatDateTime(interaction.date)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">{interaction.type}</Badge>
                      </TableCell>
                      <TableCell>{interaction.subject}</TableCell>
                      <TableCell>{interaction.agent}</TableCell>
                      <TableCell>{interaction.duration || "-"}</TableCell>
                      <TableCell>
                        <Badge variant={interaction.status === "resolved" ? "success" : "secondary"}>
                          {interaction.status}
                        </Badge>
                      </TableCell>
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

        {/* Related Parties Tab */}
        <TabsContent value="related">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Related Parties</CardTitle>
                <CardDescription>Family members and linked customers</CardDescription>
              </div>
              <Button>
                <LinkIcon className="mr-2 h-4 w-4" />
                Link Customer
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Relationship</TableHead>
                    <TableHead>CIF</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {relatedParties.map(party => (
                    <TableRow key={party.id}>
                      <TableCell className="font-medium">{party.name}</TableCell>
                      <TableCell>{party.relationship}</TableCell>
                      <TableCell className="font-mono">{party.cif}</TableCell>
                      <TableCell>
                        <Badge variant="success">{party.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">View Profile</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Document Upload Dialog */}
      <Dialog open={isDocumentDialogOpen} onOpenChange={(open) => {
        if (!open) resetDocumentDialog();
        setIsDocumentDialogOpen(open);
      }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>Upload a new KYC or supporting document</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Document Type */}
            <div className="space-y-2">
              <Label>Document Type *</Label>
              <Select
                value={documentForm.type}
                onValueChange={(value) => setDocumentForm({ ...documentForm, type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="identity">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Identity Proof (PAN, Aadhaar, Passport)
                    </div>
                  </SelectItem>
                  <SelectItem value="address">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Address Proof
                    </div>
                  </SelectItem>
                  <SelectItem value="financial">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Financial Document (ITR, Salary Slip)
                    </div>
                  </SelectItem>
                  <SelectItem value="photo">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      Photograph
                    </div>
                  </SelectItem>
                  <SelectItem value="signature">
                    <div className="flex items-center gap-2">
                      <Edit className="h-4 w-4" />
                      Signature
                    </div>
                  </SelectItem>
                  <SelectItem value="other">
                    <div className="flex items-center gap-2">
                      <File className="h-4 w-4" />
                      Other Document
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Document Name */}
            <div className="space-y-2">
              <Label>Document Name</Label>
              <Input
                placeholder="Enter document name"
                value={documentForm.name}
                onChange={(e) => setDocumentForm({ ...documentForm, name: e.target.value })}
              />
            </div>

            {/* Drag and Drop File Upload */}
            <div className="space-y-2">
              <Label>File *</Label>
              {!selectedFile ? (
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    isDragging
                      ? "border-primary bg-primary/5"
                      : "border-muted-foreground/25 hover:border-primary/50"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                  <p className="text-sm font-medium mb-1">
                    Drag and drop your file here
                  </p>
                  <p className="text-xs text-muted-foreground mb-3">
                    or click to browse
                  </p>
                  <input
                    type="file"
                    className="hidden"
                    id="file-upload"
                    accept=".jpg,.jpeg,.png,.gif,.pdf"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleFileSelect(e.target.files[0]);
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById("file-upload")?.click()}
                  >
                    Browse Files
                  </Button>
                  <p className="text-xs text-muted-foreground mt-3">
                    Supported formats: JPG, PNG, GIF, PDF (Max 5MB)
                  </p>
                </div>
              ) : (
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-muted rounded-lg">
                        {selectedFile.type.startsWith("image/") ? (
                          <ImageIcon className="h-6 w-6 text-blue-500" />
                        ) : (
                          <FileText className="h-6 w-6 text-red-500" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm truncate max-w-[200px]">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(selectedFile.size)}
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setSelectedFile(null)}
                      disabled={isUploading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Upload Progress */}
                  {isUploading && (
                    <div className="mt-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Uploading...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} className="h-2" />
                    </div>
                  )}
                </div>
              )}

              {/* Upload Error */}
              {uploadError && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertTriangle className="h-4 w-4" />
                  {uploadError}
                </p>
              )}
            </div>

            {/* Expiry Date */}
            <div className="space-y-2">
              <Label>Expiry Date (if applicable)</Label>
              <Input
                type="date"
                value={documentForm.expiryDate}
                onChange={(e) => setDocumentForm({ ...documentForm, expiryDate: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
              />
              <p className="text-xs text-muted-foreground">
                Leave empty for documents without expiry
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDocumentDialogOpen(false)}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDocumentUpload}
              disabled={!selectedFile || !documentForm.type || isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Document
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
