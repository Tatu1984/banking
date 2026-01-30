import * as React from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Loader2, AlertTriangle, Trash2, XCircle, CheckCircle } from "lucide-react"

type ConfirmVariant = "destructive" | "warning" | "default"

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: ConfirmVariant
  loading?: boolean
  onConfirm: () => void | Promise<void>
}

const variantConfig: Record<ConfirmVariant, { icon: React.ElementType; buttonVariant: "destructive" | "default" | "outline" }> = {
  destructive: { icon: Trash2, buttonVariant: "destructive" },
  warning: { icon: AlertTriangle, buttonVariant: "default" },
  default: { icon: CheckCircle, buttonVariant: "default" },
}

function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  loading = false,
  onConfirm,
}: ConfirmDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  const config = variantConfig[variant]
  const Icon = config.icon

  const handleConfirm = async () => {
    setIsLoading(true)
    try {
      await onConfirm()
    } finally {
      setIsLoading(false)
    }
  }

  const showLoading = loading || isLoading

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className={`rounded-full p-2 ${
              variant === "destructive" ? "bg-red-100 text-red-600" :
              variant === "warning" ? "bg-yellow-100 text-yellow-600" :
              "bg-blue-100 text-blue-600"
            }`}>
              <Icon className="h-5 w-5" />
            </div>
            <AlertDialogTitle>{title}</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="pt-2">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={showLoading}>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant={config.buttonVariant}
              onClick={handleConfirm}
              disabled={showLoading}
            >
              {showLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {confirmLabel}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function DeleteConfirmDialog({
  open,
  onOpenChange,
  itemName,
  onConfirm,
  loading,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  itemName: string
  onConfirm: () => void | Promise<void>
  loading?: boolean
}) {
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={`Delete ${itemName}?`}
      description={`This action cannot be undone. This will permanently delete the ${itemName.toLowerCase()} and all associated data.`}
      confirmLabel="Delete"
      variant="destructive"
      loading={loading}
      onConfirm={onConfirm}
    />
  )
}

function DeactivateConfirmDialog({
  open,
  onOpenChange,
  itemName,
  onConfirm,
  loading,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  itemName: string
  onConfirm: () => void | Promise<void>
  loading?: boolean
}) {
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={`Deactivate ${itemName}?`}
      description={`This will deactivate the ${itemName.toLowerCase()}. You can reactivate it later if needed.`}
      confirmLabel="Deactivate"
      variant="warning"
      loading={loading}
      onConfirm={onConfirm}
    />
  )
}

function BlockConfirmDialog({
  open,
  onOpenChange,
  itemName,
  onConfirm,
  loading,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  itemName: string
  onConfirm: () => void | Promise<void>
  loading?: boolean
}) {
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={`Block ${itemName}?`}
      description={`This will immediately block all transactions on the ${itemName.toLowerCase()}. This action should only be used for suspected fraud or security concerns.`}
      confirmLabel="Block"
      variant="destructive"
      loading={loading}
      onConfirm={onConfirm}
    />
  )
}

export {
  ConfirmDialog,
  DeleteConfirmDialog,
  DeactivateConfirmDialog,
  BlockConfirmDialog
}
