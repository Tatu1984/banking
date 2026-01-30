import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Building,
  Users,
  Wallet,
  Clock,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  MoreVertical,
  User,
  ArrowUpRight,
  ArrowDownRight,
  Banknote,
  CreditCard,
  FileText,
  Eye,
  TrendingUp,
  TrendingDown,
  Wifi,
  WifiOff,
} from "lucide-react";
import { formatCurrency, formatDateTime } from "@/lib/utils";

// Mock branch data
const branches = [
  {
    id: "1",
    code: "BLR001",
    name: "Bengaluru - MG Road",
    region: "South",
    type: "main",
    status: "online",
    manager: "Suresh Kumar",
    employees: 25,
    customers: 15000,
    todayTxnCount: 456,
    todayVolume: 25678901,
    cashBalance: 5000000,
    lastSync: "2024-01-28T14:30:00Z",
  },
  {
    id: "2",
    code: "MUM001",
    name: "Mumbai - Andheri",
    region: "West",
    type: "main",
    status: "online",
    manager: "Priya Sharma",
    employees: 30,
    customers: 22000,
    todayTxnCount: 678,
    todayVolume: 45678901,
    cashBalance: 8000000,
    lastSync: "2024-01-28T14:29:00Z",
  },
  {
    id: "3",
    code: "DEL001",
    name: "Delhi - CP",
    region: "North",
    type: "main",
    status: "online",
    manager: "Amit Singh",
    employees: 28,
    customers: 18500,
    todayTxnCount: 512,
    todayVolume: 34567890,
    cashBalance: 6500000,
    lastSync: "2024-01-28T14:28:00Z",
  },
  {
    id: "4",
    code: "CHN001",
    name: "Chennai - Anna Salai",
    region: "South",
    type: "main",
    status: "offline",
    manager: "Meera Reddy",
    employees: 22,
    customers: 12000,
    todayTxnCount: 234,
    todayVolume: 15678901,
    cashBalance: 4000000,
    lastSync: "2024-01-28T10:15:00Z",
  },
];

const tellerQueue = [
  { id: "1", token: "A001", customer: "Rajesh Kumar", service: "Cash Deposit", amount: 50000, status: "serving", teller: "Counter 1", waitTime: "0 min" },
  { id: "2", token: "A002", customer: "Priya Patel", service: "Cheque Deposit", amount: 100000, status: "waiting", teller: null, waitTime: "5 min" },
  { id: "3", token: "A003", customer: "Amit Singh", service: "Cash Withdrawal", amount: 25000, status: "waiting", teller: null, waitTime: "8 min" },
  { id: "4", token: "B001", customer: "TechCorp Ltd", service: "DD Request", amount: 500000, status: "serving", teller: "Counter 3", waitTime: "0 min" },
  { id: "5", token: "A004", customer: "Sunita Sharma", service: "Account Opening", amount: null, status: "waiting", teller: null, waitTime: "12 min" },
];

const todayTransactions = [
  { id: "1", time: "14:25", type: "Cash Deposit", customer: "Rajesh Kumar", amount: 50000, teller: "Counter 1", status: "completed" },
  { id: "2", time: "14:20", type: "NEFT", customer: "Priya Patel", amount: 150000, teller: "Counter 2", status: "completed" },
  { id: "3", time: "14:15", type: "Cash Withdrawal", customer: "Amit Singh", amount: 25000, teller: "Counter 1", status: "completed" },
  { id: "4", time: "14:10", type: "DD Issue", customer: "TechCorp Ltd", amount: 500000, teller: "Counter 3", status: "completed" },
  { id: "5", time: "14:05", type: "Cheque Deposit", customer: "Meera Reddy", amount: 75000, teller: "Counter 2", status: "pending_clearing" },
];

const cashPosition = {
  opening: 5000000,
  receipts: 2500000,
  payments: 1500000,
  current: 6000000,
  limit: 10000000,
};

