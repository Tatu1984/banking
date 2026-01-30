import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { BlockConfirmDialog } from "@/components/ui/confirm-dialog";
import { SearchEmptyState } from "@/components/ui/empty-state";
import { toast } from "@/hooks/use-toast";
import {
  Search,
  Plus,
  MoreVertical,
  Download,
  Eye,
  CreditCard,
  Lock,
  Unlock,
  RefreshCw,
  Settings,
  Shield,
  Smartphone,
  AlertTriangle,
  Loader2,
  History,
  ArrowDownLeft,
  ArrowUpRight,
  Store,
  Banknote,
  ShoppingCart,
  Fuel,
  Utensils,
  Plane,
} from "lucide-react";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils";
import { cards } from "@/data/mockData";

// Mock card transactions
const generateCardTransactions = (cardId: string) => {
  const categories = [
    { name: "Shopping", icon: ShoppingCart, color: "text-blue-500" },
    { name: "Fuel", icon: Fuel, color: "text-orange-500" },
    { name: "Dining", icon: Utensils, color: "text-green-500" },
    { name: "Travel", icon: Plane, color: "text-purple-500" },
    { name: "ATM", icon: Banknote, color: "text-gray-500" },
    { name: "Retail", icon: Store, color: "text-pink-500" },
  ];

  const merchants = [
    "Amazon India", "Reliance Retail", "HPCL Fuel Station", "Zomato",
    "MakeMyTrip", "Flipkart", "Shell Petrol", "Swiggy", "BigBasket",
    "ATM Withdrawal", "ICICI ATM", "Dominos Pizza", "PVR Cinemas"
  ];

  const transactions = [];
  const now = new Date();

  for (let i = 0; i < 25; i++) {
    const isDebit = Math.random() > 0.15; // 85% debits
    const category = categories[Math.floor(Math.random() * categories.length)];
    const merchant = merchants[Math.floor(Math.random() * merchants.length)];
    const date = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000);

    transactions.push({
      id: `txn-${cardId}-${i}`,
      referenceNumber: `CTX${Date.now()}${i}`,
      type: isDebit ? "debit" : "credit",
      category: category.name,
      categoryIcon: category.icon,
      categoryColor: category.color,
      merchant,
      amount: Math.round(Math.random() * 15000 + 100),
      timestamp: date.toISOString(),
      status: Math.random() > 0.05 ? "completed" : "pending",
      location: ["Mumbai", "Delhi", "Bangalore", "Chennai", "Pune"][Math.floor(Math.random() * 5)],
    });
  }

  return transactions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

// Card issue schema with validation
const cardIssueSchema = z.object({
  customerId: z.string().min(1, "Customer ID is required"),
  accountId: z.string().min(1, "Linked account is required"),
  type: z.enum(["debit", "credit", "prepaid"]),
  variant: z.enum(["classic", "gold", "platinum", "business"]),
  dailyLimit: z.number().positive("Daily limit must be positive").min(10000, "Daily limit must be at least 10,000"),
  monthlyLimit: z.number().positive("Monthly limit must be positive").min(50000, "Monthly limit must be at least 50,000"),
  nameOnCard: z.string().min(2, "Name must be at least 2 characters").max(26, "Name cannot exceed 26 characters"),
}).refine((data) => data.monthlyLimit >= data.dailyLimit, {
  message: "Monthly limit must be greater than or equal to daily limit",
  path: ["monthlyLimit"],
});

type CardIssueFormData = z.infer<typeof cardIssueSchema>;

