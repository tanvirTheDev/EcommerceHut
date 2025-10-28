// bKash Payment Configuration
export const BKASH_CONFIG = {
  // Your personal bKash number (replace with your actual number)
  PERSONAL_NUMBER: process.env.NEXT_PUBLIC_BKASH_NUMBER || "01XXXXXXXXX",
  MERCHANT_NAME: process.env.NEXT_PUBLIC_BKASH_MERCHANT_NAME || "EcommerceHut",
  CURRENCY: "BDT",
  SUCCESS_MESSAGE: "Payment successful! Thank you for your purchase.",
  INSTRUCTIONS: [
    "1. Open your bKash app",
    "2. Go to 'Send Money'",
    "3. Enter the amount shown below",
    `4. Enter the bKash number: ${process.env.NEXT_PUBLIC_BKASH_NUMBER || "01XXXXXXXXX"}`,
    "5. Complete the transaction",
    "6. Take a screenshot of the payment confirmation",
    "7. Click 'Confirm Payment' below",
  ],
};

export interface BkashPaymentData {
  orderNumber: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

export interface BkashPaymentResult {
  success: boolean;
  transactionId?: string;
  message: string;
  orderNumber: string;
}

// Generate a unique transaction reference
export const generateTransactionRef = (orderNumber: string): string => {
  const timestamp = Date.now();
  return `BKASH_${orderNumber}_${timestamp}`;
};

// Format amount for bKash (in BDT)
export const formatAmount = (amount: number): string => {
  return `৳${amount.toFixed(2)}`;
};

// Validate bKash number format (Bangladeshi mobile number)
export const isValidBkashNumber = (number: string): boolean => {
  const bdMobileRegex = /^01[3-9]\d{8}$/;
  return bdMobileRegex.test(number);
};

// Generate payment instructions
export const generatePaymentInstructions = (
  data: BkashPaymentData
): string[] => {
  return [
    `Amount to pay: ${formatAmount(data.amount)}`,
    `bKash Number: ${BKASH_CONFIG.PERSONAL_NUMBER}`,
    `Order Number: ${data.orderNumber}`,
    "",
    "Instructions:",
    ...BKASH_CONFIG.INSTRUCTIONS,
  ];
};
