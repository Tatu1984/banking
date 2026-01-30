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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { SearchEmptyState } from "@/components/ui/empty-state";
import { toast } from "@/hooks/use-toast";
import {
  Search,
  MoreVertical,
  Download,
  Eye,
  RefreshCw,
  Send,
  Globe,
  Smartphone,
  Building,
  Zap,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { formatCurrency, formatDateTime, maskAccountNumber } from "@/lib/utils";
import { payments } from "@/data/mockData";

// Validation schemas
const internalPaymentSchema = z.object({
  fromAccount: z.string().min(1, "Source account is required"),
  toAccount: z.string().regex(/^\d{9,18}$/, "Enter a valid account number (9-18 digits)"),
  amount: z.number().positive("Amount must be greater than 0"),
  remarks: z.string().max(100, "Remarks too long").optional(),
}).refine(data => data.fromAccount !== data.toAccount, {
  message: "Source and destination cannot be the same",
  path: ["toAccount"],
});

const neftPaymentSchema = z.object({
  fromAccount: z.string().min(1, "Source account is required"),
  beneficiaryAccount: z.string().regex(/^\d{9,18}$/, "Enter a valid account number"),
  beneficiaryName: z.string().min(2, "Beneficiary name is required"),
  ifscCode: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code"),
  amount: z.number().positive("Amount must be greater than 0"),
  remarks: z.string().max(100, "Remarks too long").optional(),
});

const rtgsPaymentSchema = z.object({
  fromAccount: z.string().min(1, "Source account is required"),
  beneficiaryAccount: z.string().regex(/^\d{9,18}$/, "Enter a valid account number"),
  beneficiaryName: z.string().min(2, "Beneficiary name is required"),
  ifscCode: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code"),
  amount: z.number().min(200000, "RTGS minimum amount is ₹2,00,000"),
  remarks: z.string().max(100, "Remarks too long").optional(),
});

const impsPaymentSchema = z.object({
  fromAccount: z.string().min(1, "Source account is required"),
  beneficiaryAccount: z.string().min(5, "Beneficiary account/MMID is required"),
  ifscCode: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code"),
  amount: z.number().positive("Amount must be greater than 0").max(500000, "IMPS maximum is ₹5,00,000"),
});

type InternalFormData = z.infer<typeof internalPaymentSchema>;
type NEFTFormData = z.infer<typeof neftPaymentSchema>;
type RTGSFormData = z.infer<typeof rtgsPaymentSchema>;
type IMPSFormData = z.infer<typeof impsPaymentSchema>;

export function Payments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isNewPaymentOpen, setIsNewPaymentOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<typeof payments[0] | null>(null);
  const [paymentType, setPaymentType] = useState("internal");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cancelDialog, setCancelDialog] = useState<{ open: boolean; payment: typeof payments[0] | null }>({
    open: false,
    payment: null,
  });

  // Form instances for each payment type
  const internalForm = useForm<InternalFormData>({
    resolver: zodResolver(internalPaymentSchema),
    defaultValues: { fromAccount: "", toAccount: "", amount: 0, remarks: "" },
  });

  const neftForm = useForm<NEFTFormData>({
    resolver: zodResolver(neftPaymentSchema),
    defaultValues: { fromAccount: "", beneficiaryAccount: "", beneficiaryName: "", ifscCode: "", amount: 0, remarks: "" },
  });

  const rtgsForm = useForm<RTGSFormData>({
    resolver: zodResolver(rtgsPaymentSchema),
    defaultValues: { fromAccount: "", beneficiaryAccount: "", beneficiaryName: "", ifscCode: "", amount: 0, remarks: "" },
  });

  const impsForm = useForm<IMPSFormData>({
    resolver: zodResolver(impsPaymentSchema),
    defaultValues: { fromAccount: "", beneficiaryAccount: "", ifscCode: "", amount: 0 },
  });

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.beneficiaryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.fromAccount.includes(searchTerm);
    const matchesType = typeFilter === "all" || payment.type === typeFilter;
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getPaymentIcon = (type: string) => {
    switch (type) {
      case "NEFT": return <Building className="h-4 w-4" />;
      case "RTGS": return <Zap className="h-4 w-4" />;
      case "IMPS": return <Zap className="h-4 w-4 text-orange-500" />;
      case "UPI": return <Smartphone className="h-4 w-4 text-purple-500" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  const handleInternalSubmit = async (data: InternalFormData) => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Internal payment:", data);
      toast({
        title: "Payment Initiated",
        description: `Internal transfer of ${formatCurrency(data.amount)} submitted successfully.`,
        variant: "success",
      });
      setIsNewPaymentOpen(false);
      internalForm.reset();
    } catch {
      toast({ title: "Error", description: "Failed to process payment.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNEFTSubmit = async (data: NEFTFormData) => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("NEFT payment:", data);
      toast({
        title: "NEFT Payment Initiated",
        description: `Transfer of ${formatCurrency(data.amount)} to ${data.beneficiaryName} submitted.`,
        variant: "success",
      });
      setIsNewPaymentOpen(false);
      neftForm.reset();
    } catch {
      toast({ title: "Error", description: "Failed to process NEFT payment.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRTGSSubmit = async (data: RTGSFormData) => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("RTGS payment:", data);
      toast({
        title: "RTGS Payment Initiated",
        description: `High-value transfer of ${formatCurrency(data.amount)} submitted.`,
        variant: "success",
      });
      setIsNewPaymentOpen(false);
      rtgsForm.reset();
    } catch {
      toast({ title: "Error", description: "Failed to process RTGS payment.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleIMPSSubmit = async (data: IMPSFormData) => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("IMPS payment:", data);
      toast({
        title: "IMPS Payment Initiated",
        description: `Instant transfer of ${formatCurrency(data.amount)} submitted.`,
        variant: "success",
      });
      setIsNewPaymentOpen(false);
      impsForm.reset();
    } catch {
      toast({ title: "Error", description: "Failed to process IMPS payment.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelPayment = async () => {
    if (!cancelDialog.payment) return;
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: "Payment Cancelled",
        description: `Payment ${cancelDialog.payment.referenceNumber} has been cancelled.`,
        variant: "success",
      });
      setCancelDialog({ open: false, payment: null });
    } catch {
      toast({ title: "Error", description: "Failed to cancel payment.", variant: "destructive" });
    }
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      internalForm.reset();
      neftForm.reset();
      rtgsForm.reset();
      impsForm.reset();
      setPaymentType("internal");
    }
    setIsNewPaymentOpen(open);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
          <p className="text-muted-foreground">Manage fund transfers and payment operations</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Dialog open={isNewPaymentOpen} onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
              <Button>
                <Send className="mr-2 h-4 w-4" />
                New Payment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Initiate Payment</DialogTitle>
                <DialogDescription>Create a new fund transfer</DialogDescription>
              </DialogHeader>
              <Tabs value={paymentType} onValueChange={setPaymentType}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="internal">Internal</TabsTrigger>
                  <TabsTrigger value="neft">NEFT</TabsTrigger>
                  <TabsTrigger value="rtgs">RTGS</TabsTrigger>
                  <TabsTrigger value="imps">IMPS</TabsTrigger>
                </TabsList>

                {/* Internal Transfer Form */}
                <TabsContent value="internal" className="mt-4">
                  <Form {...internalForm}>
                    <form onSubmit={internalForm.handleSubmit(handleInternalSubmit)} className="space-y-4">
                      <FormField
                        control={internalForm.control}
                        name="fromAccount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel required>From Account</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select source account" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="123400001234">XXXX1234 - Savings (INR 25,47,890)</SelectItem>
                                <SelectItem value="123400005678">XXXX5678 - Current (INR 1,23,456)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={internalForm.control}
                        name="toAccount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel required>To Account</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter destination account number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={internalForm.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel required>Amount (INR)</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="0.00" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={internalForm.control}
                        name="remarks"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Remarks</FormLabel>
                            <FormControl>
                              <Input placeholder="Payment description" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => handleDialogClose(false)} disabled={isSubmitting}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          <Send className="mr-2 h-4 w-4" />
                          Submit
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </TabsContent>

                {/* NEFT Form */}
                <TabsContent value="neft" className="mt-4">
                  <Form {...neftForm}>
                    <form onSubmit={neftForm.handleSubmit(handleNEFTSubmit)} className="space-y-4">
                      <FormField
                        control={neftForm.control}
                        name="fromAccount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel required>From Account</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select source account" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="123400001234">XXXX1234 - Savings (INR 25,47,890)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={neftForm.control}
                        name="beneficiaryAccount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel required>Beneficiary Account</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter beneficiary account number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={neftForm.control}
                        name="beneficiaryName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel required>Beneficiary Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter beneficiary name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={neftForm.control}
                        name="ifscCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel required>IFSC Code</FormLabel>
                            <FormControl>
                              <Input placeholder="SBIN0001234" {...field} onChange={(e) => field.onChange(e.target.value.toUpperCase())} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={neftForm.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel required>Amount (INR)</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="0.00" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={neftForm.control}
                        name="remarks"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Remarks</FormLabel>
                            <FormControl>
                              <Input placeholder="Payment description" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => handleDialogClose(false)} disabled={isSubmitting}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          <Send className="mr-2 h-4 w-4" />
                          Submit NEFT
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </TabsContent>

                {/* RTGS Form */}
                <TabsContent value="rtgs" className="mt-4">
                  <Form {...rtgsForm}>
                    <form onSubmit={rtgsForm.handleSubmit(handleRTGSSubmit)} className="space-y-4">
                      <FormDescription className="text-muted-foreground">
                        RTGS is available for amounts above INR 2,00,000
                      </FormDescription>
                      <FormField
                        control={rtgsForm.control}
                        name="fromAccount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel required>From Account</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select source account" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="123400001234">XXXX1234 - Savings (INR 25,47,890)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={rtgsForm.control}
                        name="beneficiaryAccount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel required>Beneficiary Account</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter beneficiary account number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={rtgsForm.control}
                        name="beneficiaryName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel required>Beneficiary Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter beneficiary name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={rtgsForm.control}
                        name="ifscCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel required>IFSC Code</FormLabel>
                            <FormControl>
                              <Input placeholder="SBIN0001234" {...field} onChange={(e) => field.onChange(e.target.value.toUpperCase())} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={rtgsForm.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel required>Amount (INR)</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="Minimum 2,00,000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => handleDialogClose(false)} disabled={isSubmitting}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          <Send className="mr-2 h-4 w-4" />
                          Submit RTGS
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </TabsContent>

                {/* IMPS Form */}
                <TabsContent value="imps" className="mt-4">
                  <Form {...impsForm}>
                    <form onSubmit={impsForm.handleSubmit(handleIMPSSubmit)} className="space-y-4">
                      <FormDescription className="text-muted-foreground">
                        IMPS enables instant 24x7 fund transfers (max ₹5,00,000)
                      </FormDescription>
                      <FormField
                        control={impsForm.control}
                        name="fromAccount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel required>From Account</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select source account" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="123400001234">XXXX1234 - Savings (INR 25,47,890)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={impsForm.control}
                        name="beneficiaryAccount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel required>Beneficiary Account / MMID</FormLabel>
                            <FormControl>
                              <Input placeholder="Account number or Mobile + MMID" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={impsForm.control}
                        name="ifscCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel required>IFSC Code</FormLabel>
                            <FormControl>
                              <Input placeholder="SBIN0001234" {...field} onChange={(e) => field.onChange(e.target.value.toUpperCase())} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={impsForm.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel required>Amount (INR)</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="Max 5,00,000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => handleDialogClose(false)} disabled={isSubmitting}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          <Zap className="mr-2 h-4 w-4" />
                          Submit IMPS
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
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
                <p className="text-sm text-muted-foreground">Total Payments</p>
                <p className="text-2xl font-bold">{payments.length}</p>
              </div>
              <Send className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-green-600">
                  {payments.filter((p) => p.status === "completed").length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Processing</p>
                <p className="text-2xl font-bold text-blue-600">
                  {payments.filter((p) => p.status === "processing").length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {payments.filter((p) => p.status === "pending").length}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Failed</p>
                <p className="text-2xl font-bold text-red-600">
                  {payments.filter((p) => p.status === "failed").length}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
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
                placeholder="Search by reference, beneficiary, or account..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Payment Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="NEFT">NEFT</SelectItem>
                <SelectItem value="RTGS">RTGS</SelectItem>
                <SelectItem value="IMPS">IMPS</SelectItem>
                <SelectItem value="UPI">UPI</SelectItem>
                <SelectItem value="Internal">Internal</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>{filteredPayments.length} payments found</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredPayments.length === 0 ? (
            <SearchEmptyState query={searchTerm || undefined} />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference Number</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>From Account</TableHead>
                  <TableHead>Beneficiary</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Initiated</TableHead>
                  <TableHead className="w-8"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-mono text-sm">{payment.referenceNumber}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getPaymentIcon(payment.type)}
                        <Badge variant="outline">{payment.type}</Badge>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{maskAccountNumber(payment.fromAccount)}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{payment.beneficiaryName}</p>
                        <p className="text-xs text-muted-foreground font-mono">
                          {payment.toAccount.includes("@") ? payment.toAccount : maskAccountNumber(payment.toAccount)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{formatCurrency(payment.amount)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          payment.status === "completed" ? "success" :
                          payment.status === "processing" ? "info" :
                          payment.status === "pending" ? "warning" : "destructive"
                        }
                      >
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{formatDateTime(payment.initiatedAt)}</TableCell>
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
                          <DropdownMenuItem onClick={() => setSelectedPayment(payment)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            Download Receipt
                          </DropdownMenuItem>
                          {payment.status === "pending" && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => {
                                  toast({ title: "Payment Approved", description: "Payment has been approved for processing.", variant: "success" });
                                }}
                              >
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => setCancelDialog({ open: true, payment })}
                              >
                                Cancel Payment
                              </DropdownMenuItem>
                            </>
                          )}
                          {payment.status === "failed" && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => {
                                  toast({ title: "Retry Initiated", description: "Payment retry has been queued.", variant: "default" });
                                }}
                              >
                                Retry Payment
                              </DropdownMenuItem>
                            </>
                          )}
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

      {/* Payment Detail Dialog */}
      <Dialog open={!!selectedPayment} onOpenChange={() => setSelectedPayment(null)}>
        <DialogContent className="max-w-lg">
          {selectedPayment && (
            <>
              <DialogHeader>
                <DialogTitle>Payment Details</DialogTitle>
                <DialogDescription>Reference: {selectedPayment.referenceNumber}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-1">Amount</p>
                  <p className="text-3xl font-bold">{formatCurrency(selectedPayment.amount)}</p>
                  <Badge
                    variant={
                      selectedPayment.status === "completed" ? "success" :
                      selectedPayment.status === "processing" ? "info" :
                      selectedPayment.status === "pending" ? "warning" : "destructive"
                    }
                    className="mt-2"
                  >
                    {selectedPayment.status}
                  </Badge>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Payment Type</span>
                    <div className="flex items-center gap-2">
                      {getPaymentIcon(selectedPayment.type)}
                      <span className="font-medium">{selectedPayment.type}</span>
                    </div>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">From Account</span>
                    <span className="font-mono">{selectedPayment.fromAccount}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Beneficiary</span>
                    <span className="font-medium">{selectedPayment.beneficiaryName}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">To Account</span>
                    <span className="font-mono">{selectedPayment.toAccount}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Initiated</span>
                    <span className="font-medium">{formatDateTime(selectedPayment.initiatedAt)}</span>
                  </div>
                  {selectedPayment.completedAt && (
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Completed</span>
                      <span className="font-medium">{formatDateTime(selectedPayment.completedAt)}</span>
                    </div>
                  )}
                  <div className="py-2">
                    <span className="text-muted-foreground">Remarks</span>
                    <p className="font-medium mt-1">{selectedPayment.remarks}</p>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedPayment(null)}>Close</Button>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download Receipt
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Cancel Payment Confirmation */}
      <ConfirmDialog
        open={cancelDialog.open}
        onOpenChange={(open) => setCancelDialog({ ...cancelDialog, open })}
        title="Cancel Payment?"
        description={`Are you sure you want to cancel payment ${cancelDialog.payment?.referenceNumber}? This action cannot be undone.`}
        confirmLabel="Cancel Payment"
        variant="destructive"
        onConfirm={handleCancelPayment}
      />
    </div>
  );
}
