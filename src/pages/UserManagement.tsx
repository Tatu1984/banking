import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Search,
  Plus,
  MoreVertical,
  Download,
  RefreshCw,
  User,
  Shield,
  Key,
  Lock,
  Unlock,
  Edit,
  Trash2,
  Mail,
  Phone,
  Building,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  UserPlus,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDate, formatDateTime } from "@/lib/utils";

// Mock user data
const users = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@bank.com",
    phone: "+91 98765 43210",
    role: "System Admin",
    department: "IT",
    branch: "Head Office",
    status: "active",
    lastLogin: "2024-01-28T14:30:00Z",
    createdAt: "2020-01-01",
    mfaEnabled: true,
    permissions: ["all"],
  },
  {
    id: "2",
    name: "Suresh Kumar",
    email: "suresh.kumar@bank.com",
    phone: "+91 87654 32109",
    role: "Branch Manager",
    department: "Operations",
    branch: "Bengaluru - MG Road",
    status: "active",
    lastLogin: "2024-01-28T10:15:00Z",
    createdAt: "2021-03-15",
    mfaEnabled: true,
    permissions: ["branch_ops", "approvals", "reports"],
  },
  {
    id: "3",
    name: "Meera Reddy",
    email: "meera.reddy@bank.com",
    phone: "+91 76543 21098",
    role: "Loan Officer",
    department: "Lending",
    branch: "Mumbai - Andheri",
    status: "active",
    lastLogin: "2024-01-27T16:45:00Z",
    createdAt: "2022-06-01",
    mfaEnabled: true,
    permissions: ["loans", "customers"],
  },
  {
    id: "4",
    name: "Vikram Joshi",
    email: "vikram.joshi@bank.com",
    phone: "+91 65432 10987",
    role: "Compliance Officer",
    department: "Compliance",
    branch: "Head Office",
    status: "active",
    lastLogin: "2024-01-28T09:00:00Z",
    createdAt: "2021-09-01",
    mfaEnabled: true,
    permissions: ["compliance", "aml", "reports"],
  },
  {
    id: "5",
    name: "Anita Desai",
    email: "anita.desai@bank.com",
    phone: "+91 54321 09876",
    role: "Teller",
    department: "Operations",
    branch: "Delhi - CP",
    status: "inactive",
    lastLogin: "2024-01-15T11:30:00Z",
    createdAt: "2023-01-10",
    mfaEnabled: false,
    permissions: ["transactions", "accounts"],
  },
  {
    id: "6",
    name: "Rahul Verma",
    email: "rahul.verma@bank.com",
    phone: "+91 43210 98765",
    role: "Customer Service",
    department: "Service",
    branch: "Chennai - Anna Salai",
    status: "locked",
    lastLogin: "2024-01-20T14:00:00Z",
    createdAt: "2022-11-15",
    mfaEnabled: true,
    permissions: ["customers", "accounts"],
  },
];

const roles = [
  { id: "1", name: "System Admin", userCount: 2 },
  { id: "2", name: "Branch Manager", userCount: 15 },
  { id: "3", name: "Loan Officer", userCount: 25 },
  { id: "4", name: "Compliance Officer", userCount: 8 },
  { id: "5", name: "Teller", userCount: 150 },
  { id: "6", name: "Customer Service", userCount: 50 },
];

