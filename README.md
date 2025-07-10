# Split Generator – Frontend

Split Generator is a modern web app for splitting grocery bills and group expenses. Upload receipts, add participants, assign products, and instantly see who owes what. The frontend is built with React, Tailwind CSS, and provides a beautiful, responsive, and accessible user experience.

---

## 🌟 Product Overview
- Upload receipts (images) and extract items using OCR
- Add participants and assign products
- See real-time totals and who owes what
- Save participant groups as templates
- Export bills for record-keeping
- Secure authentication (email/password & Google OAuth)
- Premium: Analytics, unlimited usage, advanced features
- Notifications: Manage email preferences, get alerts
- Light/dark theme support

---

## 🚀 Features
- **Receipt Upload & OCR**: Upload images, extract items
- **Participant Management**: Add, edit, color-code participants
- **Product Assignment**: Assign products, split costs
- **Bill Templates**: Save/reuse groups
- **Analytics**: Premium users get charts, stats, and insights
- **Notifications**: Manage email preferences, test emails
- **Premium**: Upgrade for unlimited usage, analytics, and more
- **Authentication**: Register, login, Google OAuth
- **Responsive UI**: Works on desktop and mobile
- **Dark Mode**: Beautiful, accessible dark theme

---

## 🛠️ Tech Stack
- **React** (with hooks & context)
- **React Router**
- **Tailwind CSS**
- **Lucide React**
- **Axios**

---

## ⚡ Getting Started

### 1. Install dependencies
```bash
cd client
npm install
```

### 2. Configure environment
Create a `.env` file in the `client` folder:
```
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Start the frontend
```bash
npm start
```
The app will run at [http://localhost:3000](http://localhost:3000)

---

## 🔑 Authentication
- Register with email/password or sign in with Google
- All bill data is user-specific and private
- Protected routes ensure only authenticated users can access bills

---

## 💎 Premium & Analytics
- Upgrade to premium for unlimited bills, advanced analytics, and more
- View analytics charts (spending, frequency, top participants, etc.)
- Premium status and usage limits shown in the UI

---

## 🔔 Notifications
- Manage email notification preferences in settings
- Send test emails to verify setup
- Get notified about premium, usage, and bill events

---

## 📝 API Endpoints (Highlights)
- `POST /api/auth/register` – Register
- `POST /api/auth/login` – Login
- `GET /api/bills` – List bills
- `POST /api/bills` – Create bill
- `GET /api/analytics/overview` – Analytics (premium)
- `GET /api/notifications/preferences` – Get notification prefs
- `PUT /api/notifications/preferences` – Update notification prefs
- `POST /api/premium/upgrade` – Upgrade to premium
- `POST /api/upload/image` – Upload receipt

---

## 🏗️ Project Structure
- `src/pages/` – Main pages (Home, Bills, Create, Bill Details, Templates, Analytics, Settings)
- `src/components/` – UI components (Header, ReceiptParser, GoogleOAuth, etc.)
- `src/contexts/` – React context for auth, theme, premium, etc.
- `src/services/` – API and utility services

---

## 🤝 Contributing
Pull requests and suggestions are welcome!

---

## 📄 License
MIT License. See main repo for details.
