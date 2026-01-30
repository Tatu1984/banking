import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  MoreVertical,
  Download,
  RefreshCw,
  AlertTriangle,
  Phone,
  Mail,
  FileText,
  Eye,
  DollarSign,
  Calendar,
  MapPin,
  MessageSquare,
  Scale,
  History,
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { loans } from "@/data/mockData";
import { useState, useEffect } from "react";
import { useBankingStore, type CollectionActivity } from "@/lib/store";
import { SkeletonCard, SkeletonTable } from "@/components/ui/skeleton";
import { EmptyState, SearchEmptyState } from "@/components/ui/empty-state";

const activityTypeConfig = {
  call: { icon: Phone, label: "Phone Call", color: "text-blue-600" },
  visit: { icon: MapPin, label: "Field Visit", color: "text-purple-600" },
  email: { icon: Mail, label: "Email", color: "text-green-600" },
  sms: { icon: MessageSquare, label: "SMS", color: "text-teal-600" },
  notice: { icon: FileText, label: "Notice", color: "text-orange-600" },
  legal: { icon: Scale, label: "Legal Action", color: "text-red-600" },
};

const outcomeConfig = {
  contacted: { label: "Contacted", color: "bg-green-100 text-green-800", icon: CheckCircle2 },
  not_reachable: { label: "Not Reachable", color: "bg-gray-100 text-gray-800", icon: XCircle },
  promise_to_pay: { label: "Promise to Pay", color: "bg-blue-100 text-blue-800", icon: Calendar },
  dispute: { label: "Dispute", color: "bg-yellow-100 text-yellow-800", icon: AlertCircle },
  skip: { label: "Skip/Fraud", color: "bg-red-100 text-red-800", icon: AlertTriangle },
  legal_action: { label: "Legal Action", color: "bg-purple-100 text-purple-800", icon: Scale },
};

interface Loan {
  id: string;
  loanNumber: string;
  customerId: string;
  customerName: string;
  type: string;
  outstandingAmount: number;
  emiAmount: number;
  status: string;
}

