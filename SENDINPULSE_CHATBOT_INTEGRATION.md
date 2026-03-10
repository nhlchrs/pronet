# Sendinpulse Chatbot Integration Guide

## ✅ Integration Complete!

I've integrated the Sendinpulse chatbot into your frontend using two methods:

### Method 1: Direct Script (Currently Active)
- **File**: `pronet/index.html`
- The script is loaded directly in the HTML head
- Simple and straightforward

### Method 2: React Component (Optional)
- **Component**: `pronet/src/Components/Chatbot/SendinpulseChatbot.jsx`
- **Integrated in**: `pronet/src/App.jsx`
- More control over when/where the chatbot appears
- Better for React lifecycle management

## 🔧 Configuration Steps

### 1. Get Your Sendinpulse Form ID

1. Log in to your **Sendinpulse** account
2. Go to **Chatbots** section
3. Create a new chatbot or select existing one
4. Navigate to **Installation** or **Integration** section
5. Copy your **Form ID** (looks like: `abcdef1234567890`)

### 2. Replace the Form ID

**If using Method 1 (index.html):**
```html
<!-- In pronet/index.html -->
<script charset="UTF-8" src="//web.webformscr.com/apps/fc3/build/loader.js" 
        async sp-form-id="YOUR_FORM_ID_HERE"></script>
```
Replace `YOUR_FORM_ID_HERE` with your actual Form ID.

**If using Method 2 (React Component):**
```javascript
// In pronet/src/Components/Chatbot/SendinpulseChatbot.jsx
script.setAttribute('sp-form-id', 'YOUR_FORM_ID_HERE');
```
Replace `YOUR_FORM_ID_HERE` with your actual Form ID.

## 📝 Choose Your Method

**Use Method 1 (index.html) if:**
- You want simple integration
- The chatbot should appear on all pages
- You don't need conditional logic

**Use Method 2 (React Component) if:**
- You need more control
- You want to show/hide chatbot based on user state
- You prefer React-style integration

**Note:** If you're using Method 1, you can remove the component integration from App.jsx to avoid loading the script twice.

## 🎨 Customization

You can customize your chatbot appearance and behavior from your Sendinpulse dashboard:
- Widget position (bottom right, bottom left, etc.)
- Colors and branding
- Welcome message
- Trigger conditions
- Operating hours

## 🧪 Testing

1. Replace `YOUR_FORM_ID_HERE` with your actual Form ID
2. Save the file(s)
3. Restart your dev server: `npm run dev`
4. Visit your website
5. The chatbot widget should appear (usually in the bottom-right corner)

## 🚀 Deployment

The chatbot will work automatically in production once you deploy. No additional configuration needed!

## 📞 Support

If you need help:
- Check Sendinpulse documentation: https://sendpulse.com/support
- Verify your Form ID is correct
- Check browser console for any errors

---
**Installation Date**: March 11, 2026
