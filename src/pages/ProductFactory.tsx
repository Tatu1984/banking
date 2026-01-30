import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Plus,
  MoreVertical,
  Download,
  RefreshCw,
  Package,
  Wallet,
  CreditCard,
  Briefcase,
  Edit,
  Copy,
  Trash2,
  Eye,
  Settings,
  Percent,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { formatDate, formatCurrency } from "@/lib/utils";

// Mock product data
const depositProducts = [
  {
    id: "1",
    code: "SAV001",
    name: "Regular Savings Account",
    category: "savings",
    minBalance: 1000,
    interestRate: 4.5,
    features: ["ATM Card", "NetBanking", "Mobile Banking"],
    status: "active",
    createdAt: "2020-01-01",
    lastModified: "2024-01-15",
  },
  {
    id: "2",
    code: "SAV002",
    name: "Premium Savings Account",
    category: "savings",
    minBalance: 25000,
    interestRate: 5.0,
    features: ["Platinum Debit Card", "Locker Discount", "Forex Card"],
    status: "active",
    createdAt: "2020-01-01",
    lastModified: "2024-01-10",
  },
  {
    id: "3",
    code: "CUR001",
    name: "Business Current Account",
    category: "current",
    minBalance: 10000,
    interestRate: 0,
    features: ["Unlimited Transactions", "Overdraft Facility", "Cash Management"],
    status: "active",
    createdAt: "2020-01-01",
    lastModified: "2023-12-01",
  },
  {
    id: "4",
    code: "FD001",
    name: "Regular Fixed Deposit",
    category: "fd",
    minBalance: 10000,
    interestRate: 7.5,
    features: ["Loan Against FD", "Auto Renewal", "Premature Withdrawal"],
    status: "active",
    createdAt: "2020-01-01",
    lastModified: "2024-01-20",
  },
  {
    id: "5",
    code: "FD002",
    name: "Tax Saver FD",
    category: "fd",
    minBalance: 100000,
    interestRate: 7.25,
    features: ["80C Benefit", "5 Year Lock-in", "No Premature Withdrawal"],
    status: "active",
    createdAt: "2020-01-01",
    lastModified: "2024-01-05",
  },
];

const loanProducts = [
  {
    id: "1",
    code: "PL001",
    name: "Personal Loan",
    category: "personal",
    minAmount: 50000,
    maxAmount: 2500000,
    interestRate: "10.5% - 18%",
    tenure: "12 - 60 months",
    processingFee: "1-2%",
    status: "active",
    createdAt: "2020-01-01",
    lastModified: "2024-01-18",
  },
  {
    id: "2",
    code: "HL001",
    name: "Home Loan",
    category: "home",
    minAmount: 500000,
    maxAmount: 100000000,
    interestRate: "8.5% - 9.5%",
    tenure: "Up to 30 years",
    processingFee: "0.5%",
    status: "active",
    createdAt: "2020-01-01",
    lastModified: "2024-01-22",
  },
  {
    id: "3",
    code: "AL001",
    name: "Auto Loan",
    category: "auto",
    minAmount: 100000,
    maxAmount: 10000000,
    interestRate: "9% - 12%",
    tenure: "12 - 84 months",
    processingFee: "1%",
    status: "active",
    createdAt: "2020-01-01",
    lastModified: "2024-01-12",
  },
  {
    id: "4",
    code: "BL001",
    name: "Business Loan",
    category: "business",
    minAmount: 500000,
    maxAmount: 50000000,
    interestRate: "11% - 16%",
    tenure: "12 - 60 months",
    processingFee: "1.5%",
    status: "active",
    createdAt: "2020-01-01",
    lastModified: "2024-01-08",
  },
];

const cardProducts = [
  {
    id: "1",
    code: "DC001",
    name: "Classic Debit Card",
    type: "debit",
    variant: "classic",
    annualFee: 0,
    dailyLimit: 50000,
    features: ["ATM Withdrawal", "POS", "Online"],
    status: "active",
    createdAt: "2020-01-01",
  },
  {
    id: "2",
    code: "DC002",
    name: "Platinum Debit Card",
    type: "debit",
    variant: "platinum",
    annualFee: 500,
    dailyLimit: 200000,
    features: ["Airport Lounge", "Concierge", "Insurance"],
    status: "active",
    createdAt: "2020-01-01",
  },
  {
    id: "3",
    code: "CC001",
    name: "Gold Credit Card",
    type: "credit",
    variant: "gold",
    annualFee: 1000,
    creditLimit: "Up to 5L",
    features: ["Reward Points", "Fuel Surcharge Waiver", "EMI Conversion"],
    status: "active",
    createdAt: "2020-01-01",
  },
  {
    id: "4",
    code: "CC002",
    name: "Platinum Credit Card",
    type: "credit",
    variant: "platinum",
    annualFee: 3000,
    creditLimit: "Up to 15L",
    features: ["5x Rewards", "Golf Access", "Travel Insurance"],
    status: "active",
    createdAt: "2020-01-01",
  },
];

