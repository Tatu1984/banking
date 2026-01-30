import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
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
  Plus,
  Ship,
  FileText,
  Globe,
  Eye,
  Building2,
  Send,
  Clock,
  CheckCircle2,
  AlertCircle,
  Wallet,
  ArrowRightLeft,
  Receipt,
  Landmark,
  Package,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useState } from "react";
import { supplyChainFinance } from "@/data/mockData";

const tradeTransactions = [
  {
    id: "1",
    lcNumber: "LC2024010001",
    type: "Import LC",
    applicant: "TechCorp Solutions Pvt Ltd",
    beneficiary: "Global Electronics Inc, USA",
    amount: 5000000,
    currency: "USD",
    status: "active",
    issuedDate: "2024-01-15",
    expiryDate: "2024-04-15",
  },
  {
    id: "2",
    lcNumber: "LC2024010002",
    type: "Export LC",
    applicant: "GlobalTrade Exports",
    beneficiary: "European Textiles Ltd, Germany",
    amount: 2500000,
    currency: "EUR",
    status: "advised",
    issuedDate: "2024-01-20",
    expiryDate: "2024-05-20",
  },
  {
    id: "3",
    lcNumber: "BG2024010001",
    type: "Bank Guarantee",
    applicant: "Construction Corp Ltd",
    beneficiary: "Government of India",
    amount: 10000000,
    currency: "INR",
    status: "active",
    issuedDate: "2024-01-10",
    expiryDate: "2025-01-10",
  },
  {
    id: "4",
    lcNumber: "BC2024010001",
    type: "Bills Collection",
    applicant: "Export House Ltd",
    beneficiary: "Asian Importers, Singapore",
    amount: 1500000,
    currency: "SGD",
    status: "pending",
    issuedDate: "2024-01-25",
    expiryDate: "2024-02-25",
  },
];

const swiftMessages = [
  { id: "1", type: "MT700", description: "Issue of Documentary Credit", lcRef: "LC2024010001", date: "2024-01-15", status: "sent" },
  { id: "2", type: "MT707", description: "Amendment to Documentary Credit", lcRef: "LC2024010001", date: "2024-01-20", status: "sent" },
  { id: "3", type: "MT799", description: "Free Format Message", lcRef: "LC2024010002", date: "2024-01-21", status: "received" },
  { id: "4", type: "MT760", description: "Guarantee/Standby LC", lcRef: "BG2024010001", date: "2024-01-10", status: "sent" },
  { id: "5", type: "MT754", description: "Advice of Payment/Acceptance", lcRef: "BC2024010001", date: "2024-01-26", status: "pending" },
];

const invoices = [
  { id: "1", invoiceNo: "INV2024001", supplier: "Raw Materials Co", buyer: "TechCorp Solutions", amount: 2500000, currency: "INR", dueDate: "2024-02-15", status: "approved", discountRate: 8.5 },
  { id: "2", invoiceNo: "INV2024002", supplier: "Components Ltd", buyer: "TechCorp Solutions", amount: 1800000, currency: "INR", dueDate: "2024-02-20", status: "pending", discountRate: 0 },
  { id: "3", invoiceNo: "INV2024003", supplier: "Packaging Inc", buyer: "TechCorp Solutions", amount: 450000, currency: "INR", dueDate: "2024-02-10", status: "financed", discountRate: 9.0 },
  { id: "4", invoiceNo: "INV2024004", supplier: "Logistics Co", buyer: "GlobalTrade Exports", amount: 3200000, currency: "USD", dueDate: "2024-03-01", status: "approved", discountRate: 7.5 },
];

