import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Search,
  Plus,
  MoreVertical,
  Download,
  RefreshCw,
  User,
  Building,
  Globe,
  Send,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertTriangle,
  Copy,
  Eye,
  Loader2,
} from "lucide-react";
import { formatDate, formatCurrency } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { accounts } from "@/data/mockData";

// Mock beneficiary data
const beneficiaries = [
  {
    id: "1",
    name: "Utilities Company Ltd",
    accountNumber: "9876543210987654",
    ifsc: "HDFC0001234",
    bank: "HDFC Bank",
    type: "domestic",
    category: "utility",
    status: "verified",
    addedOn: "2023-06-15",
    lastUsed: "2024-01-28",
    nickname: "Electricity Bill",
    dailyLimit: 100000,
    usageCount: 24,
  },
  {
    id: "2",
    name: "Raw Materials Supplier",
    accountNumber: "5678901234567890",
    ifsc: "ICIC0005678",
    bank: "ICICI Bank",
    type: "domestic",
    category: "vendor",
    status: "verified",
    addedOn: "2022-01-10",
    lastUsed: "2024-01-25",
    nickname: "Main Supplier",
    dailyLimit: 5000000,
    usageCount: 156,
  },
  {
    id: "3",
    name: "Rent Payment - Landlord",
    accountNumber: "1122334455667788",
    ifsc: "SBIN0009999",
    bank: "SBI",
    type: "domestic",
    category: "rent",
    status: "verified",
    addedOn: "2021-03-20",
    lastUsed: "2024-01-27",
    nickname: "House Rent",
    dailyLimit: 50000,
    usageCount: 36,
  },
  {
    id: "4",
    name: "Global Electronics Inc",
    accountNumber: "US9876543210",
    swift: "CHASUS33",
    bank: "JP Morgan Chase, USA",
    type: "international",
    category: "vendor",
    status: "pending",
    addedOn: "2024-01-20",
    lastUsed: null,
    nickname: "US Supplier",
    dailyLimit: 10000000,
    usageCount: 0,
  },
  {
    id: "5",
    name: "Ramesh Verma",
    accountNumber: "ramesh@upi",
    type: "upi",
    category: "personal",
    status: "verified",
    addedOn: "2024-01-10",
    lastUsed: "2024-01-28",
    nickname: "Friend",
    dailyLimit: 10000,
    usageCount: 5,
  },
];

