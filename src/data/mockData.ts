// Mock data for Enterprise Core Banking System

export interface Customer {
  id: string;
  cif: string;
  name: string;
  email: string;
  phone: string;
  type: "individual" | "corporate";
  kycStatus: "pending" | "verified" | "rejected" | "expired";
  riskCategory: "low" | "medium" | "high";
  dateOfBirth?: string;
  pan?: string;
  aadhaar?: string;
  address: string;
  createdAt: string;
  lastUpdated: string;
  totalAccounts: number;
  totalBalance: number;
}

export interface Account {
  id: string;
  accountNumber: string;
  customerId: string;
  customerName: string;
  type: "savings" | "current" | "fd" | "rd" | "escrow";
  status: "active" | "dormant" | "frozen" | "closed";
  balance: number;
  currency: string;
  branch: string;
  interestRate: number;
  openDate: string;
  lastTransaction: string;
}

export interface Transaction {
  id: string;
  referenceNumber: string;
  accountId: string;
  accountNumber: string;
  type: "credit" | "debit";
  category: "transfer" | "payment" | "withdrawal" | "deposit" | "interest" | "fee";
  amount: number;
  currency: string;
  description: string;
  status: "completed" | "pending" | "failed" | "processing";
  timestamp: string;
  balanceAfter: number;
  channel: string;
}

export interface Payment {
  id: string;
  referenceNumber: string;
  fromAccount: string;
  toAccount: string;
  beneficiaryName: string;
  amount: number;
  currency: string;
  type: "NEFT" | "RTGS" | "IMPS" | "UPI" | "Internal";
  status: "completed" | "pending" | "failed" | "processing";
  initiatedAt: string;
  completedAt?: string;
  remarks: string;
}

export interface Card {
  id: string;
  cardNumber: string;
  maskedNumber: string;
  customerId: string;
  customerName: string;
  type: "debit" | "credit" | "prepaid";
  variant: "classic" | "gold" | "platinum" | "business";
  status: "active" | "blocked" | "expired" | "pending";
  expiryDate: string;
  dailyLimit: number;
  monthlyLimit: number;
  issuedDate: string;
}

export interface Loan {
  id: string;
  loanNumber: string;
  customerId: string;
  customerName: string;
  type: "personal" | "home" | "auto" | "business" | "education";
  principalAmount: number;
  outstandingAmount: number;
  interestRate: number;
  tenure: number;
  emiAmount: number;
  status: "active" | "closed" | "npa" | "restructured";
  disbursedDate: string;
  nextEmiDate: string;
  collateral?: string;
}

export interface LoanApplication {
  id: string;
  applicationNumber: string;
  customerId: string;
  customerName: string;
  loanType: "personal" | "home" | "auto" | "business" | "education";
  requestedAmount: number;
  approvedAmount?: number;
  status: "submitted" | "under_review" | "approved" | "rejected" | "disbursed";
  creditScore: number;
  submittedAt: string;
  processedAt?: string;
  remarks?: string;
}

export interface GLEntry {
  id: string;
  entryNumber: string;
  accountCode: string;
  accountName: string;
  type: "debit" | "credit";
  amount: number;
  currency: string;
  description: string;
  transactionRef: string;
  postingDate: string;
  valueDate: string;
  branch: string;
}

export interface Alert {
  id: string;
  type: "aml" | "fraud" | "limit" | "compliance" | "system";
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  status: "new" | "investigating" | "resolved" | "escalated";
  createdAt: string;
  assignedTo?: string;
  relatedEntity?: string;
}

export interface Workflow {
  id: string;
  workflowNumber: string;
  type: "account_opening" | "loan_approval" | "kyc_update" | "limit_change" | "payment_approval";
  status: "pending" | "approved" | "rejected" | "escalated";
  initiatedBy: string;
  currentApprover: string;
  level: number;
  totalLevels: number;
  createdAt: string;
  description: string;
}

// Mock Customers
export const customers: Customer[] = [
  {
    id: "1",
    cif: "CIF001234567",
    name: "Rajesh Kumar Sharma",
    email: "rajesh.sharma@email.com",
    phone: "+91 98765 43210",
    type: "individual",
    kycStatus: "verified",
    riskCategory: "low",
    dateOfBirth: "1985-03-15",
    pan: "ABCDE1234F",
    aadhaar: "XXXX XXXX 1234",
    address: "123, MG Road, Bengaluru, Karnataka 560001",
    createdAt: "2020-01-15",
    lastUpdated: "2024-01-10",
    totalAccounts: 3,
    totalBalance: 2547890.50
  },
  {
    id: "2",
    cif: "CIF001234568",
    name: "Priya Patel",
    email: "priya.patel@email.com",
    phone: "+91 87654 32109",
    type: "individual",
    kycStatus: "verified",
    riskCategory: "low",
    dateOfBirth: "1990-07-22",
    pan: "FGHIJ5678K",
    aadhaar: "XXXX XXXX 5678",
    address: "456, Link Road, Mumbai, Maharashtra 400001",
    createdAt: "2021-03-20",
    lastUpdated: "2024-02-05",
    totalAccounts: 2,
    totalBalance: 1234567.00
  },
  {
    id: "3",
    cif: "CIF001234569",
    name: "TechCorp Solutions Pvt Ltd",
    email: "finance@techcorp.com",
    phone: "+91 22 4567 8900",
    type: "corporate",
    kycStatus: "verified",
    riskCategory: "medium",
    pan: "AABCT1234M",
    address: "Tech Park, Whitefield, Bengaluru 560066",
    createdAt: "2019-06-10",
    lastUpdated: "2024-01-28",
    totalAccounts: 5,
    totalBalance: 45678901.25
  },
  {
    id: "4",
    cif: "CIF001234570",
    name: "Amit Singh",
    email: "amit.singh@email.com",
    phone: "+91 99887 76655",
    type: "individual",
    kycStatus: "pending",
    riskCategory: "medium",
    dateOfBirth: "1978-11-30",
    pan: "KLMNO9012P",
    address: "789, Civil Lines, Delhi 110001",
    createdAt: "2024-01-20",
    lastUpdated: "2024-01-20",
    totalAccounts: 1,
    totalBalance: 50000.00
  },
  {
    id: "5",
    cif: "CIF001234571",
    name: "GlobalTrade Exports",
    email: "contact@globaltrade.in",
    phone: "+91 44 2345 6789",
    type: "corporate",
    kycStatus: "expired",
    riskCategory: "high",
    pan: "AABCG5678N",
    address: "Export Zone, Chennai 600001",
    createdAt: "2018-02-14",
    lastUpdated: "2023-02-14",
    totalAccounts: 8,
    totalBalance: 123456789.00
  }
];