export function TradeFinance() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewLCDialog, setShowNewLCDialog] = useState(false);
  const [showNewSCFDialog, setShowNewSCFDialog] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "advised": return <Send className="h-4 w-4 text-blue-500" />;
      case "pending": return <Clock className="h-4 w-4 text-yellow-500" />;
      case "expired": return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Trade Finance</h1>
          <p className="text-muted-foreground">
            Letters of Credit, Bank Guarantees, Bills Collection & Supply Chain Finance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Dialog open={showNewLCDialog} onOpenChange={setShowNewLCDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New LC
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Issue Letter of Credit</DialogTitle>
                <DialogDescription>
                  Create a new documentary letter of credit
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>LC Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select LC type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="import">Import LC</SelectItem>
                      <SelectItem value="export">Export LC</SelectItem>
                      <SelectItem value="standby">Standby LC</SelectItem>
                      <SelectItem value="transferable">Transferable LC</SelectItem>
                      <SelectItem value="revolving">Revolving LC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Applicant</Label>
                  <Input placeholder="Enter applicant name / CIF" />
                </div>
                <div className="grid gap-2">
                  <Label>Beneficiary Name</Label>
                  <Input placeholder="Enter beneficiary name" />
                </div>
                <div className="grid gap-2">
                  <Label>Beneficiary Bank (SWIFT)</Label>
                  <Input placeholder="Enter SWIFT/BIC code" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Amount</Label>
                    <Input type="number" placeholder="Enter amount" />
                  </div>
                  <div className="grid gap-2">
                    <Label>Currency</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="usd">USD</SelectItem>
                        <SelectItem value="eur">EUR</SelectItem>
                        <SelectItem value="gbp">GBP</SelectItem>
                        <SelectItem value="inr">INR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Issue Date</Label>
                    <Input type="date" />
                  </div>
                  <div className="grid gap-2">
                    <Label>Expiry Date</Label>
                    <Input type="date" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Goods Description</Label>
                  <Textarea placeholder="Enter description of goods/services..." rows={2} />
                </div>
                <div className="grid gap-2">
                  <Label>Terms</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment terms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sight">At Sight</SelectItem>
                      <SelectItem value="30">30 Days</SelectItem>
                      <SelectItem value="60">60 Days</SelectItem>
                      <SelectItem value="90">90 Days</SelectItem>
                      <SelectItem value="180">180 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowNewLCDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setShowNewLCDialog(false)}>
                  Issue LC
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active LCs</p>
                <p className="text-2xl font-bold">24</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Bank Guarantees</p>
                <p className="text-2xl font-bold">18</p>
              </div>
              <Building2 className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">SCF Programs</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <Package className="h-8 w-8 text-indigo-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Exposure</p>
                <p className="text-2xl font-bold">{formatCurrency(1250000000)}</p>
              </div>
              <Globe className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Expiring Soon</p>
                <p className="text-2xl font-bold text-yellow-600">5</p>
              </div>
              <Ship className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="lc" className="space-y-4">
        <TabsList>
          <TabsTrigger value="lc">Letters of Credit</TabsTrigger>
          <TabsTrigger value="guarantee">Bank Guarantees</TabsTrigger>
          <TabsTrigger value="bills">Bills Collection</TabsTrigger>
          <TabsTrigger value="scf">Supply Chain Finance</TabsTrigger>
          <TabsTrigger value="swift">SWIFT Messages</TabsTrigger>
        </TabsList>

        <TabsContent value="lc" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by LC number, applicant, or beneficiary..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="LC Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="import">Import LC</SelectItem>
                    <SelectItem value="export">Export LC</SelectItem>
                    <SelectItem value="standby">Standby LC</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="advised">Advised</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
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
              <CardTitle>Letters of Credit</CardTitle>
              <CardDescription>
                Documentary letters of credit issued and advised
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>LC Number</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Beneficiary</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead className="w-8"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tradeTransactions.filter(t => t.type.includes("LC")).map((txn) => (
                    <TableRow key={txn.id}>
                      <TableCell className="font-mono">{txn.lcNumber}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{txn.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{txn.applicant}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{txn.beneficiary}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {txn.currency} {txn.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(txn.status)}
                          <Badge
                            variant={
                              txn.status === "active" ? "success" :
                              txn.status === "advised" ? "info" :
                              txn.status === "pending" ? "warning" : "secondary"
                            }
                          >
                            {txn.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(txn.expiryDate)}
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
                            <DropdownMenuItem>View Documents</DropdownMenuItem>
                            <DropdownMenuItem>Amend LC</DropdownMenuItem>
                            <DropdownMenuItem>Process Payment</DropdownMenuItem>
                            <DropdownMenuItem>View SWIFT Messages</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Generate MT700</DropdownMenuItem>
                            <DropdownMenuItem>Print LC</DropdownMenuItem>
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

        <TabsContent value="guarantee" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Bank Guarantees</CardTitle>
                  <CardDescription>Performance, financial, and bid bond guarantees</CardDescription>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Issue Guarantee
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>BG Number</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Beneficiary</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Expiry</TableHead>
                    <TableHead className="w-8"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tradeTransactions.filter(t => t.type === "Bank Guarantee").map((txn) => (
                    <TableRow key={txn.id}>
                      <TableCell className="font-mono">{txn.lcNumber}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{txn.type}</Badge>
                      </TableCell>
                      <TableCell>{txn.applicant}</TableCell>
                      <TableCell>{txn.beneficiary}</TableCell>
                      <TableCell className="text-right font-medium">
                        {txn.currency} {txn.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="success">{txn.status}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(txn.expiryDate)}
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
                            <DropdownMenuItem>Amend BG</DropdownMenuItem>
                            <DropdownMenuItem>Invocation</DropdownMenuItem>
                            <DropdownMenuItem>Generate MT760</DropdownMenuItem>
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

        <TabsContent value="bills" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Bills Collection</CardTitle>
                  <CardDescription>Documentary and clean bills collection</CardDescription>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Collection
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reference</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Drawer</TableHead>
                    <TableHead>Drawee</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="w-8"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tradeTransactions.filter(t => t.type === "Bills Collection").map((txn) => (
                    <TableRow key={txn.id}>
                      <TableCell className="font-mono">{txn.lcNumber}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{txn.type}</Badge>
                      </TableCell>
                      <TableCell>{txn.applicant}</TableCell>
                      <TableCell>{txn.beneficiary}</TableCell>
                      <TableCell className="text-right font-medium">
                        {txn.currency} {txn.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="warning">{txn.status}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(txn.expiryDate)}
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
                            <DropdownMenuItem>Process Payment</DropdownMenuItem>
                            <DropdownMenuItem>Send Reminder</DropdownMenuItem>
                            <DropdownMenuItem>Protest Bill</DropdownMenuItem>
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

        <TabsContent value="scf" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Programs</p>
                    <p className="text-2xl font-bold">{supplyChainFinance.length}</p>
                  </div>
                  <Package className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Limit</p>
                    <p className="text-2xl font-bold">
                      {formatCurrency(supplyChainFinance.reduce((sum, p) => sum + p.totalLimit, 0))}
                    </p>
                  </div>
                  <Wallet className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Invoices</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {supplyChainFinance.reduce((sum, p) => sum + p.pendingApproval, 0)}
                    </p>
                  </div>
                  <Receipt className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>SCF Programs</CardTitle>
                  <CardDescription>Supply chain finance programs and utilization</CardDescription>
                </div>
                <Dialog open={showNewSCFDialog} onOpenChange={setShowNewSCFDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      New Program
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create SCF Program</DialogTitle>
                      <DialogDescription>
                        Set up a new supply chain finance program
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label>Program Name</Label>
                        <Input placeholder="Enter program name" />
                      </div>
                      <div className="grid gap-2">
                        <Label>Anchor Customer</Label>
                        <Input placeholder="Enter anchor customer CIF" />
                      </div>
                      <div className="grid gap-2">
                        <Label>Program Type</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="payable">Payable Finance</SelectItem>
                            <SelectItem value="receivable">Receivable Finance</SelectItem>
                            <SelectItem value="dealer">Dealer Finance</SelectItem>
                            <SelectItem value="vendor">Vendor Finance</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label>Total Limit</Label>
                          <Input type="number" placeholder="Enter limit" />
                        </div>
                        <div className="grid gap-2">
                          <Label>Interest Rate (%)</Label>
                          <Input type="number" placeholder="Enter rate" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label>Start Date</Label>
                          <Input type="date" />
                        </div>
                        <div className="grid gap-2">
                          <Label>Expiry Date</Label>
                          <Input type="date" />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowNewSCFDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => setShowNewSCFDialog(false)}>
                        Create Program
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Program ID</TableHead>
                    <TableHead>Program Name</TableHead>
                    <TableHead>Anchor</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Limit</TableHead>
                    <TableHead>Utilization</TableHead>
                    <TableHead>Invoices</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-8"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {supplyChainFinance.map((program) => (
                    <TableRow key={program.id}>
                      <TableCell className="font-mono">{program.programId}</TableCell>
                      <TableCell className="font-medium">{program.programName}</TableCell>
                      <TableCell>{program.anchorCustomerName}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {program.programType.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {program.currency === "INR" ? formatCurrency(program.totalLimit) : `$${(program.totalLimit / 1000000).toFixed(1)}M`}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress
                            value={(program.utilizedLimit / program.totalLimit) * 100}
                            className="w-16 h-2"
                          />
                          <span className="text-sm">
                            {((program.utilizedLimit / program.totalLimit) * 100).toFixed(0)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{program.activeInvoices}</span>
                          {program.pendingApproval > 0 && (
                            <Badge variant="warning" className="text-xs">
                              +{program.pendingApproval} pending
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={program.status === "active" ? "success" : "secondary"}>
                          {program.status}
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
                            <DropdownMenuItem>View Invoices</DropdownMenuItem>
                            <DropdownMenuItem>Add Participant</DropdownMenuItem>
                            <DropdownMenuItem>Modify Limit</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Suspend Program</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Invoice Financing</CardTitle>
              <CardDescription>Invoices pending approval and financing</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice No</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Buyer</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Discount Rate</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-8"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((inv) => (
                    <TableRow key={inv.id}>
                      <TableCell className="font-mono">{inv.invoiceNo}</TableCell>
                      <TableCell>{inv.supplier}</TableCell>
                      <TableCell>{inv.buyer}</TableCell>
                      <TableCell className="text-right font-medium">
                        {inv.currency} {inv.amount.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(inv.dueDate)}
                      </TableCell>
                      <TableCell>
                        {inv.discountRate > 0 ? `${inv.discountRate}%` : '-'}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            inv.status === "financed" ? "success" :
                            inv.status === "approved" ? "info" : "warning"
                          }
                        >
                          {inv.status}
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
                            <DropdownMenuItem>View Invoice</DropdownMenuItem>
                            {inv.status === "pending" && (
                              <DropdownMenuItem>Approve</DropdownMenuItem>
                            )}
                            {inv.status === "approved" && (
                              <DropdownMenuItem>Finance</DropdownMenuItem>
                            )}
                            <DropdownMenuItem>Reject</DropdownMenuItem>
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

        <TabsContent value="swift" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SWIFT Messages</CardTitle>
              <CardDescription>Outgoing and incoming SWIFT messages for trade transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Message Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>LC/BG Reference</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Direction</TableHead>
                    <TableHead className="w-8"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {swiftMessages.map((msg) => (
                    <TableRow key={msg.id}>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">{msg.type}</Badge>
                      </TableCell>
                      <TableCell>{msg.description}</TableCell>
                      <TableCell className="font-mono">{msg.lcRef}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(msg.date)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={msg.status === "sent" ? "success" : msg.status === "received" ? "info" : "warning"}>
                          {msg.status === "sent" ? "Outgoing" : msg.status === "received" ? "Incoming" : "Pending"}
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
      </Tabs>
    </div>
  );
}
