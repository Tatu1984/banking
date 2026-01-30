import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable, type Column } from "@/components/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import {
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  FileText,
  Phone,
  Mail,
  MapPin,
  Building2,
  User,
  Shield,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useBankingStore, PERMISSIONS, type User as StoreUser } from "@/lib/store";
import type { Customer } from "@/data/mockData";

// Individual customer schema with age validation
const individualCustomerSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^(\+91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}$/, "Invalid phone number"),
  dateOfBirth: z.string().min(1, "Date of birth is required").refine((date) => {
    const birthDate = new Date(date);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ? age - 1
      : age;
    return actualAge >= 18;
  }, "Customer must be at least 18 years old"),
  pan: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format (e.g., ABCDE1234F)"),
  aadhaar: z.string().optional(),
  address: z.string().min(10, "Address must be at least 10 characters"),
  riskCategory: z.enum(["low", "medium", "high"]).default("low"),
});

// Corporate customer schema with CIN validation
const corporateCustomerSchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  cin: z.string().regex(/^[A-Z]{1}[0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/, "Invalid CIN format (e.g., U12345MH2000PTC123456)"),
  pan: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^(\+91[\s-]?)?[2-9]\d{1,2}[\s-]?\d{4}[\s-]?\d{4}$/, "Invalid phone number"),
  registeredAddress: z.string().min(10, "Address must be at least 10 characters"),
  riskCategory: z.enum(["low", "medium", "high"]).default("medium"),
});

type IndividualFormData = z.infer<typeof individualCustomerSchema>;
type CorporateFormData = z.infer<typeof corporateCustomerSchema>;

