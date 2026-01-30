import { z } from "zod"

// Common validation patterns
const phoneRegex = /^(\+91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}$/
const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/
const accountNumberRegex = /^\d{9,18}$/

// Common field schemas
export const emailSchema = z.string().email("Invalid email address")
export const phoneSchema = z.string().regex(phoneRegex, "Invalid phone number format")
export const panSchema = z.string().regex(panRegex, "Invalid PAN format (e.g., ABCDE1234F)")
export const amountSchema = z.coerce.number().positive("Amount must be greater than 0")
export const accountNumberSchema = z.string().regex(accountNumberRegex, "Invalid account number")
export const ifscSchema = z.string().regex(ifscRegex, "Invalid IFSC code")

// Customer Schemas
export const customerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name too long"),
  email: emailSchema,
  phone: phoneSchema,
  type: z.enum(["individual", "corporate"]),
  dateOfBirth: z.string().optional(),
  pan: panSchema.optional().or(z.literal("")),
  aadhaar: z.string().optional(),
  address: z.string().min(10, "Address must be at least 10 characters").max(500, "Address too long"),
  riskCategory: z.enum(["low", "medium", "high"]).default("low"),
})

export type CustomerFormData = z.infer<typeof customerSchema>

// Account Schemas
export const accountSchema = z.object({
  customerId: z.string().min(1, "Customer is required"),
  type: z.enum(["savings", "current", "fd", "rd", "escrow"]),
  branch: z.string().min(1, "Branch is required"),
  currency: z.string().default("INR"),
  initialDeposit: amountSchema.optional(),
  interestRate: z.coerce.number().min(0, "Interest rate cannot be negative").max(20, "Interest rate too high").optional(),
  tenureMonths: z.coerce.number().int().positive().optional(),
  nominationName: z.string().optional(),
  nominationRelation: z.string().optional(),
})

export type AccountFormData = z.infer<typeof accountSchema>

// Payment Schemas
export const internalPaymentSchema = z.object({
  fromAccount: z.string().min(1, "Source account is required"),
  toAccount: z.string().min(1, "Destination account is required"),
  amount: amountSchema,
  remarks: z.string().max(100, "Remarks too long").optional(),
}).refine(data => data.fromAccount !== data.toAccount, {
  message: "Source and destination accounts cannot be the same",
  path: ["toAccount"],
})

export const neftPaymentSchema = z.object({
  fromAccount: z.string().min(1, "Source account is required"),
  beneficiaryAccount: accountNumberSchema,
  beneficiaryName: z.string().min(2, "Beneficiary name is required"),
  beneficiaryBank: z.string().min(2, "Bank name is required"),
  ifscCode: ifscSchema,
  amount: amountSchema,
  remarks: z.string().max(100, "Remarks too long").optional(),
})

export const rtgsPaymentSchema = neftPaymentSchema.extend({
  amount: amountSchema.refine(val => val >= 200000, "RTGS minimum amount is ₹2,00,000"),
})

export const impsPaymentSchema = z.object({
  fromAccount: z.string().min(1, "Source account is required"),
  beneficiaryAccount: accountNumberSchema,
  beneficiaryName: z.string().min(2, "Beneficiary name is required"),
  ifscCode: ifscSchema,
  amount: amountSchema.refine(val => val <= 500000, "IMPS maximum amount is ₹5,00,000"),
  remarks: z.string().max(100, "Remarks too long").optional(),
})

export const upiPaymentSchema = z.object({
  fromAccount: z.string().min(1, "Source account is required"),
  upiId: z.string().regex(/^[\w.-]+@[\w]+$/, "Invalid UPI ID format"),
  amount: amountSchema.refine(val => val <= 100000, "UPI maximum amount is ₹1,00,000"),
  remarks: z.string().max(100, "Remarks too long").optional(),
})

export type InternalPaymentFormData = z.infer<typeof internalPaymentSchema>
export type NEFTPaymentFormData = z.infer<typeof neftPaymentSchema>
export type RTGSPaymentFormData = z.infer<typeof rtgsPaymentSchema>
export type IMPSPaymentFormData = z.infer<typeof impsPaymentSchema>
export type UPIPaymentFormData = z.infer<typeof upiPaymentSchema>

// Card Schemas
export const cardIssueSchema = z.object({
  customerId: z.string().min(1, "Customer is required"),
  accountId: z.string().min(1, "Account is required"),
  type: z.enum(["debit", "credit", "prepaid"]),
  variant: z.enum(["classic", "gold", "platinum", "business"]),
  dailyLimit: amountSchema.refine(val => val >= 10000, "Daily limit must be at least ₹10,000"),
  monthlyLimit: amountSchema.refine(val => val >= 50000, "Monthly limit must be at least ₹50,000"),
  nameOnCard: z.string().min(2, "Name is required").max(26, "Name too long (max 26 characters)"),
})

export const cardLimitSchema = z.object({
  dailyLimit: amountSchema,
  monthlyLimit: amountSchema,
}).refine(data => data.monthlyLimit >= data.dailyLimit, {
  message: "Monthly limit must be greater than or equal to daily limit",
  path: ["monthlyLimit"],
})

