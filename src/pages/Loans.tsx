import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
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
  Briefcase,
  Home,
  Car,
  GraduationCap,
  Building2,
  AlertTriangle,
  TrendingUp,
  Calendar,
  FileText,
  DollarSign,
  Loader2,
  IndianRupee,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { loans } from "@/data/mockData";
import { Label } from "@/components/ui/label";
import { loanPrepaymentSchema, type LoanPrepaymentFormData } from "@/lib/validations";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Generate EMI schedule for a loan
function generateEMISchedule(loan: typeof loans[0]) {
  const schedule = [];
  const monthlyRate = loan.interestRate / 12 / 100;
  let balance = loan.principalAmount;
  const disbursedDate = new Date(loan.disbursedDate);
  const paidMonths = Math.floor(
    (loan.principalAmount - loan.outstandingAmount) /
    (loan.emiAmount - (loan.principalAmount * monthlyRate / loan.tenure * 12))
  );

  for (let i = 1; i <= loan.tenure; i++) {
    const interestComponent = balance * monthlyRate;
    const principalComponent = loan.emiAmount - interestComponent;
    balance = Math.max(0, balance - principalComponent);

    const dueDate = new Date(disbursedDate);
    dueDate.setMonth(dueDate.getMonth() + i);

    const isPaid = i <= paidMonths;
    const isOverdue = !isPaid && dueDate < new Date();

    schedule.push({
      month: i,
      dueDate: dueDate.toISOString().split('T')[0],
      emiAmount: loan.emiAmount,
      principal: Math.round(principalComponent),
      interest: Math.round(interestComponent),
      balance: Math.round(balance),
      status: isPaid ? 'paid' : isOverdue ? 'overdue' : 'upcoming',
    });
  }
  return schedule;
}

