import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  Users,
  Wallet,
  ArrowLeftRight,
  CreditCard,
  Landmark,
  FileText,
  Shield,
  Building2,
  Settings,
  BarChart3,
  AlertTriangle,
  CheckSquare,
  ChevronDown,
  ChevronRight,
  Globe,
  Briefcase,
  Calculator,
  Bell,
  UserCog,
  Package,
  Building,
  UserPlus,
  // New icons for added pages
  TrendingUp,
  ArrowLeftRightIcon,
  Scale,
  Activity,
  Database,
  RefreshCw,
} from "lucide-react";
import { useState } from "react";

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  badge?: number;
}

interface NavGroupProps {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function NavItem({ to, icon, label, badge }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
          isActive
            ? "bg-accent text-accent-foreground font-medium"
            : "text-muted-foreground"
        )
      }
    >
      {icon}
      <span className="flex-1">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </NavLink>
  );
}

function NavGroup({ label, icon, children, defaultOpen = false }: NavGroupProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="space-y-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-all hover:bg-accent"
      >
        {icon}
        <span className="flex-1 text-left">{label}</span>
        {isOpen ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </button>
      {isOpen && <div className="ml-4 space-y-1">{children}</div>}
    </div>
  );
}

export function Sidebar() {
  return (
    <div className="flex h-full w-64 flex-col border-r bg-card">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Landmark className="h-5 w-5 text-primary-foreground" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold">Enterprise CBS</span>
          <span className="text-[10px] text-muted-foreground">Core Banking System</span>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-1">
          <NavItem
            to="/"
            icon={<LayoutDashboard className="h-4 w-4" />}
            label="Dashboard"
          />
        </div>

        <Separator className="my-4" />

        <div className="space-y-1">
          <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Customer Management
          </p>
          <NavItem
            to="/customers"
            icon={<Users className="h-4 w-4" />}
            label="Customers"
          />
          <NavItem
            to="/accounts"
            icon={<Wallet className="h-4 w-4" />}
            label="Accounts"
          />
          <NavItem
            to="/kyc"
            icon={<FileText className="h-4 w-4" />}
            label="KYC Management"
            badge={5}
          />
        </div>

        <Separator className="my-4" />

        <div className="space-y-1">
          <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Transactions
          </p>
          <NavItem
            to="/transactions"
            icon={<ArrowLeftRight className="h-4 w-4" />}
            label="Transactions"
          />
          <NavItem
            to="/payments"
            icon={<Globe className="h-4 w-4" />}
            label="Payments"
          />
          <NavItem
            to="/beneficiaries"
            icon={<UserPlus className="h-4 w-4" />}
            label="Beneficiaries"
          />
          <NavItem
            to="/cards"
            icon={<CreditCard className="h-4 w-4" />}
            label="Cards"
          />
          <NavItem
            to="/card-disputes"
            icon={<Scale className="h-4 w-4" />}
            label="Disputes"
            badge={5}
          />
        </div>

        <Separator className="my-4" />

        <div className="space-y-1">
          <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Lending
          </p>
          <NavItem
            to="/loans"
            icon={<Briefcase className="h-4 w-4" />}
            label="Loans"
          />
          <NavItem
            to="/loan-applications"
            icon={<FileText className="h-4 w-4" />}
            label="Applications"
            badge={3}
          />
          <NavItem
            to="/loan-restructuring"
            icon={<RefreshCw className="h-4 w-4" />}
            label="Restructuring"
          />
          <NavItem
            to="/collections"
            icon={<AlertTriangle className="h-4 w-4" />}
            label="Collections"
          />
        </div>

        <Separator className="my-4" />

        <div className="space-y-1">
          <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Finance & Accounting
          </p>
          <NavItem
            to="/general-ledger"
            icon={<Calculator className="h-4 w-4" />}
            label="General Ledger"
          />
          <NavItem
            to="/treasury"
            icon={<TrendingUp className="h-4 w-4" />}
            label="Treasury & ALM"
          />
          <NavItem
            to="/reconciliation"
            icon={<ArrowLeftRightIcon className="h-4 w-4" />}
            label="Reconciliation"
          />
          <NavItem
            to="/trade-finance"
            icon={<Building2 className="h-4 w-4" />}
            label="Trade Finance"
          />
        </div>

        <Separator className="my-4" />

        <div className="space-y-1">
          <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Risk & Compliance
          </p>
          <NavItem
            to="/alerts"
            icon={<Bell className="h-4 w-4" />}
            label="Alerts"
            badge={23}
          />
          <NavItem
            to="/risk-analytics"
            icon={<Activity className="h-4 w-4" />}
            label="Risk Analytics"
          />
          <NavItem
            to="/compliance"
            icon={<Shield className="h-4 w-4" />}
            label="Compliance"
          />
          <NavItem
            to="/workflows"
            icon={<CheckSquare className="h-4 w-4" />}
            label="Workflows"
            badge={4}
          />
        </div>

        <Separator className="my-4" />

        <div className="space-y-1">
          <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Analytics
          </p>
          <NavItem
            to="/reports"
            icon={<BarChart3 className="h-4 w-4" />}
            label="Reports"
          />
          <NavItem
            to="/query-builder"
            icon={<Database className="h-4 w-4" />}
            label="Query Builder"
          />
        </div>

        <Separator className="my-4" />

        <div className="space-y-1">
          <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Administration
          </p>
          <NavItem
            to="/branch-operations"
            icon={<Building className="h-4 w-4" />}
            label="Branch Operations"
          />
          <NavItem
            to="/user-management"
            icon={<UserCog className="h-4 w-4" />}
            label="User Management"
          />
          <NavItem
            to="/product-factory"
            icon={<Package className="h-4 w-4" />}
            label="Product Factory"
          />
        </div>

        <Separator className="my-4" />

        <div className="space-y-1">
          <NavItem
            to="/settings"
            icon={<Settings className="h-4 w-4" />}
            label="Settings"
          />
        </div>
      </ScrollArea>

      {/* User Section */}
      <div className="border-t p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
            AU
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Admin User</p>
            <p className="text-xs text-muted-foreground truncate">System Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
}