// Mock Accounts
export const accounts: Account[] = [
  {
    id: "1",
    accountNumber: "1234567890123456",
    customerId: "1",
    customerName: "Rajesh Kumar Sharma",
    type: "savings",
    status: "active",
    balance: 2547890.50,
    currency: "INR",
    branch: "Bengaluru - MG Road",
    interestRate: 4.5,
    openDate: "2020-01-15",
    lastTransaction: "2024-01-28"
  },
  {
    id: "2",
    accountNumber: "1234567890123457",
    customerId: "1",
    customerName: "Rajesh Kumar Sharma",
    type: "fd",
    status: "active",
    balance: 500000.00,
    currency: "INR",
    branch: "Bengaluru - MG Road",
    interestRate: 7.5,
    openDate: "2023-06-15",
    lastTransaction: "2024-01-15"
  },
  {
    id: "3",
    accountNumber: "1234567890123458",
    customerId: "2",
    customerName: "Priya Patel",
    type: "savings",
    status: "active",
    balance: 1234567.00,
    currency: "INR",
    branch: "Mumbai - Andheri",
    interestRate: 4.5,
    openDate: "2021-03-20",
    lastTransaction: "2024-01-27"
  },
  {
    id: "4",
    accountNumber: "1234567890123459",
    customerId: "3",
    customerName: "TechCorp Solutions Pvt Ltd",
    type: "current",
    status: "active",
    balance: 45678901.25,
    currency: "INR",
    branch: "Bengaluru - Whitefield",
    interestRate: 0,
    openDate: "2019-06-10",
    lastTransaction: "2024-01-28"
  },
  {
    id: "5",
    accountNumber: "1234567890123460",
    customerId: "4",
    customerName: "Amit Singh",
    type: "savings",
    status: "dormant",
    balance: 50000.00,
    currency: "INR",
    branch: "Delhi - CP",
    interestRate: 4.5,
    openDate: "2024-01-20",
    lastTransaction: "2024-01-20"
  },
  {
    id: "6",
    accountNumber: "1234567890123461",
    customerId: "5",
    customerName: "GlobalTrade Exports",
    type: "current",
    status: "frozen",
    balance: 123456789.00,
    currency: "INR",
    branch: "Chennai - Anna Salai",
    interestRate: 0,
    openDate: "2018-02-14",
    lastTransaction: "2023-12-15"
  }
];

// Mock Transactions
export const transactions: Transaction[] = [
  {
    id: "1",
    referenceNumber: "TXN202401280001",
    accountId: "1",
    accountNumber: "1234567890123456",
    type: "credit",
    category: "transfer",
    amount: 150000.00,
    currency: "INR",
    description: "NEFT from HDFC Bank - Salary",
    status: "completed",
    timestamp: "2024-01-28T10:30:00Z",
    balanceAfter: 2547890.50,
    channel: "NEFT"
  },
  {
    id: "2",
    referenceNumber: "TXN202401280002",
    accountId: "1",
    accountNumber: "1234567890123456",
    type: "debit",
    category: "payment",
    amount: 25000.00,
    currency: "INR",
    description: "Credit Card Bill Payment",
    status: "completed",
    timestamp: "2024-01-28T11:15:00Z",
    balanceAfter: 2522890.50,
    channel: "NetBanking"
  },
  {
    id: "3",
    referenceNumber: "TXN202401280003",
    accountId: "4",
    accountNumber: "1234567890123459",
    type: "debit",
    category: "transfer",
    amount: 5000000.00,
    currency: "INR",
    description: "Vendor Payment - Invoice #INV-2024-001",
    status: "processing",
    timestamp: "2024-01-28T14:00:00Z",
    balanceAfter: 40678901.25,
    channel: "RTGS"
  },
  {
    id: "4",
    referenceNumber: "TXN202401270001",
    accountId: "3",
    accountNumber: "1234567890123458",
    type: "credit",
    category: "deposit",
    amount: 100000.00,
    currency: "INR",
    description: "Cash Deposit at Branch",
    status: "completed",
    timestamp: "2024-01-27T09:00:00Z",
    balanceAfter: 1234567.00,
    channel: "Branch"
  },
  {
    id: "5",
    referenceNumber: "TXN202401260001",
    accountId: "1",
    accountNumber: "1234567890123456",
    type: "debit",
    category: "withdrawal",
    amount: 50000.00,
    currency: "INR",
    description: "ATM Withdrawal",
    status: "completed",
    timestamp: "2024-01-26T18:30:00Z",
    balanceAfter: 2397890.50,
    channel: "ATM"
  }
];

