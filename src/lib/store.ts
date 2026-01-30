// Zustand Store for Core Banking System
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  Customer, Account, Transaction, Payment, Card, Loan, LoanApplication,
  GLEntry, Alert, Workflow, CardDispute, ReconciliationItem,
  customers as initialCustomers,
  accounts as initialAccounts,
  transactions as initialTransactions,
  payments as initialPayments,
  cards as initialCards,
  loans as initialLoans,
  loanApplications as initialLoanApplications,
  glEntries as initialGLEntries,
  alerts as initialAlerts,
  workflows as initialWorkflows,
  cardDisputes as initialCardDisputes,
  reconciliationItems as initialReconciliationItems,
  branches,
  users,
} from '@/data/mockData';

// ===========================================
// TYPES
// ===========================================

export type UserRole = 'admin' | 'manager' | 'officer' | 'teller' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  branch: string;
  permissions: string[];
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: 'create' | 'update' | 'delete' | 'approve' | 'reject' | 'view' | 'export' | 'login' | 'logout';
  entity: string;
  entityId: string;
  entityName?: string;
  changes?: Record<string, { old: unknown; new: unknown }>;
  ipAddress?: string;
  userAgent?: string;
  status: 'success' | 'failed';
  details?: string;
}

export interface Beneficiary {
  id: string;
  customerId: string;
  name: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  accountType: 'savings' | 'current';
  nickname?: string;
  isVerified: boolean;
  createdAt: string;
  lastUsed?: string;
  dailyLimit: number;
  isActive: boolean;
}

export interface CollectionActivity {
  id: string;
  loanId: string;
  loanNumber: string;
  customerId: string;
  customerName: string;
  activityType: 'call' | 'visit' | 'email' | 'sms' | 'notice' | 'legal';
  activityDate: string;
  outcome: 'contacted' | 'not_reachable' | 'promise_to_pay' | 'dispute' | 'skip' | 'legal_action';
  promiseDate?: string;
  promiseAmount?: number;
  notes: string;
  collectorId: string;
  collectorName: string;
  nextFollowUp?: string;
}

export interface KYCDocument {
  id: string;
  customerId: string;
  documentType: 'pan' | 'aadhaar' | 'passport' | 'voter_id' | 'driving_license' | 'utility_bill' | 'bank_statement';
  documentNumber: string;
  fileName: string;
  uploadedAt: string;
  verifiedAt?: string;
  verifiedBy?: string;
  status: 'pending' | 'verified' | 'rejected';
  expiryDate?: string;
  remarks?: string;
}

// Permission definitions
export const PERMISSIONS = {
  // Customer permissions
  CUSTOMER_VIEW: 'customer:view',
  CUSTOMER_CREATE: 'customer:create',
  CUSTOMER_EDIT: 'customer:edit',
  CUSTOMER_DELETE: 'customer:delete',
  CUSTOMER_DEACTIVATE: 'customer:deactivate',

  // Account permissions
  ACCOUNT_VIEW: 'account:view',
  ACCOUNT_CREATE: 'account:create',
  ACCOUNT_FREEZE: 'account:freeze',
  ACCOUNT_CLOSE: 'account:close',

  // Transaction permissions
  TRANSACTION_VIEW: 'transaction:view',
  TRANSACTION_CREATE: 'transaction:create',
  TRANSACTION_REVERSE: 'transaction:reverse',

  // Payment permissions
  PAYMENT_VIEW: 'payment:view',
  PAYMENT_CREATE: 'payment:create',
  PAYMENT_APPROVE: 'payment:approve',
  PAYMENT_REJECT: 'payment:reject',

  // Loan permissions
  LOAN_VIEW: 'loan:view',
  LOAN_CREATE: 'loan:create',
  LOAN_APPROVE: 'loan:approve',
  LOAN_DISBURSE: 'loan:disburse',
  LOAN_RESTRUCTURE: 'loan:restructure',

  // KYC permissions
  KYC_VIEW: 'kyc:view',
  KYC_APPROVE: 'kyc:approve',
  KYC_REJECT: 'kyc:reject',

  // Workflow permissions
  WORKFLOW_VIEW: 'workflow:view',
  WORKFLOW_APPROVE: 'workflow:approve',
  WORKFLOW_REJECT: 'workflow:reject',
  WORKFLOW_ESCALATE: 'workflow:escalate',

  // Admin permissions
  ADMIN_USER_MANAGE: 'admin:user_manage',
  ADMIN_SETTINGS: 'admin:settings',
  ADMIN_AUDIT_VIEW: 'admin:audit_view',

  // Export permissions
  EXPORT_DATA: 'export:data',
  EXPORT_REPORTS: 'export:reports',
} as const;

// Role permission mappings
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  admin: Object.values(PERMISSIONS),
  manager: [
    PERMISSIONS.CUSTOMER_VIEW, PERMISSIONS.CUSTOMER_CREATE, PERMISSIONS.CUSTOMER_EDIT, PERMISSIONS.CUSTOMER_DEACTIVATE,
    PERMISSIONS.ACCOUNT_VIEW, PERMISSIONS.ACCOUNT_CREATE, PERMISSIONS.ACCOUNT_FREEZE, PERMISSIONS.ACCOUNT_CLOSE,
    PERMISSIONS.TRANSACTION_VIEW, PERMISSIONS.TRANSACTION_CREATE,
    PERMISSIONS.PAYMENT_VIEW, PERMISSIONS.PAYMENT_CREATE, PERMISSIONS.PAYMENT_APPROVE, PERMISSIONS.PAYMENT_REJECT,
    PERMISSIONS.LOAN_VIEW, PERMISSIONS.LOAN_CREATE, PERMISSIONS.LOAN_APPROVE, PERMISSIONS.LOAN_DISBURSE,
    PERMISSIONS.KYC_VIEW, PERMISSIONS.KYC_APPROVE, PERMISSIONS.KYC_REJECT,
    PERMISSIONS.WORKFLOW_VIEW, PERMISSIONS.WORKFLOW_APPROVE, PERMISSIONS.WORKFLOW_REJECT, PERMISSIONS.WORKFLOW_ESCALATE,
    PERMISSIONS.EXPORT_DATA, PERMISSIONS.EXPORT_REPORTS,
  ],
  officer: [
    PERMISSIONS.CUSTOMER_VIEW, PERMISSIONS.CUSTOMER_CREATE, PERMISSIONS.CUSTOMER_EDIT,
    PERMISSIONS.ACCOUNT_VIEW, PERMISSIONS.ACCOUNT_CREATE,
    PERMISSIONS.TRANSACTION_VIEW, PERMISSIONS.TRANSACTION_CREATE,
    PERMISSIONS.PAYMENT_VIEW, PERMISSIONS.PAYMENT_CREATE,
    PERMISSIONS.LOAN_VIEW, PERMISSIONS.LOAN_CREATE,
    PERMISSIONS.KYC_VIEW,
    PERMISSIONS.WORKFLOW_VIEW,
    PERMISSIONS.EXPORT_DATA,
  ],
  teller: [
    PERMISSIONS.CUSTOMER_VIEW,
    PERMISSIONS.ACCOUNT_VIEW,
    PERMISSIONS.TRANSACTION_VIEW, PERMISSIONS.TRANSACTION_CREATE,
    PERMISSIONS.PAYMENT_VIEW, PERMISSIONS.PAYMENT_CREATE,
    PERMISSIONS.KYC_VIEW,
    PERMISSIONS.WORKFLOW_VIEW,
  ],
  viewer: [
    PERMISSIONS.CUSTOMER_VIEW,
    PERMISSIONS.ACCOUNT_VIEW,
    PERMISSIONS.TRANSACTION_VIEW,
    PERMISSIONS.PAYMENT_VIEW,
    PERMISSIONS.LOAN_VIEW,
    PERMISSIONS.KYC_VIEW,
    PERMISSIONS.WORKFLOW_VIEW,
  ],
};