export function Collections() {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedLoanId, setExpandedLoanId] = useState<string | null>(null);
  const [isLogActivityOpen, setIsLogActivityOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Form state for logging activity
  const [activityType, setActivityType] = useState<CollectionActivity['activityType']>("call");
  const [outcome, setOutcome] = useState<CollectionActivity['outcome']>("contacted");
  const [notes, setNotes] = useState("");
  const [promiseDate, setPromiseDate] = useState("");
  const [promiseAmount, setPromiseAmount] = useState("");
  const [nextFollowUp, setNextFollowUp] = useState("");

  const {
    collectionActivities,
    addCollectionActivity,
    getCollectionActivitiesByLoanId,
    currentUser
  } = useBankingStore();

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const delinquentLoans = loans.filter((loan) => loan.status === "npa" || loan.status === "restructured");

  const filteredLoans = delinquentLoans.filter((loan) =>
    loan.loanNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loan.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate KPI metrics
  const totalNPA = delinquentLoans.reduce((sum, loan) => sum + loan.outstandingAmount, 0);
  const days30to60 = delinquentLoans.filter(() => Math.random() > 0.5).length; // Simulated
  const days60to90 = Math.floor(delinquentLoans.length * 0.3);
  const days90plus = delinquentLoans.length - days30to60 - days60to90;

  const handleLogActivity = (loan: Loan) => {
    setSelectedLoan(loan);
    setActivityType("call");
    setOutcome("contacted");
    setNotes("");
    setPromiseDate("");
    setPromiseAmount("");
    setNextFollowUp("");
    setIsLogActivityOpen(true);
  };

  const handleSubmitActivity = () => {
    if (!selectedLoan) return;

    addCollectionActivity({
      loanId: selectedLoan.id,
      loanNumber: selectedLoan.loanNumber,
      customerId: selectedLoan.customerId,
      customerName: selectedLoan.customerName,
      activityType,
      activityDate: new Date().toISOString().split('T')[0],
      outcome,
      promiseDate: promiseDate || undefined,
      promiseAmount: promiseAmount ? parseFloat(promiseAmount) : undefined,
      notes,
      collectorId: currentUser.id,
      collectorName: currentUser.name,
      nextFollowUp: nextFollowUp || undefined,
    });

    setIsLogActivityOpen(false);
    setSelectedLoan(null);
  };

  const toggleExpanded = (loanId: string) => {
    setExpandedLoanId(expandedLoanId === loanId ? null : loanId);
  };

  const getLastActivity = (loanId: string): CollectionActivity | undefined => {
    const activities = getCollectionActivitiesByLoanId(loanId);
    return activities.sort((a, b) =>
      new Date(b.activityDate).getTime() - new Date(a.activityDate).getTime()
    )[0];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Collections</h1>
          <p className="text-muted-foreground">
            Manage delinquent accounts and collection activities
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total NPA</p>
                  <p className="text-2xl font-bold text-red-600">
                    {formatCurrency(totalNPA)}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">30-60 Days</p>
                  <p className="text-2xl font-bold text-yellow-600">{days30to60}</p>
                </div>
                <DollarSign className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">60-90 Days</p>
                  <p className="text-2xl font-bold text-orange-600">{days60to90}</p>
                </div>
                <DollarSign className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">90+ Days</p>
                  <p className="text-2xl font-bold text-red-600">{days90plus}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by loan number or customer..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Delinquent Accounts</CardTitle>
          <CardDescription>
            {isLoading ? "Loading..." : `Accounts requiring collection action (${filteredLoans.length} accounts)`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <SkeletonTable rows={5} columns={10} />
          ) : filteredLoans.length === 0 ? (
            searchTerm ? (
              <SearchEmptyState query={searchTerm} />
            ) : (
              <EmptyState
                icon={AlertTriangle}
                title="No Delinquent Accounts"
                description="There are no NPA or restructured loans requiring collection action at this time."
              />
            )
          ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8"></TableHead>
                <TableHead>Loan Number</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Loan Type</TableHead>
                <TableHead>Outstanding</TableHead>
                <TableHead>Overdue Amount</TableHead>
                <TableHead>Days Past Due</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Activity</TableHead>
                <TableHead className="w-8"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLoans.map((loan) => {
                const lastActivity = getLastActivity(loan.id);
                const loanActivities = getCollectionActivitiesByLoanId(loan.id);
                const isExpanded = expandedLoanId === loan.id;

                return (
                  <>
                    <TableRow key={loan.id} className={isExpanded ? "border-b-0" : ""}>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => toggleExpanded(loan.id)}
                        >
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell className="font-mono">{loan.loanNumber}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{loan.customerName}</p>
                          <p className="text-xs text-muted-foreground">ID: {loan.customerId}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">{loan.type}</Badge>
                      </TableCell>
                      <TableCell>{formatCurrency(loan.outstandingAmount)}</TableCell>
                      <TableCell className="text-red-600 font-medium">
                        {formatCurrency(loan.emiAmount * 3)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="destructive">90+</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={loan.status === "npa" ? "destructive" : "warning"}>
                          {loan.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {lastActivity ? (
                          <div className="flex items-center gap-2">
                            {(() => {
                              const config = activityTypeConfig[lastActivity.activityType];
                              const Icon = config.icon;
                              return <Icon className={`h-4 w-4 ${config.color}`} />;
                            })()}
                            <span className="text-sm text-muted-foreground">
                              {formatDate(lastActivity.activityDate)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">No activity</span>
                        )}
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
                            <DropdownMenuItem onClick={() => handleLogActivity(loan)}>
                              <Phone className="mr-2 h-4 w-4" />
                              Log Call
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleLogActivity(loan)}>
                              <Mail className="mr-2 h-4 w-4" />
                              Send Reminder
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleLogActivity(loan)}>
                              <FileText className="mr-2 h-4 w-4" />
                              Generate Notice
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toggleExpanded(loan.id)}>
                              <History className="mr-2 h-4 w-4" />
                              View History ({loanActivities.length})
                            </DropdownMenuItem>
                            <DropdownMenuItem>Initiate Legal Action</DropdownMenuItem>
                            <DropdownMenuItem>Propose Settlement</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>

                    {isExpanded && (
                      <TableRow key={`${loan.id}-expanded`}>
                        <TableCell colSpan={10} className="bg-muted/30 p-4">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold flex items-center gap-2">
                                <History className="h-4 w-4" />
                                Collection Activity History
                              </h4>
                              <Button size="sm" onClick={() => handleLogActivity(loan)}>
                                Log Activity
                              </Button>
                            </div>

                            {loanActivities.length > 0 ? (
                              <div className="space-y-3">
                                {loanActivities
                                  .sort((a, b) => new Date(b.activityDate).getTime() - new Date(a.activityDate).getTime())
                                  .map((activity) => {
                                    const typeConfig = activityTypeConfig[activity.activityType];
                                    const outcomeInfo = outcomeConfig[activity.outcome];
                                    const TypeIcon = typeConfig.icon;

                                    return (
                                      <div
                                        key={activity.id}
                                        className="flex gap-4 p-3 bg-background rounded-lg border"
                                      >
                                        <div className={`mt-1 ${typeConfig.color}`}>
                                          <TypeIcon className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1 space-y-1">
                                          <div className="flex items-center justify-between">
                                            <span className="font-medium">{typeConfig.label}</span>
                                            <span className="text-sm text-muted-foreground">
                                              {formatDate(activity.activityDate)}
                                            </span>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <Badge className={outcomeInfo.color} variant="secondary">
                                              {outcomeInfo.label}
                                            </Badge>
                                            {activity.promiseDate && (
                                              <span className="text-sm text-muted-foreground flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                Promise: {formatDate(activity.promiseDate)}
                                              </span>
                                            )}
                                            {activity.promiseAmount && (
                                              <span className="text-sm text-muted-foreground">
                                                Amount: {formatCurrency(activity.promiseAmount)}
                                              </span>
                                            )}
                                          </div>
                                          {activity.notes && (
                                            <p className="text-sm text-muted-foreground">{activity.notes}</p>
                                          )}
                                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                            <span>By: {activity.collectorName}</span>
                                            {activity.nextFollowUp && (
                                              <span className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                Next follow-up: {formatDate(activity.nextFollowUp)}
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                              </div>
                            ) : (
                              <div className="text-center py-8 text-muted-foreground">
                                <History className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                <p>No collection activities logged yet</p>
                                <Button
                                  variant="link"
                                  size="sm"
                                  onClick={() => handleLogActivity(loan)}
                                >
                                  Log first activity
                                </Button>
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                );
              })}
            </TableBody>
          </Table>
          )}
        </CardContent>
      </Card>

      {/* Log Activity Dialog */}
      <Dialog open={isLogActivityOpen} onOpenChange={setIsLogActivityOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Log Collection Activity</DialogTitle>
            <DialogDescription>
              {selectedLoan && (
                <>
                  Recording activity for <strong>{selectedLoan.customerName}</strong> - {selectedLoan.loanNumber}
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="activityType">Activity Type</Label>
              <Select value={activityType} onValueChange={(v) => setActivityType(v as CollectionActivity['activityType'])}>
                <SelectTrigger>
                  <SelectValue placeholder="Select activity type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="call">Phone Call</SelectItem>
                  <SelectItem value="visit">Field Visit</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="notice">Notice</SelectItem>
                  <SelectItem value="legal">Legal Action</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="outcome">Outcome</Label>
              <Select value={outcome} onValueChange={(v) => setOutcome(v as CollectionActivity['outcome'])}>
                <SelectTrigger>
                  <SelectValue placeholder="Select outcome" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="not_reachable">Not Reachable</SelectItem>
                  <SelectItem value="promise_to_pay">Promise to Pay</SelectItem>
                  <SelectItem value="dispute">Dispute</SelectItem>
                  <SelectItem value="skip">Skip/Fraud</SelectItem>
                  <SelectItem value="legal_action">Legal Action</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {outcome === "promise_to_pay" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="promiseDate">Promise Date</Label>
                  <Input
                    id="promiseDate"
                    type="date"
                    value={promiseDate}
                    onChange={(e) => setPromiseDate(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="promiseAmount">Promise Amount</Label>
                  <Input
                    id="promiseAmount"
                    type="number"
                    placeholder="0.00"
                    value={promiseAmount}
                    onChange={(e) => setPromiseAmount(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="nextFollowUp">Next Follow-up Date</Label>
              <Input
                id="nextFollowUp"
                type="date"
                value={nextFollowUp}
                onChange={(e) => setNextFollowUp(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Enter activity notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLogActivityOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitActivity}>
              Log Activity
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