// Mock Payments
export const payments: Payment[] = [
  {
    id: "1",
    referenceNumber: "PAY202401280001",
    fromAccount: "1234567890123456",
    toAccount: "9876543210987654",
    beneficiaryName: "Utilities Company Ltd",
    amount: 5500.00,
    currency: "INR",
    type: "IMPS",
    status: "completed",
    initiatedAt: "2024-01-28T09:00:00Z",
    completedAt: "2024-01-28T09:00:15Z",
    remarks: "Electricity Bill - Jan 2024"
  },
  {
    id: "2",
    referenceNumber: "PAY202401280002",
    fromAccount: "1234567890123459",
    toAccount: "5678901234567890",
    beneficiaryName: "Raw Materials Supplier",
    amount: 2500000.00,
    currency: "INR",
    type: "RTGS",
    status: "processing",
    initiatedAt: "2024-01-28T10:30:00Z",
    remarks: "Purchase Order #PO-2024-156"
  },
  {
    id: "3",
    referenceNumber: "PAY202401270001",
    fromAccount: "1234567890123458",
    toAccount: "1122334455667788",
    beneficiaryName: "Rent Payment",
    amount: 35000.00,
    currency: "INR",
    type: "NEFT",
    status: "completed",
    initiatedAt: "2024-01-27T11:00:00Z",
    completedAt: "2024-01-27T13:30:00Z",
    remarks: "House Rent - Feb 2024"
  },
  {
    id: "4",
    referenceNumber: "PAY202401280003",
    fromAccount: "1234567890123456",
    toAccount: "ramesh@upi",
    beneficiaryName: "Ramesh Verma",
    amount: 2000.00,
    currency: "INR",
    type: "UPI",
    status: "completed",
    initiatedAt: "2024-01-28T12:15:00Z",
    completedAt: "2024-01-28T12:15:05Z",
    remarks: "Lunch payment"
  },
  {
    id: "5",
    referenceNumber: "PAY202401250001",
    fromAccount: "1234567890123456",
    toAccount: "1234567890123457",
    beneficiaryName: "Self Transfer - FD",
    amount: 100000.00,
    currency: "INR",
    type: "Internal",
    status: "completed",
    initiatedAt: "2024-01-25T15:00:00Z",
    completedAt: "2024-01-25T15:00:01Z",
    remarks: "FD Investment"
  }
];

// Mock Cards
export const cards: Card[] = [
  {
    id: "1",
    cardNumber: "4532123456789012",
    maskedNumber: "XXXX XXXX XXXX 9012",
    customerId: "1",
    customerName: "Rajesh Kumar Sharma",
    type: "debit",
    variant: "platinum",
    status: "active",
    expiryDate: "12/2027",
    dailyLimit: 200000,
    monthlyLimit: 1000000,
    issuedDate: "2023-12-01"
  },
  {
    id: "2",
    cardNumber: "5412345678901234",
    maskedNumber: "XXXX XXXX XXXX 1234",
    customerId: "1",
    customerName: "Rajesh Kumar Sharma",
    type: "credit",
    variant: "gold",
    status: "active",
    expiryDate: "06/2026",
    dailyLimit: 100000,
    monthlyLimit: 500000,
    issuedDate: "2022-06-15"
  },
  {
    id: "3",
    cardNumber: "4532987654321098",
    maskedNumber: "XXXX XXXX XXXX 1098",
    customerId: "2",
    customerName: "Priya Patel",
    type: "debit",
    variant: "classic",
    status: "active",
    expiryDate: "03/2026",
    dailyLimit: 100000,
    monthlyLimit: 500000,
    issuedDate: "2021-03-20"
  },
  {
    id: "4",
    cardNumber: "4532111122223333",
    maskedNumber: "XXXX XXXX XXXX 3333",
    customerId: "3",
    customerName: "TechCorp Solutions Pvt Ltd",
    type: "debit",
    variant: "business",
    status: "active",
    expiryDate: "09/2025",
    dailyLimit: 1000000,
    monthlyLimit: 10000000,
    issuedDate: "2022-09-01"
  },
  {
    id: "5",
    cardNumber: "5412000011112222",
    maskedNumber: "XXXX XXXX XXXX 2222",
    customerId: "4",
    customerName: "Amit Singh",
    type: "debit",
    variant: "classic",
    status: "blocked",
    expiryDate: "01/2029",
    dailyLimit: 50000,
    monthlyLimit: 200000,
    issuedDate: "2024-01-20"
  }
];

// Mock Loans
export const loans: Loan[] = [
  {
    id: "1",
    loanNumber: "LN202301001",
    customerId: "1",
    customerName: "Rajesh Kumar Sharma",
    type: "home",
    principalAmount: 5000000,
    outstandingAmount: 4250000,
    interestRate: 8.5,
    tenure: 240,
    emiAmount: 43391,
    status: "active",
    disbursedDate: "2023-01-15",
    nextEmiDate: "2024-02-05",
    collateral: "Property at MG Road, Bengaluru"
  },
  {
    id: "2",
    loanNumber: "LN202302001",
    customerId: "2",
    customerName: "Priya Patel",
    type: "personal",
    principalAmount: 500000,
    outstandingAmount: 320000,
    interestRate: 12.5,
    tenure: 36,
    emiAmount: 16778,
    status: "active",
    disbursedDate: "2023-02-20",
    nextEmiDate: "2024-02-20"
  },
  {
    id: "3",
    loanNumber: "LN202205001",
    customerId: "3",
    customerName: "TechCorp Solutions Pvt Ltd",
    type: "business",
    principalAmount: 25000000,
    outstandingAmount: 18000000,
    interestRate: 10.5,
    tenure: 60,
    emiAmount: 536822,
    status: "active",
    disbursedDate: "2022-05-10",
    nextEmiDate: "2024-02-10",
    collateral: "Machinery and Equipment"
  },
  {
    id: "4",
    loanNumber: "LN202106001",
    customerId: "5",
    customerName: "GlobalTrade Exports",
    type: "business",
    principalAmount: 50000000,
    outstandingAmount: 45000000,
    interestRate: 11.0,
    tenure: 48,
    emiAmount: 1293444,
    status: "npa",
    disbursedDate: "2021-06-14",
    nextEmiDate: "2023-10-14",
    collateral: "Export Receivables"
  }
];