// ===========================================
// STORE INTERFACE
// ===========================================

interface BankingStore {
  // Current user
  currentUser: User;
  setCurrentUser: (user: User) => void;
  hasPermission: (permission: string) => boolean;

  // Customers
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id' | 'cif' | 'createdAt' | 'lastUpdated' | 'totalAccounts' | 'totalBalance'>) => Customer;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  deactivateCustomer: (id: string, reason: string) => void;
  getCustomerById: (id: string) => Customer | undefined;

  // Accounts
  accounts: Account[];
  addAccount: (account: Omit<Account, 'id' | 'accountNumber' | 'openDate' | 'lastTransaction'>) => Account;
  updateAccount: (id: string, updates: Partial<Account>) => void;
  freezeAccount: (id: string, reason: string) => void;
  unfreezeAccount: (id: string) => void;
  closeAccount: (id: string, reason: string, transferAccountId?: string) => void;
  getAccountById: (id: string) => Account | undefined;
  getAccountsByCustomerId: (customerId: string) => Account[];

  // Transactions
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'referenceNumber' | 'timestamp'>) => Transaction;
  getTransactionsByAccountId: (accountId: string) => Transaction[];

  // Payments
  payments: Payment[];
  executePayment: (payment: Omit<Payment, 'id' | 'referenceNumber' | 'initiatedAt' | 'status'>) => { success: boolean; payment?: Payment; error?: string };
  approvePayment: (id: string) => void;
  rejectPayment: (id: string, reason: string) => void;
  getPaymentById: (id: string) => Payment | undefined;

  // Beneficiaries
  beneficiaries: Beneficiary[];
  addBeneficiary: (beneficiary: Omit<Beneficiary, 'id' | 'createdAt' | 'isVerified'>) => Beneficiary;
  updateBeneficiary: (id: string, updates: Partial<Beneficiary>) => void;
  deleteBeneficiary: (id: string) => void;
  verifyBeneficiary: (id: string) => void;
  getBeneficiariesByCustomerId: (customerId: string) => Beneficiary[];

  // Cards
  cards: Card[];
  addCard: (card: Omit<Card, 'id' | 'cardNumber' | 'maskedNumber' | 'issuedDate'>) => Card;
  updateCard: (id: string, updates: Partial<Card>) => void;
  blockCard: (id: string, reason: string) => void;
  unblockCard: (id: string) => void;
  getCardsByCustomerId: (customerId: string) => Card[];

  // Card Disputes
  cardDisputes: CardDispute[];
  addCardDispute: (dispute: Omit<CardDispute, 'id' | 'disputeNumber' | 'filedDate' | 'status'>) => CardDispute;
  updateCardDispute: (id: string, updates: Partial<CardDispute>) => void;
  resolveCardDispute: (id: string, resolution: string) => void;

  // Loans
  loans: Loan[];
  addLoan: (loan: Omit<Loan, 'id' | 'loanNumber' | 'disbursedDate' | 'status'>) => Loan;
  updateLoan: (id: string, updates: Partial<Loan>) => void;
  markLoanAsNPA: (id: string) => void;
  processLoanPrepayment: (id: string, amount: number, type: 'partial' | 'full') => { success: boolean; error?: string };
  getLoanById: (id: string) => Loan | undefined;
  getLoansByCustomerId: (customerId: string) => Loan[];

  // Loan Applications
  loanApplications: LoanApplication[];
  addLoanApplication: (application: Omit<LoanApplication, 'id' | 'applicationNumber' | 'submittedAt' | 'status'>) => LoanApplication;
  approveLoanApplication: (id: string, approvedAmount: number, remarks?: string) => void;
  rejectLoanApplication: (id: string, remarks: string) => void;
  disburseLoan: (applicationId: string) => Loan | null;
  getLoanApplicationById: (id: string) => LoanApplication | undefined;

  // KYC
  kycDocuments: KYCDocument[];
  addKYCDocument: (document: Omit<KYCDocument, 'id' | 'uploadedAt' | 'status'>) => KYCDocument;
  approveKYCDocument: (id: string, remarks?: string) => void;
  rejectKYCDocument: (id: string, remarks: string) => void;
  updateCustomerKYCStatus: (customerId: string) => void;
  getKYCDocumentsByCustomerId: (customerId: string) => KYCDocument[];

  // GL Entries
  glEntries: GLEntry[];
  addGLEntry: (entry: Omit<GLEntry, 'id' | 'entryNumber' | 'postingDate'>) => GLEntry;

  // Alerts
  alerts: Alert[];
  addAlert: (alert: Omit<Alert, 'id' | 'createdAt' | 'status'>) => Alert;
  updateAlertStatus: (id: string, status: Alert['status'], assignedTo?: string) => void;
  resolveAlert: (id: string) => void;

  // Workflows
  workflows: Workflow[];
  addWorkflow: (workflow: Omit<Workflow, 'id' | 'workflowNumber' | 'createdAt' | 'status' | 'level'>) => Workflow;
  approveWorkflow: (id: string) => void;
  rejectWorkflow: (id: string, reason: string) => void;
  escalateWorkflow: (id: string) => void;
  getWorkflowById: (id: string) => Workflow | undefined;

  // Reconciliation
  reconciliationItems: ReconciliationItem[];
  updateReconciliationItem: (id: string, updates: Partial<ReconciliationItem>) => void;

  // Collection Activities
  collectionActivities: CollectionActivity[];
  addCollectionActivity: (activity: Omit<CollectionActivity, 'id'>) => CollectionActivity;
  getCollectionActivitiesByLoanId: (loanId: string) => CollectionActivity[];

  // Audit Logs
  auditLogs: AuditLog[];
  addAuditLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => void;
  getAuditLogs: (filters?: { entity?: string; action?: string; userId?: string; startDate?: string; endDate?: string }) => AuditLog[];

  // Limits and Settings
  dailyLimits: Record<string, { neft: number; rtgs: number; imps: number; upi: number; internal: number }>;
  setDailyLimit: (customerId: string, limits: { neft: number; rtgs: number; imps: number; upi: number; internal: number }) => void;

  // Dashboard metrics computed
  getDashboardMetrics: () => {
    totalCustomers: number;
    activeAccounts: number;
    totalDeposits: number;
    totalLoans: number;
    pendingWorkflows: number;
    activeAlerts: number;
    npaLoans: number;
    todayTransactions: number;
  };
}

// ===========================================
// UTILITY FUNCTIONS
// ===========================================

