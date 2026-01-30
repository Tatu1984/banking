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
  AlertTriangle,
  CreditCard,
  Clock,
  CheckCircle2,
  XCircle,
  Scale,
  Eye,
  FileText,
  MessageSquare,
  Upload,
  Send,
  TrendingUp,
  TrendingDown,
  User,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useState } from "react";
import { cardDisputes } from "@/data/mockData";

const chargebackReasons = [
  { code: "4837", description: "No Cardholder Authorization", network: "Visa" },
  { code: "4863", description: "Cardholder Does Not Recognize", network: "Visa" },
  { code: "4853", description: "Cardholder Dispute", network: "Visa" },
  { code: "4834", description: "Point-of-Interaction Error", network: "Visa" },
  { code: "10.4", description: "Other Fraud - Card Absent Environment", network: "Mastercard" },
  { code: "4808", description: "Authorization-Related Chargeback", network: "Visa" },
];

const disputeTimeline = [
  { date: "2024-01-26", event: "Dispute Filed", description: "Customer reported unauthorized transaction", user: "Customer" },
  { date: "2024-01-26", event: "Case Created", description: "Dispute case created and assigned", user: "System" },
  { date: "2024-01-27", event: "Documents Requested", description: "Requested additional documentation from customer", user: "Dispute Team" },
  { date: "2024-01-27", event: "Documents Received", description: "Customer submitted card statement and declaration", user: "Customer" },
  { date: "2024-01-28", event: "Investigation Started", description: "Chargeback investigation initiated", user: "Dispute Team" },
];

