# Library Book Issue & Return Management System

![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)
![React](https://img.shields.io/badge/React-18.3-blue.svg)
![Express](https://img.shields.io/badge/Express-4.21-lightgrey.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-brightgreen.svg)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4.0-38bdf8.svg)
![AI Assistant](https://img.shields.io/badge/AI-Google%20Gemini-orange.svg)

A full-stack Library Management System built with **Node.js**, **Express**, **MongoDB**, **React.js**, and **Tailwind CSS**. Features QR code-based book issuing/returning, an admin dashboard with overdue tracking, CSV data export, and an AI-powered chatbot assistant.

---

## Tech Stack

| Layer      | Technology                                      |
| ---------- | ----------------------------------------------- |
| Frontend   | React 18, Vite, Tailwind CSS v4, React Router 7 |
| Backend    | Node.js, Express 4, Mongoose (MongoDB ODM)      |
| Database   | MongoDB                                         |
| QR System  | `qrcode` (generation), `html5-qrcode` (scanning)|
| AI Chatbot | Google Generative AI SDK (Gemma / Gemini)       |
| Export     | `json2csv` for CSV generation                   |
| Icons      | Lucide React                                    |

---

## Features

- **Book Management** - Full CRUD for books (Title, Author, ISBN, Category, Total Copies)
- **QR Code System** - Auto-generated unique QR code for each book; camera-based QR scanning
- **Issue Flow** - Scan QR > Verify book > Check availability > Create transaction > Decrement copies
- **Return Flow** - Scan QR > Find active transaction > Update return date > Increment copies
- **Search & Filter** - Server-side filtering by title, author, and availability status
- **Admin Dashboard** - Stats cards (Total, Available, Issued, Overdue), borrowed books table with overdue calculation
- **CSV Export** - Download complete transaction history as CSV via `/api/export/history`
- **AI Chatbot** - Ask questions about library stock powered by Google Generative AI
- **Error Handling** - Comprehensive HTTP status codes and centralized error middleware

---

## Prerequisites

- **Node.js** 18+ and npm
- **MongoDB** (local installation or MongoDB Atlas cloud)
- **Gemini API Key** (optional, for AI chatbot feature) - Get one at [Google AI Studio](https://aistudio.google.com/)

---

## Project Structure

```
├── server/
│   ├── controllers/        # Request handlers
│   │   ├── bookController.js
│   │   ├── transactionController.js
│   │   ├── exportController.js
│   │   ├── dashboardController.js
│   │   └── chatbotController.js
│   ├── services/           # Business logic
│   │   ├── bookService.js
│   │   ├── transactionService.js
│   │   ├── exportService.js
│   │   ├── dashboardService.js
│   │   └── chatbotService.js
│   ├── routes/             # Route definitions
│   │   ├── bookRoutes.js
│   │   ├── transactionRoutes.js
│   │   ├── exportRoutes.js
│   │   ├── dashboardRoutes.js
│   │   └── chatbotRoutes.js
│   ├── models/             # Mongoose schemas
│   │   ├── Book.js
│   │   └── Transaction.js
│   ├── middleware/
│   │   └── errorHandler.js
│   ├── server.js           # Entry point
│   ├── package.json
│   └── .env.example
├── client/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── BookList.jsx
│   │   │   ├── BookForm.jsx
│   │   │   ├── QRCodeDisplay.jsx
│   │   │   ├── QRScanner.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ChatBot.jsx
│   │   │   ├── SearchFilter.jsx
│   │   │   └── BorrowedBooksTable.jsx
│   │   ├── pages/          # Page components
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── BooksPage.jsx
│   │   │   ├── IssuePage.jsx
│   │   │   └── ReturnPage.jsx
│   │   ├── services/
│   │   │   └── api.js      # Axios API client
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── .gitignore
└── README.md
```

---

## Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/RGowthamRaj/library-management-system.git
cd library-management-system
```

### 2. Setup the Backend

```bash
cd server
npm install

# Create environment file
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
MONGODB_URI=mongodb://localhost:27017/library_management
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Setup the Frontend

```bash
cd ../client
npm install
```

### 4. Start MongoDB

Make sure MongoDB is running locally, or use a MongoDB Atlas connection string in your `.env`.

### 5. Run the Application

Open two terminal windows:

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```
Server starts at `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```
Client starts at `http://localhost:3000`

The Vite dev server proxies `/api` requests to the backend automatically.

---

## API Endpoints

### Books

| Method | Endpoint         | Description                          |
| ------ | ---------------- | ------------------------------------ |
| GET    | `/api/books`     | List all books (supports `?title=`, `?author=`, `?available=true/false`) |
| GET    | `/api/books/:id` | Get a single book by ID              |
| POST   | `/api/books`     | Create a new book                    |
| PUT    | `/api/books/:id` | Update a book                        |
| DELETE | `/api/books/:id` | Delete a book                        |

### Transactions

| Method | Endpoint                   | Description                          |
| ------ | -------------------------- | ------------------------------------ |
| POST   | `/api/transactions/issue`  | Issue a book `{ uniqueBookId, borrowerName, borrowerEmail }` |
| POST   | `/api/transactions/return` | Return a book `{ uniqueBookId }`     |
| GET    | `/api/transactions`        | List all transactions                |

### Dashboard

| Method | Endpoint              | Description                          |
| ------ | --------------------- | ------------------------------------ |
| GET    | `/api/dashboard/stats`| Get dashboard statistics             |

### Export

| Method | Endpoint              | Description                          |
| ------ | --------------------- | ------------------------------------ |
| GET    | `/api/export/history` | Download transaction history as CSV  |

### Chatbot

| Method | Endpoint           | Description                          |
| ------ | ------------------ | ------------------------------------ |
| POST   | `/api/chatbot/ask` | Ask the AI assistant `{ question }`  |

### Health Check

| Method | Endpoint       | Description          |
| ------ | -------------- | -------------------- |
| GET    | `/api/health`  | Server health check  |

---

## Architecture

The backend follows the **Controller-Service-Route** architectural pattern:

- **Routes**: Define API endpoints and map them to controllers
- **Controllers**: Handle HTTP request/response validation and status codes
- **Services**: Contain business logic and MongoDB operations
- **Models**: Define data schemas via Mongoose with validation and indexing
- **Middleware**: Centralized error handling and logging

---

## Overdue Calculation

A book is considered **overdue** if it has been issued for more than **14 days** without being returned. The `daysOverdue` is calculated as:

```
daysOverdue = max(0, daysSinceIssue - 14)
```

---

## Author

**Gowtham Raj**  
GitHub: [@RGowthamRaj](https://github.com/RGowthamRaj)

---

## License

This project is for educational and evaluation purposes.
