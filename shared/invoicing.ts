// Invoice and Net terms management system for wholesale orders
// Handles invoice generation, payment terms, and payment tracking

export type InvoiceStatus = 'draft' | 'sent' | 'viewed' | 'partially-paid' | 'paid' | 'overdue' | 'cancelled';
export type PaymentStatus = 'unpaid' | 'partial' | 'paid' | 'overdue' | 'cancelled';
export type NetTerms = 'net-0' | 'net-15' | 'net-30' | 'net-60';

export interface InvoiceLineItem {
  itemId: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  description?: string;
  metadata?: Record<string, any>;
}

export interface InvoiceAddress {
  name: string;
  company?: string;
  street: string;
  street2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
  email?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  poNumber?: string;
  orderId: string;
  customerId: string;
  customerName: string;
  
  // Dates
  invoiceDate: Date;
  dueDate: Date;
  netTerms: NetTerms;
  
  // Addresses
  billToAddress: InvoiceAddress;
  shipToAddress?: InvoiceAddress;
  
  // Line items and totals
  lineItems: InvoiceLineItem[];
  subtotal: number;
  discountAmount: number;
  discountPercentage?: number;
  taxRate: number;
  taxAmount: number;
  shippingCost: number;
  total: number;
  
  // Payment
  status: InvoiceStatus;
  paymentStatus: PaymentStatus;
  amountPaid: number;
  amountRemaining: number;
  lastPaymentDate?: Date;
  payments: Payment[];
  
  // Terms and conditions
  notes?: string;
  terms?: string;
  bankDetails?: {
    accountName: string;
    accountNumber: string;
    routingNumber: string;
    bankName: string;
    swift?: string;
    iban?: string;
  };
  
  // Metadata
  sentAt?: Date;
  viewedAt?: Date;
  remindersSent: number;
  lastReminderAt?: Date;
  
  // Document
  documentUrl?: string;
  emailsSent: string[]; // recipient email addresses
  
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string; // user ID
}

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  date: Date;
  method: 'check' | 'bank-transfer' | 'credit-card' | 'ach' | 'cash';
  reference: string;
  note?: string;
  recordedBy?: string; // user ID
  recordedAt: Date;
}

export interface InvoiceTemplate {
  id: string;
  name: string;
  companyName: string;
  companyLogo?: string;
  companyAddress: InvoiceAddress;
  companyWebsite?: string;
  companyPhone?: string;
  companyEmail?: string;
  taxId?: string;
  
  terms?: string;
  notes?: string;
  bankDetails?: Invoice['bankDetails'];
  
  footerText?: string;
  headerText?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentReminder {
  id: string;
  invoiceId: string;
  reminderType: 'initial' | 'first-follow-up' | 'second-follow-up' | 'final-notice';
  sentAt: Date;
  sentTo: string;
  subject: string;
  message: string;
  attachedDocument?: boolean;
}

export interface NetTermsConfig {
  term: NetTerms;
  days: number;
  label: string;
  description: string;
  minimumOrderAmount?: number;
  requiresApproval: boolean;
  creditRequired: boolean;
}

// Net terms configurations
export const NET_TERMS_CONFIG: Record<NetTerms, NetTermsConfig> = {
  'net-0': {
    term: 'net-0',
    days: 0,
    label: 'Due on Receipt',
    description: 'Payment due immediately upon invoice receipt',
    minimumOrderAmount: 0,
    requiresApproval: false,
    creditRequired: false,
  },
  'net-15': {
    term: 'net-15',
    days: 15,
    label: 'Net 15',
    description: 'Payment due within 15 days of invoice date',
    minimumOrderAmount: 500,
    requiresApproval: true,
    creditRequired: true,
  },
  'net-30': {
    term: 'net-30',
    days: 30,
    label: 'Net 30',
    description: 'Payment due within 30 days of invoice date',
    minimumOrderAmount: 1000,
    requiresApproval: true,
    creditRequired: true,
  },
  'net-60': {
    term: 'net-60',
    days: 60,
    label: 'Net 60',
    description: 'Payment due within 60 days of invoice date',
    minimumOrderAmount: 5000,
    requiresApproval: true,
    creditRequired: true,
  },
};

// Helper functions
export function calculateDueDate(invoiceDate: Date, netTerms: NetTerms): Date {
  const config = NET_TERMS_CONFIG[netTerms];
  const dueDate = new Date(invoiceDate);
  dueDate.setDate(dueDate.getDate() + config.days);
  return dueDate;
}

export function getDaysOverdue(dueDate: Date): number {
  const today = new Date();
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  return Math.floor((today.getTime() - dueDate.getTime()) / millisecondsPerDay);
}

export function getInvoiceStatus(
  dueDate: Date,
  amountRemaining: number,
  amountPaid: number
): PaymentStatus {
  if (amountRemaining <= 0) {
    return 'paid';
  }

  const daysOverdue = getDaysOverdue(dueDate);
  if (daysOverdue > 0) {
    return 'overdue';
  }

  if (amountPaid > 0) {
    return 'partial';
  }

  return 'unpaid';
}

export function generateInvoiceNumber(customerId: string, invoiceCount: number): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const sequence = String(invoiceCount + 1).padStart(5, '0');
  return `INV-${year}${month}-${sequence}`;
}

