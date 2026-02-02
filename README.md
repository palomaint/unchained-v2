# UNCHAINED Training App

Training app for Pedal & Pause UNCHAINED cycling event.

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Environment variables
Create a `.env.local` file:
```
NEXT_PUBLIC_SUPABASE_URL=https://ovpzeekjzqgrtcpztlht.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92cHplZWtqenFncnRjcHp0bGh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwNDI5MzUsImV4cCI6MjA4NTYxODkzNX0.qebP1by-UjVEjXEs8DnuPlYMUHTk6eDvMXbLZFwFtE4
```

### 3. Run locally
```bash
npm run dev
```

## Deploy to Vercel

1. Push to GitHub
2. Import in Vercel
3. Add environment variables in Vercel settings
4. Deploy

## Adding Guests

1. Go to Supabase → Table Editor → guests
2. Click "Insert row"
3. Add the guest's email
4. Save

The guest can now access the app with that email.