export function BranchOperations() {
  const [selectedBranch, setSelectedBranch] = useState("BLR001");

  const branch = branches.find(b => b.code === selectedBranch) || branches[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Branch Operations</h1>
          <p className="text-muted-foreground">
            Monitor and manage branch activities
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedBranch} onValueChange={setSelectedBranch}>
            <SelectTrigger className="w-[250px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {branches.map(b => (
                <SelectItem key={b.code} value={b.code}>
                  {b.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Branch Status Bar */}
      <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
        <div className="flex items-center gap-3">
          <Building className="h-8 w-8 text-primary" />
          <div>
            <h2 className="font-semibold text-lg">{branch.name}</h2>
            <p className="text-sm text-muted-foreground">Code: {branch.code} | Region: {branch.region}</p>
          </div>
        </div>
        <Badge variant={branch.status === "online" ? "success" : "destructive"} className="ml-auto">
          {branch.status === "online" ? <Wifi className="mr-1 h-3 w-3" /> : <WifiOff className="mr-1 h-3 w-3" />}
          {branch.status}
        </Badge>
        <span className="text-sm text-muted-foreground">
          Last sync: {formatDateTime(branch.lastSync)}
        </span>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Today's Transactions</p>
                <p className="text-2xl font-bold">{branch.todayTxnCount}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Today's Volume</p>
                <p className="text-2xl font-bold">{formatCurrency(branch.todayVolume)}</p>
              </div>
              <Wallet className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cash Balance</p>
                <p className="text-2xl font-bold">{formatCurrency(branch.cashBalance)}</p>
              </div>
              <Banknote className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Queue</p>
                <p className="text-2xl font-bold">{tellerQueue.filter(t => t.status === "waiting").length}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Employees Present</p>
                <p className="text-2xl font-bold">{branch.employees - 3}/{branch.employees}</p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="queue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="queue">Teller Queue</TabsTrigger>
          <TabsTrigger value="transactions">Today's Transactions</TabsTrigger>
          <TabsTrigger value="cash">Cash Position</TabsTrigger>
          <TabsTrigger value="counters">Counter Status</TabsTrigger>
          <TabsTrigger value="branches">All Branches</TabsTrigger>
        </TabsList>

        {/* Teller Queue */}
        <TabsContent value="queue">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Teller Queue</CardTitle>
                <CardDescription>Current customer queue at counters</CardDescription>
              </div>
              <Button size="sm">
                Generate Token
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Token</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Wait Time</TableHead>
                    <TableHead>Counter</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tellerQueue.map(item => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">{item.token}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{item.customer}</TableCell>
                      <TableCell>{item.service}</TableCell>
                      <TableCell>{item.amount ? formatCurrency(item.amount) : "-"}</TableCell>
                      <TableCell>{item.waitTime}</TableCell>
                      <TableCell>{item.teller || "-"}</TableCell>
                      <TableCell>
                        <Badge variant={item.status === "serving" ? "success" : "warning"}>
                          {item.status}
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
                            <DropdownMenuItem>Call to Counter</DropdownMenuItem>
                            <DropdownMenuItem>Reassign</DropdownMenuItem>
                            <DropdownMenuItem>Mark Complete</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Cancel</DropdownMenuItem>
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

        {/* Today's Transactions */}
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Today's Transactions</CardTitle>
              <CardDescription>All transactions processed today</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Counter</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {todayTransactions.map(txn => (
                    <TableRow key={txn.id}>
                      <TableCell>{txn.time}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {txn.type.includes("Deposit") || txn.type === "NEFT" ? (
                            <ArrowDownRight className="h-4 w-4 text-green-500" />
                          ) : (
                            <ArrowUpRight className="h-4 w-4 text-red-500" />
                          )}
                          {txn.type}
                        </div>
                      </TableCell>
                      <TableCell>{txn.customer}</TableCell>
                      <TableCell className="font-medium">{formatCurrency(txn.amount)}</TableCell>
                      <TableCell>{txn.teller}</TableCell>
                      <TableCell>
                        <Badge variant={txn.status === "completed" ? "success" : "warning"}>
                          {txn.status.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
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

        {/* Cash Position */}
        <TabsContent value="cash">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Cash Position</CardTitle>
                <CardDescription>Current cash status at branch</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Opening Balance</p>
                    <p className="text-2xl font-bold">{formatCurrency(cashPosition.opening)}</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-600">Today's Receipts</p>
                    <p className="text-2xl font-bold text-green-600">+{formatCurrency(cashPosition.receipts)}</p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg">
                    <p className="text-sm text-red-600">Today's Payments</p>
                    <p className="text-2xl font-bold text-red-600">-{formatCurrency(cashPosition.payments)}</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-600">Current Balance</p>
                    <p className="text-2xl font-bold text-blue-600">{formatCurrency(cashPosition.current)}</p>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Cash Utilization</span>
                    <span>{((cashPosition.current / cashPosition.limit) * 100).toFixed(0)}% of limit</span>
                  </div>
                  <Progress value={(cashPosition.current / cashPosition.limit) * 100} className="h-3" />
                  <p className="text-xs text-muted-foreground mt-1">
                    Limit: {formatCurrency(cashPosition.limit)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Denomination Breakdown</CardTitle>
                <CardDescription>Cash by denomination</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Denomination</TableHead>
                      <TableHead>Count</TableHead>
                      <TableHead>Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>₹2000</TableCell>
                      <TableCell>500</TableCell>
                      <TableCell>{formatCurrency(1000000)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>₹500</TableCell>
                      <TableCell>4000</TableCell>
                      <TableCell>{formatCurrency(2000000)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>₹200</TableCell>
                      <TableCell>5000</TableCell>
                      <TableCell>{formatCurrency(1000000)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>₹100</TableCell>
                      <TableCell>15000</TableCell>
                      <TableCell>{formatCurrency(1500000)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>₹50 & below</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>{formatCurrency(500000)}</TableCell>
                    </TableRow>
                    <TableRow className="font-bold">
                      <TableCell>Total</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>{formatCurrency(6000000)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Counter Status */}
        <TabsContent value="counters">
          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map(counter => (
              <Card key={counter}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Counter {counter}</h3>
                    <Badge variant={counter <= 4 ? "success" : "secondary"}>
                      {counter <= 4 ? "Active" : "Closed"}
                    </Badge>
                  </div>
                  {counter <= 4 ? (
                    <>
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>T{counter}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">Teller {counter}</p>
                          <p className="text-xs text-muted-foreground">Since 9:00 AM</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Transactions</p>
                          <p className="font-medium">{50 + counter * 10}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Serving</p>
                          <p className="font-medium">{counter <= 2 ? "A00" + counter : "-"}</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">Counter not in use</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* All Branches */}
        <TabsContent value="branches">
          <Card>
            <CardHeader>
              <CardTitle>All Branches</CardTitle>
              <CardDescription>Branch-wise operational status</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Branch</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead>Manager</TableHead>
                    <TableHead>Customers</TableHead>
                    <TableHead>Today's Txns</TableHead>
                    <TableHead>Today's Volume</TableHead>
                    <TableHead>Cash Balance</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {branches.map(b => (
                    <TableRow key={b.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{b.name}</p>
                          <p className="text-xs text-muted-foreground">{b.code}</p>
                        </div>
                      </TableCell>
                      <TableCell>{b.region}</TableCell>
                      <TableCell>{b.manager}</TableCell>
                      <TableCell>{b.customers.toLocaleString()}</TableCell>
                      <TableCell>{b.todayTxnCount}</TableCell>
                      <TableCell>{formatCurrency(b.todayVolume)}</TableCell>
                      <TableCell>{formatCurrency(b.cashBalance)}</TableCell>
                      <TableCell>
                        <Badge variant={b.status === "online" ? "success" : "destructive"}>
                          {b.status}
                        </Badge>
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
