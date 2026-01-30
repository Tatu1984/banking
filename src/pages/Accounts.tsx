import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { SearchEmptyState } from "@/components/ui/empty-state";
import { toast } from "@/hooks/use-toast";
import {
  Search,
  Plus,
  MoreVertical,
  Download,
  Eye,
  Edit,
  Wallet,
  Lock,
  Unlock,
  Ban,
  FileText,
  ArrowLeftRight,
  TrendingUp,
  RefreshCw,
  CreditCard,
  Building,
  Banknote,
  PiggyBank,
  Loader2,
} from "lucide-react";
import { formatCurrency, formatDate, maskAccountNumber } from "@/lib/utils";
import { accounts } from "@/data/mockData";

// Account opening validation schema
const accountOpeningSchema = z.object({
  customerId: z.string().min(1, "Customer ID (CIF) is required"),
  type: z.enum(["savings", "current", "fd", "rd", "escrow"]),
  branch: z.string().min(1, "Branch is required"),
  currency: z.string(),
  initialDeposit: z.string().optional(),
  nominationName: z.string().optional(),
  nominationRelation: z.string().optional(),
});

type AccountOpeningFormData = z.infer<typeof accountOpeningSchema>;

export function Accounts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<typeof accounts[0] | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [freezeDialog, setFreezeDialog] = useState<{ open: boolean; account: typeof accounts[0] | null }>({
    open: false,
    account: null,
  });
  const [closeDialog, setCloseDialog] = useState<{ open: boolean; account: typeof accounts[0] | null }>({
    open: false,
    account: null,
  });
  const [editAccount, setEditAccount] = useState<typeof accounts[0] | null>(null);
  const [editForm, setEditForm] = useState({
    interestRate: 0,
    branch: "",
    nominationName: "",
    nominationRelation: "",
  });

  const openEditAccount = (account: typeof accounts[0]) => {
    setEditForm({
      interestRate: account.interestRate,
      branch: account.branch,
      nominationName: "",
      nominationRelation: "",
    });
    setEditAccount(account);
  };

  const handleEditAccount = async () => {
    if (!editAccount) return;
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast({
        title: "Account Updated",
        description: `Account ${editAccount.accountNumber} has been updated successfully.`,
        variant: "success",
      });
      setEditAccount(null);
    } catch {
      toast({
        title: "Error",
        description: "Failed to update account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Form instance for account opening
  const form = useForm<AccountOpeningFormData>({
    resolver: zodResolver(accountOpeningSchema),
    defaultValues: {
      customerId: "",
      type: "savings",
      branch: "",
      currency: "INR",
      initialDeposit: "",
      nominationName: "",
      nominationRelation: "",
    },
  });

  const filteredAccounts = accounts.filter((account) => {
    const matchesSearch =
      account.accountNumber.includes(searchTerm) ||
      account.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || account.type === typeFilter;
    const matchesStatus = statusFilter === "all" || account.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  const handleAccountSubmit = async (data: AccountOpeningFormData) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("New account:", data);
      toast({
        title: "Account Created",
        description: `New ${data.type} account has been opened successfully for customer ${data.customerId}.`,
        variant: "success",
      });
      setIsAddDialogOpen(false);
      form.reset();
    } catch {
      toast({
        title: "Error",
        description: "Failed to open account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFreezeAccount = async () => {
    if (!freezeDialog.account) return;
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: "Account Frozen",
        description: `Account ${freezeDialog.account.accountNumber} has been frozen successfully.`,
        variant: "success",
      });
      setFreezeDialog({ open: false, account: null });
    } catch {
      toast({
        title: "Error",
        description: "Failed to freeze account. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCloseAccount = async () => {
    if (!closeDialog.account) return;
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: "Account Closed",
        description: `Account ${closeDialog.account.accountNumber} has been closed.`,
        variant: "success",
      });
      setCloseDialog({ open: false, account: null });
    } catch {
      toast({
        title: "Error",
        description: "Failed to close account. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      form.reset();
    }
    setIsAddDialogOpen(open);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Accounts</h1>
          <p className="text-muted-foreground">
            Manage customer accounts and account lifecycle
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Open Account
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Open New Account</DialogTitle>
                <DialogDescription>
                  Create a new account for an existing customer.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleAccountSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="customerId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>Customer ID (CIF)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter CIF number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>Account Type</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select account type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="savings">Savings Account</SelectItem>
                            <SelectItem value="current">Current Account</SelectItem>
                            <SelectItem value="fd">Fixed Deposit</SelectItem>
                            <SelectItem value="rd">Recurring Deposit</SelectItem>
                            <SelectItem value="escrow">Escrow Account</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="branch"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>Branch</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select branch" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="blr001">Bengaluru - MG Road</SelectItem>
                            <SelectItem value="mum001">Mumbai - Andheri</SelectItem>
                            <SelectItem value="del001">Delhi - CP</SelectItem>
                            <SelectItem value="chn001">Chennai - Anna Salai</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Currency</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                            <SelectItem value="USD">USD - US Dollar</SelectItem>
                            <SelectItem value="EUR">EUR - Euro</SelectItem>
                            <SelectItem value="GBP">GBP - British Pound</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="initialDeposit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Initial Deposit</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="nominationName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nominee Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter nominee name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="nominationRelation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nominee Relation</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Spouse, Parent" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => handleDialogClose(false)} disabled={isSubmitting}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Open Account
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Accounts</p>
                <p className="text-2xl font-bold">{accounts.length}</p>
              </div>
              <Wallet className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Savings</p>
                <p className="text-2xl font-bold">
                  {accounts.filter((a) => a.type === "savings").length}
                </p>
              </div>
              <PiggyBank className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current</p>
                <p className="text-2xl font-bold">
                  {accounts.filter((a) => a.type === "current").length}
                </p>
              </div>
              <Building className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">FD/RD</p>
                <p className="text-2xl font-bold">
                  {accounts.filter((a) => a.type === "fd" || a.type === "rd").length}
                </p>
              </div>
              <Banknote className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Balance</p>
                <p className="text-lg font-bold">{formatCurrency(totalBalance)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[300px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by account number or customer name..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Account Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="savings">Savings</SelectItem>
                <SelectItem value="current">Current</SelectItem>
                <SelectItem value="fd">Fixed Deposit</SelectItem>
                <SelectItem value="rd">Recurring Deposit</SelectItem>
                <SelectItem value="escrow">Escrow</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="dormant">Dormant</SelectItem>
                <SelectItem value="frozen">Frozen</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Accounts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Account List</CardTitle>
          <CardDescription>
            {filteredAccounts.length} accounts found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredAccounts.length === 0 ? (
            <SearchEmptyState query={searchTerm || undefined} />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account Number</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Interest Rate</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Transaction</TableHead>
                  <TableHead className="w-8"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAccounts.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell className="font-mono">
                      {maskAccountNumber(account.accountNumber)}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{account.customerName}</p>
                        <p className="text-xs text-muted-foreground">
                          ID: {account.customerId}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {account.type === "fd" ? "Fixed Deposit" :
                         account.type === "rd" ? "Recurring Deposit" :
                         account.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{account.branch}</TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(account.balance)}
                    </TableCell>
                    <TableCell>
                      {account.interestRate > 0 ? `${account.interestRate}%` : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          account.status === "active" ? "success" :
                          account.status === "dormant" ? "secondary" :
                          account.status === "frozen" ? "warning" : "destructive"
                        }
                      >
                        {account.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(account.lastTransaction)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => setSelectedAccount(account)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Quick View
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to={`/accounts/${account.id}`}>
                              <Wallet className="mr-2 h-4 w-4" />
                              Full Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEditAccount(account)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Account
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <ArrowLeftRight className="mr-2 h-4 w-4" />
                            View Transactions
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileText className="mr-2 h-4 w-4" />
                            Generate Statement
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <CreditCard className="mr-2 h-4 w-4" />
                            Linked Cards
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {account.status === "active" ? (
                            <>
                              <DropdownMenuItem
                                onClick={() => setFreezeDialog({ open: true, account })}
                              >
                                <Lock className="mr-2 h-4 w-4" />
                                Freeze Account
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => setCloseDialog({ open: true, account })}
                              >
                                <Ban className="mr-2 h-4 w-4" />
                                Close Account
                              </DropdownMenuItem>
                            </>
                          ) : account.status === "frozen" ? (
                            <DropdownMenuItem
                              onClick={() => {
                                toast({
                                  title: "Account Unfrozen",
                                  description: `Account ${account.accountNumber} has been unfrozen.`,
                                  variant: "success",
                                });
                              }}
                            >
                              <Unlock className="mr-2 h-4 w-4" />
                              Unfreeze Account
                            </DropdownMenuItem>
                          ) : account.status === "dormant" ? (
                            <DropdownMenuItem
                              onClick={() => {
                                toast({
                                  title: "Account Reactivated",
                                  description: `Account ${account.accountNumber} has been reactivated.`,
                                  variant: "success",
                                });
                              }}
                            >
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Reactivate Account
                            </DropdownMenuItem>
                          ) : null}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Account Detail Dialog */}
      <Dialog open={!!selectedAccount} onOpenChange={() => setSelectedAccount(null)}>
        <DialogContent className="max-w-2xl">
          {selectedAccount && (
            <>
              <DialogHeader>
                <DialogTitle>Account Details</DialogTitle>
                <DialogDescription>
                  Account Number: {selectedAccount.accountNumber}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6">
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Available Balance</p>
                    <p className="text-3xl font-bold">{formatCurrency(selectedAccount.balance)}</p>
                  </div>
                  <Badge
                    variant={
                      selectedAccount.status === "active" ? "success" :
                      selectedAccount.status === "frozen" ? "warning" : "secondary"
                    }
                    className="text-lg px-4 py-1"
                  >
                    {selectedAccount.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-muted-foreground">Account Information</Label>
                      <div className="mt-2 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Type:</span>
                          <span className="font-medium capitalize">{selectedAccount.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Currency:</span>
                          <span className="font-medium">{selectedAccount.currency}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Interest Rate:</span>
                          <span className="font-medium">
                            {selectedAccount.interestRate > 0 ? `${selectedAccount.interestRate}% p.a.` : "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Branch:</span>
                          <span className="font-medium">{selectedAccount.branch}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-muted-foreground">Customer Details</Label>
                      <div className="mt-2 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Name:</span>
                          <span className="font-medium">{selectedAccount.customerName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Customer ID:</span>
                          <span className="font-medium">{selectedAccount.customerId}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Important Dates</Label>
                      <div className="mt-2 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Opened:</span>
                          <span className="font-medium">{formatDate(selectedAccount.openDate)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Last Transaction:</span>
                          <span className="font-medium">{formatDate(selectedAccount.lastTransaction)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <FileText className="mr-2 h-4 w-4" />
                    Download Statement
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <ArrowLeftRight className="mr-2 h-4 w-4" />
                    View Transactions
                  </Button>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedAccount(null)}>
                  Close
                </Button>
                <Button onClick={() => { setSelectedAccount(null); openEditAccount(selectedAccount); }}>
                  Edit Account
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Freeze Account Confirmation Dialog */}
      <ConfirmDialog
        open={freezeDialog.open}
        onOpenChange={(open) => setFreezeDialog({ ...freezeDialog, open })}
        title="Freeze Account?"
        description={`Are you sure you want to freeze account ${freezeDialog.account?.accountNumber}? All transactions on this account will be blocked until it is unfrozen.`}
        confirmLabel="Freeze Account"
        variant="warning"
        onConfirm={handleFreezeAccount}
      />

      {/* Close Account Confirmation Dialog */}
      <ConfirmDialog
        open={closeDialog.open}
        onOpenChange={(open) => setCloseDialog({ ...closeDialog, open })}
        title="Close Account?"
        description={`Are you sure you want to close account ${closeDialog.account?.accountNumber}? This action cannot be undone. Any remaining balance will need to be transferred or withdrawn.`}
        confirmLabel="Close Account"
        variant="destructive"
        onConfirm={handleCloseAccount}
      />

      {/* Edit Account Dialog */}
      <Dialog open={!!editAccount} onOpenChange={(open) => !open && setEditAccount(null)}>
        <DialogContent className="max-w-md">
          {editAccount && (
            <>
              <DialogHeader>
                <DialogTitle>Edit Account</DialogTitle>
                <DialogDescription>Update account details</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-mono font-medium">{editAccount.accountNumber}</p>
                      <p className="text-sm text-muted-foreground">{editAccount.customerName}</p>
                    </div>
                    <Badge variant="outline" className="capitalize">{editAccount.type}</Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Branch</Label>
                  <Select
                    value={editForm.branch || editAccount.branch}
                    onValueChange={(value) => setEditForm({ ...editForm, branch: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Bengaluru - MG Road">Bengaluru - MG Road</SelectItem>
                      <SelectItem value="Mumbai - Andheri">Mumbai - Andheri</SelectItem>
                      <SelectItem value="Delhi - CP">Delhi - CP</SelectItem>
                      <SelectItem value="Chennai - Anna Salai">Chennai - Anna Salai</SelectItem>
                      <SelectItem value="Bengaluru - Whitefield">Bengaluru - Whitefield</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {(editAccount.type === "savings" || editAccount.type === "fd" || editAccount.type === "rd") && (
                  <div className="space-y-2">
                    <Label>Interest Rate (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={editForm.interestRate}
                      onChange={(e) => setEditForm({ ...editForm, interestRate: Number(e.target.value) })}
                    />
                  </div>
                )}

                <div className="border-t pt-4">
                  <Label className="text-muted-foreground">Nomination Details</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="space-y-2">
                      <Label>Nominee Name</Label>
                      <Input
                        value={editForm.nominationName}
                        onChange={(e) => setEditForm({ ...editForm, nominationName: e.target.value })}
                        placeholder="Enter nominee name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Relation</Label>
                      <Select
                        value={editForm.nominationRelation}
                        onValueChange={(value) => setEditForm({ ...editForm, nominationRelation: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select relation" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="spouse">Spouse</SelectItem>
                          <SelectItem value="parent">Parent</SelectItem>
                          <SelectItem value="child">Child</SelectItem>
                          <SelectItem value="sibling">Sibling</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditAccount(null)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button onClick={handleEditAccount} disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