export function Customers() {
  const [typeFilter, setTypeFilter] = useState("all");
  const [kycFilter, setKycFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerType, setCustomerType] = useState<"individual" | "corporate">("individual");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deactivateDialog, setDeactivateDialog] = useState<{ open: boolean; customer: Customer | null; reason: string }>({
    open: false,
    customer: null,
    reason: "",
  });
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);

  // Store hooks
  const customers = useBankingStore((state) => state.customers);
  const addCustomer = useBankingStore((state) => state.addCustomer);
  const updateCustomer = useBankingStore((state) => state.updateCustomer);
  const deactivateCustomer = useBankingStore((state) => state.deactivateCustomer);
  const hasPermission = useBankingStore((state) => state.hasPermission);

  // Permission checks
  const canCreate = hasPermission(PERMISSIONS.CUSTOMER_CREATE);
  const canEdit = hasPermission(PERMISSIONS.CUSTOMER_EDIT);
  const canDeactivate = hasPermission(PERMISSIONS.CUSTOMER_DEACTIVATE);

  // Individual form
  const individualForm = useForm<IndividualFormData>({
    resolver: zodResolver(individualCustomerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      pan: "",
      aadhaar: "",
      address: "",
      riskCategory: "low",
    },
  });

  // Corporate form
  const corporateForm = useForm<CorporateFormData>({
    resolver: zodResolver(corporateCustomerSchema),
    defaultValues: {
      companyName: "",
      cin: "",
      pan: "",
      email: "",
      phone: "",
      registeredAddress: "",
      riskCategory: "medium",
    },
  });

  // Edit form state
  const [editForm, setEditForm] = useState({
    email: "",
    phone: "",
    address: "",
    riskCategory: "" as "low" | "medium" | "high" | "",
  });

  // Filter customers
  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const matchesType = typeFilter === "all" || customer.type === typeFilter;
      const matchesKyc = kycFilter === "all" || customer.kycStatus === kycFilter;
      return matchesType && matchesKyc;
    });
  }, [customers, typeFilter, kycFilter]);

  // Stats
  const stats = useMemo(() => ({
    total: customers.length,
    individual: customers.filter(c => c.type === "individual").length,
    corporate: customers.filter(c => c.type === "corporate").length,
    kycPending: customers.filter(c => c.kycStatus === "pending" || c.kycStatus === "expired").length,
  }), [customers]);

  const handleIndividualSubmit = async (data: IndividualFormData) => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      addCustomer({
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        phone: data.phone,
        type: "individual",
        kycStatus: "pending",
        riskCategory: data.riskCategory,
        dateOfBirth: data.dateOfBirth,
        pan: data.pan,
        aadhaar: data.aadhaar,
        address: data.address,
      });

      toast({
        title: "Customer Created",
        description: `${data.firstName} ${data.lastName} has been added successfully.`,
        variant: "success",
      });
      setIsAddDialogOpen(false);
      individualForm.reset();
    } catch {
      toast({
        title: "Error",
        description: "Failed to create customer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCorporateSubmit = async (data: CorporateFormData) => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      addCustomer({
        name: data.companyName,
        email: data.email,
        phone: data.phone,
        type: "corporate",
        kycStatus: "pending",
        riskCategory: data.riskCategory,
        pan: data.pan,
        address: data.registeredAddress,
      });

      toast({
        title: "Customer Created",
        description: `${data.companyName} has been added successfully.`,
        variant: "success",
      });
      setIsAddDialogOpen(false);
      corporateForm.reset();
    } catch {
      toast({
        title: "Error",
        description: "Failed to create customer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditCustomer = (customer: Customer) => {
    setEditForm({
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      riskCategory: customer.riskCategory,
    });
    setEditCustomer(customer);
  };

  const handleEditCustomer = async () => {
    if (!editCustomer) return;
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      updateCustomer(editCustomer.id, {
        email: editForm.email,
        phone: editForm.phone,
        address: editForm.address,
        riskCategory: editForm.riskCategory as "low" | "medium" | "high",
      });

      toast({
        title: "Customer Updated",
        description: `${editCustomer.name}'s details have been updated successfully.`,
        variant: "success",
      });
      setEditCustomer(null);
    } catch {
      toast({
        title: "Error",
        description: "Failed to update customer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeactivate = async () => {
    if (!deactivateDialog.customer || !deactivateDialog.reason) return;

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      deactivateCustomer(deactivateDialog.customer.id, deactivateDialog.reason);

      toast({
        title: "Customer Deactivated",
        description: `${deactivateDialog.customer.name} has been deactivated.`,
        variant: "success",
      });
      setDeactivateDialog({ open: false, customer: null, reason: "" });
    } catch {
      toast({
        title: "Error",
        description: "Failed to deactivate customer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      individualForm.reset();
      corporateForm.reset();
      setCustomerType("individual");
    }
    setIsAddDialogOpen(open);
  };

  // Table columns
  const columns: Column<Customer>[] = [
    {
      key: "name",
      header: "Customer",
      render: (customer) => (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback className="bg-primary/10 text-primary">
              {customer.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{customer.name}</p>
            <p className="text-xs text-muted-foreground">
              Since {formatDate(customer.createdAt)}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "cif",
      header: "CIF",
      render: (customer) => (
        <span className="font-mono text-sm">{customer.cif}</span>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: (customer) => (
        <Badge variant="outline">
          {customer.type === "individual" ? (
            <User className="mr-1 h-3 w-3" />
          ) : (
            <Building2 className="mr-1 h-3 w-3" />
          )}
          {customer.type}
        </Badge>
      ),
    },
    {
      key: "email",
      header: "Contact",
      render: (customer) => (
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-sm">
            <Mail className="h-3 w-3 text-muted-foreground" />
            {customer.email}
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Phone className="h-3 w-3 text-muted-foreground" />
            {customer.phone}
          </div>
        </div>
      ),
    },
    {
      key: "kycStatus",
      header: "KYC Status",
      render: (customer) => (
        <Badge
          variant={
            customer.kycStatus === "verified" ? "success" :
            customer.kycStatus === "pending" ? "warning" :
            customer.kycStatus === "expired" ? "secondary" : "destructive"
          }
        >
          {customer.kycStatus}
        </Badge>
      ),
    },
    {
      key: "riskCategory",
      header: "Risk",
      render: (customer) => (
        <Badge
          variant={
            customer.riskCategory === "low" ? "success" :
            customer.riskCategory === "medium" ? "warning" : "destructive"
          }
        >
          {customer.riskCategory}
        </Badge>
      ),
    },
    {
      key: "totalAccounts",
      header: "Accounts",
    },
    {
      key: "totalBalance",
      header: "Total Balance",
      render: (customer) => (
        <span className="font-medium">{formatCurrency(customer.totalBalance)}</span>
      ),
    },
    {
      key: "actions",
      header: "",
      sortable: false,
      render: (customer) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setSelectedCustomer(customer)}>
              <Eye className="mr-2 h-4 w-4" />
              Quick View
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={`/customers/${customer.id}`}>
                <User className="mr-2 h-4 w-4" />
                Full Profile
              </Link>
            </DropdownMenuItem>
            {canEdit && (
              <DropdownMenuItem onClick={() => openEditCustomer(customer)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Customer
              </DropdownMenuItem>
            )}
            <DropdownMenuItem>
              <FileText className="mr-2 h-4 w-4" />
              View Documents
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Shield className="mr-2 h-4 w-4" />
              Update KYC
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to={`/accounts?customer=${customer.id}`}>View Accounts</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={`/transactions?customer=${customer.id}`}>View Transactions</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={`/loans?customer=${customer.id}`}>View Loans</Link>
            </DropdownMenuItem>
            {canDeactivate && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => setDeactivateDialog({ open: true, customer, reason: "" })}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Deactivate
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
          <p className="text-muted-foreground">
            Manage customer profiles, KYC, and relationships
          </p>
        </div>
        <div className="flex items-center gap-2">
          {canCreate && (
            <Dialog open={isAddDialogOpen} onOpenChange={handleDialogClose}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Customer
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Customer</DialogTitle>
                  <DialogDescription>
                    Create a new customer profile. All fields marked with * are required.
                  </DialogDescription>
                </DialogHeader>
                <Tabs value={customerType} onValueChange={(v) => setCustomerType(v as "individual" | "corporate")}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="individual">Individual</TabsTrigger>
                    <TabsTrigger value="corporate">Corporate</TabsTrigger>
                  </TabsList>
                  <TabsContent value="individual" className="mt-4">
                    <Form {...individualForm}>
                      <form onSubmit={individualForm.handleSubmit(handleIndividualSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={individualForm.control}
                            name="firstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel required>First Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter first name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={individualForm.control}
                            name="lastName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel required>Last Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter last name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={individualForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel required>Email</FormLabel>
                                <FormControl>
                                  <Input type="email" placeholder="Enter email" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={individualForm.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel required>Phone</FormLabel>
                                <FormControl>
                                  <Input placeholder="+91 98765 43210" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={individualForm.control}
                            name="dateOfBirth"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel required>Date of Birth</FormLabel>
                                <FormControl>
                                  <Input type="date" max={new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]} {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={individualForm.control}
                            name="pan"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel required>PAN Number</FormLabel>
                                <FormControl>
                                  <Input placeholder="ABCDE1234F" {...field} onChange={(e) => field.onChange(e.target.value.toUpperCase())} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={individualForm.control}
                            name="aadhaar"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Aadhaar Number</FormLabel>
                                <FormControl>
                                  <Input placeholder="XXXX XXXX XXXX" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={individualForm.control}
                            name="riskCategory"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Risk Category</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select risk" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={individualForm.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel required>Address</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter full address" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <DialogFooter>
                          <Button type="button" variant="outline" onClick={() => handleDialogClose(false)} disabled={isSubmitting}>
                            Cancel
                          </Button>
                          <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Customer
                          </Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </TabsContent>
                  <TabsContent value="corporate" className="mt-4">
                    <Form {...corporateForm}>
                      <form onSubmit={corporateForm.handleSubmit(handleCorporateSubmit)} className="space-y-4">
                        <FormField
                          control={corporateForm.control}
                          name="companyName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel required>Company Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter company name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={corporateForm.control}
                            name="cin"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel required>CIN Number</FormLabel>
                                <FormControl>
                                  <Input placeholder="U12345MH2000PTC123456" {...field} onChange={(e) => field.onChange(e.target.value.toUpperCase())} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={corporateForm.control}
                            name="pan"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel required>PAN Number</FormLabel>
                                <FormControl>
                                  <Input placeholder="ABCDE1234F" {...field} onChange={(e) => field.onChange(e.target.value.toUpperCase())} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={corporateForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel required>Email</FormLabel>
                                <FormControl>
                                  <Input type="email" placeholder="Enter email" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={corporateForm.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel required>Phone</FormLabel>
                                <FormControl>
                                  <Input placeholder="+91 22 1234 5678" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={corporateForm.control}
                          name="riskCategory"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Risk Category</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select risk" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="low">Low</SelectItem>
                                  <SelectItem value="medium">Medium</SelectItem>
                                  <SelectItem value="high">High</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={corporateForm.control}
                          name="registeredAddress"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel required>Registered Address</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter registered address" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <DialogFooter>
                          <Button type="button" variant="outline" onClick={() => handleDialogClose(false)} disabled={isSubmitting}>
                            Cancel
                          </Button>
                          <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Customer
                          </Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Customers</p>
                <p className="text-2xl font-bold">{stats.total.toLocaleString()}</p>
              </div>
              <User className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Individual</p>
                <p className="text-2xl font-bold">{stats.individual.toLocaleString()}</p>
              </div>
              <User className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Corporate</p>
                <p className="text-2xl font-bold">{stats.corporate.toLocaleString()}</p>
              </div>
              <Building2 className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">KYC Pending</p>
                <p className="text-2xl font-bold">{stats.kycPending.toLocaleString()}</p>
              </div>
              <Shield className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-4">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Customer Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="individual">Individual</SelectItem>
                <SelectItem value="corporate">Corporate</SelectItem>
              </SelectContent>
            </Select>
            <Select value={kycFilter} onValueChange={setKycFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="KYC Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Customer Table */}
      <Card>
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
          <CardDescription>
            {filteredCustomers.length} customers found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={filteredCustomers}
            columns={columns}
            rowKey="id"
            searchable
            searchPlaceholder="Search by name, CIF, or email..."
            searchKeys={["name", "cif", "email"]}
            pagination
            pageSize={10}
            exportable
            exportFileName="customers"
            emptyMessage="No customers found"
          />
        </CardContent>
      </Card>

      {/* Customer Detail Dialog */}
      <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
        <DialogContent className="max-w-3xl">
          {selectedCustomer && (
            <>
              <DialogHeader>
                <DialogTitle>Customer Profile</DialogTitle>
                <DialogDescription>
                  CIF: {selectedCustomer.cif}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="text-lg bg-primary/10 text-primary">
                      {selectedCustomer.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">{selectedCustomer.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{selectedCustomer.type}</Badge>
                      <Badge
                        variant={
                          selectedCustomer.kycStatus === "verified" ? "success" :
                          selectedCustomer.kycStatus === "pending" ? "warning" : "destructive"
                        }
                      >
                        KYC: {selectedCustomer.kycStatus}
                      </Badge>
                      <Badge
                        variant={
                          selectedCustomer.riskCategory === "low" ? "success" :
                          selectedCustomer.riskCategory === "medium" ? "warning" : "destructive"
                        }
                      >
                        Risk: {selectedCustomer.riskCategory}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Total Balance</p>
                    <p className="text-2xl font-bold">{formatCurrency(selectedCustomer.totalBalance)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Contact Information</p>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{selectedCustomer.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{selectedCustomer.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{selectedCustomer.address}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Account Summary</p>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        <Card>
                          <CardContent className="p-4">
                            <p className="text-2xl font-bold">{selectedCustomer.totalAccounts}</p>
                            <p className="text-xs text-muted-foreground">Active Accounts</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4">
                            <p className="text-2xl font-bold">-</p>
                            <p className="text-xs text-muted-foreground">Active Cards</p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedCustomer(null)}>
                  Close
                </Button>
                {canEdit && (
                  <Button onClick={() => { setSelectedCustomer(null); openEditCustomer(selectedCustomer); }}>
                    Edit Customer
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Customer Dialog */}
      <Dialog open={!!editCustomer} onOpenChange={() => setEditCustomer(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
            <DialogDescription>
              Update customer details for {editCustomer?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone</label>
              <Input
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Address</label>
              <Textarea
                value={editForm.address}
                onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Risk Category</label>
              <Select
                value={editForm.riskCategory}
                onValueChange={(v) => setEditForm({ ...editForm, riskCategory: v as "low" | "medium" | "high" })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditCustomer(null)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleEditCustomer} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deactivate Confirmation Dialog */}
      <Dialog open={deactivateDialog.open} onOpenChange={(open) => setDeactivateDialog({ ...deactivateDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Deactivate Customer
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to deactivate {deactivateDialog.customer?.name}? This action will:
            </DialogDescription>
          </DialogHeader>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
            <li>Freeze all associated accounts</li>
            <li>Block all cards</li>
            <li>Suspend pending transactions</li>
            <li>Require manager approval to reactivate</li>
          </ul>
          <div className="space-y-2">
            <label className="text-sm font-medium">Reason for deactivation *</label>
            <Textarea
              placeholder="Enter reason for deactivation..."
              value={deactivateDialog.reason}
              onChange={(e) => setDeactivateDialog({ ...deactivateDialog, reason: e.target.value })}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeactivateDialog({ open: false, customer: null, reason: "" })}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeactivate}
              disabled={isSubmitting || !deactivateDialog.reason.trim()}
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Deactivate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
