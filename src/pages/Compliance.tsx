import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Shield,
  CheckCircle,
  AlertTriangle,
  FileText,
  Calendar,
  Download,
  Eye,
  Clock,
} from "lucide-react";

const complianceItems = [
  { name: "RBI Annual Returns", status: "compliant", dueDate: "2024-03-31", progress: 100 },
  { name: "KYC Compliance", status: "attention", dueDate: "2024-02-15", progress: 85 },
  { name: "AML Policy Review", status: "compliant", dueDate: "2024-06-30", progress: 100 },
  { name: "FATCA Reporting", status: "pending", dueDate: "2024-01-31", progress: 60 },
  { name: "Capital Adequacy", status: "compliant", dueDate: "2024-03-31", progress: 100 },
  { name: "Liquidity Ratio", status: "compliant", dueDate: "2024-01-31", progress: 100 },
];

const regulatoryReports = [
  { name: "RBI Form A", frequency: "Monthly", lastSubmitted: "2024-01-15", status: "submitted" },
  { name: "CRILC Report", frequency: "Monthly", lastSubmitted: "2024-01-10", status: "submitted" },
  { name: "ALM Returns", frequency: "Quarterly", lastSubmitted: "2024-01-05", status: "submitted" },
  { name: "Basel III Returns", frequency: "Quarterly", lastSubmitted: "2024-01-01", status: "submitted" },
  { name: "STR/CTR Report", frequency: "As Required", lastSubmitted: "2024-01-25", status: "submitted" },
];

export function Compliance() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Compliance</h1>
          <p className="text-muted-foreground">
            Monitor regulatory compliance and reporting status
          </p>
        </div>
        <Button>
          <FileText className="mr-2 h-4 w-4" />
          Generate Report
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overall Score</p>
                <p className="text-2xl font-bold text-green-600">94%</p>
              </div>
              <Shield className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Compliant</p>
                <p className="text-2xl font-bold text-green-600">
                  {complianceItems.filter((c) => c.status === "compliant").length}
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
                <p className="text-sm text-muted-foreground">Needs Attention</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {complianceItems.filter((c) => c.status === "attention").length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-orange-600">
                  {complianceItems.filter((c) => c.status === "pending").length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Compliance Status</CardTitle>
            <CardDescription>
              Current status of compliance requirements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {complianceItems.map((item) => (
                <div key={item.name} className="p-4 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {item.status === "compliant" ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : item.status === "attention" ? (
                        <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      ) : (
                        <Clock className="h-5 w-5 text-orange-500" />
                      )}
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <Badge
                      variant={
                        item.status === "compliant" ? "success" :
                        item.status === "attention" ? "warning" : "secondary"
                      }
                    >
                      {item.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                    <span>Due: {item.dueDate}</span>
                    <span>{item.progress}%</span>
                  </div>
                  <Progress value={item.progress} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Regulatory Reports</CardTitle>
            <CardDescription>
              Status of regulatory report submissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {regulatoryReports.map((report) => (
                <div key={report.name} className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <p className="font-medium">{report.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{report.frequency}</Badge>
                      <span className="text-xs text-muted-foreground">
                        Last: {report.lastSubmitted}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="success">{report.status}</Badge>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Deadlines</CardTitle>
          <CardDescription>
            Important compliance deadlines in the next 30 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: "FATCA Reporting", date: "Jan 31, 2024", priority: "high" },
              { name: "Monthly RBI Returns", date: "Feb 5, 2024", priority: "medium" },
              { name: "KYC Renewal Batch", date: "Feb 15, 2024", priority: "high" },
              { name: "Quarterly ALM Report", date: "Feb 28, 2024", priority: "medium" },
            ].map((deadline) => (
              <div key={deadline.name} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{deadline.name}</p>
                    <p className="text-sm text-muted-foreground">{deadline.date}</p>
                  </div>
                </div>
                <Badge variant={deadline.priority === "high" ? "destructive" : "secondary"}>
                  {deadline.priority}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
