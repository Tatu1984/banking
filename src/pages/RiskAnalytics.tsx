import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Download,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  Shield,
  BarChart3,
  PieChart,
  Activity,
  Target,
  MoreVertical,
  Play,
  Eye,
  FileText,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useState } from "react";
import { riskMetrics, stressTestResults } from "@/data/mockData";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

const varTrendData = [
  { date: "Jan 22", var1d: 2100, var10d: 6500 },
  { date: "Jan 23", var1d: 2250, var10d: 6800 },
  { date: "Jan 24", var1d: 2180, var10d: 6600 },
  { date: "Jan 25", var1d: 2400, var10d: 7200 },
  { date: "Jan 26", var1d: 2350, var10d: 7100 },
  { date: "Jan 27", var1d: 2480, var10d: 7400 },
  { date: "Jan 28", var1d: 2500, var10d: 7500 },
];

const creditPortfolioData = [
  { rating: "AAA", exposure: 15000, ecl: 15 },
  { rating: "AA", exposure: 25000, ecl: 125 },
  { rating: "A", exposure: 35000, ecl: 350 },
  { rating: "BBB", exposure: 28000, ecl: 560 },
  { rating: "BB", exposure: 18000, ecl: 720 },
  { rating: "B", exposure: 8000, ecl: 640 },
  { rating: "CCC", exposure: 3000, ecl: 600 },
  { rating: "Default", exposure: 2000, ecl: 1800 },
];

const operationalRiskData = [
  { category: "Internal Fraud", incidents: 3, losses: 150000 },
  { category: "External Fraud", incidents: 12, losses: 450000 },
  { category: "Employment Practices", incidents: 2, losses: 50000 },
  { category: "Clients/Products", incidents: 8, losses: 280000 },
  { category: "Physical Assets", incidents: 1, losses: 25000 },
  { category: "Business Disruption", incidents: 4, losses: 180000 },
  { category: "Process Management", incidents: 15, losses: 320000 },
];

const riskRadarData = [
  { subject: 'Credit Risk', A: 75, fullMark: 100 },
  { subject: 'Market Risk', A: 60, fullMark: 100 },
  { subject: 'Liquidity Risk', A: 85, fullMark: 100 },
  { subject: 'Operational Risk', A: 70, fullMark: 100 },
  { subject: 'Compliance Risk', A: 90, fullMark: 100 },
  { subject: 'Reputational Risk', A: 80, fullMark: 100 },
];

