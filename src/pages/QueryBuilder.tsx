import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Switch } from "@/components/ui/switch";
import {
  Search,
  MoreVertical,
  Download,
  Play,
  Plus,
  Save,
  Clock,
  FileText,
  Database,
  Code,
  Table as TableIcon,
  Eye,
  Trash2,
  Copy,
  Calendar,
  FileSpreadsheet,
  FileJson,
  Filter,
  Columns,
  RefreshCw,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useState } from "react";
import { savedQueries } from "@/data/mockData";

const dataSources = [
  { id: "customers", name: "Customers", tables: ["customer_master", "customer_kyc", "customer_segments"] },
  { id: "accounts", name: "Accounts", tables: ["accounts", "account_balances", "account_history"] },
  { id: "transactions", name: "Transactions", tables: ["transactions", "transaction_limits", "transaction_logs"] },
  { id: "loans", name: "Loans", tables: ["loans", "loan_applications", "loan_payments", "collaterals"] },
  { id: "cards", name: "Cards", tables: ["cards", "card_transactions", "card_limits"] },
  { id: "payments", name: "Payments", tables: ["payments", "beneficiaries", "payment_rails"] },
];

const sampleResults = [
  { id: 1, cif: "CIF001234567", name: "Rajesh Kumar Sharma", amount: 2547890.50, txn_count: 45, status: "Active" },
  { id: 2, cif: "CIF001234568", name: "Priya Patel", amount: 1234567.00, txn_count: 32, status: "Active" },
  { id: 3, cif: "CIF001234569", name: "TechCorp Solutions Pvt Ltd", amount: 45678901.25, txn_count: 156, status: "Active" },
  { id: 4, cif: "CIF001234570", name: "Amit Singh", amount: 50000.00, txn_count: 3, status: "Pending" },
  { id: 5, cif: "CIF001234571", name: "GlobalTrade Exports", amount: 123456789.00, txn_count: 245, status: "Frozen" },
];

const recentQueries = [
  { id: "1", query: "SELECT * FROM transactions WHERE amount > 1000000", runTime: "2.3s", rows: 1245, time: "10 mins ago" },
  { id: "2", query: "SELECT customer_name, SUM(balance) FROM accounts GROUP BY customer_id", runTime: "1.8s", rows: 856, time: "25 mins ago" },
  { id: "3", query: "SELECT * FROM loans WHERE status = 'npa'", runTime: "0.9s", rows: 45, time: "1 hour ago" },
];