// Mock Loan Applications
export const loanApplications: LoanApplication[] = [
  {
    id: "1",
    applicationNumber: "APP202401001",
    customerId: "4",
    customerName: "Amit Singh",
    loanType: "personal",
    requestedAmount: 300000,
    status: "under_review",
    creditScore: 720,
    submittedAt: "2024-01-25T10:00:00Z",
    remarks: "Documents verification in progress"
  },
  {
    id: "2",
    applicationNumber: "APP202401002",
    customerId: "1",
    customerName: "Rajesh Kumar Sharma",
    loanType: "auto",
    requestedAmount: 800000,
    approvedAmount: 750000,
    status: "approved",
    creditScore: 785,
    submittedAt: "2024-01-20T14:30:00Z",
    processedAt: "2024-01-27T11:00:00Z",
    remarks: "Approved with 6.25% lower amount due to LTV ratio"
  },
  {
    id: "3",
    applicationNumber: "APP202401003",
    customerId: "2",
    customerName: "Priya Patel",
    loanType: "education",
    requestedAmount: 1500000,
    status: "submitted",
    creditScore: 760,
    submittedAt: "2024-01-28T09:15:00Z"
  },
  {
    id: "4",
    applicationNumber: "APP202401004",
    customerId: "3",
    customerName: "TechCorp Solutions Pvt Ltd",
    loanType: "business",
    requestedAmount: 10000000,
    status: "rejected",
    creditScore: 650,
    submittedAt: "2024-01-15T16:00:00Z",
    processedAt: "2024-01-22T10:30:00Z",
    remarks: "Insufficient collateral coverage"
  }
];

// Mock GL Entries
export const glEntries: GLEntry[] = [
  {
    id: "1",
    entryNumber: "GL202401280001",
    accountCode: "1001001",
    accountName: "Savings Deposits",
    type: "credit",
    amount: 150000.00,
    currency: "INR",
    description: "Customer deposit",
    transactionRef: "TXN202401280001",
    postingDate: "2024-01-28",
    valueDate: "2024-01-28",
    branch: "Bengaluru - MG Road"
  },
  {
    id: "2",
    entryNumber: "GL202401280002",
    accountCode: "2001001",
    accountName: "Inter-bank Settlement",
    type: "debit",
    amount: 150000.00,
    currency: "INR",
    description: "NEFT settlement",
    transactionRef: "TXN202401280001",
    postingDate: "2024-01-28",
    valueDate: "2024-01-28",
    branch: "Head Office"
  },
  {
    id: "3",
    entryNumber: "GL202401280003",
    accountCode: "4001001",
    accountName: "Interest Income - Loans",
    type: "credit",
    amount: 35678.50,
    currency: "INR",
    description: "Monthly interest accrual",
    transactionRef: "INT202401280001",
    postingDate: "2024-01-28",
    valueDate: "2024-01-28",
    branch: "Head Office"
  }
];

// Mock Alerts
export const alerts: Alert[] = [
  {
    id: "1",
    type: "aml",
    severity: "high",
    title: "Large Cash Transaction Alert",
    description: "Multiple cash deposits exceeding threshold in 24 hours - Account: 1234567890123461",
    status: "new",
    createdAt: "2024-01-28T08:00:00Z",
    relatedEntity: "CIF001234571"
  },
  {
    id: "2",
    type: "fraud",
    severity: "critical",
    title: "Suspicious Login Attempt",
    description: "Multiple failed login attempts from different geolocations detected",
    status: "investigating",
    createdAt: "2024-01-28T06:30:00Z",
    assignedTo: "Security Team",
    relatedEntity: "CIF001234567"
  },
  {
    id: "3",
    type: "compliance",
    severity: "medium",
    title: "KYC Renewal Required",
    description: "5 customers have KYC expiring in next 30 days",
    status: "new",
    createdAt: "2024-01-28T00:00:00Z"
  },
  {
    id: "4",
    type: "limit",
    severity: "low",
    title: "Transaction Limit Breach Attempt",
    description: "Customer attempted transaction exceeding daily limit",
    status: "resolved",
    createdAt: "2024-01-27T15:45:00Z",
    relatedEntity: "CIF001234568"
  },
  {
    id: "5",
    type: "system",
    severity: "medium",
    title: "Database Performance Alert",
    description: "Query response time exceeding threshold on reporting database",
    status: "investigating",
    createdAt: "2024-01-28T07:15:00Z",
    assignedTo: "IT Operations"
  }
];

// Mock Workflows
export const workflows: Workflow[] = [
  {
    id: "1",
    workflowNumber: "WF202401280001",
    type: "account_opening",
    status: "pending",
    initiatedBy: "Branch Officer",
    currentApprover: "Branch Manager",
    level: 1,
    totalLevels: 2,
    createdAt: "2024-01-28T10:00:00Z",
    description: "New savings account opening for Amit Singh"
  },
  {
    id: "2",
    workflowNumber: "WF202401270001",
    type: "loan_approval",
    status: "approved",
    initiatedBy: "Loan Officer",
    currentApprover: "Credit Committee",
    level: 3,
    totalLevels: 3,
    createdAt: "2024-01-27T14:00:00Z",
    description: "Auto loan approval for Rajesh Kumar Sharma - INR 7,50,000"
  },
  {
    id: "3",
    workflowNumber: "WF202401280002",
    type: "payment_approval",
    status: "pending",
    initiatedBy: "Corporate Maker",
    currentApprover: "Corporate Checker",
    level: 1,
    totalLevels: 2,
    createdAt: "2024-01-28T11:30:00Z",
    description: "RTGS payment of INR 25,00,000 to Raw Materials Supplier"
  },
  {
    id: "4",
    workflowNumber: "WF202401260001",
    type: "limit_change",
    status: "escalated",
    initiatedBy: "Customer Service",
    currentApprover: "Risk Manager",
    level: 2,
    totalLevels: 3,
    createdAt: "2024-01-26T09:00:00Z",
    description: "Request to increase daily card limit to INR 5,00,000"
  }
];

// Dashboard Metrics
export const dashboardMetrics = {
  totalCustomers: 1250000,
  activeAccounts: 2450000,
  totalDeposits: 45678901234,
  totalLoans: 23456789012,
  todayTransactions: 125678,
  todayVolume: 5678901234,
  pendingWorkflows: 156,
  activeAlerts: 23,
  npaRatio: 2.34,
  capitalAdequacy: 15.67,
  liquidity: 28.45,
  roi: 12.34
};

