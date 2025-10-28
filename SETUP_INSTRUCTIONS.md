# bKash Payment Setup Instructions

## 🔧 **Fix the "Insufficient permissions" Error**

The error you're seeing is because your Sanity API token doesn't have write permissions. Here's how to fix it:

### **Step 1: Get a Sanity API Token with Write Permissions**

1. Go to [sanity.io/manage](https://sanity.io/manage)
2. Select your project
3. Go to **API** tab
4. Click **"Add API token"**
5. Name it: `EcommerceHut Write Token`
6. **IMPORTANT**: Select **"Editor"** permissions (not "Viewer")
7. Copy the token

### **Step 2: Add Environment Variables**

Create a `.env.local` file in your project root with:

```bash
# Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_write_token_here

# bKash Configuration
NEXT_PUBLIC_BKASH_NUMBER=01XXXXXXXXX
NEXT_PUBLIC_BKASH_MERCHANT_NAME=EcommerceHut

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Clerk Authentication (if you have it)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret
```

### **Step 3: Update Your bKash Number**

Replace `01XXXXXXXXX` with your actual bKash number in the `.env.local` file.

### **Step 4: Restart Your Development Server**

```bash
npm run dev
```

## 🎯 **What This Fixes**

- ✅ **Sanity write permissions** - Orders can now be created
- ✅ **bKash payment flow** - Complete payment process
- ✅ **Environment configuration** - Easy to update settings

## 🚨 **Important Notes**

1. **Never commit `.env.local`** to git (it's already in .gitignore)
2. **Use "Editor" permissions** for the Sanity token, not "Viewer"
3. **Replace the placeholder values** with your actual credentials

## 🧪 **Test the Payment Flow**

1. Add items to basket
2. Click "Pay with bKash"
3. You should now see the bKash payment page instead of the error
4. Follow the payment instructions
5. Confirm payment

---

**Need Help?** Check the browser console for any remaining errors after setting up the environment variables.
