import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Search,
  MoreVertical,
  Download,
  Eye,
  RefreshCw,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Plus,
  Loader2,
} from "lucide-react";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { loanApplications, customers } from "@/data/mockData";
import { loanApplicationSchema, type LoanApplicationFormData } from "@/lib/validations";
import { useToast } from "@/hooks/use-toast";

export function LoanApplications() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<typeof loanApplications[0] | null>(null);
  const { toast } = useToast();

  const form = useForm<LoanApplicationFormData>({
    resolver: zodResolver(loanApplicationSchema),
    defaultValues: {
      customerId: "",
      loanType: "personal",
      requestedAmount: 100000,
      tenure: 12,
      purpose: "",
      employmentType: "salaried",
      monthlyIncome: 50000,
      existingEMI: 0,
    },
  });

  const handleSubmit = async (data: LoanApplicationFormData) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: "Application Submitted",
        description: `Loan application for ${formatCurrency(data.requestedAmount)} has been submitted successfully.`,
      });
      setIsNewDialogOpen(false);
      form.reset();
    } catch {
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate EMI estimate
  const calculateEMI = (principal: number, tenure: number, rate: number) => {
    const monthlyRate = rate / 12 / 100;
    const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, tenure) / (Math.pow(1 + monthlyRate, tenure) - 1);
    return Math.round(emi);
  };

  const getInterestRate = (loanType: string) => {
    switch (loanType) {
      case "home": return 8.5;
      case "auto": return 9.5;
      case "personal": return 12.5;
      case "education": return 10.0;
      case "business": return 11.0;
      default: return 12.0;
    }
  };

  const filteredApplications = loanApplications.filter((app) => {
    const matchesSearch =
      app.applicationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || app.loanType === typeFilter;
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "rejected": return <XCircle className="h-4 w-4 text-red-500" />;
      case "under_review": return <Clock className="h-4 w-4 text-blue-500" />;
      case "submitted": return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Loan Applications</h1>
          <p className="text-muted-foreground">
            Review and process loan applications
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => setIsNewDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Application
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{loanApplications.length}</p>
              <p className="text-sm text-muted-foreground">Total</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {loanApplications.filter((a) => a.status === "submitted").length}
              </p>
              <p className="text-sm text-muted-foreground">Submitted</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {loanApplications.filter((a) => a.status === "under_review").length}
              </p>
              <p className="text-sm text-muted-foreground">Under Review</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {loanApplications.filter((a) => a.status === "approved").length}
              </p>
              <p className="text-sm text-muted-foreground">Approved</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                {loanApplications.filter((a) => a.status === "rejected").length}
              </p>
              <p className="text-sm text-muted-foreground">Rejected</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[300px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by application number or customer..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Loan Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="home">Home</SelectItem>
                <SelectItem value="auto">Auto</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="education">Education</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="disbursed">Disbursed</SelectItem>
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
          <CardTitle>Applications</CardTitle>
          <CardDescription>
            {filteredApplications.length} applications found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Application #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Loan Type</TableHead>
                <TableHead>Requested</TableHead>
                <TableHead>Approved</TableHead>
                <TableHead>Credit Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead className="w-8"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell className="font-mono">{app.applicationNumber}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{app.customerName}</p>
                      <p className="text-xs text-muted-foreground">ID: {app.customerId}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">{app.loanType}</Badge>
                  </TableCell>
                  <TableCell>{formatCurrency(app.requestedAmount)}</TableCell>
                  <TableCell>
                    {app.approvedAmount ? formatCurrency(app.approvedAmount) : "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${
                        app.creditScore >= 750 ? "text-green-600" :
                        app.creditScore >= 650 ? "text-yellow-600" : "text-red-600"
                      }`}>
                        {app.creditScore}
                      </span>
                      <Progress
                        value={(app.creditScore / 900) * 100}
                        className="h-2 w-16"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(app.status)}
                      <Badge
                        variant={
                          app.status === "approved" ? "success" :
                          app.status === "rejected" ? "destructive" :
                          app.status === "under_review" ? "info" : "warning"
                        }
                      >
                        {app.status.replace("_", " ")}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatDateTime(app.submittedAt)}
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
                        <DropdownMenuItem onClick={() => setSelectedApplication(app)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>View Documents</DropdownMenuItem>
                        <DropdownMenuItem>Credit Report</DropdownMenuItem>
                        {(app.status === "submitted" || app.status === "under_review") && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-green-600">
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <XCircle className="mr-2 h-4 w-4" />
                              Reject
                            </DropdownMenuItem>
                          </>
                        )}
                        {app.status === "approved" && (
                          <DropdownMenuItem>Process Disbursement</DropdownMenuItem>
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

      {/* New Application Dialog */}
      <Dialog open={isNewDialogOpen} onOpenChange={setIsNewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New Loan Application</DialogTitle>
            <DialogDescription>
              Submit a new loan application for processing
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="customerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select customer" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {customers.map((customer) => (
                            <SelectItem key={customer.id} value={customer.id}>
                              {customer.name} ({customer.cif})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="loanType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loan Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select loan type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="personal">Personal Loan</SelectItem>
                          <SelectItem value="home">Home Loan</SelectItem>
                          <SelectItem value="auto">Auto Loan</SelectItem>
                          <SelectItem value="business">Business Loan</SelectItem>
                          <SelectItem value="education">Education Loan</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Interest Rate: {getInterestRate(form.watch('loanType'))}% p.a.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="requestedAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Requested Amount (₹)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter amount" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tenure"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tenure (Months)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter tenure" {...field} min={6} max={360} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="employmentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employment Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select employment type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="salaried">Salaried</SelectItem>
                          <SelectItem value="self_employed">Self Employed</SelectItem>
                          <SelectItem value="business">Business Owner</SelectItem>
                          <SelectItem value="professional">Professional</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="monthlyIncome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monthly Income (₹)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter monthly income" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="existingEMI"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Existing EMI (₹)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter existing EMI" {...field} />
                      </FormControl>
                      <FormDescription>Total of all existing EMIs</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="purpose"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loan Purpose</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the purpose of this loan..."
                        className="resize-none"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* EMI Calculator Preview */}
              <div className="bg-muted p-4 rounded-lg space-y-3">
                <h4 className="font-medium">Loan Summary</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Estimated EMI</p>
                    <p className="text-lg font-bold text-primary">
                      {formatCurrency(calculateEMI(
                        form.watch('requestedAmount') || 0,
                        form.watch('tenure') || 12,
                        getInterestRate(form.watch('loanType'))
                      ))}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total Interest</p>
                    <p className="text-lg font-bold">
                      {formatCurrency(
                        calculateEMI(
                          form.watch('requestedAmount') || 0,
                          form.watch('tenure') || 12,
                          getInterestRate(form.watch('loanType'))
                        ) * (form.watch('tenure') || 12) - (form.watch('requestedAmount') || 0)
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total Payable</p>
                    <p className="text-lg font-bold">
                      {formatCurrency(
                        calculateEMI(
                          form.watch('requestedAmount') || 0,
                          form.watch('tenure') || 12,
                          getInterestRate(form.watch('loanType'))
                        ) * (form.watch('tenure') || 12)
                      )}
                    </p>
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">FOIR (Fixed Obligation to Income Ratio):</span>
                    <span className={`font-medium ${
                      ((form.watch('existingEMI') || 0) + calculateEMI(
                        form.watch('requestedAmount') || 0,
                        form.watch('tenure') || 12,
                        getInterestRate(form.watch('loanType'))
                      )) / (form.watch('monthlyIncome') || 1) > 0.5 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {(((form.watch('existingEMI') || 0) + calculateEMI(
                        form.watch('requestedAmount') || 0,
                        form.watch('tenure') || 12,
                        getInterestRate(form.watch('loanType'))
                      )) / (form.watch('monthlyIncome') || 1) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    FOIR should ideally be below 50% for approval
                  </p>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsNewDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Submit Application
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Application Detail Dialog */}
      <Dialog open={!!selectedApplication} onOpenChange={() => setSelectedApplication(null)}>
        <DialogContent className="max-w-2xl">
          {selectedApplication && (
            <>
              <DialogHeader>
                <DialogTitle>Application Details</DialogTitle>
                <DialogDescription>
                  Application: {selectedApplication.applicationNumber}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Requested Amount</p>
                    <p className="text-3xl font-bold">{formatCurrency(selectedApplication.requestedAmount)}</p>
                    {selectedApplication.approvedAmount && (
                      <p className="text-sm text-green-600">
                        Approved: {formatCurrency(selectedApplication.approvedAmount)}
                      </p>
                    )}
                  </div>
                  <Badge
                    variant={
                      selectedApplication.status === "approved" ? "success" :
                      selectedApplication.status === "rejected" ? "destructive" :
                      selectedApplication.status === "under_review" ? "info" : "warning"
                    }
                    className="text-lg px-4 py-1"
                  >
                    {selectedApplication.status.replace("_", " ")}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Customer</p>
                      <p className="font-medium">{selectedApplication.customerName}</p>
                      <p className="text-xs text-muted-foreground">ID: {selectedApplication.customerId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Loan Type</p>
                      <Badge variant="outline" className="capitalize">{selectedApplication.loanType}</Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Submitted At</p>
                      <p className="font-medium">{formatDateTime(selectedApplication.submittedAt)}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Credit Score</p>
                      <div className="flex items-center gap-2">
                        <span className={`text-2xl font-bold ${
                          selectedApplication.creditScore >= 750 ? "text-green-600" :
                          selectedApplication.creditScore >= 650 ? "text-yellow-600" : "text-red-600"
                        }`}>
                          {selectedApplication.creditScore}
                        </span>
                        <span className="text-sm text-muted-foreground">/ 900</span>
                      </div>
                      <Progress
                        value={(selectedApplication.creditScore / 900) * 100}
                        className="h-2 mt-2"
                      />
                    </div>
                    {selectedApplication.processedAt && (
                      <div>
                        <p className="text-sm text-muted-foreground">Processed At</p>
                        <p className="font-medium">{formatDateTime(selectedApplication.processedAt)}</p>
                      </div>
                    )}
                  </div>
                </div>

                {selectedApplication.remarks && (
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Remarks</p>
                    <p className="mt-1">{selectedApplication.remarks}</p>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedApplication(null)}>
                  Close
                </Button>
                {(selectedApplication.status === "submitted" || selectedApplication.status === "under_review") && (
                  <>
                    <Button variant="destructive">
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                    <Button>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                  </>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
