import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  TrendingUp,
  TrendingDown,
  Minus,
  DollarSign,
  BarChart3,
  PieChart,
  ArrowUpDown,
  Building2,
  Wallet,
  LineChart,
  AlertTriangle,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useState } from "react";
import { treasuryPositions, almBuckets } from "@/data/mockData";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  AreaChart,
  Area,
} from "recharts";

const liquidityMetrics = {
  lcr: 128.5,
  nsfr: 115.2,
  hqlaTotal: 850000000000,
  hqlaLevel1: 650000000000,
  hqlaLevel2a: 150000000000,
  hqlaLevel2b: 50000000000,
  netCashOutflows: 660000000000,
  availableFunding: 920000000000,
  requiredFunding: 800000000000,
};

const interestRateRisk = {
  niiImpact100bps: 8500000000,
  niiImpact200bps: 17200000000,
  niiImpact300bps: 26100000000,
  eveImpact100bps: -15000000000,
  eveImpact200bps: -32000000000,
  eveImpact300bps: -51000000000,
  duration: 2.8,
  modifiedDuration: 2.65,
  convexity: 12.5,
};

const fxExposureSummary = {
  totalLongPosition: 75000000,
  totalShortPosition: 45000000,
  netOpenPosition: 30000000,
  nopLimit: 100000000,
  nopUtilization: 30,
  dailyVaR: 125000000,
  monthlyVaR: 580000000,
};