export function calculateInvoiceTotals(
  lineItems: InvoiceLineItem[],
  discountPercentage: number = 0,
  taxRate: number = 0.08,
  shippingCost: number = 0
): {
  subtotal: number;
  discountAmount: number;
  subtotalAfterDiscount: number;
  taxAmount: number;
  total: number;
} {
  const subtotal = lineItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const discountAmount = subtotal * (discountPercentage / 100);
  const subtotalAfterDiscount = subtotal - discountAmount;
  const taxAmount = subtotalAfterDiscount * taxRate;
  const total = subtotalAfterDiscount + taxAmount + shippingCost;

  return {
    subtotal,
    discountAmount,
    subtotalAfterDiscount,
    taxAmount,
    total,
  };
}

export function recordPayment(
  invoice: Invoice,
  payment: Omit<Payment, 'id' | 'invoiceId' | 'recordedAt'>
): Invoice {
  const newPayment: Payment = {
    ...payment,
    id: `PAY-${Date.now()}`,
    invoiceId: invoice.id,
    recordedAt: new Date(),
  };

  const amountPaid = invoice.amountPaid + payment.amount;
  const amountRemaining = Math.max(0, invoice.total - amountPaid);

  const paymentStatus = getInvoiceStatus(invoice.dueDate, amountRemaining, amountPaid);

  return {
    ...invoice,
    amountPaid,
    amountRemaining,
    paymentStatus,
    payments: [...invoice.payments, newPayment],
    lastPaymentDate: new Date(),
    status: amountRemaining === 0 ? 'paid' : 'partially-paid',
  };
}

export function shouldSendReminder(invoice: Invoice): boolean {
  if (invoice.paymentStatus === 'paid') {
    return false;
  }

  const daysOverdue = getDaysOverdue(invoice.dueDate);
  if (daysOverdue < 0) {
    return false; // Not yet due
  }

  // Send reminders at different intervals
  const daysSinceDue = daysOverdue;
  const remindersSent = invoice.remindersSent || 0;

  if (remindersSent === 0 && daysSinceDue >= 1) return true; // Initial reminder
  if (remindersSent === 1 && daysSinceDue >= 7) return true; // First follow-up
  if (remindersSent === 2 && daysSinceDue >= 14) return true; // Second follow-up
  if (remindersSent === 3 && daysSinceDue >= 30) return true; // Final notice

  return false;
}

