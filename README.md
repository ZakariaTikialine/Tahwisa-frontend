# Tahwisa Frontend

A modern frontend application for the Tahwisa platform, built with Next.js 14 App Router. Enables employees to register for company trips and provides comprehensive admin management tools.

## 🚀 Features

- **Secure Authentication** - JWT-based login & registration system
- **Role-Based Access** - Distinct interfaces for admin and employee users
- **Trip Management** - Employee registration with real-time status tracking
- **Analytics Dashboard** - Comprehensive statistics and insights
- **Admin Tools** - Complete management of sessions, periods, and destinations

## 🛠️ Technologies

- **Next.js 14** - App Router architecture
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client for API communication
- **Lucide React** - Beautiful icon library
- **Railway** - Backend integration

## 📦 Installation

1. **Clone the repository:**
    ```bash
    git clone <repo-url>
    cd frontend
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Configure environment:**
    Create `.env.local` with:
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:5000
    ```

4. **Start development server:**
    ```bash
    npm run dev
    ```

## 📖 Pages

| Route | Description |
|-------|-------------|
| `/login` | User authentication |
| `/register` | Account creation |
| `/registration` | Trip registration |
| `/profile` | User profile management |
| `/admin/dashboard` | Admin overview |
| `/admin/sessions` | Session management |
| `/admin/periodes` | Period management |
| `/admin/destinations` | Destination management |

## 📁 Project Structure

```
├── app/                 # Next.js pages & layout
│   ├── (auth)/         # Authentication routes
│   ├── admin/          # Admin panel pages
│   ├── globals.css     # Global styles
│   └── layout.tsx      # Root layout
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── dashboard/      # Dashboard widgets
│   ├── forms/          # Form components
│   └── ui/             # Base UI components
├── lib/                # API utilities & token management
│   ├── api.js          # Axios configuration
│   └── auth.js         # Authentication helpers
├── public/             # Static assets
└── types/              # TypeScript definitions
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🚀 Deployment

Deploy to Vercel and configure the environment variable:
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
```

## 📄 License

This project is licensed under the MIT License.