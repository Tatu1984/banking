import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BarChart3,
  Download,
  FileText,
  MoreVertical,
  Clock,
  Calendar,
  TrendingUp,
  Users,
  Wallet,
  Shield,
  Building,
  Play,
  Eye,
} from "lucide-react";

const reportCategories = [
  {
    title: "Customer Reports",
    icon: Users,
    reports: [
      { name: "Customer Acquisition Report", frequency: "Daily", lastRun: "2024-01-28 10:00" },
      { name: "KYC Status Report", frequency: "Weekly", lastRun: "2024-01-27 00:00" },
      { name: "Customer Segmentation Analysis", frequency: "Monthly", lastRun: "2024-01-01 00:00" },
      { name: "Dormant Account Report", frequency: "Daily", lastRun: "2024-01-28 06:00" },
    ]
  },
  {
    title: "Financial Reports",
    icon: TrendingUp,
    reports: [
      { name: "Daily Balance Sheet", frequency: "Daily", lastRun: "2024-01-28 23:30" },
      { name: "Profit & Loss Statement", frequency: "Monthly", lastRun: "2024-01-01 00:00" },
      { name: "Interest Accrual Report", frequency: "Daily", lastRun: "2024-01-28 18:00" },
      { name: "Fee Income Analysis", frequency: "Weekly", lastRun: "2024-01-27 00:00" },
    ]
  },
  {
    title: "Transaction Reports",
    icon: Wallet,
    reports: [
      { name: "Transaction Summary", frequency: "Daily", lastRun: "2024-01-28 23:59" },
      { name: "Large Transaction Report", frequency: "Real-time", lastRun: "2024-01-28 14:30" },
      { name: "Failed Transaction Analysis", frequency: "Daily", lastRun: "2024-01-28 06:00" },
      { name: "Channel-wise Transaction Report", frequency: "Weekly", lastRun: "2024-01-27 00:00" },
    ]
  },
  {
    title: "Risk & Compliance Reports",
    icon: Shield,
    reports: [
      { name: "AML Suspicious Activity Report", frequency: "Daily", lastRun: "2024-01-28 08:00" },
      { name: "Regulatory Compliance Report", frequency: "Monthly", lastRun: "2024-01-01 00:00" },
      { name: "NPA Movement Report", frequency: "Weekly", lastRun: "2024-01-27 00:00" },
      { name: "Credit Risk Dashboard", frequency: "Daily", lastRun: "2024-01-28 10:00" },
    ]
  },
  {
    title: "Regulatory Reports",
    icon: Building,
    reports: [
      { name: "RBI Returns", frequency: "Monthly", lastRun: "2024-01-01 00:00" },
      { name: "FATCA/CRS Report", frequency: "Annual", lastRun: "2024-01-15 00:00" },
      { name: "Capital Adequacy Report", frequency: "Quarterly", lastRun: "2024-01-01 00:00" },
      { name: "Liquidity Coverage Ratio", frequency: "Daily", lastRun: "2024-01-28 18:00" },
    ]
  },
];

export function Reports() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">
            Generate and download reports across all banking operations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Report
          </Button>
          <Button>
            <FileText className="mr-2 h-4 w-4" />
            Custom Report
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Reports</p>
                <p className="text-2xl font-bold">48</p>
              </div>
              <BarChart3 className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Scheduled</p>
                <p className="text-2xl font-bold">32</p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Generated Today</p>
                <p className="text-2xl font-bold">15</p>
              </div>
              <FileText className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reportCategories.map((category) => (
          <Card key={category.title}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <category.icon className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">{category.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {category.reports.map((report) => (
                  <div
                    key={report.name}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{report.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {report.frequency}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Last: {report.lastRun}
                        </span>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Play className="mr-2 h-4 w-4" />
                          Run Now
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Last Report
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Calendar className="mr-2 h-4 w-4" />
                          Schedule
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
