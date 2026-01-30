import { cn } from "@/lib/utils"
import {
  FileQuestion,
  Users,
  CreditCard,
  Wallet,
  Receipt,
  AlertCircle,
  Search,
  FolderOpen,
  Inbox,
  type LucideIcon
} from "lucide-react"
import { Button } from "./button"

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

const entityIcons: Record<string, LucideIcon> = {
  customers: Users,
  accounts: Wallet,
  transactions: Receipt,
  payments: Receipt,
  cards: CreditCard,
  loans: Wallet,
  alerts: AlertCircle,
  search: Search,
  files: FolderOpen,
  default: Inbox,
}

function EmptyState({
  icon: Icon = FileQuestion,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 px-4 text-center", className)}>
      <div className="rounded-full bg-muted p-4 mb-4">
        <Icon className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-sm mb-4">{description}</p>
      )}
      {action && (
        <Button onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  )
}

function EmptyStateForEntity({
  entity,
  onAction,
}: {
  entity: keyof typeof entityIcons | string
  onAction?: () => void
}) {
  const Icon = entityIcons[entity] || entityIcons.default

  const messages: Record<string, { title: string; description: string; actionLabel?: string }> = {
    customers: {
      title: "No customers found",
      description: "Get started by creating your first customer record.",
      actionLabel: "Add Customer",
    },
    accounts: {
      title: "No accounts found",
      description: "Create a new account to get started.",
      actionLabel: "Open Account",
    },
    transactions: {
      title: "No transactions found",
      description: "Transactions will appear here once they are processed.",
    },
    payments: {
      title: "No payments found",
      description: "Initiate a new payment to get started.",
      actionLabel: "New Payment",
    },
    cards: {
      title: "No cards found",
      description: "Issue a new card to get started.",
      actionLabel: "Issue Card",
    },
    loans: {
      title: "No loans found",
      description: "Loan records will appear here once created.",
    },
    alerts: {
      title: "No alerts",
      description: "You're all caught up! No alerts to review.",
    },
    search: {
      title: "No results found",
      description: "Try adjusting your search or filter criteria.",
    },
    files: {
      title: "No files uploaded",
      description: "Upload documents to attach them to this record.",
      actionLabel: "Upload File",
    },
    default: {
      title: "No data available",
      description: "There's nothing here yet.",
    },
  }

  const message = messages[entity] || messages.default

  return (
    <EmptyState
      icon={Icon}
      title={message.title}
      description={message.description}
      action={onAction && message.actionLabel ? { label: message.actionLabel, onClick: onAction } : undefined}
    />
  )
}

function SearchEmptyState({ query }: { query?: string }) {
  return (
    <EmptyState
      icon={Search}
      title="No results found"
      description={query ? `No results found for "${query}". Try a different search term.` : "Try adjusting your search or filter criteria."}
    />
  )
}

export { EmptyState, EmptyStateForEntity, SearchEmptyState }