export function CardDisputes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewDisputeDialog, setShowNewDisputeDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [selectedDispute, setSelectedDispute] = useState<typeof cardDisputes[0] | null>(null);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "fraud": return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "merchant": return <CreditCard className="h-4 w-4 text-blue-500" />;
      case "atm": return <CreditCard className="h-4 w-4 text-purple-500" />;
      case "duplicate": return <FileText className="h-4 w-4 text-orange-500" />;
      case "non_receipt": return <Clock className="h-4 w-4 text-yellow-500" />;
      case "quality": return <Scale className="h-4 w-4 text-indigo-500" />;
      default: return <CreditCard className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "success" | "warning" | "info"> = {
      open: "secondary",
      investigating: "info",
      chargeback_filed: "warning",
      resolved: "success",
      rejected: "destructive",
      arbitration: "destructive"
    };
    return variants[status] || "secondary";
  };

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "success" | "warning" | "info"> = {
      low: "secondary",
      medium: "info",
      high: "warning",
      critical: "destructive"
    };
    return variants[priority] || "secondary";
  };

  const openCount = cardDisputes.filter(d => d.status === "open").length;
  const investigatingCount = cardDisputes.filter(d => d.status === "investigating").length;
  const chargebackCount = cardDisputes.filter(d => d.status === "chargeback_filed").length;
  const arbitrationCount = cardDisputes.filter(d => d.status === "arbitration").length;
  const totalAmount = cardDisputes.reduce((sum, d) => sum + d.disputeAmount, 0);

  const handleViewDetail = (dispute: typeof cardDisputes[0]) => {
    setSelectedDispute(dispute);
    setShowDetailDialog(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Card Disputes & Chargebacks</h1>
          <p className="text-muted-foreground">
            Manage card transaction disputes, chargebacks, and arbitration cases
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Dialog open={showNewDisputeDialog} onOpenChange={setShowNewDisputeDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Dispute
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>File New Dispute</DialogTitle>
                <DialogDescription>
                  Create a new card transaction dispute case
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Customer CIF</Label>
                  <Input placeholder="Enter customer ID" />
                </div>
                <div className="grid gap-2">
                  <Label>Card Number</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select card" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="card1">XXXX XXXX XXXX 9012 - Debit</SelectItem>
                      <SelectItem value="card2">XXXX XXXX XXXX 1234 - Credit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Transaction Reference</Label>
                  <Input placeholder="Enter transaction reference" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Dispute Amount</Label>
                    <Input type="number" placeholder="Enter amount" />
                  </div>
                  <div className="grid gap-2">
                    <Label>Transaction Date</Label>
                    <Input type="date" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Dispute Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fraud">Fraud / Unauthorized</SelectItem>
                      <SelectItem value="merchant">Merchant Dispute</SelectItem>
                      <SelectItem value="atm">ATM Dispute</SelectItem>
                      <SelectItem value="duplicate">Duplicate Charge</SelectItem>
                      <SelectItem value="non_receipt">Non-Receipt of Goods</SelectItem>
                      <SelectItem value="quality">Quality / Service Issue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Merchant Name</Label>
                  <Input placeholder="Enter merchant name" />
                </div>
                <div className="grid gap-2">
                  <Label>Priority</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Description</Label>
                  <Textarea placeholder="Describe the dispute reason..." rows={3} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowNewDisputeDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setShowNewDisputeDialog(false)}>
                  Create Dispute
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Open Cases</p>
                <p className="text-2xl font-bold">{openCount}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Investigating</p>
                <p className="text-2xl font-bold text-yellow-600">{investigatingCount}</p>
              </div>
              <Search className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Chargeback Filed</p>
                <p className="text-2xl font-bold text-orange-600">{chargebackCount}</p>
              </div>
              <Send className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Arbitration</p>
                <p className="text-2xl font-bold text-red-600">{arbitrationCount}</p>
              </div>
              <Scale className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Disputed</p>
                <p className="text-2xl font-bold">{formatCurrency(totalAmount)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Disputes</TabsTrigger>
          <TabsTrigger value="fraud">Fraud Cases</TabsTrigger>
          <TabsTrigger value="chargebacks">Chargebacks</TabsTrigger>
          <TabsTrigger value="arbitration">Arbitration</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by dispute #, card number, or customer..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="fraud">Fraud</SelectItem>
                    <SelectItem value="merchant">Merchant</SelectItem>
                    <SelectItem value="atm">ATM</SelectItem>
                    <SelectItem value="duplicate">Duplicate</SelectItem>
                    <SelectItem value="quality">Quality</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
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
              <CardTitle>Dispute Cases</CardTitle>
              <CardDescription>All card transaction disputes and chargebacks</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Dispute #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Card</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Merchant</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Filed Date</TableHead>
                    <TableHead className="w-8"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cardDisputes.map((dispute) => (
                    <TableRow key={dispute.id}>
                      <TableCell className="font-mono">{dispute.disputeNumber}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{dispute.customerName}</p>
                          <p className="text-xs text-muted-foreground">{dispute.customerId}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{dispute.cardNumber}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(dispute.category)}
                          <Badge variant="outline" className="capitalize">
                            {dispute.category.replace('_', ' ')}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(dispute.disputeAmount)}
                      </TableCell>
                      <TableCell className="max-w-[150px] truncate" title={dispute.merchantName}>
                        {dispute.merchantName}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getPriorityBadge(dispute.priority)} className="capitalize">
                          {dispute.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadge(dispute.status)} className="capitalize">
                          {dispute.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(dispute.filedDate)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewDetail(dispute)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileText className="mr-2 h-4 w-4" />
                              View Documents
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Add Note
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {dispute.status === "open" && (
                              <DropdownMenuItem>Start Investigation</DropdownMenuItem>
                            )}
                            {dispute.status === "investigating" && (
                              <>
                                <DropdownMenuItem>File Chargeback</DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">Reject Dispute</DropdownMenuItem>
                              </>
                            )}
                            {dispute.status === "chargeback_filed" && (
                              <DropdownMenuItem>Escalate to Arbitration</DropdownMenuItem>
                            )}
                            <DropdownMenuItem>
                              <Upload className="mr-2 h-4 w-4" />
                              Upload Documents
                            </DropdownMenuItem>
                            <DropdownMenuItem>Assign to Team</DropdownMenuItem>
                            {dispute.status !== "resolved" && dispute.status !== "rejected" && (
                              <DropdownMenuItem className="text-green-600">
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Resolve Dispute
                              </DropdownMenuItem>
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
        </TabsContent>

        <TabsContent value="fraud" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fraud Cases</CardTitle>
              <CardDescription>Unauthorized and fraudulent transaction disputes</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Dispute #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Card</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Merchant</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-8"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cardDisputes.filter(d => d.category === "fraud").map((dispute) => (
                    <TableRow key={dispute.id}>
                      <TableCell className="font-mono">{dispute.disputeNumber}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{dispute.customerName}</p>
                          <p className="text-xs text-muted-foreground">{dispute.customerId}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{dispute.cardNumber}</TableCell>
                      <TableCell className="text-right font-medium text-red-600">
                        {formatCurrency(dispute.disputeAmount)}
                      </TableCell>
                      <TableCell>{dispute.merchantName}</TableCell>
                      <TableCell>
                        <Badge variant={getPriorityBadge(dispute.priority)} className="capitalize">
                          {dispute.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadge(dispute.status)} className="capitalize">
                          {dispute.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleViewDetail(dispute)}>
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

        <TabsContent value="chargebacks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Chargeback Reason Codes</CardTitle>
              <CardDescription>Common chargeback reasons by card network</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reason Code</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Network</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {chargebackReasons.map((reason) => (
                    <TableRow key={reason.code}>
                      <TableCell className="font-mono font-medium">{reason.code}</TableCell>
                      <TableCell>{reason.description}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{reason.network}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="arbitration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Arbitration Cases</CardTitle>
              <CardDescription>Disputes escalated to card network arbitration</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Dispute #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Merchant</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead className="w-8"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cardDisputes.filter(d => d.status === "arbitration").map((dispute) => (
                    <TableRow key={dispute.id}>
                      <TableCell className="font-mono">{dispute.disputeNumber}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{dispute.customerName}</p>
                          <p className="text-xs text-muted-foreground">{dispute.customerId}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium text-red-600">
                        {formatCurrency(dispute.disputeAmount)}
                      </TableCell>
                      <TableCell>{dispute.merchantName}</TableCell>
                      <TableCell>
                        <Badge variant="destructive">In Arbitration</Badge>
                      </TableCell>
                      <TableCell>{dispute.assignedTo}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleViewDetail(dispute)}>
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

        <TabsContent value="resolved" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Resolved Disputes</CardTitle>
              <CardDescription>Successfully resolved dispute cases</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Dispute #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Resolution</TableHead>
                    <TableHead>Resolved Date</TableHead>
                    <TableHead className="w-8"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cardDisputes.filter(d => d.status === "resolved").map((dispute) => (
                    <TableRow key={dispute.id}>
                      <TableCell className="font-mono">{dispute.disputeNumber}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{dispute.customerName}</p>
                          <p className="text-xs text-muted-foreground">{dispute.customerId}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(dispute.disputeAmount)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {dispute.category.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate" title={dispute.resolution}>
                        {dispute.resolution}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {dispute.resolvedDate ? formatDate(dispute.resolvedDate) : '-'}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleViewDetail(dispute)}>
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

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Dispute Details</DialogTitle>
            <DialogDescription>
              {selectedDispute?.disputeNumber} - {selectedDispute?.customerName}
            </DialogDescription>
          </DialogHeader>
          {selectedDispute && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Dispute Amount</p>
                  <p className="text-2xl font-bold">{formatCurrency(selectedDispute.disputeAmount)}</p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant={getStatusBadge(selectedDispute.status)} className="capitalize text-lg px-3 py-1">
                    {selectedDispute.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Card Number</p>
                    <p className="font-mono">{selectedDispute.cardNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Transaction Reference</p>
                    <p className="font-mono">{selectedDispute.transactionRef}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Transaction Date</p>
                    <p>{formatDate(selectedDispute.transactionDate)}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Category</p>
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(selectedDispute.category)}
                      <span className="capitalize">{selectedDispute.category.replace('_', ' ')}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Merchant</p>
                    <p>{selectedDispute.merchantName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Assigned To</p>
                    <p>{selectedDispute.assignedTo || 'Unassigned'}</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Remarks</p>
                <p className="p-3 bg-muted rounded-lg">{selectedDispute.remarks}</p>
              </div>

              <div>
                <p className="text-sm font-medium mb-3">Case Timeline</p>
                <div className="space-y-3">
                  {disputeTimeline.map((event, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        {index < disputeTimeline.length - 1 && (
                          <div className="w-0.5 h-full bg-border"></div>
                        )}
                      </div>
                      <div className="pb-3">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">{event.event}</p>
                          <Badge variant="outline" className="text-xs">{event.user}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{event.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">{formatDate(event.date)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailDialog(false)}>
              Close
            </Button>
            {selectedDispute?.status !== "resolved" && selectedDispute?.status !== "rejected" && (
              <Button>Take Action</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
