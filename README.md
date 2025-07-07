# Split Generator – Frontend

Split Generator is a modern web app for splitting grocery bills and group expenses. Upload e-bills or receipt images, add participants, assign products, and instantly see who owes what. The frontend is built with React, Tailwind CSS, and provides a beautiful, responsive, and accessible user experience.

---

## 🌟 Product Overview

**Split Generator** makes group bill splitting effortless:
- Upload receipts (images or PDFs) and extract items using OCR
- Add participants and assign products to each person
- See real-time totals and who owes what
- Save participant groups as templates for quick reuse
- Export bills for record-keeping
- Secure authentication (email/password & Google OAuth)
- Light/dark theme support

---

## 🚀 Features

- **Receipt Upload & OCR**: Upload images or PDFs, extract items using Tesseract.js and PDF.js
- **Participant Management**: Add, edit, and color-code participants
- **Product Assignment**: Assign products to participants, split costs automatically
- **Bill Templates**: Save and reuse common participant groups
- **Bill Export**: Download a text summary of any bill
- **Authentication**: Register, login, Google OAuth, protected routes
- **Responsive UI**: Works great on desktop and mobile
- **Dark Mode**: Beautiful, accessible dark theme

---

## 🛠️ Tech Stack

- **React** (with hooks & context)
- **React Router** (routing)
- **Tailwind CSS** (utility-first styling, dark mode)
- **Lucide React** (icons)
- **Tesseract.js** (client-side OCR)
- **PDF.js** (PDF parsing)
- **Axios** (API requests)

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

## 🧾 Bill Splitting Flow
1. **Create Bill**: Enter a title, upload a receipt, or add products manually
2. **Add Participants**: Add names and assign colors
3. **Assign Products**: Assign each product to one or more participants
4. **View Totals**: See who owes what in real time
5. **Export Bill**: Download a summary for your records

---

## 🗂️ Project Structure
- `src/pages/` – Main pages (Home, Bills, Create, Bill Details, Templates, Settings)
- `src/components/` – UI components (Header, ReceiptParser, GoogleOAuth, etc.)
- `src/contexts/` – React context for auth, theme, etc.
- `src/services/` – API and utility services

---

## 🤝 Contributing
Pull requests and suggestions are welcome! Please open an issue for major changes.

---

## 📄 License
MIT License. See main repo for details.

---

## 💡 About
Split Generator is designed to make group expense splitting painless, accurate, and fun. Built with love for roommates, friends, and anyone who hates doing math after shopping!