export function Treasury() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDealDialog, setShowDealDialog] = useState(false);

  const formatLargeNumber = (num: number) => {
    if (num >= 10000000) {
      return `₹${(num / 10000000).toFixed(2)} Cr`;
    } else if (num >= 100000) {
      return `₹${(num / 100000).toFixed(2)} L`;
    }
    return formatCurrency(num);
  };

  const gapChartData = almBuckets.map(bucket => ({
    name: bucket.bucket,
    gap: bucket.gap / 10000000, // Convert to Cr
    cumulative: bucket.cumulativeGap / 10000000,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Treasury & ALM</h1>
          <p className="text-muted-foreground">
            Asset-Liability Management, Liquidity, and FX Position Management
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Dialog open={showDealDialog} onOpenChange={setShowDealDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New FX Deal
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>New FX Deal</DialogTitle>
                <DialogDescription>
                  Enter details for new foreign exchange transaction
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Deal Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select deal type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="spot">Spot</SelectItem>
                      <SelectItem value="forward">Forward</SelectItem>
                      <SelectItem value="swap">Swap</SelectItem>
                      <SelectItem value="option">Option</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Buy Currency</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="usd">USD</SelectItem>
                        <SelectItem value="eur">EUR</SelectItem>
                        <SelectItem value="gbp">GBP</SelectItem>
                        <SelectItem value="jpy">JPY</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Sell Currency</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inr">INR</SelectItem>
                        <SelectItem value="usd">USD</SelectItem>
                        <SelectItem value="eur">EUR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Amount</Label>
                    <Input type="number" placeholder="Enter amount" />
                  </div>
                  <div className="grid gap-2">
                    <Label>Rate</Label>
                    <Input type="number" placeholder="Exchange rate" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Value Date</Label>
                  <Input type="date" />
                </div>
                <div className="grid gap-2">
                  <Label>Counterparty</Label>
                  <Input placeholder="Bank/Institution name" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowDealDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setShowDealDialog(false)}>
                  Submit Deal
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">LCR</p>
                <p className="text-2xl font-bold text-green-600">{liquidityMetrics.lcr}%</p>
                <p className="text-xs text-muted-foreground">Min Required: 100%</p>
              </div>
              <BarChart3 className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">NSFR</p>
                <p className="text-2xl font-bold text-green-600">{liquidityMetrics.nsfr}%</p>
                <p className="text-xs text-muted-foreground">Min Required: 100%</p>
              </div>
              <PieChart className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Net Open Position</p>
                <p className="text-2xl font-bold">${(fxExposureSummary.netOpenPosition / 1000000).toFixed(1)}M</p>
                <p className="text-xs text-muted-foreground">{fxExposureSummary.nopUtilization}% of limit</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Duration Gap</p>
                <p className="text-2xl font-bold">{interestRateRisk.duration} Years</p>
                <p className="text-xs text-muted-foreground">Modified: {interestRateRisk.modifiedDuration}</p>
              </div>
              <LineChart className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="alm" className="space-y-4">
        <TabsList>
          <TabsTrigger value="alm">ALM Gap Analysis</TabsTrigger>
          <TabsTrigger value="liquidity">Liquidity</TabsTrigger>
          <TabsTrigger value="fx">FX Positions</TabsTrigger>
          <TabsTrigger value="irr">Interest Rate Risk</TabsTrigger>
        </TabsList>

        <TabsContent value="alm" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Maturity Gap Analysis</CardTitle>
                <CardDescription>Asset-Liability gap by time buckets (₹ Cr)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={gapChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" fontSize={10} angle={-45} textAnchor="end" height={80} />
                      <YAxis fontSize={12} />
                      <Tooltip formatter={(value) => [`₹${Number(value).toFixed(0)} Cr`, '']} />
                      <ReferenceLine y={0} stroke="#000" />
                      <Bar dataKey="gap" fill="#3b82f6" name="Gap" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cumulative Gap</CardTitle>
                <CardDescription>Running total of gaps across buckets (₹ Cr)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={gapChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" fontSize={10} angle={-45} textAnchor="end" height={80} />
                      <YAxis fontSize={12} />
                      <Tooltip formatter={(value) => [`₹${Number(value).toFixed(0)} Cr`, '']} />
                      <ReferenceLine y={0} stroke="#000" />
                      <Area type="monotone" dataKey="cumulative" stroke="#10b981" fill="#10b98133" name="Cumulative Gap" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>ALM Statement</CardTitle>
              <CardDescription>Detailed maturity profile of assets and liabilities</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time Bucket</TableHead>
                    <TableHead className="text-right">Assets (₹ Cr)</TableHead>
                    <TableHead className="text-right">Liabilities (₹ Cr)</TableHead>
                    <TableHead className="text-right">Gap (₹ Cr)</TableHead>
                    <TableHead className="text-right">Cumulative Gap</TableHead>
                    <TableHead className="text-right">Gap Ratio (%)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {almBuckets.map((bucket) => (
                    <TableRow key={bucket.id}>
                      <TableCell className="font-medium">{bucket.bucket}</TableCell>
                      <TableCell className="text-right">{(bucket.assets / 10000000).toLocaleString()}</TableCell>
                      <TableCell className="text-right">{(bucket.liabilities / 10000000).toLocaleString()}</TableCell>
                      <TableCell className={`text-right font-medium ${bucket.gap >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {bucket.gap >= 0 ? '+' : ''}{(bucket.gap / 10000000).toLocaleString()}
                      </TableCell>
                      <TableCell className={`text-right ${bucket.cumulativeGap >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {bucket.cumulativeGap >= 0 ? '+' : ''}{(bucket.cumulativeGap / 10000000).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant={Math.abs(bucket.gapRatio) > 15 ? "destructive" : bucket.gapRatio >= 0 ? "success" : "warning"}>
                          {bucket.gapRatio >= 0 ? '+' : ''}{bucket.gapRatio.toFixed(1)}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="liquidity" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">HQLA Composition</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Level 1 Assets</span>
                    <span className="font-medium">{formatLargeNumber(liquidityMetrics.hqlaLevel1)}</span>
                  </div>
                  <Progress value={76.5} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Level 2A Assets</span>
                    <span className="font-medium">{formatLargeNumber(liquidityMetrics.hqlaLevel2a)}</span>
                  </div>
                  <Progress value={17.6} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Level 2B Assets</span>
                    <span className="font-medium">{formatLargeNumber(liquidityMetrics.hqlaLevel2b)}</span>
                  </div>
                  <Progress value={5.9} className="h-2" />
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between">
                    <span className="font-medium">Total HQLA</span>
                    <span className="font-bold">{formatLargeNumber(liquidityMetrics.hqlaTotal)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">LCR Components</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Stock of HQLA</span>
                  <span className="font-medium">{formatLargeNumber(liquidityMetrics.hqlaTotal)}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Total Net Cash Outflows</span>
                  <span className="font-medium">{formatLargeNumber(liquidityMetrics.netCashOutflows)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="font-medium">LCR Ratio</span>
                  <span className="text-2xl font-bold text-green-600">{liquidityMetrics.lcr}%</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-700">Above regulatory minimum of 100%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">NSFR Components</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Available Stable Funding</span>
                  <span className="font-medium">{formatLargeNumber(liquidityMetrics.availableFunding)}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Required Stable Funding</span>
                  <span className="font-medium">{formatLargeNumber(liquidityMetrics.requiredFunding)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="font-medium">NSFR Ratio</span>
                  <span className="text-2xl font-bold text-green-600">{liquidityMetrics.nsfr}%</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-700">Above regulatory minimum of 100%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="fx" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Long Position</p>
                  <p className="text-2xl font-bold text-green-600">${(fxExposureSummary.totalLongPosition / 1000000).toFixed(1)}M</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Short Position</p>
                  <p className="text-2xl font-bold text-red-600">${(fxExposureSummary.totalShortPosition / 1000000).toFixed(1)}M</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">NOP Utilization</p>
                  <p className="text-2xl font-bold">{fxExposureSummary.nopUtilization}%</p>
                  <Progress value={fxExposureSummary.nopUtilization} className="mt-2" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Daily VaR</p>
                  <p className="text-2xl font-bold">{formatCurrency(fxExposureSummary.dailyVaR)}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Currency Position Summary</CardTitle>
              <CardDescription>Nostro/Vostro balances and FX exposure by currency</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Currency</TableHead>
                    <TableHead className="text-right">Nostro Balance</TableHead>
                    <TableHead className="text-right">Vostro Balance</TableHead>
                    <TableHead className="text-right">Net Position</TableHead>
                    <TableHead className="text-right">Spot Rate</TableHead>
                    <TableHead className="text-right">MTM Value (INR)</TableHead>
                    <TableHead className="text-right">Limit Utilization</TableHead>
                    <TableHead className="w-8"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {treasuryPositions.map((pos) => (
                    <TableRow key={pos.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{pos.currency}</Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {pos.nostroBalance.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {pos.vostroBalance.toLocaleString()}
                      </TableCell>
                      <TableCell className={`text-right font-mono font-medium ${pos.netPosition >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {pos.netPosition >= 0 ? '+' : ''}{pos.netPosition.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">{pos.spotRate.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(pos.mtmValue)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <Progress value={pos.utilization} className="w-16 h-2" />
                          <span className="text-sm">{pos.utilization.toFixed(1)}%</span>
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
                            <DropdownMenuItem>View Transactions</DropdownMenuItem>
                            <DropdownMenuItem>Nostro Statement</DropdownMenuItem>
                            <DropdownMenuItem>Reconciliation</DropdownMenuItem>
                            <DropdownMenuItem>Position History</DropdownMenuItem>
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

        <TabsContent value="irr" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>NII Sensitivity</CardTitle>
                <CardDescription>Impact on Net Interest Income from rate changes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">+100 bps Shock</p>
                      <p className="text-xl font-bold text-green-600">+{formatLargeNumber(interestRateRisk.niiImpact100bps)}</p>
                    </div>
                    <TrendingUp className="h-6 w-6 text-green-500" />
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">+200 bps Shock</p>
                      <p className="text-xl font-bold text-green-600">+{formatLargeNumber(interestRateRisk.niiImpact200bps)}</p>
                    </div>
                    <TrendingUp className="h-6 w-6 text-green-500" />
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">+300 bps Shock</p>
                      <p className="text-xl font-bold text-green-600">+{formatLargeNumber(interestRateRisk.niiImpact300bps)}</p>
                    </div>
                    <TrendingUp className="h-6 w-6 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>EVE Sensitivity</CardTitle>
                <CardDescription>Impact on Economic Value of Equity from rate changes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">+100 bps Shock</p>
                      <p className="text-xl font-bold text-red-600">{formatLargeNumber(interestRateRisk.eveImpact100bps)}</p>
                    </div>
                    <TrendingDown className="h-6 w-6 text-red-500" />
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">+200 bps Shock</p>
                      <p className="text-xl font-bold text-red-600">{formatLargeNumber(interestRateRisk.eveImpact200bps)}</p>
                    </div>
                    <TrendingDown className="h-6 w-6 text-red-500" />
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">+300 bps Shock</p>
                      <p className="text-xl font-bold text-red-600">{formatLargeNumber(interestRateRisk.eveImpact300bps)}</p>
                    </div>
                    <TrendingDown className="h-6 w-6 text-red-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Duration Metrics</CardTitle>
              <CardDescription>Portfolio duration and convexity analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Macaulay Duration</p>
                  <p className="text-3xl font-bold">{interestRateRisk.duration}</p>
                  <p className="text-sm text-muted-foreground">Years</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Modified Duration</p>
                  <p className="text-3xl font-bold">{interestRateRisk.modifiedDuration}</p>
                  <p className="text-sm text-muted-foreground">Years</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Convexity</p>
                  <p className="text-3xl font-bold">{interestRateRisk.convexity}</p>
                  <p className="text-sm text-muted-foreground">Years²</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
