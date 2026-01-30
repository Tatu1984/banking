import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { Toaster } from "./components/ui/toaster";
import { ErrorBoundary } from "./components/ui/error-boundary";
import {
  Dashboard,
  Customers,
  CustomerDetail,
  Accounts,
  AccountDetail,
  Transactions,
  Payments,
  BeneficiaryManagement,
  Cards,
  Loans,
  LoanApplications,
  GeneralLedger,
  Alerts,
  Workflows,
  Reports,
  Settings,
  KYC,
  Collections,
  Compliance,
  TradeFinance,
  UserManagement,
  ProductFactory,
  BranchOperations,
  // New pages for complete SoW coverage
  Treasury,
  Reconciliation,
  CardDisputes,
  RiskAnalytics,
  QueryBuilder,
  LoanRestructuring,
  AuditLogs,
} from "./pages";

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Toaster />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="customers" element={<Customers />} />
            <Route path="customers/:id" element={<CustomerDetail />} />
            <Route path="accounts" element={<Accounts />} />
            <Route path="accounts/:id" element={<AccountDetail />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="payments" element={<Payments />} />
            <Route path="beneficiaries" element={<BeneficiaryManagement />} />
            <Route path="cards" element={<Cards />} />
            <Route path="loans" element={<Loans />} />
            <Route path="loan-applications" element={<LoanApplications />} />
            <Route path="general-ledger" element={<GeneralLedger />} />
            <Route path="alerts" element={<Alerts />} />
            <Route path="workflows" element={<Workflows />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
            <Route path="kyc" element={<KYC />} />
            <Route path="collections" element={<Collections />} />
            <Route path="compliance" element={<Compliance />} />
            <Route path="trade-finance" element={<TradeFinance />} />
            <Route path="user-management" element={<UserManagement />} />
            <Route path="product-factory" element={<ProductFactory />} />
            <Route path="branch-operations" element={<BranchOperations />} />
            {/* New routes for complete SoW coverage */}
            <Route path="treasury" element={<Treasury />} />
            <Route path="reconciliation" element={<Reconciliation />} />
            <Route path="card-disputes" element={<CardDisputes />} />
            <Route path="risk-analytics" element={<RiskAnalytics />} />
            <Route path="query-builder" element={<QueryBuilder />} />
            <Route path="loan-restructuring" element={<LoanRestructuring />} />
            <Route path="audit-logs" element={<AuditLogs />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