// Branch Data
export const branches = [
  { id: "1", name: "Bengaluru - MG Road", code: "BLR001", region: "South" },
  { id: "2", name: "Mumbai - Andheri", code: "MUM001", region: "West" },
  { id: "3", name: "Delhi - CP", code: "DEL001", region: "North" },
  { id: "4", name: "Chennai - Anna Salai", code: "CHN001", region: "South" },
  { id: "5", name: "Bengaluru - Whitefield", code: "BLR002", region: "South" },
  { id: "6", name: "Kolkata - Park Street", code: "KOL001", region: "East" }
];

// Users for assignment
export const users = [
  { id: "1", name: "Admin User", role: "System Admin", department: "IT" },
  { id: "2", name: "Suresh Kumar", role: "Branch Manager", department: "Operations" },
  { id: "3", name: "Meera Reddy", role: "Loan Officer", department: "Lending" },
  { id: "4", name: "Vikram Joshi", role: "Compliance Officer", department: "Compliance" },
  { id: "5", name: "Anita Desai", role: "Risk Analyst", department: "Risk" }
];

// Card Disputes Interface
export interface CardDispute {
  id: string;
  disputeNumber: string;
  cardId: string;
  cardNumber: string;
  customerName: string;
  customerId: string;
  transactionRef: string;
  transactionDate: string;
  disputeAmount: number;
  currency: string;
  category: "fraud" | "merchant" | "atm" | "duplicate" | "non_receipt" | "quality";
  status: "open" | "investigating" | "chargeback_filed" | "resolved" | "rejected" | "arbitration";
  priority: "low" | "medium" | "high" | "critical";
  filedDate: string;
  resolvedDate?: string;
  resolution?: string;
  merchantName: string;
  assignedTo?: string;
  remarks?: string;
}

// Mock Card Disputes
export const cardDisputes: CardDispute[] = [
  {
    id: "1",
    disputeNumber: "DSP2024010001",
    cardId: "1",
    cardNumber: "XXXX XXXX XXXX 9012",
    customerName: "Rajesh Kumar Sharma",
    customerId: "1",
    transactionRef: "TXN202401150001",
    transactionDate: "2024-01-15",
    disputeAmount: 45000,
    currency: "INR",
    category: "fraud",
    status: "investigating",
    priority: "high",
    filedDate: "2024-01-18",
    merchantName: "Unknown Online Store",
    assignedTo: "Dispute Team",
    remarks: "Customer claims card was not used for this transaction"
  },
  {
    id: "2",
    disputeNumber: "DSP2024010002",
    cardId: "2",
    cardNumber: "XXXX XXXX XXXX 1234",
    customerName: "Rajesh Kumar Sharma",
    customerId: "1",
    transactionRef: "TXN202401200001",
    transactionDate: "2024-01-20",
    disputeAmount: 12500,
    currency: "INR",
    category: "merchant",
    status: "chargeback_filed",
    priority: "medium",
    filedDate: "2024-01-22",
    merchantName: "Electronics World",
    assignedTo: "Chargeback Team",
    remarks: "Product not received despite payment"
  },
  {
    id: "3",
    disputeNumber: "DSP2024010003",
    cardId: "3",
    cardNumber: "XXXX XXXX XXXX 1098",
    customerName: "Priya Patel",
    customerId: "2",
    transactionRef: "TXN202401100001",
    transactionDate: "2024-01-10",
    disputeAmount: 5000,
    currency: "INR",
    category: "duplicate",
    status: "resolved",
    priority: "low",
    filedDate: "2024-01-12",
    resolvedDate: "2024-01-25",
    resolution: "Amount credited back to customer account",
    merchantName: "Coffee Shop",
    remarks: "Duplicate charge at POS terminal"
  },
  {
    id: "4",
    disputeNumber: "DSP2024010004",
    cardId: "4",
    cardNumber: "XXXX XXXX XXXX 3333",
    customerName: "TechCorp Solutions Pvt Ltd",
    customerId: "3",
    transactionRef: "TXN202401220001",
    transactionDate: "2024-01-22",
    disputeAmount: 250000,
    currency: "INR",
    category: "quality",
    status: "arbitration",
    priority: "critical",
    filedDate: "2024-01-24",
    merchantName: "Office Supplies Inc",
    assignedTo: "Legal Team",
    remarks: "Goods received were defective, merchant not responding"
  },
  {
    id: "5",
    disputeNumber: "DSP2024010005",
    cardId: "5",
    cardNumber: "XXXX XXXX XXXX 2222",
    customerName: "Amit Singh",
    customerId: "4",
    transactionRef: "TXN202401250001",
    transactionDate: "2024-01-25",
    disputeAmount: 10000,
    currency: "INR",
    category: "atm",
    status: "open",
    priority: "high",
    filedDate: "2024-01-26",
    merchantName: "ATM - SBI Branch Delhi",
    remarks: "Cash not dispensed but account debited"
  }
];

// Treasury Position Interface
export interface TreasuryPosition {
  id: string;
  currency: string;
  nostroBalance: number;
  vostroBalance: number;
  netPosition: number;
  spotRate: number;
  forwardRate: number;
  mtmValue: number;
  limit: number;
  utilization: number;
}