const generateId = () => Math.random().toString(36).substring(2, 15);
const generateCIF = () => `CIF${Date.now().toString().substring(5)}${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
const generateAccountNumber = () => Array.from({ length: 16 }, () => Math.floor(Math.random() * 10)).join('');
const generateRefNumber = (prefix: string) => `${prefix}${new Date().toISOString().split('T')[0].replace(/-/g, '')}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
const generateCardNumber = () => `4${Array.from({ length: 15 }, () => Math.floor(Math.random() * 10)).join('')}`;
const maskCardNumber = (cardNumber: string) => `XXXX XXXX XXXX ${cardNumber.slice(-4)}`;
const formatDate = (date: Date) => date.toISOString().split('T')[0];
const formatDateTime = (date: Date) => date.toISOString();

// ===========================================
// STORE IMPLEMENTATION
// ===========================================

export const useBankingStore = create<BankingStore>()(
  persist(
    (set, get) => ({
      // Current User
      currentUser: {
        id: '1',
        name: 'Admin User',
        email: 'admin@cbs.com',
        role: 'admin',
        department: 'IT',
        branch: 'Head Office',
        permissions: ROLE_PERMISSIONS.admin,
      },

      setCurrentUser: (user) => {
        set({ currentUser: { ...user, permissions: ROLE_PERMISSIONS[user.role] } });
        get().addAuditLog({
          userId: user.id,
          userName: user.name,
          action: 'login',
          entity: 'user',
          entityId: user.id,
          entityName: user.name,
          status: 'success',
          details: `User logged in with role: ${user.role}`,
        });
      },

      hasPermission: (permission) => {
        const { currentUser } = get();
        return currentUser.permissions.includes(permission) || currentUser.role === 'admin';
      },

      // Customers
      customers: [...initialCustomers],

      addCustomer: (customerData) => {
        const { currentUser, addAuditLog } = get();
        const newCustomer: Customer = {
          ...customerData,
          id: generateId(),
          cif: generateCIF(),
          createdAt: formatDate(new Date()),
          lastUpdated: formatDate(new Date()),
          totalAccounts: 0,
          totalBalance: 0,
        };
        set((state) => ({ customers: [...state.customers, newCustomer] }));
        addAuditLog({
          userId: currentUser.id,
          userName: currentUser.name,
          action: 'create',
          entity: 'customer',
          entityId: newCustomer.id,
          entityName: newCustomer.name,
          status: 'success',
          details: `Created new ${newCustomer.type} customer`,
        });
        return newCustomer;
      },

      updateCustomer: (id, updates) => {
        const { currentUser, addAuditLog, customers } = get();
        const oldCustomer = customers.find((c) => c.id === id);
        if (!oldCustomer) return;

        const changes: Record<string, { old: unknown; new: unknown }> = {};
        Object.keys(updates).forEach((key) => {
          if (oldCustomer[key as keyof Customer] !== updates[key as keyof Customer]) {
            changes[key] = { old: oldCustomer[key as keyof Customer], new: updates[key as keyof Customer] };
          }
        });

        set((state) => ({
          customers: state.customers.map((c) =>
            c.id === id ? { ...c, ...updates, lastUpdated: formatDate(new Date()) } : c
          ),
        }));

        addAuditLog({
          userId: currentUser.id,
          userName: currentUser.name,
          action: 'update',
          entity: 'customer',
          entityId: id,
          entityName: oldCustomer.name,
          changes,
          status: 'success',
        });
      },

      deleteCustomer: (id) => {
        const { currentUser, addAuditLog, customers } = get();
        const customer = customers.find((c) => c.id === id);
        if (!customer) return;

        set((state) => ({
          customers: state.customers.filter((c) => c.id !== id),
        }));

        addAuditLog({
          userId: currentUser.id,
          userName: currentUser.name,
          action: 'delete',
          entity: 'customer',
          entityId: id,
          entityName: customer.name,
          status: 'success',
        });
      },

      deactivateCustomer: (id, reason) => {
        const { updateCustomer, addAuditLog, currentUser, customers } = get();
        const customer = customers.find((c) => c.id === id);
        if (!customer) return;

        updateCustomer(id, { kycStatus: 'rejected' });

        addAuditLog({
          userId: currentUser.id,
          userName: currentUser.name,
          action: 'update',
          entity: 'customer',
          entityId: id,
          entityName: customer.name,
          status: 'success',
          details: `Customer deactivated. Reason: ${reason}`,
        });
      },

      getCustomerById: (id) => get().customers.find((c) => c.id === id),

      // Accounts
      accounts: [...initialAccounts],

      addAccount: (accountData) => {
        const { currentUser, addAuditLog, addWorkflow, customers, updateCustomer } = get();
        const newAccount: Account = {
          ...accountData,
          id: generateId(),
          accountNumber: generateAccountNumber(),
          openDate: formatDate(new Date()),
          lastTransaction: formatDate(new Date()),
        };

        set((state) => ({ accounts: [...state.accounts, newAccount] }));

        // Update customer's total accounts
        const customer = customers.find((c) => c.id === accountData.customerId);
        if (customer) {
          updateCustomer(customer.id, { totalAccounts: customer.totalAccounts + 1 });
        }

        // Create workflow for account opening
        addWorkflow({
          type: 'account_opening',
          initiatedBy: currentUser.name,
          currentApprover: 'Branch Manager',
          totalLevels: 2,
          description: `New ${accountData.type} account opening for ${accountData.customerName}`,
        });

        addAuditLog({
          userId: currentUser.id,
          userName: currentUser.name,
          action: 'create',
          entity: 'account',
          entityId: newAccount.id,
          entityName: newAccount.accountNumber,
          status: 'success',
          details: `Opened new ${newAccount.type} account`,
        });

        return newAccount;
      },

      updateAccount: (id, updates) => {
        const { currentUser, addAuditLog, accounts } = get();
        const oldAccount = accounts.find((a) => a.id === id);
        if (!oldAccount) return;

        set((state) => ({
          accounts: state.accounts.map((a) => (a.id === id ? { ...a, ...updates } : a)),
        }));

        addAuditLog({
          userId: currentUser.id,
          userName: currentUser.name,
          action: 'update',
          entity: 'account',
          entityId: id,
          entityName: oldAccount.accountNumber,
          status: 'success',
        });
      },

      freezeAccount: (id, reason) => {
        const { updateAccount, addAuditLog, currentUser, accounts, addAlert } = get();
        const account = accounts.find((a) => a.id === id);
        if (!account) return;

        updateAccount(id, { status: 'frozen' });

        // Create alert for frozen account
        addAlert({
          type: 'compliance',
          severity: 'high',
          title: 'Account Frozen',
          description: `Account ${account.accountNumber} has been frozen. Reason: ${reason}`,
          relatedEntity: account.customerId,
        });

        addAuditLog({
          userId: currentUser.id,
          userName: currentUser.name,
          action: 'update',
          entity: 'account',
          entityId: id,
          entityName: account.accountNumber,
          status: 'success',
          details: `Account frozen. Reason: ${reason}`,
        });
      },

      unfreezeAccount: (id) => {
        const { updateAccount, addAuditLog, currentUser, accounts } = get();
        const account = accounts.find((a) => a.id === id);
        if (!account) return;

        updateAccount(id, { status: 'active' });

        addAuditLog({
          userId: currentUser.id,
          userName: currentUser.name,
          action: 'update',
          entity: 'account',
          entityId: id,
          entityName: account.accountNumber,
          status: 'success',
          details: 'Account unfrozen',
        });
      },

      closeAccount: (id, reason, transferAccountId) => {
        const { accounts, updateAccount, addTransaction, addAuditLog, currentUser } = get();
        const account = accounts.find((a) => a.id === id);
        if (!account) return;

        // Transfer remaining balance if specified
        if (account.balance > 0 && transferAccountId) {
          const targetAccount = accounts.find((a) => a.id === transferAccountId);
          if (targetAccount) {
            // Debit from closing account
            addTransaction({
              accountId: account.id,
              accountNumber: account.accountNumber,
              type: 'debit',
              category: 'transfer',
              amount: account.balance,
              currency: account.currency,
              description: `Account closure - Balance transfer to ${targetAccount.accountNumber}`,
              status: 'completed',
              balanceAfter: 0,
              channel: 'Branch',
            });

            // Credit to target account
            addTransaction({
              accountId: targetAccount.id,
              accountNumber: targetAccount.accountNumber,
              type: 'credit',
              category: 'transfer',
              amount: account.balance,
              currency: account.currency,
              description: `Balance transfer from closed account ${account.accountNumber}`,
              status: 'completed',
              balanceAfter: targetAccount.balance + account.balance,
              channel: 'Branch',
            });

            updateAccount(targetAccount.id, { balance: targetAccount.balance + account.balance });
          }
        }

        updateAccount(id, { status: 'closed', balance: 0 });

        addAuditLog({
          userId: currentUser.id,
          userName: currentUser.name,
          action: 'update',
          entity: 'account',
          entityId: id,
          entityName: account.accountNumber,
          status: 'success',
          details: `Account closed. Reason: ${reason}`,
        });
      },

      getAccountById: (id) => get().accounts.find((a) => a.id === id),
      getAccountsByCustomerId: (customerId) => get().accounts.filter((a) => a.customerId === customerId),

      // Transactions
      transactions: [...initialTransactions],

      addTransaction: (transactionData) => {
        const { currentUser, addAuditLog, addGLEntry } = get();
        const newTransaction: Transaction = {
          ...transactionData,
          id: generateId(),
          referenceNumber: generateRefNumber('TXN'),
          timestamp: formatDateTime(new Date()),
        };

        set((state) => ({ transactions: [newTransaction, ...state.transactions] }));

        // Create GL entry
        addGLEntry({
          accountCode: transactionData.type === 'credit' ? '1001001' : '2001001',
          accountName: transactionData.type === 'credit' ? 'Customer Deposits' : 'Customer Withdrawals',
          type: transactionData.type,
          amount: transactionData.amount,
          currency: transactionData.currency,
          description: transactionData.description,
          transactionRef: newTransaction.referenceNumber,
          valueDate: formatDate(new Date()),
          branch: 'Head Office',
        });

        addAuditLog({
          userId: currentUser.id,
          userName: currentUser.name,
          action: 'create',
          entity: 'transaction',
          entityId: newTransaction.id,
          entityName: newTransaction.referenceNumber,
          status: 'success',
          details: `${transactionData.type} transaction of ${transactionData.currency} ${transactionData.amount}`,
        });

        return newTransaction;
      },

      getTransactionsByAccountId: (accountId) =>
        get().transactions.filter((t) => t.accountId === accountId),

      // Payments
      payments: [...initialPayments],

      executePayment: (paymentData) => {
        const { accounts, updateAccount, addTransaction, addAuditLog, currentUser, addWorkflow, dailyLimits } = get();

        // Find source account
        const sourceAccount = accounts.find((a) => a.accountNumber === paymentData.fromAccount);
        if (!sourceAccount) {
          return { success: false, error: 'Source account not found' };
        }

        // Check if account is frozen
        if (sourceAccount.status === 'frozen') {
          return { success: false, error: 'Source account is frozen' };
        }

        // Check balance
        if (sourceAccount.balance < paymentData.amount) {
          return { success: false, error: 'Insufficient balance' };
        }

        // Check daily limit
        const customerLimits = dailyLimits[sourceAccount.customerId] || { neft: 1000000, rtgs: 10000000, imps: 500000, upi: 100000, internal: 5000000 };
        const limitKey = paymentData.type.toLowerCase() as keyof typeof customerLimits;
        if (paymentData.amount > customerLimits[limitKey]) {
          // Create approval workflow for high-value payment
          addWorkflow({
            type: 'payment_approval',
            initiatedBy: currentUser.name,
            currentApprover: 'Branch Manager',
            totalLevels: paymentData.amount > 1000000 ? 3 : 2,
            description: `${paymentData.type} payment of INR ${paymentData.amount.toLocaleString()} to ${paymentData.beneficiaryName}`,
          });

          const newPayment: Payment = {
            ...paymentData,
            id: generateId(),
            referenceNumber: generateRefNumber('PAY'),
            initiatedAt: formatDateTime(new Date()),
            status: 'pending',
          };

          set((state) => ({ payments: [newPayment, ...state.payments] }));

          addAuditLog({
            userId: currentUser.id,
            userName: currentUser.name,
            action: 'create',
            entity: 'payment',
            entityId: newPayment.id,
            entityName: newPayment.referenceNumber,
            status: 'success',
            details: `Payment created - pending approval (exceeds limit)`,
          });

          return { success: true, payment: newPayment };
        }

        // Execute payment immediately
        const newPayment: Payment = {
          ...paymentData,
          id: generateId(),
          referenceNumber: generateRefNumber('PAY'),
          initiatedAt: formatDateTime(new Date()),
          completedAt: formatDateTime(new Date()),
          status: 'completed',
        };

        set((state) => ({ payments: [newPayment, ...state.payments] }));

        // Debit source account
        const newBalance = sourceAccount.balance - paymentData.amount;
        updateAccount(sourceAccount.id, { balance: newBalance, lastTransaction: formatDate(new Date()) });

        // Create debit transaction
        addTransaction({
          accountId: sourceAccount.id,
          accountNumber: sourceAccount.accountNumber,
          type: 'debit',
          category: 'payment',
          amount: paymentData.amount,
          currency: paymentData.currency,
          description: `${paymentData.type} to ${paymentData.beneficiaryName} - ${paymentData.remarks}`,
          status: 'completed',
          balanceAfter: newBalance,
          channel: paymentData.type,
        });

        // Credit target account if internal
        if (paymentData.type === 'Internal') {
          const targetAccount = accounts.find((a) => a.accountNumber === paymentData.toAccount);
          if (targetAccount) {
            const newTargetBalance = targetAccount.balance + paymentData.amount;
            updateAccount(targetAccount.id, { balance: newTargetBalance, lastTransaction: formatDate(new Date()) });

            addTransaction({
              accountId: targetAccount.id,
              accountNumber: targetAccount.accountNumber,
              type: 'credit',
              category: 'transfer',
              amount: paymentData.amount,
              currency: paymentData.currency,
              description: `Transfer from ${sourceAccount.accountNumber}`,
              status: 'completed',
              balanceAfter: newTargetBalance,
              channel: 'Internal',
            });
          }
        }

        addAuditLog({
          userId: currentUser.id,
          userName: currentUser.name,
          action: 'create',
          entity: 'payment',
          entityId: newPayment.id,
          entityName: newPayment.referenceNumber,
          status: 'success',
          details: `Payment executed successfully`,
        });

        return { success: true, payment: newPayment };
      },

      approvePayment: (id) => {
        const { payments, accounts, updateAccount, addTransaction, addAuditLog, currentUser } = get();
        const payment = payments.find((p) => p.id === id);
        if (!payment || payment.status !== 'pending') return;

        const sourceAccount = accounts.find((a) => a.accountNumber === payment.fromAccount);
        if (!sourceAccount || sourceAccount.balance < payment.amount) return;

        // Update payment status
        set((state) => ({
          payments: state.payments.map((p) =>
            p.id === id ? { ...p, status: 'completed', completedAt: formatDateTime(new Date()) } : p
          ),
        }));

        // Execute the transfer
        const newBalance = sourceAccount.balance - payment.amount;
        updateAccount(sourceAccount.id, { balance: newBalance, lastTransaction: formatDate(new Date()) });

        addTransaction({
          accountId: sourceAccount.id,
          accountNumber: sourceAccount.accountNumber,
          type: 'debit',
          category: 'payment',
          amount: payment.amount,
          currency: payment.currency,
          description: `${payment.type} to ${payment.beneficiaryName} - ${payment.remarks}`,
          status: 'completed',
          balanceAfter: newBalance,
          channel: payment.type,
        });

        addAuditLog({
          userId: currentUser.id,
          userName: currentUser.name,
          action: 'approve',
          entity: 'payment',
          entityId: id,
          entityName: payment.referenceNumber,
          status: 'success',
        });
      },

      rejectPayment: (id, reason) => {
        const { payments, addAuditLog, currentUser } = get();
        const payment = payments.find((p) => p.id === id);
        if (!payment) return;

        set((state) => ({
          payments: state.payments.map((p) =>
            p.id === id ? { ...p, status: 'failed' } : p
          ),
        }));

        addAuditLog({
          userId: currentUser.id,
          userName: currentUser.name,
          action: 'reject',
          entity: 'payment',
          entityId: id,
          entityName: payment.referenceNumber,
          status: 'success',
          details: `Rejected: ${reason}`,
        });
      },

      getPaymentById: (id) => get().payments.find((p) => p.id === id),

      // Beneficiaries
      beneficiaries: [],

      addBeneficiary: (beneficiaryData) => {
        const { currentUser, addAuditLog } = get();
        const newBeneficiary: Beneficiary = {
          ...beneficiaryData,
          id: generateId(),
          createdAt: formatDateTime(new Date()),
          isVerified: false,
        };

        set((state) => ({ beneficiaries: [...state.beneficiaries, newBeneficiary] }));

        addAuditLog({
          userId: currentUser.id,
          userName: currentUser.name,
          action: 'create',
          entity: 'beneficiary',
          entityId: newBeneficiary.id,
          entityName: newBeneficiary.name,
          status: 'success',
        });

        return newBeneficiary;
      },

      updateBeneficiary: (id, updates) => {
        set((state) => ({
          beneficiaries: state.beneficiaries.map((b) => (b.id === id ? { ...b, ...updates } : b)),
        }));
      },

      deleteBeneficiary: (id) => {
        const { currentUser, addAuditLog, beneficiaries } = get();
        const beneficiary = beneficiaries.find((b) => b.id === id);

        set((state) => ({
          beneficiaries: state.beneficiaries.filter((b) => b.id !== id),
        }));

        if (beneficiary) {
          addAuditLog({
            userId: currentUser.id,
            userName: currentUser.name,
            action: 'delete',
            entity: 'beneficiary',
            entityId: id,
            entityName: beneficiary.name,
            status: 'success',
          });
        }
      },

      verifyBeneficiary: (id) => {
        const { updateBeneficiary, addAuditLog, currentUser, beneficiaries } = get();
        const beneficiary = beneficiaries.find((b) => b.id === id);
        if (!beneficiary) return;

        updateBeneficiary(id, { isVerified: true });

        addAuditLog({
          userId: currentUser.id,
          userName: currentUser.name,
          action: 'approve',
          entity: 'beneficiary',
          entityId: id,
          entityName: beneficiary.name,
          status: 'success',
          details: 'Beneficiary verified',
        });
      },

      getBeneficiariesByCustomerId: (customerId) =>
        get().beneficiaries.filter((b) => b.customerId === customerId),

      // Cards
      cards: [...initialCards],

      addCard: (cardData) => {
        const { currentUser, addAuditLog } = get();
        const cardNumber = generateCardNumber();
        const newCard: Card = {
          ...cardData,
          id: generateId(),
          cardNumber,
          maskedNumber: maskCardNumber(cardNumber),
          issuedDate: formatDate(new Date()),
        };

        set((state) => ({ cards: [...state.cards, newCard] }));

        addAuditLog({
          userId: currentUser.id,
          userName: currentUser.name,
          action: 'create',
          entity: 'card',
          entityId: newCard.id,
          entityName: newCard.maskedNumber,
          status: 'success',
          details: `Issued new ${newCard.type} card (${newCard.variant})`,
        });

        return newCard;
      },

      updateCard: (id, updates) => {
        set((state) => ({
          cards: state.cards.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        }));
      },

      blockCard: (id, reason) => {
        const { updateCard, addAuditLog, currentUser, cards, addAlert } = get();
        const card = cards.find((c) => c.id === id);
        if (!card) return;

        updateCard(id, { status: 'blocked' });

        addAlert({
          type: 'fraud',
          severity: 'high',
          title: 'Card Blocked',
          description: `Card ${card.maskedNumber} has been blocked. Reason: ${reason}`,
          relatedEntity: card.customerId,
        });

        addAuditLog({
          userId: currentUser.id,
          userName: currentUser.name,
          action: 'update',
          entity: 'card',
          entityId: id,
          entityName: card.maskedNumber,
          status: 'success',
          details: `Card blocked. Reason: ${reason}`,
        });
      },

      unblockCard: (id) => {
        const { updateCard, addAuditLog, currentUser, cards } = get();
        const card = cards.find((c) => c.id === id);
        if (!card) return;

        updateCard(id, { status: 'active' });

        addAuditLog({
          userId: currentUser.id,
          userName: currentUser.name,
          action: 'update',
          entity: 'card',
          entityId: id,
          entityName: card.maskedNumber,
          status: 'success',
          details: 'Card unblocked',
        });
      },

      getCardsByCustomerId: (customerId) => get().cards.filter((c) => c.customerId === customerId),

      // Card Disputes
      cardDisputes: [...initialCardDisputes],

      addCardDispute: (disputeData) => {
        const { currentUser, addAuditLog } = get();
        const newDispute: CardDispute = {
          ...disputeData,
          id: generateId(),
          disputeNumber: generateRefNumber('DSP'),
          filedDate: formatDate(new Date()),
          status: 'open',
        };

        set((state) => ({ cardDisputes: [...state.cardDisputes, newDispute] }));

        addAuditLog({
          userId: currentUser.id,
          userName: currentUser.name,
          action: 'create',
          entity: 'cardDispute',
          entityId: newDispute.id,
          entityName: newDispute.disputeNumber,
          status: 'success',
        });

        return newDispute;
      },

      updateCardDispute: (id, updates) => {
        set((state) => ({
          cardDisputes: state.cardDisputes.map((d) => (d.id === id ? { ...d, ...updates } : d)),
        }));
      },

      resolveCardDispute: (id, resolution) => {
        const { updateCardDispute, addAuditLog, currentUser, cardDisputes } = get();
        const dispute = cardDisputes.find((d) => d.id === id);
        if (!dispute) return;

        updateCardDispute(id, {
          status: 'resolved',
          resolvedDate: formatDate(new Date()),
          resolution,
        });

        addAuditLog({
          userId: currentUser.id,
          userName: currentUser.name,
          action: 'update',
          entity: 'cardDispute',
          entityId: id,
          entityName: dispute.disputeNumber,
          status: 'success',
          details: `Dispute resolved: ${resolution}`,
        });
      },

      // Loans
      loans: [...initialLoans],

      addLoan: (loanData) => {
        const { currentUser, addAuditLog } = get();
        const newLoan: Loan = {
          ...loanData,
          id: generateId(),
          loanNumber: generateRefNumber('LN'),
          disbursedDate: formatDate(new Date()),
          status: 'active',
        };

        set((state) => ({ loans: [...state.loans, newLoan] }));

        addAuditLog({
          userId: currentUser.id,
          userName: currentUser.name,
          action: 'create',
          entity: 'loan',
          entityId: newLoan.id,
          entityName: newLoan.loanNumber,
          status: 'success',
          details: `Disbursed ${newLoan.type} loan of ${newLoan.principalAmount}`,
        });

        return newLoan;
      },

      updateLoan: (id, updates) => {
        set((state) => ({
          loans: state.loans.map((l) => (l.id === id ? { ...l, ...updates } : l)),
        }));
      },

      markLoanAsNPA: (id) => {
        const { updateLoan, addAuditLog, currentUser, loans, addAlert } = get();
        const loan = loans.find((l) => l.id === id);
        if (!loan) return;

        updateLoan(id, { status: 'npa' });

        addAlert({
          type: 'compliance',
          severity: 'critical',
          title: 'Loan Marked as NPA',
          description: `Loan ${loan.loanNumber} has been marked as NPA. Outstanding: INR ${loan.outstandingAmount.toLocaleString()}`,
          relatedEntity: loan.customerId,
        });

        addAuditLog({
          userId: currentUser.id,
          userName: currentUser.name,
          action: 'update',
          entity: 'loan',
          entityId: id,
          entityName: loan.loanNumber,
          status: 'success',
          details: 'Loan marked as NPA',
        });
      },

      processLoanPrepayment: (id, amount, type) => {
        const { loans, updateLoan, addTransaction, addAuditLog, currentUser, accounts } = get();
        const loan = loans.find((l) => l.id === id);
        if (!loan) return { success: false, error: 'Loan not found' };

        if (amount > loan.outstandingAmount) {
          return { success: false, error: 'Prepayment amount exceeds outstanding' };
        }

        // Calculate prepayment fee (0.5%)
        const prepaymentFee = amount * 0.005;
        const totalPayable = amount + prepaymentFee;

        // Find customer's primary account
        const customerAccount = accounts.find((a) => a.customerId === loan.customerId && a.status === 'active');
        if (!customerAccount || customerAccount.balance < totalPayable) {
          return { success: false, error: 'Insufficient balance for prepayment' };
        }

        const newOutstanding = type === 'full' ? 0 : loan.outstandingAmount - amount;
        const newStatus = newOutstanding === 0 ? 'closed' : loan.status;

        updateLoan(id, { outstandingAmount: newOutstanding, status: newStatus });

        // Debit customer account
        addTransaction({
          accountId: customerAccount.id,
          accountNumber: customerAccount.accountNumber,
          type: 'debit',
          category: 'payment',
          amount: totalPayable,
          currency: 'INR',
          description: `Loan prepayment - ${loan.loanNumber} (includes ${prepaymentFee} fee)`,
          status: 'completed',
          balanceAfter: customerAccount.balance - totalPayable,
          channel: 'Branch',
        });

        set((state) => ({
          accounts: state.accounts.map((a) =>
            a.id === customerAccount.id ? { ...a, balance: a.balance - totalPayable } : a
          ),
        }));

        addAuditLog({
          userId: currentUser.id,
          userName: currentUser.name,
          action: 'update',
          entity: 'loan',
          entityId: id,
          entityName: loan.loanNumber,
          status: 'success',
          details: `${type} prepayment of ${amount} processed`,
        });

        return { success: true };
      },

      getLoanById: (id) => get().loans.find((l) => l.id === id),
      getLoansByCustomerId: (customerId) => get().loans.filter((l) => l.customerId === customerId),

      // Loan Applications
      loanApplications: [...initialLoanApplications],

      addLoanApplication: (applicationData) => {
        const { currentUser, addAuditLog, addWorkflow } = get();
        const newApplication: LoanApplication = {
          ...applicationData,
          id: generateId(),
          applicationNumber: generateRefNumber('APP'),
          submittedAt: formatDateTime(new Date()),
          status: 'submitted',
        };

        set((state) => ({ loanApplications: [...state.loanApplications, newApplication] }));

        // Create approval workflow
        addWorkflow({
          type: 'loan_approval',
          initiatedBy: currentUser.name,
          currentApprover: 'Loan Officer',
          totalLevels: applicationData.requestedAmount > 1000000 ? 3 : 2,
          description: `${applicationData.loanType} loan application for ${applicationData.customerName} - INR ${applicationData.requestedAmount.toLocaleString()}`,
        });

        addAuditLog({
          userId: currentUser.id,
          userName: currentUser.name,
          action: 'create',
          entity: 'loanApplication',
          entityId: newApplication.id,
          entityName: newApplication.applicationNumber,
          status: 'success',
        });

        return newApplication;
      },

      approveLoanApplication: (id, approvedAmount, remarks) => {
        const { loanApplications, addAuditLog, currentUser } = get();
        const application = loanApplications.find((a) => a.id === id);
        if (!application) return;

        set((state) => ({
          loanApplications: state.loanApplications.map((a) =>
            a.id === id
              ? {
                  ...a,
                  status: 'approved',
                  approvedAmount,
                  processedAt: formatDateTime(new Date()),
                  remarks: remarks || a.remarks,
                }
              : a
          ),
        }));

        addAuditLog({
          userId: currentUser.id,
          userName: currentUser.name,
          action: 'approve',
          entity: 'loanApplication',
          entityId: id,
          entityName: application.applicationNumber,
          status: 'success',
          details: `Approved for ${approvedAmount}`,
        });
      },

      rejectLoanApplication: (id, remarks) => {
        const { loanApplications, addAuditLog, currentUser } = get();
        const application = loanApplications.find((a) => a.id === id);
        if (!application) return;

        set((state) => ({
          loanApplications: state.loanApplications.map((a) =>
            a.id === id
              ? { ...a, status: 'rejected', processedAt: formatDateTime(new Date()), remarks }
              : a
          ),
        }));

        addAuditLog({
          userId: currentUser.id,
          userName: currentUser.name,
          action: 'reject',
          entity: 'loanApplication',
          entityId: id,
          entityName: application.applicationNumber,
          status: 'success',
          details: `Rejected: ${remarks}`,
        });
      },

      disburseLoan: (applicationId) => {
        const { loanApplications, customers, addLoan, accounts, updateAccount, addTransaction, addAuditLog, currentUser } = get();
        const application = loanApplications.find((a) => a.id === applicationId);
        if (!application || application.status !== 'approved' || !application.approvedAmount) return null;

        const customer = customers.find((c) => c.id === application.customerId);
        if (!customer) return null;

        // Calculate EMI (simplified)
        const principal = application.approvedAmount;
        const rate = application.loanType === 'home' ? 8.5 : application.loanType === 'personal' ? 12.5 : 10.5;
        const tenure = application.loanType === 'home' ? 240 : application.loanType === 'personal' ? 36 : 60;
        const monthlyRate = rate / 12 / 100;
        const emi = Math.round((principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / (Math.pow(1 + monthlyRate, tenure) - 1));

        // Create loan
        const loan = addLoan({
          customerId: application.customerId,
          customerName: application.customerName,
          type: application.loanType,
          principalAmount: principal,
          outstandingAmount: principal,
          interestRate: rate,
          tenure,
          emiAmount: emi,
          nextEmiDate: formatDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),
        });

        // Update application status
        set((state) => ({
          loanApplications: state.loanApplications.map((a) =>
            a.id === applicationId ? { ...a, status: 'disbursed' } : a
          ),
        }));

        // Credit to customer's account
        const customerAccount = accounts.find((a) => a.customerId === application.customerId && a.status === 'active');
        if (customerAccount) {
          const newBalance = customerAccount.balance + principal;
          updateAccount(customerAccount.id, { balance: newBalance, lastTransaction: formatDate(new Date()) });

          addTransaction({
            accountId: customerAccount.id,
            accountNumber: customerAccount.accountNumber,
            type: 'credit',
            category: 'deposit',
            amount: principal,
            currency: 'INR',
            description: `Loan disbursement - ${loan.loanNumber}`,
            status: 'completed',
            balanceAfter: newBalance,
            channel: 'Branch',
          });
        }

        addAuditLog({
          userId: currentUser.id,
          userName: currentUser.name,
          action: 'create',
          entity: 'loan',
          entityId: loan.id,
          entityName: loan.loanNumber,
          status: 'success',
          details: `Loan disbursed from application ${application.applicationNumber}`,
        });

        return loan;
      },

      getLoanApplicationById: (id) => get().loanApplications.find((a) => a.id === id),

      // KYC Documents
      kycDocuments: [],

      addKYCDocument: (documentData) => {
        const { currentUser, addAuditLog } = get();
        const newDocument: KYCDocument = {
          ...documentData,
          id: generateId(),
          uploadedAt: formatDateTime(new Date()),
          status: 'pending',
        };

        set((state) => ({ kycDocuments: [...state.kycDocuments, newDocument] }));

        addAuditLog({
          userId: currentUser.id,
          userName: currentUser.name,
          action: 'create',
          entity: 'kycDocument',
          entityId: newDocument.id,
          entityName: newDocument.documentType,
          status: 'success',
        });

        return newDocument;
      },

      approveKYCDocument: (id, remarks) => {
        const { kycDocuments, currentUser, addAuditLog, updateCustomerKYCStatus } = get();
        const document = kycDocuments.find((d) => d.id === id);
        if (!document) return;

        set((state) => ({
          kycDocuments: state.kycDocuments.map((d) =>
            d.id === id
              ? {
                  ...d,
                  status: 'verified',
                  verifiedAt: formatDateTime(new Date()),
                  verifiedBy: currentUser.name,
                  remarks,
                }
              : d
          ),
        }));

        // Check if all documents are verified
        updateCustomerKYCStatus(document.customerId);

        addAuditLog({
          userId: currentUser.id,
          userName: currentUser.name,
          action: 'approve',
          entity: 'kycDocument',
          entityId: id,
          entityName: document.documentType,
          status: 'success',
        });
      },

      rejectKYCDocument: (id, remarks) => {
        const { kycDocuments, currentUser, addAuditLog, updateCustomer } = get();
        const document = kycDocuments.find((d) => d.id === id);
        if (!document) return;

        set((state) => ({
          kycDocuments: state.kycDocuments.map((d) =>
            d.id === id ? { ...d, status: 'rejected', remarks } : d
          ),
        }));

        // Update customer KYC status
        updateCustomer(document.customerId, { kycStatus: 'rejected' });

        addAuditLog({
          userId: currentUser.id,
          userName: currentUser.name,
          action: 'reject',
          entity: 'kycDocument',
          entityId: id,
          entityName: document.documentType,
          status: 'success',
          details: `Rejected: ${remarks}`,
        });
      },

      updateCustomerKYCStatus: (customerId) => {
        const { kycDocuments, updateCustomer } = get();
        const customerDocs = kycDocuments.filter((d) => d.customerId === customerId);

        if (customerDocs.length === 0) return;

        const allVerified = customerDocs.every((d) => d.status === 'verified');
        const anyRejected = customerDocs.some((d) => d.status === 'rejected');

        if (allVerified) {
          updateCustomer(customerId, { kycStatus: 'verified' });
        } else if (anyRejected) {
          updateCustomer(customerId, { kycStatus: 'rejected' });
        }
      },

      getKYCDocumentsByCustomerId: (customerId) =>
        get().kycDocuments.filter((d) => d.customerId === customerId),

      // GL Entries
      glEntries: [...initialGLEntries],

      addGLEntry: (entryData) => {
        const newEntry: GLEntry = {
          ...entryData,
          id: generateId(),
          entryNumber: generateRefNumber('GL'),
          postingDate: formatDate(new Date()),
        };

        set((state) => ({ glEntries: [newEntry, ...state.glEntries] }));

        return newEntry;
      },

      // Alerts
      alerts: [...initialAlerts],

      addAlert: (alertData) => {
        const newAlert: Alert = {
          ...alertData,
          id: generateId(),
          createdAt: formatDateTime(new Date()),
          status: 'new',
        };

        set((state) => ({ alerts: [newAlert, ...state.alerts] }));

        return newAlert;
      },

      updateAlertStatus: (id, status, assignedTo) => {
        const { currentUser, addAuditLog, alerts } = get();
        const alert = alerts.find((a) => a.id === id);
        if (!alert) return;

        set((state) => ({
          alerts: state.alerts.map((a) =>
            a.id === id ? { ...a, status, assignedTo: assignedTo || a.assignedTo } : a
          ),
        }));

        addAuditLog({
          userId: currentUser.id,
          userName: currentUser.name,
          action: 'update',
          entity: 'alert',
          entityId: id,
          entityName: alert.title,
          status: 'success',
          details: `Status changed to ${status}`,
        });
      },

      resolveAlert: (id) => {
        const { updateAlertStatus } = get();
        updateAlertStatus(id, 'resolved');
      },

      // Workflows
      workflows: [...initialWorkflows],

      addWorkflow: (workflowData) => {
        const newWorkflow: Workflow = {
          ...workflowData,
          id: generateId(),
          workflowNumber: generateRefNumber('WF'),
          createdAt: formatDateTime(new Date()),
          status: 'pending',
          level: 1,
        };

        set((state) => ({ workflows: [newWorkflow, ...state.workflows] }));

        return newWorkflow;
      },

      approveWorkflow: (id) => {
        const { workflows, currentUser, addAuditLog } = get();
        const workflow = workflows.find((w) => w.id === id);
        if (!workflow) return;

        const isLastLevel = workflow.level >= workflow.totalLevels;
        const newLevel = isLastLevel ? workflow.level : workflow.level + 1;
        const newStatus = isLastLevel ? 'approved' : 'pending';
        const approvers = ['Branch Manager', 'Regional Manager', 'Credit Committee', 'Risk Manager'];
        const nextApprover = isLastLevel ? workflow.currentApprover : approvers[newLevel] || 'Head Office';

        set((state) => ({
          workflows: state.workflows.map((w) =>
            w.id === id ? { ...w, status: newStatus, level: newLevel, currentApprover: nextApprover } : w
          ),
        }));

        addAuditLog({
          userId: currentUser.id,
          userName: currentUser.name,
          action: 'approve',
          entity: 'workflow',
          entityId: id,
          entityName: workflow.workflowNumber,
          status: 'success',
          details: isLastLevel ? 'Workflow fully approved' : `Approved at level ${workflow.level}, moved to level ${newLevel}`,
        });
      },

      rejectWorkflow: (id, reason) => {
        const { workflows, currentUser, addAuditLog } = get();
        const workflow = workflows.find((w) => w.id === id);
        if (!workflow) return;

        set((state) => ({
          workflows: state.workflows.map((w) => (w.id === id ? { ...w, status: 'rejected' } : w)),
        }));

        addAuditLog({
          userId: currentUser.id,
          userName: currentUser.name,
          action: 'reject',
          entity: 'workflow',
          entityId: id,
          entityName: workflow.workflowNumber,
          status: 'success',
          details: `Rejected: ${reason}`,
        });
      },

      escalateWorkflow: (id) => {
        const { workflows, currentUser, addAuditLog } = get();
        const workflow = workflows.find((w) => w.id === id);
        if (!workflow) return;

        set((state) => ({
          workflows: state.workflows.map((w) =>
            w.id === id ? { ...w, status: 'escalated', currentApprover: 'Head Office' } : w
          ),
        }));

        addAuditLog({
          userId: currentUser.id,
          userName: currentUser.name,
          action: 'update',
          entity: 'workflow',
          entityId: id,
          entityName: workflow.workflowNumber,
          status: 'success',
          details: 'Workflow escalated to Head Office',
        });
      },

      getWorkflowById: (id) => get().workflows.find((w) => w.id === id),

      // Reconciliation
      reconciliationItems: [...initialReconciliationItems],

      updateReconciliationItem: (id, updates) => {
        set((state) => ({
          reconciliationItems: state.reconciliationItems.map((r) =>
            r.id === id ? { ...r, ...updates } : r
          ),
        }));
      },

      // Collection Activities
      collectionActivities: [],

      addCollectionActivity: (activityData) => {
        const { currentUser, addAuditLog } = get();
        const newActivity: CollectionActivity = {
          ...activityData,
          id: generateId(),
        };

        set((state) => ({ collectionActivities: [...state.collectionActivities, newActivity] }));

        addAuditLog({
          userId: currentUser.id,
          userName: currentUser.name,
          action: 'create',
          entity: 'collectionActivity',
          entityId: newActivity.id,
          entityName: `${newActivity.activityType} - ${newActivity.loanNumber}`,
          status: 'success',
        });

        return newActivity;
      },

      getCollectionActivitiesByLoanId: (loanId) =>
        get().collectionActivities.filter((a) => a.loanId === loanId),

      // Audit Logs
      auditLogs: [],

      addAuditLog: (logData) => {
        const newLog: AuditLog = {
          ...logData,
          id: generateId(),
          timestamp: formatDateTime(new Date()),
        };

        set((state) => ({ auditLogs: [newLog, ...state.auditLogs].slice(0, 10000) })); // Keep last 10000 logs
      },

      getAuditLogs: (filters) => {
        const { auditLogs } = get();

        return auditLogs.filter((log) => {
          if (filters?.entity && log.entity !== filters.entity) return false;
          if (filters?.action && log.action !== filters.action) return false;
          if (filters?.userId && log.userId !== filters.userId) return false;
          if (filters?.startDate && log.timestamp < filters.startDate) return false;
          if (filters?.endDate && log.timestamp > filters.endDate) return false;
          return true;
        });
      },

      // Daily Limits
      dailyLimits: {},

      setDailyLimit: (customerId, limits) => {
        set((state) => ({
          dailyLimits: { ...state.dailyLimits, [customerId]: limits },
        }));
      },

      // Dashboard Metrics
      getDashboardMetrics: () => {
        const { customers, accounts, loans, workflows, alerts, transactions } = get();

        const today = formatDate(new Date());
        const todayTransactions = transactions.filter((t) => t.timestamp.startsWith(today));

        return {
          totalCustomers: customers.length,
          activeAccounts: accounts.filter((a) => a.status === 'active').length,
          totalDeposits: accounts.reduce((sum, a) => sum + a.balance, 0),
          totalLoans: loans.reduce((sum, l) => sum + l.outstandingAmount, 0),
          pendingWorkflows: workflows.filter((w) => w.status === 'pending').length,
          activeAlerts: alerts.filter((a) => a.status === 'new' || a.status === 'investigating').length,
          npaLoans: loans.filter((l) => l.status === 'npa').length,
          todayTransactions: todayTransactions.length,
        };
      },
    }),
    {
      name: 'cbs-storage',
      partialize: (state) => ({
        customers: state.customers,
        accounts: state.accounts,
        transactions: state.transactions,
        payments: state.payments,
        beneficiaries: state.beneficiaries,
        cards: state.cards,
        cardDisputes: state.cardDisputes,
        loans: state.loans,
        loanApplications: state.loanApplications,
        kycDocuments: state.kycDocuments,
        glEntries: state.glEntries,
        alerts: state.alerts,
        workflows: state.workflows,
        collectionActivities: state.collectionActivities,
        auditLogs: state.auditLogs,
        dailyLimits: state.dailyLimits,
        currentUser: state.currentUser,
      }),
    }
  )
);

// Export helper hooks
export const useCurrentUser = () => useBankingStore((state) => state.currentUser);
export const useHasPermission = () => useBankingStore((state) => state.hasPermission);
export const useCustomers = () => useBankingStore((state) => state.customers);
export const useAccounts = () => useBankingStore((state) => state.accounts);
export const useTransactions = () => useBankingStore((state) => state.transactions);
export const usePayments = () => useBankingStore((state) => state.payments);
export const useLoans = () => useBankingStore((state) => state.loans);
export const useLoanApplications = () => useBankingStore((state) => state.loanApplications);
export const useWorkflows = () => useBankingStore((state) => state.workflows);
export const useAlerts = () => useBankingStore((state) => state.alerts);
export const useAuditLogs = () => useBankingStore((state) => state.auditLogs);