export function Cards() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isIssueDialogOpen, setIsIssueDialogOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<typeof cards[0] | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [blockDialog, setBlockDialog] = useState<{ open: boolean; card: typeof cards[0] | null }>({
    open: false,
    card: null,
  });
  const [transactionHistoryCard, setTransactionHistoryCard] = useState<typeof cards[0] | null>(null);
  const [transactionFilter, setTransactionFilter] = useState("all");
  const cardTransactions = transactionHistoryCard ? generateCardTransactions(transactionHistoryCard.id) : [];

  // Form instance for card issuance
  const form = useForm<CardIssueFormData>({
    resolver: zodResolver(cardIssueSchema),
    defaultValues: {
      customerId: "",
      accountId: "",
      type: "debit",
      variant: "classic",
      dailyLimit: 100000,
      monthlyLimit: 500000,
      nameOnCard: "",
    },
  });

  const filteredCards = cards.filter((card) => {
    const matchesSearch =
      card.maskedNumber.includes(searchTerm) ||
      card.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || card.type === typeFilter;
    const matchesStatus = statusFilter === "all" || card.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getVariantColor = (variant: string) => {
    switch (variant) {
      case "platinum": return "bg-gradient-to-r from-slate-700 to-slate-900 text-white";
      case "gold": return "bg-gradient-to-r from-yellow-500 to-yellow-700 text-white";
      case "business": return "bg-gradient-to-r from-blue-600 to-blue-800 text-white";
      default: return "bg-gradient-to-r from-gray-400 to-gray-600 text-white";
    }
  };

  const handleIssueCard = async (data: CardIssueFormData) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Card issuance:", data);
      toast({
        title: "Card Issued Successfully",
        description: `A new ${data.variant} ${data.type} card has been issued for customer ${data.customerId}.`,
        variant: "success",
      });
      setIsIssueDialogOpen(false);
      form.reset();
    } catch {
      toast({
        title: "Error",
        description: "Failed to issue card. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBlockCard = async () => {
    if (!blockDialog.card) return;

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: "Card Blocked",
        description: `Card ${blockDialog.card.maskedNumber} has been blocked successfully.`,
        variant: "success",
      });
      setBlockDialog({ open: false, card: null });
    } catch {
      toast({
        title: "Error",
        description: "Failed to block card. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUnblockCard = async (card: typeof cards[0]) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: "Card Unblocked",
        description: `Card ${card.maskedNumber} has been unblocked successfully.`,
        variant: "success",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to unblock card. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      form.reset();
    }
    setIsIssueDialogOpen(open);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cards</h1>
          <p className="text-muted-foreground">
            Manage debit, credit, and prepaid cards
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Dialog open={isIssueDialogOpen} onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Issue Card
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Issue New Card</DialogTitle>
                <DialogDescription>
                  Issue a new card for an existing customer
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleIssueCard)} className="space-y-4">
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
                    name="accountId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>Linked Account</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select account" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="acc1">XXXX1234 - Savings</SelectItem>
                            <SelectItem value="acc2">XXXX5678 - Current</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>Card Type</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select card type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="debit">Debit Card</SelectItem>
                            <SelectItem value="credit">Credit Card</SelectItem>
                            <SelectItem value="prepaid">Prepaid Card</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="variant"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>Card Variant</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select variant" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="classic">Classic</SelectItem>
                            <SelectItem value="gold">Gold</SelectItem>
                            <SelectItem value="platinum">Platinum</SelectItem>
                            <SelectItem value="business">Business</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="nameOnCard"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>Name on Card</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter name as it should appear on card"
                            maxLength={26}
                            {...field}
                            onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="dailyLimit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required>Daily Limit</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="100000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="monthlyLimit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required>Monthly Limit</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="500000" {...field} />
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
                      Issue Card
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Cards</p>
                <p className="text-2xl font-bold">{cards.length}</p>
              </div>
              <CreditCard className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-green-600">
                  {cards.filter((c) => c.status === "active").length}
                </p>
              </div>
              <Shield className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Blocked</p>
                <p className="text-2xl font-bold text-red-600">
                  {cards.filter((c) => c.status === "blocked").length}
                </p>
              </div>
              <Lock className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Expiring Soon</p>
                <p className="text-2xl font-bold text-yellow-600">12</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
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
                placeholder="Search by card number or customer name..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Card Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="debit">Debit</SelectItem>
                <SelectItem value="credit">Credit</SelectItem>
                <SelectItem value="prepaid">Prepaid</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Cards Table */}
      <Card>
        <CardHeader>
          <CardTitle>Card List</CardTitle>
          <CardDescription>
            {filteredCards.length} cards found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredCards.length === 0 ? (
            <SearchEmptyState query={searchTerm || undefined} />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Card</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Variant</TableHead>
                  <TableHead>Daily Limit</TableHead>
                  <TableHead>Expiry</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-8"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCards.map((card) => (
                  <TableRow key={card.id}>
                    <TableCell>
                      <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg ${getVariantColor(card.variant)}`}>
                        <CreditCard className="h-4 w-4" />
                        <span className="font-mono text-sm">{card.maskedNumber}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{card.customerName}</p>
                        <p className="text-xs text-muted-foreground">ID: {card.customerId}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">{card.type}</Badge>
                    </TableCell>
                    <TableCell className="capitalize">{card.variant}</TableCell>
                    <TableCell>{formatCurrency(card.dailyLimit)}</TableCell>
                    <TableCell>{card.expiryDate}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          card.status === "active" ? "success" :
                          card.status === "blocked" ? "destructive" :
                          card.status === "expired" ? "secondary" : "warning"
                        }
                      >
                        {card.status}
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
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => setSelectedCard(card)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setTransactionHistoryCard(card)}>
                            <History className="mr-2 h-4 w-4" />
                            Transaction History
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Settings className="mr-2 h-4 w-4" />
                            Manage Limits
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Smartphone className="mr-2 h-4 w-4" />
                            Enable Tokenization
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {card.status === "active" ? (
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => setBlockDialog({ open: true, card })}
                            >
                              <Lock className="mr-2 h-4 w-4" />
                              Block Card
                            </DropdownMenuItem>
                          ) : card.status === "blocked" ? (
                            <DropdownMenuItem onClick={() => handleUnblockCard(card)}>
                              <Unlock className="mr-2 h-4 w-4" />
                              Unblock Card
                            </DropdownMenuItem>
                          ) : null}
                          <DropdownMenuItem>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Replace Card
                          </DropdownMenuItem>
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

      {/* Card Detail Dialog */}
      <Dialog open={!!selectedCard} onOpenChange={() => setSelectedCard(null)}>
        <DialogContent className="max-w-lg">
          {selectedCard && (
            <>
              <DialogHeader>
                <DialogTitle>Card Details</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {/* Card Visual */}
                <div className={`p-6 rounded-xl ${getVariantColor(selectedCard.variant)}`}>
                  <div className="flex justify-between items-start mb-8">
                    <CreditCard className="h-10 w-10" />
                    <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                      {selectedCard.type}
                    </Badge>
                  </div>
                  <p className="font-mono text-xl tracking-wider mb-4">
                    {selectedCard.maskedNumber}
                  </p>
                  <div className="flex justify-between">
                    <div>
                      <p className="text-xs opacity-70">Card Holder</p>
                      <p className="font-medium">{selectedCard.customerName}</p>
                    </div>
                    <div>
                      <p className="text-xs opacity-70">Valid Thru</p>
                      <p className="font-medium">{selectedCard.expiryDate}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Status</span>
                    <Badge
                      variant={
                        selectedCard.status === "active" ? "success" :
                        selectedCard.status === "blocked" ? "destructive" : "secondary"
                      }
                    >
                      {selectedCard.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Variant</span>
                    <span className="font-medium capitalize">{selectedCard.variant}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Daily Limit</span>
                    <span className="font-medium">{formatCurrency(selectedCard.dailyLimit)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Monthly Limit</span>
                    <span className="font-medium">{formatCurrency(selectedCard.monthlyLimit)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Issued Date</span>
                    <span className="font-medium">{formatDate(selectedCard.issuedDate)}</span>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedCard(null)}>
                  Close
                </Button>
                <Button>Manage Card</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Block Card Confirmation Dialog */}
      <BlockConfirmDialog
        open={blockDialog.open}
        onOpenChange={(open) => setBlockDialog({ ...blockDialog, open })}
        itemName={blockDialog.card ? `Card ${blockDialog.card.maskedNumber}` : "Card"}
        onConfirm={handleBlockCard}
      />

      {/* Card Transaction History Dialog */}
      <Dialog open={!!transactionHistoryCard} onOpenChange={() => setTransactionHistoryCard(null)}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
          {transactionHistoryCard && (
            <>
              <DialogHeader>
                <DialogTitle>Card Transaction History</DialogTitle>
                <DialogDescription>
                  {transactionHistoryCard.maskedNumber} | {transactionHistoryCard.customerName}
                </DialogDescription>
              </DialogHeader>

              {/* Summary Cards */}
              <div className="grid grid-cols-4 gap-3 py-3">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground">Total Transactions</p>
                  <p className="text-lg font-bold text-blue-700">{cardTransactions.length}</p>
                </div>
                <div className="bg-red-50 p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground">Total Debits</p>
                  <p className="text-lg font-bold text-red-700">
                    {formatCurrency(cardTransactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0))}
                  </p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground">Total Credits</p>
                  <p className="text-lg font-bold text-green-700">
                    {formatCurrency(cardTransactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0))}
                  </p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground">Avg. Transaction</p>
                  <p className="text-lg font-bold text-purple-700">
                    {formatCurrency(cardTransactions.reduce((sum, t) => sum + t.amount, 0) / cardTransactions.length)}
                  </p>
                </div>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-4 py-2 border-b">
                <Select value={transactionFilter} onValueChange={setTransactionFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Transactions</SelectItem>
                    <SelectItem value="debit">Debits Only</SelectItem>
                    <SelectItem value="credit">Credits Only</SelectItem>
                  </SelectContent>
                </Select>
                <div className="text-sm text-muted-foreground">
                  Showing {cardTransactions.filter(t => transactionFilter === 'all' || t.type === transactionFilter).length} transactions
                </div>
              </div>

              {/* Transaction List */}
              <div className="overflow-auto flex-1">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Merchant</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cardTransactions
                      .filter(t => transactionFilter === 'all' || t.type === transactionFilter)
                      .map((txn) => {
                        const IconComponent = txn.categoryIcon;
                        return (
                          <TableRow key={txn.id}>
                            <TableCell className="text-sm">
                              {formatDateTime(txn.timestamp)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {txn.type === 'debit' ? (
                                  <ArrowUpRight className="h-4 w-4 text-red-500" />
                                ) : (
                                  <ArrowDownLeft className="h-4 w-4 text-green-500" />
                                )}
                                <span className="font-medium">{txn.merchant}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <IconComponent className={`h-4 w-4 ${txn.categoryColor}`} />
                                <span>{txn.category}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {txn.location}
                            </TableCell>
                            <TableCell className="text-right">
                              <span className={`font-medium ${txn.type === 'debit' ? 'text-red-600' : 'text-green-600'}`}>
                                {txn.type === 'debit' ? '-' : '+'}{formatCurrency(txn.amount)}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Badge variant={txn.status === 'completed' ? 'success' : 'warning'}>
                                {txn.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </div>

              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={() => setTransactionHistoryCard(null)}>
                  Close
                </Button>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download Statement
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