// Mock Treasury Positions
export const treasuryPositions: TreasuryPosition[] = [
  {
    id: "1",
    currency: "USD",
    nostroBalance: 125000000,
    vostroBalance: 85000000,
    netPosition: 40000000,
    spotRate: 83.25,
    forwardRate: 83.45,
    mtmValue: 3330000000,
    limit: 200000000,
    utilization: 62.5
  },
  {
    id: "2",
    currency: "EUR",
    nostroBalance: 45000000,
    vostroBalance: 30000000,
    netPosition: 15000000,
    spotRate: 90.50,
    forwardRate: 90.75,
    mtmValue: 1357500000,
    limit: 75000000,
    utilization: 60.0
  },
  {
    id: "3",
    currency: "GBP",
    nostroBalance: 25000000,
    vostroBalance: 18000000,
    netPosition: 7000000,
    spotRate: 105.25,
    forwardRate: 105.50,
    mtmValue: 736750000,
    limit: 50000000,
    utilization: 50.0
  },
  {
    id: "4",
    currency: "JPY",
    nostroBalance: 5000000000,
    vostroBalance: 3500000000,
    netPosition: 1500000000,
    spotRate: 0.56,
    forwardRate: 0.565,
    mtmValue: 840000000,
    limit: 8000000000,
    utilization: 62.5
  },
  {
    id: "5",
    currency: "SGD",
    nostroBalance: 35000000,
    vostroBalance: 22000000,
    netPosition: 13000000,
    spotRate: 62.15,
    forwardRate: 62.35,
    mtmValue: 807950000,
    limit: 60000000,
    utilization: 58.3
  }
];

// ALM Gap Analysis Interface
export interface ALMBucket {
  id: string;
  bucket: string;
  assets: number;
  liabilities: number;
  gap: number;
  cumulativeGap: number;
  gapRatio: number;
}

// Mock ALM Data
export const almBuckets: ALMBucket[] = [
  { id: "1", bucket: "0-7 Days", assets: 125000000000, liabilities: 145000000000, gap: -20000000000, cumulativeGap: -20000000000, gapRatio: -13.8 },
  { id: "2", bucket: "8-14 Days", assets: 85000000000, liabilities: 75000000000, gap: 10000000000, cumulativeGap: -10000000000, gapRatio: 13.3 },
  { id: "3", bucket: "15-30 Days", assets: 110000000000, liabilities: 95000000000, gap: 15000000000, cumulativeGap: 5000000000, gapRatio: 15.8 },
  { id: "4", bucket: "1-3 Months", assets: 250000000000, liabilities: 220000000000, gap: 30000000000, cumulativeGap: 35000000000, gapRatio: 13.6 },
  { id: "5", bucket: "3-6 Months", assets: 180000000000, liabilities: 195000000000, gap: -15000000000, cumulativeGap: 20000000000, gapRatio: -7.7 },
  { id: "6", bucket: "6-12 Months", assets: 320000000000, liabilities: 280000000000, gap: 40000000000, cumulativeGap: 60000000000, gapRatio: 14.3 },
  { id: "7", bucket: "1-3 Years", assets: 450000000000, liabilities: 420000000000, gap: 30000000000, cumulativeGap: 90000000000, gapRatio: 7.1 },
  { id: "8", bucket: "3-5 Years", assets: 280000000000, liabilities: 250000000000, gap: 30000000000, cumulativeGap: 120000000000, gapRatio: 12.0 },
  { id: "9", bucket: ">5 Years", assets: 200000000000, liabilities: 320000000000, gap: -120000000000, cumulativeGap: 0, gapRatio: -37.5 }
];

// Reconciliation Interface
export interface ReconciliationItem {
  id: string;
  reconciliationType: "nostro" | "vostro" | "gl" | "interbank" | "atm" | "pos";
  accountName: string;
  accountNumber: string;
  currency: string;
  bookBalance: number;
  counterpartyBalance: number;
  difference: number;
  status: "matched" | "unmatched" | "pending" | "exception";
  lastReconDate: string;
  exceptions: number;
  matchRate: number;
}

// Mock Reconciliation Data
export const reconciliationItems: ReconciliationItem[] = [
  {
    id: "1",
    reconciliationType: "nostro",
    accountName: "Citibank New York - USD",
    accountNumber: "4567890123",
    currency: "USD",
    bookBalance: 125000000,
    counterpartyBalance: 124985000,
    difference: 15000,
    status: "exception",
    lastReconDate: "2024-01-28",
    exceptions: 3,
    matchRate: 99.2
  },
  {
    id: "2",
    reconciliationType: "nostro",
    accountName: "Deutsche Bank Frankfurt - EUR",
    accountNumber: "7890123456",
    currency: "EUR",
    bookBalance: 45000000,
    counterpartyBalance: 45000000,
    difference: 0,
    status: "matched",
    lastReconDate: "2024-01-28",
    exceptions: 0,
    matchRate: 100
  },
  {
    id: "3",
    reconciliationType: "vostro",
    accountName: "Bank of America - INR",
    accountNumber: "1234567890",
    currency: "INR",
    bookBalance: 850000000,
    counterpartyBalance: 850250000,
    difference: -250000,
    status: "exception",
    lastReconDate: "2024-01-28",
    exceptions: 5,
    matchRate: 98.5
  },
  {
    id: "4",
    reconciliationType: "gl",
    accountName: "Savings Deposits - GL",
    accountNumber: "1001001",
    currency: "INR",
    bookBalance: 45678901234,
    counterpartyBalance: 45678901234,
    difference: 0,
    status: "matched",
    lastReconDate: "2024-01-28",
    exceptions: 0,
    matchRate: 100
  },
  {
    id: "5",
    reconciliationType: "atm",
    accountName: "ATM Switch Settlement",
    accountNumber: "ATM001",
    currency: "INR",
    bookBalance: 125000000,
    counterpartyBalance: 124750000,
    difference: 250000,
    status: "pending",
    lastReconDate: "2024-01-28",
    exceptions: 12,
    matchRate: 97.8
  },
  {
    id: "6",
    reconciliationType: "pos",
    accountName: "POS Merchant Settlement",
    accountNumber: "POS001",
    currency: "INR",
    bookBalance: 85000000,
    counterpartyBalance: 84950000,
    difference: 50000,
    status: "unmatched",
    lastReconDate: "2024-01-28",
    exceptions: 8,
    matchRate: 99.1
  }
];

// Risk Metrics Interface
export interface RiskMetric {
  id: string;
  category: "credit" | "market" | "operational" | "liquidity";
  metricName: string;
  currentValue: number;
  threshold: number;
  limit: number;
  trend: "up" | "down" | "stable";
  status: "green" | "amber" | "red";
  lastUpdated: string;
}