export function RiskAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState("1m");

  const formatLargeNumber = (num: number) => {
    if (num >= 10000000) {
      return `₹${(num / 10000000).toFixed(2)} Cr`;
    } else if (num >= 100000) {
      return `₹${(num / 100000).toFixed(2)} L`;
    }
    return formatCurrency(num);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <TrendingUp className="h-4 w-4 text-red-500" />;
      case "down": return <TrendingDown className="h-4 w-4 text-green-500" />;
      default: return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "green": return <Badge variant="success">Normal</Badge>;
      case "amber": return <Badge variant="warning">Warning</Badge>;
      case "red": return <Badge variant="destructive">Breach</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const marketRiskMetrics = riskMetrics.filter(m => m.category === "market");
  const creditRiskMetrics = riskMetrics.filter(m => m.category === "credit");
  const liquidityRiskMetrics = riskMetrics.filter(m => m.category === "liquidity");
  const operationalRiskMetrics = riskMetrics.filter(m => m.category === "operational");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Risk Analytics</h1>
          <p className="text-muted-foreground">
            Enterprise risk dashboard with VaR, stress testing, and risk metrics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">1 Day</SelectItem>
              <SelectItem value="1w">1 Week</SelectItem>
              <SelectItem value="1m">1 Month</SelectItem>
              <SelectItem value="3m">3 Months</SelectItem>
              <SelectItem value="1y">1 Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <Play className="mr-2 h-4 w-4" />
            Run Stress Test
          </Button>
        </div>
      </div>

      {/* Risk Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">1-Day VaR (99%)</p>
                <p className="text-2xl font-bold">{formatLargeNumber(2500000000)}</p>
                <div className="flex items-center gap-1 text-sm">
                  <TrendingUp className="h-3 w-3 text-red-500" />
                  <span className="text-red-500">+2.5%</span>
                </div>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Expected Credit Loss</p>
                <p className="text-2xl font-bold">{formatLargeNumber(12500000000)}</p>
                <div className="flex items-center gap-1 text-sm">
                  <TrendingUp className="h-3 w-3 text-red-500" />
                  <span className="text-red-500">+1.8%</span>
                </div>
              </div>
              <Shield className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Capital Adequacy</p>
                <p className="text-2xl font-bold text-green-600">15.67%</p>
                <div className="flex items-center gap-1 text-sm">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-green-500">Above 11.5% min</span>
                </div>
              </div>
              <Target className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Op Risk Events (MTD)</p>
                <p className="text-2xl font-bold">45</p>
                <div className="flex items-center gap-1 text-sm">
                  <TrendingDown className="h-3 w-3 text-green-500" />
                  <span className="text-green-500">-12% vs last month</span>
                </div>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Radar */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Risk Profile</CardTitle>
            <CardDescription>Overall risk health score by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={riskRadarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" fontSize={11} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar name="Risk Score" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>VaR Trend</CardTitle>
            <CardDescription>Value at Risk over time (₹ Cr)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={varTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip formatter={(value) => [`₹${value} Cr`, '']} />
                  <Legend />
                  <Line type="monotone" dataKey="var1d" name="1-Day VaR" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="var10d" name="10-Day VaR" stroke="#ef4444" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="market" className="space-y-4">
        <TabsList>
          <TabsTrigger value="market">Market Risk</TabsTrigger>
          <TabsTrigger value="credit">Credit Risk</TabsTrigger>
          <TabsTrigger value="liquidity">Liquidity Risk</TabsTrigger>
          <TabsTrigger value="operational">Operational Risk</TabsTrigger>
          <TabsTrigger value="stress">Stress Testing</TabsTrigger>
        </TabsList>

        <TabsContent value="market" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Market Risk Metrics</CardTitle>
              <CardDescription>Key market risk indicators and limits</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Metric</TableHead>
                    <TableHead className="text-right">Current Value</TableHead>
                    <TableHead className="text-right">Threshold</TableHead>
                    <TableHead className="text-right">Limit</TableHead>
                    <TableHead className="text-center">Utilization</TableHead>
                    <TableHead>Trend</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {marketRiskMetrics.map((metric) => (
                    <TableRow key={metric.id}>
                      <TableCell className="font-medium">{metric.metricName}</TableCell>
                      <TableCell className="text-right font-mono">
                        {formatLargeNumber(metric.currentValue)}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {formatLargeNumber(metric.threshold)}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {formatLargeNumber(metric.limit)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress
                            value={(metric.currentValue / metric.limit) * 100}
                            className="w-20 h-2"
                          />
                          <span className="text-sm">
                            {((metric.currentValue / metric.limit) * 100).toFixed(0)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{getTrendIcon(metric.trend)}</TableCell>
                      <TableCell>{getStatusBadge(metric.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="credit" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Credit Portfolio by Rating</CardTitle>
                <CardDescription>Exposure and ECL by credit rating (₹ Cr)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={creditPortfolioData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="rating" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="exposure" name="Exposure (Cr)" fill="#3b82f6" />
                      <Bar dataKey="ecl" name="ECL (Cr)" fill="#ef4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Credit Risk Metrics</CardTitle>
                <CardDescription>Key credit risk indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Metric</TableHead>
                      <TableHead className="text-right">Value</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {creditRiskMetrics.map((metric) => (
                      <TableRow key={metric.id}>
                        <TableCell className="font-medium">{metric.metricName}</TableCell>
                        <TableCell className="text-right font-mono">
                          {formatLargeNumber(metric.currentValue)}
                        </TableCell>
                        <TableCell>{getStatusBadge(metric.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>IFRS 9 Staging</CardTitle>
              <CardDescription>Expected Credit Loss by staging category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Stage 1 (Performing)</p>
                  <p className="text-2xl font-bold text-green-700">{formatLargeNumber(85000000000)}</p>
                  <p className="text-sm text-green-600">ECL: {formatLargeNumber(425000000)}</p>
                  <Progress value={85} className="mt-2" />
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Stage 2 (Under-performing)</p>
                  <p className="text-2xl font-bold text-yellow-700">{formatLargeNumber(12000000000)}</p>
                  <p className="text-sm text-yellow-600">ECL: {formatLargeNumber(1200000000)}</p>
                  <Progress value={12} className="mt-2" />
                </div>
                <div className="p-4 bg-red-50 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Stage 3 (Non-performing)</p>
                  <p className="text-2xl font-bold text-red-700">{formatLargeNumber(3000000000)}</p>
                  <p className="text-sm text-red-600">ECL: {formatLargeNumber(1500000000)}</p>
                  <Progress value={3} className="mt-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="liquidity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Liquidity Risk Metrics</CardTitle>
              <CardDescription>Regulatory liquidity ratios and indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Metric</TableHead>
                    <TableHead className="text-right">Current</TableHead>
                    <TableHead className="text-right">Regulatory Min</TableHead>
                    <TableHead className="text-center">Buffer</TableHead>
                    <TableHead>Trend</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {liquidityRiskMetrics.map((metric) => (
                    <TableRow key={metric.id}>
                      <TableCell className="font-medium">{metric.metricName}</TableCell>
                      <TableCell className="text-right font-mono text-lg">
                        {metric.currentValue.toFixed(1)}%
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {metric.limit}%
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="success">
                          +{(metric.currentValue - metric.limit).toFixed(1)}%
                        </Badge>
                      </TableCell>
                      <TableCell>{getTrendIcon(metric.trend)}</TableCell>
                      <TableCell>{getStatusBadge(metric.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operational" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Operational Loss Events</CardTitle>
                <CardDescription>Loss events by Basel category</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Incidents</TableHead>
                      <TableHead className="text-right">Losses</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {operationalRiskData.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.category}</TableCell>
                        <TableCell className="text-right">{item.incidents}</TableCell>
                        <TableCell className="text-right text-red-600">
                          {formatCurrency(item.losses)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Risk Indicators</CardTitle>
                <CardDescription>Operational risk KRIs and thresholds</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Metric</TableHead>
                      <TableHead className="text-right">Current</TableHead>
                      <TableHead className="text-right">Threshold</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {operationalRiskMetrics.map((metric) => (
                      <TableRow key={metric.id}>
                        <TableCell className="font-medium">{metric.metricName}</TableCell>
                        <TableCell className="text-right">{metric.currentValue}</TableCell>
                        <TableCell className="text-right text-muted-foreground">{metric.threshold}</TableCell>
                        <TableCell>{getStatusBadge(metric.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="stress" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Stress Test Results</CardTitle>
                  <CardDescription>Impact analysis under various stress scenarios</CardDescription>
                </div>
                <Button>
                  <Play className="mr-2 h-4 w-4" />
                  Run New Scenario
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Scenario</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Capital Impact</TableHead>
                    <TableHead className="text-right">NII Impact</TableHead>
                    <TableHead className="text-right">NPA Impact</TableHead>
                    <TableHead className="text-right">CAR Post-Stress</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead>Last Run</TableHead>
                    <TableHead className="w-8"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stressTestResults.map((test) => (
                    <TableRow key={test.id}>
                      <TableCell className="font-medium">{test.scenarioName}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {test.scenarioType}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-red-600">
                        {formatLargeNumber(test.impactOnCapital)}
                      </TableCell>
                      <TableCell className={`text-right ${test.impactOnNII >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {test.impactOnNII >= 0 ? '+' : ''}{formatLargeNumber(test.impactOnNII)}
                      </TableCell>
                      <TableCell className="text-right text-red-600">
                        +{test.impactOnNPA.toFixed(1)}%
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {test.carPostStress.toFixed(1)}%
                      </TableCell>
                      <TableCell>
                        {test.status === "pass" ? (
                          <Badge variant="success">
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                            Pass
                          </Badge>
                        ) : test.status === "warning" ? (
                          <Badge variant="warning">
                            <AlertCircle className="mr-1 h-3 w-3" />
                            Warning
                          </Badge>
                        ) : (
                          <Badge variant="destructive">
                            <AlertTriangle className="mr-1 h-3 w-3" />
                            Fail
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {test.lastRunDate}
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
                              <Play className="mr-2 h-4 w-4" />
                              Re-run Scenario
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileText className="mr-2 h-4 w-4" />
                              Download Report
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
      </Tabs>
    </div>
  );
}