export type CardIssueFormData = z.infer<typeof cardIssueSchema>
export type CardLimitFormData = z.infer<typeof cardLimitSchema>

// Loan Application Schema
export const loanApplicationSchema = z.object({
  customerId: z.string().min(1, "Customer is required"),
  loanType: z.enum(["personal", "home", "auto", "business", "education"]),
  requestedAmount: amountSchema.refine(val => val >= 10000, "Minimum loan amount is ₹10,000"),
  tenure: z.coerce.number().int().min(6, "Minimum tenure is 6 months").max(360, "Maximum tenure is 30 years"),
  purpose: z.string().min(10, "Please describe the loan purpose").max(500, "Description too long"),
  employmentType: z.enum(["salaried", "self_employed", "business", "professional"]),
  monthlyIncome: amountSchema,
  existingEMI: z.coerce.number().min(0, "Cannot be negative").default(0),
})

export type LoanApplicationFormData = z.infer<typeof loanApplicationSchema>

// Loan Prepayment Schema
export const loanPrepaymentSchema = z.object({
  prepaymentAmount: amountSchema,
  prepaymentType: z.enum(["partial", "full"]),
  effectiveDate: z.string().min(1, "Date is required"),
})

export type LoanPrepaymentFormData = z.infer<typeof loanPrepaymentSchema>

// Beneficiary Schema
export const beneficiarySchema = z.object({
  nickname: z.string().min(2, "Nickname is required").max(50, "Nickname too long"),
  accountNumber: accountNumberSchema,
  accountHolderName: z.string().min(2, "Account holder name is required"),
  bankName: z.string().min(2, "Bank name is required"),
  ifscCode: ifscSchema,
  accountType: z.enum(["savings", "current"]).default("savings"),
  transferLimit: amountSchema.optional(),
})

export type BeneficiaryFormData = z.infer<typeof beneficiarySchema>

// KYC Update Schema
export const kycUpdateSchema = z.object({
  documentType: z.enum(["aadhaar", "pan", "passport", "driving_license", "voter_id"]),
  documentNumber: z.string().min(5, "Document number is required"),
  expiryDate: z.string().optional(),
  addressProofType: z.enum(["utility_bill", "bank_statement", "rent_agreement", "aadhaar"]).optional(),
})

export type KYCUpdateFormData = z.infer<typeof kycUpdateSchema>

// User Management Schema
export const userSchema = z.object({
  name: z.string().min(2, "Name is required").max(100, "Name too long"),
  email: emailSchema,
  role: z.enum(["admin", "manager", "officer", "teller", "viewer"]),
  branch: z.string().min(1, "Branch is required"),
  department: z.string().min(1, "Department is required"),
  employeeId: z.string().min(3, "Employee ID is required"),
})

export type UserFormData = z.infer<typeof userSchema>

// Branch Schema
export const branchSchema = z.object({
  name: z.string().min(2, "Branch name is required"),
  code: z.string().min(3, "Branch code is required").max(10, "Code too long"),
  address: z.string().min(10, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().regex(/^\d{6}$/, "Invalid PIN code"),
  phone: phoneSchema,
  managerId: z.string().optional(),
  ifscCode: ifscSchema,
})

export type BranchFormData = z.infer<typeof branchSchema>

// Product Schema
export const productSchema = z.object({
  name: z.string().min(2, "Product name is required"),
  code: z.string().min(3, "Product code is required"),
  type: z.enum(["savings", "current", "fd", "rd", "loan", "card"]),
  description: z.string().min(10, "Description is required"),
  interestRate: z.coerce.number().min(0).max(30).optional(),
  minBalance: amountSchema.optional(),
  maxBalance: amountSchema.optional(),
  tenureMin: z.coerce.number().int().positive().optional(),
  tenureMax: z.coerce.number().int().positive().optional(),
  isActive: z.boolean().default(true),
})

export type ProductFormData = z.infer<typeof productSchema>

// Card Dispute Schema
export const cardDisputeSchema = z.object({
  cardId: z.string().min(1, "Card is required"),
  disputeType: z.enum(["fraud", "merchant", "atm", "duplicate", "non_receipt"]),
  transactionDate: z.string().min(1, "Transaction date is required"),
  transactionAmount: amountSchema,
  merchantName: z.string().optional(),
  description: z.string().min(20, "Please provide detailed description").max(1000, "Description too long"),
})

export type CardDisputeFormData = z.infer<typeof cardDisputeSchema>

// Query Builder Schema
export const savedQuerySchema = z.object({
  name: z.string().min(2, "Query name is required").max(100, "Name too long"),
  description: z.string().max(500, "Description too long").optional(),
  category: z.enum(["customer", "transaction", "loan", "risk", "compliance", "custom"]),
  query: z.string().min(10, "Query is required"),
  isPublic: z.boolean().default(false),
})

export type SavedQueryFormData = z.infer<typeof savedQuerySchema>