// Mock Risk Metrics
export const riskMetrics: RiskMetric[] = [
  { id: "1", category: "market", metricName: "Value at Risk (VaR) - 1 Day", currentValue: 2500000000, threshold: 3000000000, limit: 5000000000, trend: "up", status: "green", lastUpdated: "2024-01-28T10:00:00Z" },
  { id: "2", category: "market", metricName: "VaR - 10 Day", currentValue: 7500000000, threshold: 9000000000, limit: 15000000000, trend: "stable", status: "green", lastUpdated: "2024-01-28T10:00:00Z" },
  { id: "3", category: "credit", metricName: "Expected Credit Loss (ECL)", currentValue: 12500000000, threshold: 15000000000, limit: 20000000000, trend: "up", status: "amber", lastUpdated: "2024-01-28T10:00:00Z" },
  { id: "4", category: "credit", metricName: "Credit VaR", currentValue: 8500000000, threshold: 10000000000, limit: 15000000000, trend: "down", status: "green", lastUpdated: "2024-01-28T10:00:00Z" },
  { id: "5", category: "liquidity", metricName: "Liquidity Coverage Ratio", currentValue: 128.5, threshold: 110, limit: 100, trend: "stable", status: "green", lastUpdated: "2024-01-28T10:00:00Z" },
  { id: "6", category: "liquidity", metricName: "Net Stable Funding Ratio", currentValue: 115.2, threshold: 105, limit: 100, trend: "up", status: "green", lastUpdated: "2024-01-28T10:00:00Z" },
  { id: "7", category: "operational", metricName: "Operational Loss Events", currentValue: 45, threshold: 50, limit: 100, trend: "up", status: "amber", lastUpdated: "2024-01-28T10:00:00Z" },
  { id: "8", category: "operational", metricName: "System Downtime (mins)", currentValue: 12, threshold: 30, limit: 60, trend: "down", status: "green", lastUpdated: "2024-01-28T10:00:00Z" }
];

// Stress Test Results Interface
export interface StressTestResult {
  id: string;
  scenarioName: string;
  scenarioType: "historical" | "hypothetical" | "regulatory";
  impactOnCapital: number;
  impactOnNII: number;
  impactOnNPA: number;
  capitalPostStress: number;
  carPostStress: number;
  status: "pass" | "fail" | "warning";
  lastRunDate: string;
}

// Mock Stress Test Results
export const stressTestResults: StressTestResult[] = [
  { id: "1", scenarioName: "2008 Financial Crisis", scenarioType: "historical", impactOnCapital: -45000000000, impactOnNII: -8500000000, impactOnNPA: 2.5, capitalPostStress: 355000000000, carPostStress: 12.8, status: "pass", lastRunDate: "2024-01-28" },
  { id: "2", scenarioName: "COVID-19 Pandemic", scenarioType: "historical", impactOnCapital: -35000000000, impactOnNII: -6200000000, impactOnNPA: 1.8, capitalPostStress: 365000000000, carPostStress: 13.2, status: "pass", lastRunDate: "2024-01-28" },
  { id: "3", scenarioName: "RBI Adverse Scenario", scenarioType: "regulatory", impactOnCapital: -55000000000, impactOnNII: -12000000000, impactOnNPA: 3.2, capitalPostStress: 345000000000, carPostStress: 11.5, status: "warning", lastRunDate: "2024-01-28" },
  { id: "4", scenarioName: "Interest Rate Shock +300bps", scenarioType: "hypothetical", impactOnCapital: -25000000000, impactOnNII: 15000000000, impactOnNPA: 0.5, capitalPostStress: 375000000000, carPostStress: 14.2, status: "pass", lastRunDate: "2024-01-28" },
  { id: "5", scenarioName: "Currency Depreciation 20%", scenarioType: "hypothetical", impactOnCapital: -18000000000, impactOnNII: -4500000000, impactOnNPA: 0.8, capitalPostStress: 382000000000, carPostStress: 14.5, status: "pass", lastRunDate: "2024-01-28" }
];

// Loan Restructuring Interface
export interface LoanRestructuring {
  id: string;
  restructuringNumber: string;
  loanId: string;
  loanNumber: string;
  customerId: string;
  customerName: string;
  originalPrincipal: number;
  currentOutstanding: number;
  restructuredAmount: number;
  originalTenure: number;
  revisedTenure: number;
  originalRate: number;
  revisedRate: number;
  moratoriumPeriod: number;
  status: "proposed" | "under_review" | "approved" | "rejected" | "implemented";
  restructuringType: "moratorium" | "tenure_extension" | "rate_reduction" | "principal_haircut" | "combination";
  proposedDate: string;
  approvedDate?: string;
  implementedDate?: string;
  provisioningStage: "stage1" | "stage2" | "stage3";
  eclAmount: number;
  remarks?: string;
}