export function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<typeof users[0] | null>(null);
  const [editUser, setEditUser] = useState<typeof users[0] | null>(null);
  const [resetPasswordUser, setResetPasswordUser] = useState<typeof users[0] | null>(null);
  const [deleteUser, setDeleteUser] = useState<typeof users[0] | null>(null);
  const [lockUser, setLockUser] = useState<typeof users[0] | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit form state
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    department: "",
    branch: "",
    mfaEnabled: true,
  });

  const openEditDialog = (user: typeof users[0]) => {
    setEditForm({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      department: user.department,
      branch: user.branch,
      mfaEnabled: user.mfaEnabled,
    });
    setEditUser(user);
  };

  const handleEditUser = async () => {
    if (!editUser) return;
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setEditUser(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resetPasswordUser) return;
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setResetPasswordUser(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteUser) return;
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setDeleteUser(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLockUnlock = async () => {
    if (!lockUser) return;
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setLockUser(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage system users and their access permissions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
              <User className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-green-600">
                  {users.filter(u => u.status === "active").length}
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
                <p className="text-sm text-muted-foreground">Inactive</p>
                <p className="text-2xl font-bold text-gray-600">
                  {users.filter(u => u.status === "inactive").length}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Locked</p>
                <p className="text-2xl font-bold text-red-600">
                  {users.filter(u => u.status === "locked").length}
                </p>
              </div>
              <Lock className="h-8 w-8 text-red-500" />
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
                placeholder="Search by name or email..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {roles.map(role => (
                  <SelectItem key={role.id} value={role.name}>{role.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="locked">Locked</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* User List */}
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>
            {filteredUsers.length} users found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>MFA</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map(user => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-primary/10 text-primary text-sm">
                          {user.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{user.role}</Badge>
                  </TableCell>
                  <TableCell>{user.department}</TableCell>
                  <TableCell>{user.branch}</TableCell>
                  <TableCell>
                    {user.mfaEnabled ? (
                      <Badge variant="success" className="text-xs">Enabled</Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">Disabled</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.status === "active" ? "success" :
                        user.status === "inactive" ? "secondary" : "destructive"
                      }
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatDateTime(user.lastLogin)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedUser(user)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditDialog(user)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit User
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditDialog(user)}>
                          <Shield className="mr-2 h-4 w-4" />
                          Manage Permissions
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setResetPasswordUser(user)}>
                          <Key className="mr-2 h-4 w-4" />
                          Reset Password
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {user.status === "locked" ? (
                          <DropdownMenuItem onClick={() => setLockUser(user)}>
                            <Unlock className="mr-2 h-4 w-4" />
                            Unlock Account
                          </DropdownMenuItem>
                        ) : user.status === "active" ? (
                          <>
                            <DropdownMenuItem onClick={() => setLockUser(user)}>
                              <Lock className="mr-2 h-4 w-4" />
                              Lock Account
                            </DropdownMenuItem>
                          </>
                        ) : (
                          <DropdownMenuItem onClick={() => setLockUser(user)}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Activate
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => setDeleteUser(user)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete User
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

      {/* Add User Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>Create a new user account</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First Name *</Label>
                <Input placeholder="Enter first name" />
              </div>
              <div className="space-y-2">
                <Label>Last Name *</Label>
                <Input placeholder="Enter last name" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Email *</Label>
              <Input type="email" placeholder="Enter email address" />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input placeholder="Enter phone number" />
            </div>
            <div className="space-y-2">
              <Label>Role *</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map(role => (
                    <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Department *</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="it">IT</SelectItem>
                  <SelectItem value="operations">Operations</SelectItem>
                  <SelectItem value="lending">Lending</SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                  <SelectItem value="service">Customer Service</SelectItem>
                  <SelectItem value="risk">Risk</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Branch *</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select branch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ho">Head Office</SelectItem>
                  <SelectItem value="blr">Bengaluru - MG Road</SelectItem>
                  <SelectItem value="mum">Mumbai - Andheri</SelectItem>
                  <SelectItem value="del">Delhi - CP</SelectItem>
                  <SelectItem value="chn">Chennai - Anna Salai</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable MFA</Label>
                <p className="text-xs text-muted-foreground">Require two-factor authentication</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Send Welcome Email</Label>
                <p className="text-xs text-muted-foreground">Send login credentials via email</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => setIsAddDialogOpen(false)}>Create User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* User Detail Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-lg">
          {selectedUser && (
            <>
              <DialogHeader>
                <DialogTitle>User Details</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="text-xl bg-primary/10 text-primary">
                      {selectedUser.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-lg">{selectedUser.name}</p>
                    <p className="text-muted-foreground">{selectedUser.role}</p>
                    <Badge
                      variant={
                        selectedUser.status === "active" ? "success" :
                        selectedUser.status === "inactive" ? "secondary" : "destructive"
                      }
                      className="mt-1"
                    >
                      {selectedUser.status}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 py-2 border-b">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedUser.email}</span>
                  </div>
                  <div className="flex items-center gap-2 py-2 border-b">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedUser.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 py-2 border-b">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedUser.branch}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Department</span>
                    <span>{selectedUser.department}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">MFA Status</span>
                    <Badge variant={selectedUser.mfaEnabled ? "success" : "secondary"}>
                      {selectedUser.mfaEnabled ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Last Login</span>
                    <span>{formatDateTime(selectedUser.lastLogin)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Created</span>
                    <span>{formatDate(selectedUser.createdAt)}</span>
                  </div>
                </div>

                <div>
                  <Label className="text-muted-foreground">Permissions</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedUser.permissions.map(perm => (
                      <Badge key={perm} variant="outline" className="capitalize">
                        {perm.replace("_", " ")}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedUser(null)}>Close</Button>
                <Button onClick={() => { setSelectedUser(null); openEditDialog(selectedUser); }}>Edit User</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={!!editUser} onOpenChange={(open) => !open && setEditUser(null)}>
        <DialogContent className="max-w-lg">
          {editUser && (
            <>
              <DialogHeader>
                <DialogTitle>Edit User</DialogTitle>
                <DialogDescription>Update user details and permissions</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Name *</Label>
                    <Input
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email *</Label>
                    <Input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Role *</Label>
                  <Select value={editForm.role} onValueChange={(value) => setEditForm({ ...editForm, role: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map(role => (
                        <SelectItem key={role.id} value={role.name}>{role.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Department *</Label>
                    <Select value={editForm.department} onValueChange={(value) => setEditForm({ ...editForm, department: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IT">IT</SelectItem>
                        <SelectItem value="Operations">Operations</SelectItem>
                        <SelectItem value="Lending">Lending</SelectItem>
                        <SelectItem value="Compliance">Compliance</SelectItem>
                        <SelectItem value="Service">Customer Service</SelectItem>
                        <SelectItem value="Risk">Risk</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Branch *</Label>
                    <Select value={editForm.branch} onValueChange={(value) => setEditForm({ ...editForm, branch: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select branch" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Head Office">Head Office</SelectItem>
                        <SelectItem value="Bengaluru - MG Road">Bengaluru - MG Road</SelectItem>
                        <SelectItem value="Mumbai - Andheri">Mumbai - Andheri</SelectItem>
                        <SelectItem value="Delhi - CP">Delhi - CP</SelectItem>
                        <SelectItem value="Chennai - Anna Salai">Chennai - Anna Salai</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>MFA Enabled</Label>
                    <p className="text-xs text-muted-foreground">Two-factor authentication</p>
                  </div>
                  <Switch
                    checked={editForm.mfaEnabled}
                    onCheckedChange={(checked) => setEditForm({ ...editForm, mfaEnabled: checked })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditUser(null)} disabled={isSubmitting}>Cancel</Button>
                <Button onClick={handleEditUser} disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={!!resetPasswordUser} onOpenChange={(open) => !open && setResetPasswordUser(null)}>
        <DialogContent className="max-w-md">
          {resetPasswordUser && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Reset Password
                </DialogTitle>
                <DialogDescription>
                  Reset password for {resetPasswordUser.name}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800">This action will:</p>
                      <ul className="text-sm text-yellow-700 mt-1 list-disc list-inside">
                        <li>Generate a new temporary password</li>
                        <li>Send it to {resetPasswordUser.email}</li>
                        <li>Force password change on next login</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="sendEmail" defaultChecked />
                  <label htmlFor="sendEmail" className="text-sm">
                    Send new password via email
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="forceChange" defaultChecked />
                  <label htmlFor="forceChange" className="text-sm">
                    Force password change on next login
                  </label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setResetPasswordUser(null)} disabled={isSubmitting}>Cancel</Button>
                <Button onClick={handleResetPassword} disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Reset Password
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Lock/Unlock Dialog */}
      <Dialog open={!!lockUser} onOpenChange={(open) => !open && setLockUser(null)}>
        <DialogContent className="max-w-md">
          {lockUser && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {lockUser.status === "locked" ? (
                    <><Unlock className="h-5 w-5 text-green-600" /> Unlock Account</>
                  ) : lockUser.status === "inactive" ? (
                    <><CheckCircle className="h-5 w-5 text-green-600" /> Activate Account</>
                  ) : (
                    <><Lock className="h-5 w-5 text-red-600" /> Lock Account</>
                  )}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm">
                  {lockUser.status === "locked" ? (
                    <>Are you sure you want to unlock the account for <strong>{lockUser.name}</strong>? They will be able to log in again.</>
                  ) : lockUser.status === "inactive" ? (
                    <>Are you sure you want to activate the account for <strong>{lockUser.name}</strong>? They will be able to log in.</>
                  ) : (
                    <>Are you sure you want to lock the account for <strong>{lockUser.name}</strong>? They will not be able to log in until unlocked.</>
                  )}
                </p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setLockUser(null)} disabled={isSubmitting}>Cancel</Button>
                <Button
                  onClick={handleLockUnlock}
                  disabled={isSubmitting}
                  variant={lockUser.status === "locked" || lockUser.status === "inactive" ? "default" : "destructive"}
                >
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {lockUser.status === "locked" ? "Unlock" : lockUser.status === "inactive" ? "Activate" : "Lock"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={!!deleteUser} onOpenChange={(open) => !open && setDeleteUser(null)}>
        <DialogContent className="max-w-md">
          {deleteUser && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-destructive">
                  <Trash2 className="h-5 w-5" />
                  Delete User
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">
                    Are you sure you want to delete <strong>{deleteUser.name}</strong>? This action cannot be undone.
                  </p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {deleteUser.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{deleteUser.name}</p>
                      <p className="text-sm text-muted-foreground">{deleteUser.email}</p>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDeleteUser(null)} disabled={isSubmitting}>Cancel</Button>
                <Button variant="destructive" onClick={handleDeleteUser} disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Delete User
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