export function QueryBuilder() {
  const [query, setQuery] = useState("SELECT \n  c.cif,\n  c.name,\n  SUM(a.balance) as total_balance,\n  COUNT(t.id) as txn_count\nFROM customers c\nJOIN accounts a ON c.id = a.customer_id\nJOIN transactions t ON a.id = t.account_id\nWHERE t.date >= '2024-01-01'\nGROUP BY c.cif, c.name\nORDER BY total_balance DESC\nLIMIT 100;");
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [selectedDataSource, setSelectedDataSource] = useState("");
  const [showResults, setShowResults] = useState(true);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Query Builder</h1>
          <p className="text-muted-foreground">
            Ad-hoc analytics queries and custom report generation
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Schedule Query</DialogTitle>
                <DialogDescription>
                  Set up automated query execution
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Query Name</Label>
                  <Input placeholder="Enter query name" />
                </div>
                <div className="grid gap-2">
                  <Label>Frequency</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Run Time</Label>
                  <Input type="time" defaultValue="06:00" />
                </div>
                <div className="grid gap-2">
                  <Label>Output Format</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Email Recipients</Label>
                  <Input placeholder="Enter email addresses (comma separated)" />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="enabled" defaultChecked />
                  <Label htmlFor="enabled">Enable Schedule</Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowScheduleDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setShowScheduleDialog(false)}>
                  Save Schedule
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Save className="mr-2 h-4 w-4" />
                Save Query
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Save Query</DialogTitle>
                <DialogDescription>
                  Save this query for future use
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Query Name</Label>
                  <Input placeholder="Enter a name for this query" />
                </div>
                <div className="grid gap-2">
                  <Label>Description</Label>
                  <Textarea placeholder="Describe what this query does..." rows={2} />
                </div>
                <div className="grid gap-2">
                  <Label>Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="customer">Customer</SelectItem>
                      <SelectItem value="transaction">Transaction</SelectItem>
                      <SelectItem value="loan">Loan</SelectItem>
                      <SelectItem value="risk">Risk</SelectItem>
                      <SelectItem value="compliance">Compliance</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Default Output Format</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setShowSaveDialog(false)}>
                  Save
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button>
            <Play className="mr-2 h-4 w-4" />
            Run Query
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {/* Data Sources Panel */}
        <Card className="md:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Data Sources</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {dataSources.map((source) => (
              <div key={source.id} className="space-y-1">
                <button
                  className={`w-full flex items-center gap-2 p-2 rounded-md text-left hover:bg-muted ${selectedDataSource === source.id ? 'bg-muted' : ''}`}
                  onClick={() => setSelectedDataSource(selectedDataSource === source.id ? "" : source.id)}
                >
                  <Database className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{source.name}</span>
                </button>
                {selectedDataSource === source.id && (
                  <div className="ml-6 space-y-1">
                    {source.tables.map((table) => (
                      <button
                        key={table}
                        className="w-full flex items-center gap-2 p-1.5 rounded text-left text-sm text-muted-foreground hover:text-foreground hover:bg-muted"
                        onClick={() => setQuery(prev => prev + `\n-- ${table}`)}
                      >
                        <TableIcon className="h-3 w-3" />
                        {table}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Query Editor */}
        <Card className="md:col-span-3">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Code className="h-4 w-4" />
                SQL Editor
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setQuery("")}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              className="font-mono text-sm min-h-[200px]"
              placeholder="Enter your SQL query here..."
              value={query}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setQuery(e.target.value)}
            />
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Rows: 5</span>
                <span>Execution time: 1.2s</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Add Filter
                </Button>
                <Button variant="outline" size="sm">
                  <Columns className="mr-2 h-4 w-4" />
                  Select Columns
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {showResults && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Query Results</CardTitle>
                <CardDescription>5 rows returned in 1.2 seconds</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Excel
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  CSV
                </Button>
                <Button variant="outline" size="sm">
                  <FileJson className="mr-2 h-4 w-4" />
                  JSON
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>CIF</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-right">Total Balance</TableHead>
                  <TableHead className="text-right">Transaction Count</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sampleResults.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-mono">{row.cif}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell className="text-right font-mono">
                      ₹{row.amount.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">{row.txn_count}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          row.status === "Active" ? "success" :
                          row.status === "Frozen" ? "destructive" : "warning"
                        }
                      >
                        {row.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="saved" className="space-y-4">
        <TabsList>
          <TabsTrigger value="saved">Saved Queries</TabsTrigger>
          <TabsTrigger value="recent">Recent Queries</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
        </TabsList>

        <TabsContent value="saved" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Saved Queries</CardTitle>
                  <CardDescription>Your saved queries for quick access</CardDescription>
                </div>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search queries..." className="pl-10" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Query Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Created By</TableHead>
                    <TableHead>Last Run</TableHead>
                    <TableHead>Scheduled</TableHead>
                    <TableHead className="w-8"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {savedQueries.map((q) => (
                    <TableRow key={q.id}>
                      <TableCell className="font-medium">{q.queryName}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">{q.category}</Badge>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate text-muted-foreground">
                        {q.description}
                      </TableCell>
                      <TableCell>{q.createdBy}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {q.lastRun ? formatDate(q.lastRun) : 'Never'}
                      </TableCell>
                      <TableCell>
                        {q.isScheduled ? (
                          <Badge variant="success">{q.scheduleFrequency}</Badge>
                        ) : (
                          <Badge variant="secondary">Manual</Badge>
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
                            <DropdownMenuItem onClick={() => setQuery(q.sqlQuery)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Load Query
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Play className="mr-2 h-4 w-4" />
                              Run Now
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="mr-2 h-4 w-4" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Calendar className="mr-2 h-4 w-4" />
                              Schedule
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
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

        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Queries</CardTitle>
              <CardDescription>Queries executed in this session</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Query</TableHead>
                    <TableHead>Run Time</TableHead>
                    <TableHead>Rows</TableHead>
                    <TableHead>When</TableHead>
                    <TableHead className="w-8"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentQueries.map((q) => (
                    <TableRow key={q.id}>
                      <TableCell className="font-mono text-sm max-w-[400px] truncate">
                        {q.query}
                      </TableCell>
                      <TableCell>{q.runTime}</TableCell>
                      <TableCell>{q.rows}</TableCell>
                      <TableCell className="text-muted-foreground">{q.time}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setQuery(q.query)}
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Scheduled Queries</CardTitle>
                  <CardDescription>Automated query execution schedules</CardDescription>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Schedule
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Query Name</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Next Run</TableHead>
                    <TableHead>Output</TableHead>
                    <TableHead>Recipients</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-8"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {savedQueries.filter(q => q.isScheduled).map((q) => (
                    <TableRow key={q.id}>
                      <TableCell className="font-medium">{q.queryName}</TableCell>
                      <TableCell className="capitalize">{q.scheduleFrequency}</TableCell>
                      <TableCell className="text-muted-foreground">
                        Tomorrow, 6:00 AM
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{q.outputFormat.toUpperCase()}</Badge>
                      </TableCell>
                      <TableCell>2 recipients</TableCell>
                      <TableCell>
                        <Badge variant="success">Active</Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit Schedule</DropdownMenuItem>
                            <DropdownMenuItem>Run Now</DropdownMenuItem>
                            <DropdownMenuItem>View History</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Pause</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
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