// Mock Loan Restructuring Data
export const loanRestructurings: LoanRestructuring[] = [
  {
    id: "1",
    restructuringNumber: "RST2024010001",
    loanId: "4",
    loanNumber: "LN202106001",
    customerId: "5",
    customerName: "GlobalTrade Exports",
    originalPrincipal: 50000000,
    currentOutstanding: 45000000,
    restructuredAmount: 45000000,
    originalTenure: 48,
    revisedTenure: 72,
    originalRate: 11.0,
    revisedRate: 10.0,
    moratoriumPeriod: 6,
    status: "under_review",
    restructuringType: "combination",
    proposedDate: "2024-01-20",
    provisioningStage: "stage3",
    eclAmount: 22500000,
    remarks: "COVID impact on export business"
  },
  {
    id: "2",
    restructuringNumber: "RST2024010002",
    loanId: "3",
    loanNumber: "LN202205001",
    customerId: "3",
    customerName: "TechCorp Solutions Pvt Ltd",
    originalPrincipal: 25000000,
    currentOutstanding: 18000000,
    restructuredAmount: 18000000,
    originalTenure: 60,
    revisedTenure: 84,
    originalRate: 10.5,
    revisedRate: 10.5,
    moratoriumPeriod: 3,
    status: "approved",
    restructuringType: "tenure_extension",
    proposedDate: "2024-01-15",
    approvedDate: "2024-01-25",
    provisioningStage: "stage2",
    eclAmount: 1800000,
    remarks: "Temporary cash flow issue"
  },
  {
    id: "3",
    restructuringNumber: "RST2024010003",
    loanId: "1",
    loanNumber: "LN202301001",
    customerId: "1",
    customerName: "Rajesh Kumar Sharma",
    originalPrincipal: 5000000,
    currentOutstanding: 4250000,
    restructuredAmount: 4250000,
    originalTenure: 240,
    revisedTenure: 240,
    originalRate: 8.5,
    revisedRate: 8.0,
    moratoriumPeriod: 0,
    status: "implemented",
    restructuringType: "rate_reduction",
    proposedDate: "2024-01-05",
    approvedDate: "2024-01-10",
    implementedDate: "2024-01-15",
    provisioningStage: "stage1",
    eclAmount: 42500,
    remarks: "Rate reduction as per RBI guidelines"
  }
];

// Supply Chain Finance Interface
export interface SupplyChainFinance {
  id: string;
  programId: string;
  programName: string;
  anchorCustomerId: string;
  anchorCustomerName: string;
  programType: "payable_finance" | "receivable_finance" | "dealer_finance" | "vendor_finance";
  totalLimit: number;
  utilizedLimit: number;
  availableLimit: number;
  currency: string;
  activeInvoices: number;
  pendingApproval: number;
  status: "active" | "suspended" | "closed";
  startDate: string;
  expiryDate: string;
  interestRate: number;
}

// Mock Supply Chain Finance Data
export const supplyChainFinance: SupplyChainFinance[] = [
  {
    id: "1",
    programId: "SCF2024001",
    programName: "TechCorp Vendor Finance Program",
    anchorCustomerId: "3",
    anchorCustomerName: "TechCorp Solutions Pvt Ltd",
    programType: "vendor_finance",
    totalLimit: 100000000,
    utilizedLimit: 65000000,
    availableLimit: 35000000,
    currency: "INR",
    activeInvoices: 45,
    pendingApproval: 8,
    status: "active",
    startDate: "2023-06-01",
    expiryDate: "2025-05-31",
    interestRate: 9.5
  },
  {
    id: "2",
    programId: "SCF2024002",
    programName: "GlobalTrade Receivable Discounting",
    anchorCustomerId: "5",
    anchorCustomerName: "GlobalTrade Exports",
    programType: "receivable_finance",
    totalLimit: 250000000,
    utilizedLimit: 180000000,
    availableLimit: 70000000,
    currency: "USD",
    activeInvoices: 120,
    pendingApproval: 15,
    status: "active",
    startDate: "2023-01-15",
    expiryDate: "2025-01-14",
    interestRate: 7.5
  },
  {
    id: "3",
    programId: "SCF2024003",
    programName: "AutoParts Dealer Finance",
    anchorCustomerId: "6",
    anchorCustomerName: "AutoParts Manufacturing Ltd",
    programType: "dealer_finance",
    totalLimit: 500000000,
    utilizedLimit: 320000000,
    availableLimit: 180000000,
    currency: "INR",
    activeInvoices: 250,
    pendingApproval: 35,
    status: "active",
    startDate: "2022-09-01",
    expiryDate: "2024-08-31",
    interestRate: 10.0
  }
];

// Saved Queries Interface
export interface SavedQuery {
  id: string;
  queryName: string;
  description: string;
  sqlQuery: string;
  category: "customer" | "transaction" | "loan" | "risk" | "compliance" | "custom";
  createdBy: string;
  createdAt: string;
  lastRun?: string;
  isScheduled: boolean;
  scheduleFrequency?: "daily" | "weekly" | "monthly";
  outputFormat: "csv" | "excel" | "json" | "pdf";
}

// Mock Saved Queries
export const savedQueries: SavedQuery[] = [
  {
    id: "1",
    queryName: "High Value Transactions Report",
    description: "All transactions above 10 lakhs in the last 30 days",
    sqlQuery: "SELECT * FROM transactions WHERE amount > 1000000 AND date >= DATEADD(day, -30, GETDATE())",
    category: "transaction",
    createdBy: "Admin User",
    createdAt: "2024-01-15",
    lastRun: "2024-01-28",
    isScheduled: true,
    scheduleFrequency: "daily",
    outputFormat: "excel"
  },
  {
    id: "2",
    queryName: "KYC Expiry Report",
    description: "Customers with KYC expiring in next 60 days",
    sqlQuery: "SELECT * FROM customers WHERE kyc_expiry_date BETWEEN GETDATE() AND DATEADD(day, 60, GETDATE())",
    category: "compliance",
    createdBy: "Compliance Officer",
    createdAt: "2024-01-10",
    lastRun: "2024-01-28",
    isScheduled: true,
    scheduleFrequency: "weekly",
    outputFormat: "csv"
  },
  {
    id: "3",
    queryName: "NPA Movement Analysis",
    description: "Loans moved to NPA category in current quarter",
    sqlQuery: "SELECT * FROM loans WHERE status = 'npa' AND status_change_date >= @QuarterStart",
    category: "loan",
    createdBy: "Risk Analyst",
    createdAt: "2024-01-05",
    lastRun: "2024-01-25",
    isScheduled: false,
    outputFormat: "pdf"
  },
  {
    id: "4",
    queryName: "Dormant Account Activation",
    description: "Dormant accounts with recent activity",
    sqlQuery: "SELECT * FROM accounts WHERE status = 'dormant' AND last_transaction_date >= DATEADD(day, -7, GETDATE())",
    category: "customer",
    createdBy: "Branch Manager",
    createdAt: "2024-01-20",
    isScheduled: false,
    outputFormat: "excel"
  }
];