export function Loans() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedLoan, setSelectedLoan] = useState<typeof loans[0] | null>(null);
  const [prepaymentLoan, setPrepaymentLoan] = useState<typeof loans[0] | null>(null);
  const [scheduleLoan, setScheduleLoan] = useState<typeof loans[0] | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const prepaymentForm = useForm<LoanPrepaymentFormData>({
    resolver: zodResolver(loanPrepaymentSchema),
    defaultValues: {
      prepaymentAmount: 0,
      prepaymentType: "partial",
      effectiveDate: new Date().toISOString().split('T')[0],
    },
  });

  const handlePrepaymentSubmit = async (data: LoanPrepaymentFormData) => {
    if (!prepaymentLoan) return;
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: "Prepayment Processed",
        description: `${data.prepaymentType === 'full' ? 'Full' : 'Partial'} prepayment of ${formatCurrency(data.prepaymentAmount)} processed for loan ${prepaymentLoan.loanNumber}`,
      });
      setPrepaymentLoan(null);
      prepaymentForm.reset();
    } catch {
      toast({
        title: "Error",
        description: "Failed to process prepayment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openPrepaymentDialog = (loan: typeof loans[0]) => {
    prepaymentForm.reset({
      prepaymentAmount: loan.outstandingAmount,
      prepaymentType: "partial",
      effectiveDate: new Date().toISOString().split('T')[0],
    });
    setPrepaymentLoan(loan);
  };

  const filteredLoans = loans.filter((loan) => {
    const matchesSearch =
      loan.loanNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || loan.type === typeFilter;
    const matchesStatus = statusFilter === "all" || loan.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const totalDisbursed = loans.reduce((sum, l) => sum + l.principalAmount, 0);
  const totalOutstanding = loans.reduce((sum, l) => sum + l.outstandingAmount, 0);

  const getLoanIcon = (type: string) => {
    switch (type) {
      case "home": return <Home className="h-4 w-4" />;
      case "auto": return <Car className="h-4 w-4" />;
      case "education": return <GraduationCap className="h-4 w-4" />;
      case "business": return <Building2 className="h-4 w-4" />;
      default: return <Briefcase className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Loans</h1>
          <p className="text-muted-foreground">
            Manage loan portfolio and servicing
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Disbursed</p>
                <p className="text-2xl font-bold">{formatCurrency(totalDisbursed)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Outstanding</p>
                <p className="text-2xl font-bold">{formatCurrency(totalOutstanding)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Loans</p>
                <p className="text-2xl font-bold">
                  {loans.filter((l) => l.status === "active").length}
                </p>
              </div>
              <Briefcase className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">NPA</p>
                <p className="text-2xl font-bold text-red-600">
                  {loans.filter((l) => l.status === "npa").length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
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
                placeholder="Search by loan number or customer name..."
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="npa">NPA</SelectItem>
                <SelectItem value="restructured">Restructured</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Loans Table */}
      <Card>
        <CardHeader>
          <CardTitle>Loan Portfolio</CardTitle>
          <CardDescription>
            {filteredLoans.length} loans found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Loan Number</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Principal</TableHead>
                <TableHead>Outstanding</TableHead>
                <TableHead>EMI</TableHead>
                <TableHead>Interest</TableHead>
                <TableHead>Next EMI</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-8"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLoans.map((loan) => (
                <TableRow key={loan.id}>
                  <TableCell className="font-mono">{loan.loanNumber}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{loan.customerName}</p>
                      <p className="text-xs text-muted-foreground">ID: {loan.customerId}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getLoanIcon(loan.type)}
                      <Badge variant="outline" className="capitalize">{loan.type}</Badge>
                    </div>
                  </TableCell>
                  <TableCell>{formatCurrency(loan.principalAmount)}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{formatCurrency(loan.outstandingAmount)}</p>
                      <Progress
                        value={((loan.principalAmount - loan.outstandingAmount) / loan.principalAmount) * 100}
                        className="h-1 mt-1"
                      />
                    </div>
                  </TableCell>
                  <TableCell>{formatCurrency(loan.emiAmount)}</TableCell>
                  <TableCell>{loan.interestRate}%</TableCell>
                  <TableCell>{formatDate(loan.nextEmiDate)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        loan.status === "active" ? "success" :
                        loan.status === "closed" ? "secondary" :
                        loan.status === "npa" ? "destructive" : "warning"
                      }
                    >
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
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setSelectedLoan(loan)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setScheduleLoan(loan)}>
                          <Calendar className="mr-2 h-4 w-4" />
                          View EMI Schedule
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileText className="mr-2 h-4 w-4" />
                          Generate Statement
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {loan.status === "active" && (
                          <>
                            <DropdownMenuItem onClick={() => openPrepaymentDialog(loan)}>
                              <IndianRupee className="mr-2 h-4 w-4" />
                              Process Prepayment
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <AlertTriangle className="mr-2 h-4 w-4" />
                              Mark as NPA
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
        </CardContent>
      </Card>

      {/* Loan Detail Dialog */}
      <Dialog open={!!selectedLoan} onOpenChange={() => setSelectedLoan(null)}>
        <DialogContent className="max-w-2xl">
          {selectedLoan && (
            <>
              <DialogHeader>
                <DialogTitle>Loan Details</DialogTitle>
                <DialogDescription>
                  Loan Number: {selectedLoan.loanNumber}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6">
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Outstanding Amount</p>
                    <p className="text-3xl font-bold">{formatCurrency(selectedLoan.outstandingAmount)}</p>
                  </div>
                  <Badge
                    variant={
                      selectedLoan.status === "active" ? "success" :
                      selectedLoan.status === "npa" ? "destructive" : "secondary"
                    }
                    className="text-lg px-4 py-1"
                  >
                    {selectedLoan.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-muted-foreground">Loan Information</Label>
                      <div className="mt-2 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Type:</span>
                          <span className="font-medium capitalize">{selectedLoan.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Principal:</span>
                          <span className="font-medium">{formatCurrency(selectedLoan.principalAmount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Interest Rate:</span>
                          <span className="font-medium">{selectedLoan.interestRate}% p.a.</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Tenure:</span>
                          <span className="font-medium">{selectedLoan.tenure} months</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-muted-foreground">EMI Details</Label>
                      <div className="mt-2 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">EMI Amount:</span>
                          <span className="font-medium">{formatCurrency(selectedLoan.emiAmount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Next EMI Date:</span>
                          <span className="font-medium">{formatDate(selectedLoan.nextEmiDate)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Disbursed On:</span>
                          <span className="font-medium">{formatDate(selectedLoan.disbursedDate)}</span>
                        </div>
                      </div>
                    </div>
                    {selectedLoan.collateral && (
                      <div>
                        <Label className="text-muted-foreground">Collateral</Label>
                        <p className="mt-2">{selectedLoan.collateral}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Label className="text-muted-foreground">Repayment Progress</Label>
                  <div className="mt-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Paid: {formatCurrency(selectedLoan.principalAmount - selectedLoan.outstandingAmount)}</span>
                      <span>Remaining: {formatCurrency(selectedLoan.outstandingAmount)}</span>
                    </div>
                    <Progress
                      value={((selectedLoan.principalAmount - selectedLoan.outstandingAmount) / selectedLoan.principalAmount) * 100}
                      className="h-3"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedLoan(null)}>
                  Close
                </Button>
                <Button onClick={() => {
                  setScheduleLoan(selectedLoan);
                  setSelectedLoan(null);
                }}>View Schedule</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Prepayment Dialog */}
      <Dialog open={!!prepaymentLoan} onOpenChange={() => setPrepaymentLoan(null)}>
        <DialogContent className="max-w-lg">
          {prepaymentLoan && (
            <>
              <DialogHeader>
                <DialogTitle>Process Prepayment</DialogTitle>
                <DialogDescription>
                  Loan: {prepaymentLoan.loanNumber} | Outstanding: {formatCurrency(prepaymentLoan.outstandingAmount)}
                </DialogDescription>
              </DialogHeader>
              <Form {...prepaymentForm}>
                <form onSubmit={prepaymentForm.handleSubmit(handlePrepaymentSubmit)} className="space-y-4">
                  <FormField
                    control={prepaymentForm.control}
                    name="prepaymentType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prepayment Type</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={(value) => {
                              field.onChange(value);
                              if (value === 'full') {
                                prepaymentForm.setValue('prepaymentAmount', prepaymentLoan.outstandingAmount);
                              }
                            }}
                            value={field.value}
                            className="flex gap-4"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="partial" id="partial" />
                              <Label htmlFor="partial">Partial Prepayment</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="full" id="full" />
                              <Label htmlFor="full">Full Closure</Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={prepaymentForm.control}
                    name="prepaymentAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prepayment Amount</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter amount"
                            {...field}
                            disabled={prepaymentForm.watch('prepaymentType') === 'full'}
                            max={prepaymentLoan.outstandingAmount}
                          />
                        </FormControl>
                        <FormDescription>
                          Maximum: {formatCurrency(prepaymentLoan.outstandingAmount)}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={prepaymentForm.control}
                    name="effectiveDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Effective Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} min={new Date().toISOString().split('T')[0]} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="bg-muted p-4 rounded-lg space-y-2">
                    <h4 className="font-medium">Prepayment Summary</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <span className="text-muted-foreground">Prepayment Amount:</span>
                      <span className="font-medium">{formatCurrency(prepaymentForm.watch('prepaymentAmount') || 0)}</span>
                      <span className="text-muted-foreground">Processing Fee (0.5%):</span>
                      <span className="font-medium">{formatCurrency((prepaymentForm.watch('prepaymentAmount') || 0) * 0.005)}</span>
                      <span className="text-muted-foreground">Total Payable:</span>
                      <span className="font-medium text-primary">{formatCurrency((prepaymentForm.watch('prepaymentAmount') || 0) * 1.005)}</span>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setPrepaymentLoan(null)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Process Prepayment
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* EMI Schedule Dialog */}
      <Dialog open={!!scheduleLoan} onOpenChange={() => setScheduleLoan(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
          {scheduleLoan && (
            <>
              <DialogHeader>
                <DialogTitle>EMI Schedule</DialogTitle>
                <DialogDescription>
                  {scheduleLoan.loanNumber} | {scheduleLoan.customerName} | {formatCurrency(scheduleLoan.principalAmount)} @ {scheduleLoan.interestRate}% for {scheduleLoan.tenure} months
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-4 gap-4 py-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground">Principal Amount</p>
                  <p className="text-lg font-bold text-blue-700">{formatCurrency(scheduleLoan.principalAmount)}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground">EMI Amount</p>
                  <p className="text-lg font-bold text-green-700">{formatCurrency(scheduleLoan.emiAmount)}</p>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground">Outstanding</p>
                  <p className="text-lg font-bold text-orange-700">{formatCurrency(scheduleLoan.outstandingAmount)}</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground">Next EMI Date</p>
                  <p className="text-lg font-bold text-purple-700">{formatDate(scheduleLoan.nextEmiDate)}</p>
                </div>
              </div>

              <div className="overflow-auto flex-1">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">Month</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead className="text-right">EMI</TableHead>
                      <TableHead className="text-right">Principal</TableHead>
                      <TableHead className="text-right">Interest</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {generateEMISchedule(scheduleLoan).map((emi) => (
                      <TableRow key={emi.month} className={emi.status === 'paid' ? 'bg-green-50/50' : emi.status === 'overdue' ? 'bg-red-50/50' : ''}>
                        <TableCell className="font-medium">{emi.month}</TableCell>
                        <TableCell>{formatDate(emi.dueDate)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(emi.emiAmount)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(emi.principal)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(emi.interest)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(emi.balance)}</TableCell>
                        <TableCell className="text-center">
                          {emi.status === 'paid' && (
                            <Badge variant="success" className="gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              Paid
                            </Badge>
                          )}
                          {emi.status === 'overdue' && (
                            <Badge variant="destructive" className="gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              Overdue
                            </Badge>
                          )}
                          {emi.status === 'upcoming' && (
                            <Badge variant="outline" className="gap-1">
                              <Clock className="h-3 w-3" />
                              Upcoming
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={() => setScheduleLoan(null)}>
                  Close
                </Button>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download Schedule
                </Button>
                {scheduleLoan.status === 'active' && (
                  <Button onClick={() => {
                    openPrepaymentDialog(scheduleLoan);
                    setScheduleLoan(null);
                  }}>
                    <IndianRupee className="mr-2 h-4 w-4" />
                    Process Prepayment
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
