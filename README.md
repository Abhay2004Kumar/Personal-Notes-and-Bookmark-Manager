# 📒 Notes & 🔖 Bookmarks Manager

A secure, responsive, and modern web app for managing your personal notes and bookmarks. Built using **Next.js App Router**, **MongoDB**, **JWT Authentication**, and styled with **Tailwind CSS + shadcn/ui** for a sleek dark UI experience.

---

## ✨ Features

- 🔐 **Authentication**

  - Sign up and log in using JWT-based auth
  - Protected routes for authenticated users only

- 📒 **Notes Management**

  - Create, edit, delete notes
  - Tag notes and filter/search by tag or content
  - Mark notes as favorites

- 🔖 **Bookmarks Management**

  - Add/edit/delete bookmarks
  - Auto-fetch title if left empty
  - Tag and filter/search bookmarks
  - Mark favorites

- 🌙 **Dark Theme UI**

  - Beautiful responsive design using TailwindCSS and shadcn/ui
  - Mobile-friendly with scroll effects and navigation animations

---

## 🚀 Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/your-username/notes-bookmarks-manager.git
cd notes-bookmarks-manager
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Set up environment variables

Create a `.env.local` file in the root of the project and add the following:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
```

> 💡 You can get a MongoDB URI from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

### 4. Run the development server

```bash
npm run dev
# or
yarn dev
```

Visit `http://localhost:3000` to see the app in action.

---

## 🧱 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **Authentication**: JWT with cookies/localStorage
- **Database**: MongoDB with Mongoose
- **Data Fetching**: REST APIs via App Router route handlers

---

## 📁 Project Structure (Simplified)

```
/app
  /api
    /auth         # Login & Signup
    /notes        # Note CRUD
    /bookmarks    # Bookmark CRUD
  /notes          # Notes page (protected)
  /bookmarks      # Bookmarks page (protected)
  /login, /signup # Auth pages

/components       # UI Components (Cards, Dialogs, Navbar, etc.)
/context          # AuthProvider for JWT context
/lib              # Helpers (db, auth, fetch metadata)
/models           # Mongoose models
/types            # Shared TS types
```

---

## 🙌 Credits

- [Next.js](https://nextjs.org/)
- [shadcn/ui](https://ui.shadcn.dev/)
- [MongoDB](https://www.mongodb.com/)
- [Lucide Icons](https://lucide.dev/)

---

## 📜 License

MIT License. Feel free to use, modify, and share!

