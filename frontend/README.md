# PharmaDesk Frontend

Frontend for the PharmaDesk pharmacy POS, built with the Next.js App Router and connected to the Laravel API.

## Stack

- Next.js 16.2.12
- React 19.2.4
- React DOM 19.2.4
- Tailwind CSS 4
- Lucide React
- Recharts
- JavaScript and JSX only

The Laravel API client is centralized in `src/lib/api.js`; supplier, purchase,
and inventory calls live in `src/services/pos.service.js`.

## Local setup

Use Node.js 20.9 or newer.

```bash
npm install
cp .env.example .env.local
npm run dev
```

On Windows Command Prompt:

```bat
copy .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

The default `.env.example` is configured for the Laravel API:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
NEXT_PUBLIC_USE_MOCK_AUTH=false
```

Start the backend before signing in. Purchase, supplier, and inventory records
are read from and written to PostgreSQL through the API. Product images are
uploaded with the purchase and served from Laravel's public storage disk.

## Structure

```text
src/
├── app/
│   ├── dashboard/page.jsx
│   ├── login/page.jsx
│   ├── globals.css
│   ├── layout.jsx
│   └── page.jsx
├── components/
│   ├── auth/LoginPage.jsx
│   ├── common/ComingSoonView.jsx
│   ├── dashboard/DashboardView.jsx
│   ├── layout/
│   │   ├── Sidebar.jsx
│   │   └── TopHeaderBar.jsx
│   ├── modals/CalculatorModal.jsx
│   └── ui/
├── data/mockData.js
├── lib/
│   ├── api.js
│   ├── auth-storage.js
│   └── pos-utils.js
└── services/
    ├── auth.service.js
    └── pos.service.js
```

All React components and App Router pages use `.jsx`. Pure JavaScript modules such as API helpers, services, storage, and data use `.js`; there are no TypeScript files.

## Production

For Vercel, set:

```env
NEXT_PUBLIC_API_URL=https://your-render-service.onrender.com/api
NEXT_PUBLIC_USE_MOCK_AUTH=false
```

Your Laravel backend must allow the deployed Vercel origin through CORS. The API client supports JSON requests, Bearer tokens, credentials/cookies, and Laravel validation error responses.