export function BeneficiaryManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<typeof beneficiaries[0] | null>(null);
  const [editBeneficiary, setEditBeneficiary] = useState<typeof beneficiaries[0] | null>(null);
  const [deleteBeneficiary, setDeleteBeneficiary] = useState<typeof beneficiaries[0] | null>(null);
  const [sendMoneyBeneficiary, setSendMoneyBeneficiary] = useState<typeof beneficiaries[0] | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Edit form state
  const [editForm, setEditForm] = useState({
    nickname: "",
    dailyLimit: 0,
    category: "",
  });

  // Send money form state
  const [sendMoneyForm, setSendMoneyForm] = useState({
    fromAccount: "",
    amount: 0,
    remarks: "",
  });

  const openEditDialog = (beneficiary: typeof beneficiaries[0]) => {
    setEditForm({
      nickname: beneficiary.nickname,
      dailyLimit: beneficiary.dailyLimit,
      category: beneficiary.category,
    });
    setEditBeneficiary(beneficiary);
  };

  const openSendMoneyDialog = (beneficiary: typeof beneficiaries[0]) => {
    setSendMoneyForm({ fromAccount: "", amount: 0, remarks: "" });
    setSendMoneyBeneficiary(beneficiary);
  };

  const handleEditBeneficiary = async () => {
    if (!editBeneficiary) return;
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast({
        title: "Beneficiary Updated",
        description: `${editBeneficiary.name} has been updated successfully.`,
      });
      setEditBeneficiary(null);
    } catch {
      toast({ title: "Error", description: "Failed to update beneficiary.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBeneficiary = async () => {
    if (!deleteBeneficiary) return;
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast({
        title: "Beneficiary Deleted",
        description: `${deleteBeneficiary.name} has been removed.`,
      });
      setDeleteBeneficiary(null);
    } catch {
      toast({ title: "Error", description: "Failed to delete beneficiary.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendMoney = async () => {
    if (!sendMoneyBeneficiary || !sendMoneyForm.fromAccount || sendMoneyForm.amount <= 0) return;
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast({
        title: "Transfer Initiated",
        description: `${formatCurrency(sendMoneyForm.amount)} sent to ${sendMoneyBeneficiary.name}`,
      });
      setSendMoneyBeneficiary(null);
    } catch {
      toast({ title: "Error", description: "Failed to initiate transfer.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredBeneficiaries = beneficiaries.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.accountNumber.includes(searchTerm) ||
      b.nickname.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || b.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Beneficiary Management</h1>
          <p className="text-muted-foreground">
            Manage saved beneficiaries for fund transfers
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Beneficiary
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Beneficiaries</p>
                <p className="text-2xl font-bold">{beneficiaries.length}</p>
              </div>
              <User className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Domestic</p>
                <p className="text-2xl font-bold">
                  {beneficiaries.filter(b => b.type === "domestic").length}
                </p>
              </div>
              <Building className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">International</p>
                <p className="text-2xl font-bold">
                  {beneficiaries.filter(b => b.type === "international").length}
                </p>
              </div>
              <Globe className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">UPI</p>
                <p className="text-2xl font-bold">
                  {beneficiaries.filter(b => b.type === "upi").length}
                </p>
              </div>
              <Send className="h-8 w-8 text-green-500" />
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
                placeholder="Search by name, account, or nickname..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Beneficiary Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="domestic">Domestic</SelectItem>
                <SelectItem value="international">International</SelectItem>
                <SelectItem value="upi">UPI</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Beneficiary List */}
      <Card>
        <CardHeader>
          <CardTitle>Saved Beneficiaries</CardTitle>
          <CardDescription>
            {filteredBeneficiaries.length} beneficiaries found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Beneficiary</TableHead>
                <TableHead>Account Details</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Daily Limit</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBeneficiaries.map(beneficiary => (
                <TableRow key={beneficiary.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{beneficiary.name}</p>
                      <p className="text-xs text-muted-foreground">{beneficiary.nickname}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm">{beneficiary.accountNumber}</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      {beneficiary.ifsc && (
                        <p className="text-xs text-muted-foreground">IFSC: {beneficiary.ifsc}</p>
                      )}
                      {beneficiary.swift && (
                        <p className="text-xs text-muted-foreground">SWIFT: {beneficiary.swift}</p>
                      )}
                      {beneficiary.bank && (
                        <p className="text-xs text-muted-foreground">{beneficiary.bank}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {beneficiary.type === "domestic" && <Building className="mr-1 h-3 w-3" />}
                      {beneficiary.type === "international" && <Globe className="mr-1 h-3 w-3" />}
                      {beneficiary.type === "upi" && <Send className="mr-1 h-3 w-3" />}
                      {beneficiary.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="capitalize">{beneficiary.category}</Badge>
                  </TableCell>
                  <TableCell>₹{beneficiary.dailyLimit.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {beneficiary.status === "verified" ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <Clock className="h-4 w-4 text-yellow-500" />
                      )}
                      <Badge variant={beneficiary.status === "verified" ? "success" : "warning"}>
                        {beneficiary.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {beneficiary.lastUsed ? formatDate(beneficiary.lastUsed) : "Never"}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedBeneficiary(beneficiary)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openSendMoneyDialog(beneficiary)}>
                          <Send className="mr-2 h-4 w-4" />
                          Send Money
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditDialog(beneficiary)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => setDeleteBeneficiary(beneficiary)}>
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

      {/* Add Beneficiary Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Beneficiary</DialogTitle>
            <DialogDescription>Add a new beneficiary for fund transfers</DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="domestic">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="domestic">Domestic</TabsTrigger>
              <TabsTrigger value="international">International</TabsTrigger>
              <TabsTrigger value="upi">UPI</TabsTrigger>
            </TabsList>
            <TabsContent value="domestic" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Beneficiary Name *</Label>
                <Input placeholder="Enter full name as per bank records" />
              </div>
              <div className="space-y-2">
                <Label>Nickname</Label>
                <Input placeholder="A friendly name for this beneficiary" />
              </div>
              <div className="space-y-2">
                <Label>Account Number *</Label>
                <Input placeholder="Enter account number" />
              </div>
              <div className="space-y-2">
                <Label>Confirm Account Number *</Label>
                <Input placeholder="Re-enter account number" />
              </div>
              <div className="space-y-2">
                <Label>IFSC Code *</Label>
                <Input placeholder="Enter IFSC code" />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="vendor">Vendor</SelectItem>
                    <SelectItem value="utility">Utility</SelectItem>
                    <SelectItem value="rent">Rent</SelectItem>
                    <SelectItem value="salary">Salary</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Daily Transfer Limit</Label>
                <Input type="number" placeholder="Enter daily limit" />
              </div>
            </TabsContent>
            <TabsContent value="international" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Beneficiary Name *</Label>
                <Input placeholder="Enter full name" />
              </div>
              <div className="space-y-2">
                <Label>Account Number / IBAN *</Label>
                <Input placeholder="Enter account number or IBAN" />
              </div>
              <div className="space-y-2">
                <Label>SWIFT / BIC Code *</Label>
                <Input placeholder="Enter SWIFT code" />
              </div>
              <div className="space-y-2">
                <Label>Bank Name *</Label>
                <Input placeholder="Enter bank name" />
              </div>
              <div className="space-y-2">
                <Label>Bank Address *</Label>
                <Input placeholder="Enter bank address" />
              </div>
              <div className="space-y-2">
                <Label>Country *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="de">Germany</SelectItem>
                    <SelectItem value="sg">Singapore</SelectItem>
                    <SelectItem value="ae">UAE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
            <TabsContent value="upi" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>UPI ID / VPA *</Label>
                <Input placeholder="Enter UPI ID (e.g., name@bank)" />
              </div>
              <div className="space-y-2">
                <Label>Beneficiary Name</Label>
                <Input placeholder="Enter name" />
              </div>
              <div className="space-y-2">
                <Label>Nickname</Label>
                <Input placeholder="A friendly name" />
              </div>
            </TabsContent>
          </Tabs>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => setIsAddDialogOpen(false)}>Add Beneficiary</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Beneficiary Detail Dialog */}
      <Dialog open={!!selectedBeneficiary} onOpenChange={() => setSelectedBeneficiary(null)}>
        <DialogContent>
          {selectedBeneficiary && (
            <>
              <DialogHeader>
                <DialogTitle>Beneficiary Details</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                  <div className="p-3 rounded-full bg-primary/10">
                    {selectedBeneficiary.type === "domestic" && <Building className="h-6 w-6 text-primary" />}
                    {selectedBeneficiary.type === "international" && <Globe className="h-6 w-6 text-primary" />}
                    {selectedBeneficiary.type === "upi" && <Send className="h-6 w-6 text-primary" />}
                  </div>
                  <div>
                    <p className="font-semibold">{selectedBeneficiary.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedBeneficiary.nickname}</p>
                  </div>
                  <Badge variant={selectedBeneficiary.status === "verified" ? "success" : "warning"} className="ml-auto">
                    {selectedBeneficiary.status}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Account Number</span>
                    <span className="font-mono">{selectedBeneficiary.accountNumber}</span>
                  </div>
                  {selectedBeneficiary.ifsc && (
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">IFSC Code</span>
                      <span className="font-mono">{selectedBeneficiary.ifsc}</span>
                    </div>
                  )}
                  {selectedBeneficiary.swift && (
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">SWIFT Code</span>
                      <span className="font-mono">{selectedBeneficiary.swift}</span>
                    </div>
                  )}
                  {selectedBeneficiary.bank && (
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Bank</span>
                      <span>{selectedBeneficiary.bank}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Category</span>
                    <Badge variant="secondary" className="capitalize">{selectedBeneficiary.category}</Badge>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Daily Limit</span>
                    <span>₹{selectedBeneficiary.dailyLimit.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Added On</span>
                    <span>{formatDate(selectedBeneficiary.addedOn)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Usage Count</span>
                    <span>{selectedBeneficiary.usageCount} transfers</span>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedBeneficiary(null)}>Close</Button>
                <Button onClick={() => { setSelectedBeneficiary(null); openSendMoneyDialog(selectedBeneficiary); }}>
                  <Send className="mr-2 h-4 w-4" />
                  Send Money
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Beneficiary Dialog */}
      <Dialog open={!!editBeneficiary} onOpenChange={(open) => !open && setEditBeneficiary(null)}>
        <DialogContent className="max-w-md">
          {editBeneficiary && (
            <>
              <DialogHeader>
                <DialogTitle>Edit Beneficiary</DialogTitle>
                <DialogDescription>Update beneficiary details</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="font-medium">{editBeneficiary.name}</p>
                  <p className="text-sm text-muted-foreground font-mono">{editBeneficiary.accountNumber}</p>
                </div>
                <div className="space-y-2">
                  <Label>Nickname</Label>
                  <Input
                    value={editForm.nickname}
                    onChange={(e) => setEditForm({ ...editForm, nickname: e.target.value })}
                    placeholder="Enter nickname"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={editForm.category} onValueChange={(value) => setEditForm({ ...editForm, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="personal">Personal</SelectItem>
                      <SelectItem value="vendor">Vendor</SelectItem>
                      <SelectItem value="utility">Utility</SelectItem>
                      <SelectItem value="rent">Rent</SelectItem>
                      <SelectItem value="salary">Salary</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Daily Transfer Limit</Label>
                  <Input
                    type="number"
                    value={editForm.dailyLimit}
                    onChange={(e) => setEditForm({ ...editForm, dailyLimit: Number(e.target.value) })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditBeneficiary(null)} disabled={isSubmitting}>Cancel</Button>
                <Button onClick={handleEditBeneficiary} disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Beneficiary Dialog */}
      <Dialog open={!!deleteBeneficiary} onOpenChange={(open) => !open && setDeleteBeneficiary(null)}>
        <DialogContent className="max-w-md">
          {deleteBeneficiary && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-destructive">
                  <Trash2 className="h-5 w-5" />
                  Delete Beneficiary
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">
                    Are you sure you want to delete <strong>{deleteBeneficiary.name}</strong>? This action cannot be undone.
                  </p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      {deleteBeneficiary.type === "domestic" && <Building className="h-5 w-5 text-primary" />}
                      {deleteBeneficiary.type === "international" && <Globe className="h-5 w-5 text-primary" />}
                      {deleteBeneficiary.type === "upi" && <Send className="h-5 w-5 text-primary" />}
                    </div>
                    <div>
                      <p className="font-medium">{deleteBeneficiary.name}</p>
                      <p className="text-sm text-muted-foreground font-mono">{deleteBeneficiary.accountNumber}</p>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDeleteBeneficiary(null)} disabled={isSubmitting}>Cancel</Button>
                <Button variant="destructive" onClick={handleDeleteBeneficiary} disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Delete Beneficiary
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Send Money Dialog */}
      <Dialog open={!!sendMoneyBeneficiary} onOpenChange={(open) => !open && setSendMoneyBeneficiary(null)}>
        <DialogContent className="max-w-md">
          {sendMoneyBeneficiary && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5 text-primary" />
                  Send Money
                </DialogTitle>
                <DialogDescription>Transfer funds to {sendMoneyBeneficiary.name}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      {sendMoneyBeneficiary.type === "domestic" && <Building className="h-5 w-5 text-primary" />}
                      {sendMoneyBeneficiary.type === "international" && <Globe className="h-5 w-5 text-primary" />}
                      {sendMoneyBeneficiary.type === "upi" && <Send className="h-5 w-5 text-primary" />}
                    </div>
                    <div>
                      <p className="font-medium">{sendMoneyBeneficiary.name}</p>
                      <p className="text-sm text-muted-foreground font-mono">{sendMoneyBeneficiary.accountNumber}</p>
                      {sendMoneyBeneficiary.bank && <p className="text-xs text-muted-foreground">{sendMoneyBeneficiary.bank}</p>}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>From Account *</Label>
                  <Select value={sendMoneyForm.fromAccount} onValueChange={(value) => setSendMoneyForm({ ...sendMoneyForm, fromAccount: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select source account" />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.filter(a => a.status === "active").map(account => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.accountNumber} - {formatCurrency(account.balance)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Amount *</Label>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={sendMoneyForm.amount || ""}
                    onChange={(e) => setSendMoneyForm({ ...sendMoneyForm, amount: Number(e.target.value) })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Daily limit: {formatCurrency(sendMoneyBeneficiary.dailyLimit)}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Remarks</Label>
                  <Input
                    placeholder="Payment description"
                    value={sendMoneyForm.remarks}
                    onChange={(e) => setSendMoneyForm({ ...sendMoneyForm, remarks: e.target.value })}
                  />
                </div>

                {sendMoneyForm.amount > 0 && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm font-medium text-green-800">
                      Transfer Summary
                    </p>
                    <div className="mt-2 space-y-1 text-sm text-green-700">
                      <div className="flex justify-between">
                        <span>Amount:</span>
                        <span>{formatCurrency(sendMoneyForm.amount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Transfer Fee:</span>
                        <span>{formatCurrency(0)}</span>
                      </div>
                      <div className="flex justify-between font-medium pt-1 border-t border-green-300">
                        <span>Total:</span>
                        <span>{formatCurrency(sendMoneyForm.amount)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSendMoneyBeneficiary(null)} disabled={isSubmitting}>Cancel</Button>
                <Button
                  onClick={handleSendMoney}
                  disabled={isSubmitting || !sendMoneyForm.fromAccount || sendMoneyForm.amount <= 0}
                >
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Send Money
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
