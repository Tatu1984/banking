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
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Eye,
  FileText,
  TrendingDown,
  Calculator,
  Calendar,
  Percent,
  DollarSign,
  ArrowRight,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useState } from "react";
import { loanRestructurings } from "@/data/mockData";

const provisioningData = [
  { stage: "Stage 1", description: "Performing", loans: 85000, exposure: 85000000000, ecl: 425000000, coverage: 0.5 },
  { stage: "Stage 2", description: "Under-performing", loans: 12000, exposure: 12000000000, ecl: 1200000000, coverage: 10.0 },
  { stage: "Stage 3", description: "Non-performing", loans: 3000, exposure: 3000000000, ecl: 1500000000, coverage: 50.0 },
];

export function LoanRestructuring() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewProposalDialog, setShowNewProposalDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [selectedRestructuring, setSelectedRestructuring] = useState<typeof loanRestructurings[0] | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "implemented": return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "approved": return <CheckCircle2 className="h-4 w-4 text-blue-500" />;
      case "under_review": return <Clock className="h-4 w-4 text-yellow-500" />;
      case "proposed": return <FileText className="h-4 w-4 text-gray-500" />;
      case "rejected": return <XCircle className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "stage1": return "success";
      case "stage2": return "warning";
      case "stage3": return "destructive";
      default: return "secondary";
    }
  };

  const handleViewDetail = (item: typeof loanRestructurings[0]) => {
    setSelectedRestructuring(item);
    setShowDetailDialog(true);
  };

  const proposedCount = loanRestructurings.filter(r => r.status === "proposed").length;
  const underReviewCount = loanRestructurings.filter(r => r.status === "under_review").length;
  const approvedCount = loanRestructurings.filter(r => r.status === "approved").length;
  const implementedCount = loanRestructurings.filter(r => r.status === "implemented").length;
  const totalECL = loanRestructurings.reduce((sum, r) => sum + r.eclAmount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Loan Restructuring</h1>
          <p className="text-muted-foreground">
            Manage loan restructuring proposals, moratorium, and IFRS 9 provisioning
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Dialog open={showNewProposalDialog} onOpenChange={setShowNewProposalDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Proposal
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Create Restructuring Proposal</DialogTitle>
                <DialogDescription>
                  Submit a new loan restructuring proposal
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Loan Number</Label>
                  <Input placeholder="Enter loan number" />
                </div>
                <div className="grid gap-2">
                  <Label>Restructuring Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="moratorium">Moratorium Only</SelectItem>
                      <SelectItem value="tenure_extension">Tenure Extension</SelectItem>
                      <SelectItem value="rate_reduction">Interest Rate Reduction</SelectItem>
                      <SelectItem value="principal_haircut">Principal Haircut</SelectItem>
                      <SelectItem value="combination">Combination</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Moratorium Period (Months)</Label>
                    <Input type="number" placeholder="0" />
                  </div>
                  <div className="grid gap-2">
                    <Label>Tenure Extension (Months)</Label>
                    <Input type="number" placeholder="0" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Current Interest Rate (%)</Label>
                    <Input type="number" placeholder="Current rate" disabled />
                  </div>
                  <div className="grid gap-2">
                    <Label>Proposed Interest Rate (%)</Label>
                    <Input type="number" placeholder="New rate" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Principal Haircut Amount</Label>
                  <Input type="number" placeholder="Enter amount (if applicable)" />
                </div>
                <div className="grid gap-2">
                  <Label>Justification</Label>
                  <Textarea placeholder="Provide reason for restructuring..." rows={3} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowNewProposalDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setShowNewProposalDialog(false)}>
                  Submit Proposal
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
                <p className="text-sm text-muted-foreground">Proposed</p>
                <p className="text-2xl font-bold">{proposedCount}</p>
              </div>
              <FileText className="h-8 w-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Under Review</p>
                <p className="text-2xl font-bold text-yellow-600">{underReviewCount}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold text-blue-600">{approvedCount}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Implemented</p>
                <p className="text-2xl font-bold text-green-600">{implementedCount}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total ECL</p>
                <p className="text-2xl font-bold">{formatCurrency(totalECL)}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="proposals" className="space-y-4">
        <TabsList>
          <TabsTrigger value="proposals">Restructuring Proposals</TabsTrigger>
          <TabsTrigger value="provisioning">IFRS 9 Provisioning</TabsTrigger>
          <TabsTrigger value="ecl">ECL Calculator</TabsTrigger>
        </TabsList>

        <TabsContent value="proposals" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by loan number, customer, or restructuring #..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Restructuring Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="moratorium">Moratorium</SelectItem>
                    <SelectItem value="tenure_extension">Tenure Extension</SelectItem>
                    <SelectItem value="rate_reduction">Rate Reduction</SelectItem>
                    <SelectItem value="principal_haircut">Principal Haircut</SelectItem>
                    <SelectItem value="combination">Combination</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="proposed">Proposed</SelectItem>
                    <SelectItem value="under_review">Under Review</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="implemented">Implemented</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
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
              <CardTitle>Restructuring Cases</CardTitle>
              <CardDescription>All loan restructuring proposals and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Restructuring #</TableHead>
                    <TableHead>Loan / Customer</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Outstanding</TableHead>
                    <TableHead>Changes</TableHead>
                    <TableHead>Stage</TableHead>
                    <TableHead className="text-right">ECL</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-8"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loanRestructurings.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-mono">{item.restructuringNumber}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.loanNumber}</p>
                          <p className="text-xs text-muted-foreground">{item.customerName}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {item.restructuringType.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(item.currentOutstanding)}
                      </TableCell>
                      <TableCell>
                        <div className="text-xs space-y-1">
                          {item.moratoriumPeriod > 0 && (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{item.moratoriumPeriod}m moratorium</span>
                            </div>
                          )}
                          {item.revisedTenure !== item.originalTenure && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{item.originalTenure} <ArrowRight className="h-2 w-2 inline" /> {item.revisedTenure}m</span>
                            </div>
                          )}
                          {item.revisedRate !== item.originalRate && (
                            <div className="flex items-center gap-1">
                              <Percent className="h-3 w-3" />
                              <span>{item.originalRate}% <ArrowRight className="h-2 w-2 inline" /> {item.revisedRate}%</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStageColor(item.provisioningStage) as any}>
                          {item.provisioningStage.replace('stage', 'Stage ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-red-600">
                        {formatCurrency(item.eclAmount)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(item.status)}
                          <Badge
                            variant={
                              item.status === "implemented" ? "success" :
                              item.status === "approved" ? "info" :
                              item.status === "under_review" ? "warning" :
                              item.status === "rejected" ? "destructive" : "secondary"
                            }
                          >
                            {item.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewDetail(item)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileText className="mr-2 h-4 w-4" />
                              View Documents
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Calculator className="mr-2 h-4 w-4" />
                              Recalculate ECL
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {item.status === "under_review" && (
                              <>
                                <DropdownMenuItem className="text-green-600">Approve</DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">Reject</DropdownMenuItem>
                              </>
                            )}
                            {item.status === "approved" && (
                              <DropdownMenuItem>Implement Changes</DropdownMenuItem>
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

        <TabsContent value="provisioning" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {provisioningData.map((stage) => (
              <Card key={stage.stage}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center justify-between">
                    {stage.stage}
                    <Badge
                      variant={
                        stage.stage === "Stage 1" ? "success" :
                        stage.stage === "Stage 2" ? "warning" : "destructive"
                      }
                    >
                      {stage.description}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Loans</span>
                    <span className="font-medium">{stage.loans.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Exposure</span>
                    <span className="font-medium">{formatCurrency(stage.exposure)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">ECL</span>
                    <span className="font-medium text-red-600">{formatCurrency(stage.ecl)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Coverage</span>
                    <div className="flex items-center gap-2">
                      <Progress value={stage.coverage} className="w-16 h-2" />
                      <span className="font-medium">{stage.coverage}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>ECL Movement</CardTitle>
              <CardDescription>Expected Credit Loss changes over time</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Period</TableHead>
                    <TableHead className="text-right">Opening ECL</TableHead>
                    <TableHead className="text-right">New Provisions</TableHead>
                    <TableHead className="text-right">Releases</TableHead>
                    <TableHead className="text-right">Write-offs</TableHead>
                    <TableHead className="text-right">Closing ECL</TableHead>
                    <TableHead className="text-right">Movement</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Q4 2023</TableCell>
                    <TableCell className="text-right">{formatCurrency(2800000000)}</TableCell>
                    <TableCell className="text-right text-red-600">+{formatCurrency(450000000)}</TableCell>
                    <TableCell className="text-right text-green-600">-{formatCurrency(180000000)}</TableCell>
                    <TableCell className="text-right">-{formatCurrency(120000000)}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(2950000000)}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="destructive">+5.4%</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Q1 2024 (YTD)</TableCell>
                    <TableCell className="text-right">{formatCurrency(2950000000)}</TableCell>
                    <TableCell className="text-right text-red-600">+{formatCurrency(280000000)}</TableCell>
                    <TableCell className="text-right text-green-600">-{formatCurrency(95000000)}</TableCell>
                    <TableCell className="text-right">-{formatCurrency(10000000)}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(3125000000)}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="warning">+5.9%</Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ecl" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>ECL Calculator</CardTitle>
              <CardDescription>Calculate Expected Credit Loss for individual loans</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label>Loan Number</Label>
                    <Input placeholder="Enter loan number" />
                  </div>
                  <div className="grid gap-2">
                    <Label>Exposure at Default (EAD)</Label>
                    <Input type="number" placeholder="Enter EAD amount" />
                  </div>
                  <div className="grid gap-2">
                    <Label>Probability of Default (PD) %</Label>
                    <Input type="number" placeholder="Enter PD percentage" />
                  </div>
                  <div className="grid gap-2">
                    <Label>Loss Given Default (LGD) %</Label>
                    <Input type="number" placeholder="Enter LGD percentage" />
                  </div>
                  <div className="grid gap-2">
                    <Label>Staging</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select stage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="stage1">Stage 1 - 12 Month ECL</SelectItem>
                        <SelectItem value="stage2">Stage 2 - Lifetime ECL</SelectItem>
                        <SelectItem value="stage3">Stage 3 - Lifetime ECL (Credit Impaired)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full">
                    <Calculator className="mr-2 h-4 w-4" />
                    Calculate ECL
                  </Button>
                </div>

                <div className="space-y-4">
                  <Card className="bg-muted">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Calculation Result</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center py-4">
                        <p className="text-sm text-muted-foreground">Expected Credit Loss</p>
                        <p className="text-4xl font-bold text-red-600">{formatCurrency(0)}</p>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Formula</span>
                          <span className="font-mono">EAD × PD × LGD</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">EAD</span>
                          <span>-</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">PD</span>
                          <span>-</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">LGD</span>
                          <span>-</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Discount Factor</span>
                          <span>-</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Restructuring Details</DialogTitle>
            <DialogDescription>
              {selectedRestructuring?.restructuringNumber}
            </DialogDescription>
          </DialogHeader>
          {selectedRestructuring && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Loan Number</p>
                  <p className="font-mono font-medium">{selectedRestructuring.loanNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Customer</p>
                  <p className="font-medium">{selectedRestructuring.customerName}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-muted">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Original Terms</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Principal</span>
                      <span>{formatCurrency(selectedRestructuring.originalPrincipal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tenure</span>
                      <span>{selectedRestructuring.originalTenure} months</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Interest Rate</span>
                      <span>{selectedRestructuring.originalRate}%</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-primary/5 border-primary/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Revised Terms</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Amount</span>
                      <span>{formatCurrency(selectedRestructuring.restructuredAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tenure</span>
                      <span>{selectedRestructuring.revisedTenure} months</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Interest Rate</span>
                      <span>{selectedRestructuring.revisedRate}%</span>
                    </div>
                    {selectedRestructuring.moratoriumPeriod > 0 && (
                      <div className="flex justify-between">
                        <span>Moratorium</span>
                        <span>{selectedRestructuring.moratoriumPeriod} months</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Stage</p>
                  <Badge variant={getStageColor(selectedRestructuring.provisioningStage) as any} className="mt-1">
                    {selectedRestructuring.provisioningStage.replace('stage', 'Stage ')}
                  </Badge>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">ECL Amount</p>
                  <p className="text-lg font-bold text-red-600">{formatCurrency(selectedRestructuring.eclAmount)}</p>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge
                    variant={
                      selectedRestructuring.status === "implemented" ? "success" :
                      selectedRestructuring.status === "approved" ? "info" :
                      selectedRestructuring.status === "under_review" ? "warning" : "secondary"
                    }
                    className="mt-1"
                  >
                    {selectedRestructuring.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>

              {selectedRestructuring.remarks && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Remarks</p>
                  <p className="p-3 bg-muted rounded-lg text-sm">{selectedRestructuring.remarks}</p>
                </div>
              )}

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Proposed Date</p>
                  <p>{formatDate(selectedRestructuring.proposedDate)}</p>
                </div>
                {selectedRestructuring.approvedDate && (
                  <div>
                    <p className="text-muted-foreground">Approved Date</p>
                    <p>{formatDate(selectedRestructuring.approvedDate)}</p>
                  </div>
                )}
                {selectedRestructuring.implementedDate && (
                  <div>
                    <p className="text-muted-foreground">Implemented Date</p>
                    <p>{formatDate(selectedRestructuring.implementedDate)}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailDialog(false)}>
              Close
            </Button>
            {selectedRestructuring?.status === "under_review" && (
              <>
                <Button variant="destructive">Reject</Button>
                <Button>Approve</Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