export function canApplyNetTerms(
  netTerms: NetTerms,
  orderTotal: number,
  customerCreditLimit?: number,
  customerCreditUsed?: number
): { allowed: boolean; reason?: string } {
  const config = NET_TERMS_CONFIG[netTerms];

  // Check minimum order amount
  if (
    config.minimumOrderAmount &&
    orderTotal < config.minimumOrderAmount
  ) {
    return {
      allowed: false,
      reason: `Minimum order of $${config.minimumOrderAmount} required for ${config.label}`,
    };
  }

  // Check credit limit
  if (config.creditRequired && customerCreditLimit) {
    const availableCredit = customerCreditLimit - (customerCreditUsed || 0);
    if (availableCredit < orderTotal) {
      return {
        allowed: false,
        reason: `Insufficient credit available. Required: $${orderTotal}, Available: $${availableCredit}`,
      };
    }
  }

  return { allowed: true };
}

export function getPaymentTermsDisplay(netTerms: NetTerms): string {
  const config = NET_TERMS_CONFIG[netTerms];
  return `${config.label} - ${config.description}`;
}

export function estimatePaymentDate(
  invoiceDate: Date,
  netTerms: NetTerms,
  earlyPaymentDiscount?: number
): {
  dueDate: Date;
  discountDeadline?: Date;
  discountPercentage?: number;
} {
  const dueDate = calculateDueDate(invoiceDate, netTerms);
  let discountDeadline: Date | undefined;

  // 2/10 Net 30 style: 2% discount if paid within 10 days
  if (earlyPaymentDiscount) {
    discountDeadline = new Date(invoiceDate);
    discountDeadline.setDate(discountDeadline.getDate() + 10);
  }

  return {
    dueDate,
    discountDeadline,
    discountPercentage: earlyPaymentDiscount,
  };
}

export function formatInvoiceForEmail(invoice: Invoice): {
  subject: string;
  body: string;
  htmlBody: string;
} {
  const dueDate = invoice.dueDate.toLocaleDateString();
  const total = invoice.total.toFixed(2);

  const subject = `Invoice ${invoice.invoiceNumber} from Sticky Slap`;

  const body = `
Dear ${invoice.customerName},

Please find your invoice attached:

Invoice Number: ${invoice.invoiceNumber}
Invoice Date: ${invoice.invoiceDate.toLocaleDateString()}
Due Date: ${dueDate}
Total Amount Due: $${total}
Payment Terms: ${NET_TERMS_CONFIG[invoice.netTerms].label}

${invoice.notes || ''}

Thank you for your business!

Sticky Slap
${invoice.billToAddress.phone}
${invoice.billToAddress.email}
  `.trim();

  const htmlBody = `
<p>Dear ${invoice.customerName},</p>

<p>Please find your invoice attached:</p>

<table style="border-collapse: collapse; width: 100%; margin: 20px 0;">
  <tr>
    <td style="padding: 8px;"><strong>Invoice Number:</strong></td>
    <td style="padding: 8px;">${invoice.invoiceNumber}</td>
  </tr>
  <tr>
    <td style="padding: 8px;"><strong>Invoice Date:</strong></td>
    <td style="padding: 8px;">${invoice.invoiceDate.toLocaleDateString()}</td>
  </tr>
  <tr>
    <td style="padding: 8px;"><strong>Due Date:</strong></td>
    <td style="padding: 8px;">${dueDate}</td>
  </tr>
  <tr>
    <td style="padding: 8px;"><strong>Total Amount Due:</strong></td>
    <td style="padding: 8px; font-weight: bold;">$${total}</td>
  </tr>
  <tr>
    <td style="padding: 8px;"><strong>Payment Terms:</strong></td>
    <td style="padding: 8px;">${NET_TERMS_CONFIG[invoice.netTerms].label}</td>
  </tr>
</table>

${invoice.notes ? `<p>${invoice.notes}</p>` : ''}

<p>Thank you for your business!</p>

<p>
  Sticky Slap<br>
  ${invoice.billToAddress.phone || ''}<br>
  ${invoice.billToAddress.email || ''}
</p>
  `.trim();

  return { subject, body, htmlBody };
}