const interestRates = [
  { id: "1", product: "Savings Account", category: "deposits", rate: 4.5, effectiveFrom: "2024-01-01", status: "active" },
  { id: "2", product: "Premium Savings", category: "deposits", rate: 5.0, effectiveFrom: "2024-01-01", status: "active" },
  { id: "3", product: "FD (1 Year)", category: "deposits", rate: 7.0, effectiveFrom: "2024-01-15", status: "active" },
  { id: "4", product: "FD (3 Years)", category: "deposits", rate: 7.5, effectiveFrom: "2024-01-15", status: "active" },
  { id: "5", product: "FD (5 Years)", category: "deposits", rate: 7.25, effectiveFrom: "2024-01-15", status: "active" },
  { id: "6", product: "Home Loan", category: "loans", rate: 8.5, effectiveFrom: "2024-01-20", status: "active" },
  { id: "7", product: "Personal Loan", category: "loans", rate: 12.5, effectiveFrom: "2024-01-20", status: "active" },
  { id: "8", product: "Auto Loan", category: "loans", rate: 9.5, effectiveFrom: "2024-01-20", status: "active" },
];

export function ProductFactory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isRateDialogOpen, setIsRateDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Product Factory</h1>
          <p className="text-muted-foreground">
            Configure and manage banking products
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => setIsAddProductOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Product
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Deposit Products</p>
                <p className="text-2xl font-bold">{depositProducts.length}</p>
              </div>
              <Wallet className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Loan Products</p>
                <p className="text-2xl font-bold">{loanProducts.length}</p>
              </div>
              <Briefcase className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Card Products</p>
                <p className="text-2xl font-bold">{cardProducts.length}</p>
              </div>
              <CreditCard className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Interest Rates</p>
                <p className="text-2xl font-bold">{interestRates.length}</p>
              </div>
              <Percent className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="deposits" className="space-y-4">
        <TabsList>
          <TabsTrigger value="deposits">Deposit Products</TabsTrigger>
          <TabsTrigger value="loans">Loan Products</TabsTrigger>
          <TabsTrigger value="cards">Card Products</TabsTrigger>
          <TabsTrigger value="rates">Interest Rates</TabsTrigger>
        </TabsList>

        {/* Deposit Products */}
        <TabsContent value="deposits">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Deposit Products</CardTitle>
                <CardDescription>Savings, Current, FD, RD products</CardDescription>
              </div>
              <div className="flex gap-2">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search products..." className="pl-10" />
                </div>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Min Balance</TableHead>
                    <TableHead>Interest Rate</TableHead>
                    <TableHead>Features</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {depositProducts.map(product => (
                    <TableRow key={product.id}>
                      <TableCell className="font-mono">{product.code}</TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">{product.category}</Badge>
                      </TableCell>
                      <TableCell>{formatCurrency(product.minBalance)}</TableCell>
                      <TableCell>{product.interestRate}%</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {product.features.slice(0, 2).map(f => (
                            <Badge key={f} variant="secondary" className="text-xs">{f}</Badge>
                          ))}
                          {product.features.length > 2 && (
                            <Badge variant="secondary" className="text-xs">+{product.features.length - 2}</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={product.status === "active" ? "success" : "secondary"}>
                          {product.status}
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
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Product
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="mr-2 h-4 w-4" />
                              Clone Product
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Settings className="mr-2 h-4 w-4" />
                              Configure Rules
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              {product.status === "active" ? "Deactivate" : "Activate"}
                            </DropdownMenuItem>
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

        {/* Loan Products */}
        <TabsContent value="loans">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Loan Products</CardTitle>
                <CardDescription>Personal, Home, Auto, Business loans</CardDescription>
              </div>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Amount Range</TableHead>
                    <TableHead>Interest Rate</TableHead>
                    <TableHead>Tenure</TableHead>
                    <TableHead>Processing Fee</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loanProducts.map(product => (
                    <TableRow key={product.id}>
                      <TableCell className="font-mono">{product.code}</TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">{product.category}</Badge>
                      </TableCell>
                      <TableCell>
                        {formatCurrency(product.minAmount)} - {formatCurrency(product.maxAmount)}
                      </TableCell>
                      <TableCell>{product.interestRate}</TableCell>
                      <TableCell>{product.tenure}</TableCell>
                      <TableCell>{product.processingFee}</TableCell>
                      <TableCell>
                        <Badge variant={product.status === "active" ? "success" : "secondary"}>
                          {product.status}
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
                            <DropdownMenuItem>Edit Product</DropdownMenuItem>
                            <DropdownMenuItem>Configure Underwriting Rules</DropdownMenuItem>
                            <DropdownMenuItem>Clone Product</DropdownMenuItem>
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

        {/* Card Products */}
        <TabsContent value="cards">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Card Products</CardTitle>
                <CardDescription>Debit and Credit card products</CardDescription>
              </div>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Variant</TableHead>
                    <TableHead>Annual Fee</TableHead>
                    <TableHead>Limit</TableHead>
                    <TableHead>Features</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cardProducts.map(product => (
                    <TableRow key={product.id}>
                      <TableCell className="font-mono">{product.code}</TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">{product.type}</Badge>
                      </TableCell>
                      <TableCell className="capitalize">{product.variant}</TableCell>
                      <TableCell>{formatCurrency(product.annualFee)}</TableCell>
                      <TableCell>{product.dailyLimit ? formatCurrency(product.dailyLimit) : product.creditLimit}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {product.features.slice(0, 2).map(f => (
                            <Badge key={f} variant="secondary" className="text-xs">{f}</Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={product.status === "active" ? "success" : "secondary"}>
                          {product.status}
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
                            <DropdownMenuItem>Edit Product</DropdownMenuItem>
                            <DropdownMenuItem>Configure Rewards</DropdownMenuItem>
                            <DropdownMenuItem>Clone Product</DropdownMenuItem>
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

        {/* Interest Rates */}
        <TabsContent value="rates">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Interest Rates</CardTitle>
                <CardDescription>Manage interest rates across products</CardDescription>
              </div>
              <Button size="sm" onClick={() => setIsRateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Update Rates
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Interest Rate</TableHead>
                    <TableHead>Effective From</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {interestRates.map(rate => (
                    <TableRow key={rate.id}>
                      <TableCell className="font-medium">{rate.product}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">{rate.category}</Badge>
                      </TableCell>
                      <TableCell className="font-bold">{rate.rate}%</TableCell>
                      <TableCell>{formatDate(rate.effectiveFrom)}</TableCell>
                      <TableCell>
                        <Badge variant={rate.status === "active" ? "success" : "secondary"}>
                          {rate.status}
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
                            <DropdownMenuItem>View History</DropdownMenuItem>
                            <DropdownMenuItem>Update Rate</DropdownMenuItem>
                            <DropdownMenuItem>Schedule Change</DropdownMenuItem>
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
      </Tabs>

      {/* Create Product Dialog */}
      <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Product</DialogTitle>
            <DialogDescription>Define a new banking product</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Product Type *</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select product type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="savings">Savings Account</SelectItem>
                  <SelectItem value="current">Current Account</SelectItem>
                  <SelectItem value="fd">Fixed Deposit</SelectItem>
                  <SelectItem value="rd">Recurring Deposit</SelectItem>
                  <SelectItem value="personal_loan">Personal Loan</SelectItem>
                  <SelectItem value="home_loan">Home Loan</SelectItem>
                  <SelectItem value="auto_loan">Auto Loan</SelectItem>
                  <SelectItem value="debit_card">Debit Card</SelectItem>
                  <SelectItem value="credit_card">Credit Card</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Product Code *</Label>
                <Input placeholder="e.g., SAV003" />
              </div>
              <div className="space-y-2">
                <Label>Product Name *</Label>
                <Input placeholder="e.g., Student Savings" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input placeholder="Brief product description" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Minimum Balance/Amount</Label>
                <Input type="number" placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label>Interest Rate (%)</Label>
                <Input type="number" placeholder="0.00" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Activate Immediately</Label>
                <p className="text-xs text-muted-foreground">Make product available for use</p>
              </div>
              <Switch />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddProductOpen(false)}>Cancel</Button>
            <Button onClick={() => setIsAddProductOpen(false)}>Create Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Rate Dialog */}
      <Dialog open={isRateDialogOpen} onOpenChange={setIsRateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Interest Rate</DialogTitle>
            <DialogDescription>Change interest rate for a product</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Product *</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sav">Savings Account</SelectItem>
                  <SelectItem value="fd1">FD (1 Year)</SelectItem>
                  <SelectItem value="fd3">FD (3 Years)</SelectItem>
                  <SelectItem value="hl">Home Loan</SelectItem>
                  <SelectItem value="pl">Personal Loan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Current Rate</Label>
                <Input value="7.5%" disabled />
              </div>
              <div className="space-y-2">
                <Label>New Rate *</Label>
                <Input type="number" placeholder="0.00" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Effective From *</Label>
              <Input type="date" />
            </div>
            <div className="space-y-2">
              <Label>Reason for Change</Label>
              <Input placeholder="Enter reason" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRateDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => setIsRateDialogOpen(false)}>Update Rate</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
