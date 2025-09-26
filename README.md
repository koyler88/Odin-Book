# Fauxstagram (Odin-Book)

A full-stack Instagram clone built with React (Vite) frontend and Node.js/Express/Prisma backend.

## Features
- User authentication (JWT)
- Instagram-style feed, profile, and direct messaging
- Create, edit, delete posts with image upload
- Like, comment, follow/unfollow users
- Real-time chat UI
- Responsive, modern dark theme

## Project Structure
- `frontend/` — React + Vite app
- `backend/` — Node.js/Express API with Prisma ORM

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm

### Setup
1. Clone the repo:
   ```bash
   git clone https://github.com/koyler88/Odin-Book.git
   cd Odin-Book
   ```
2. Install dependencies:
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```
3. Configure environment variables:
   - See `frontend/README.md` and `backend/README.md` for details.
4. Start development servers:
   ```bash
   cd backend && npm run dev
   cd ../frontend && npm run dev
   ```

## Deployment
- Frontend: Netlify, Vercel, etc.
- Backend: Render, Heroku, etc.

## More Info
- [Frontend README](./frontend/README.md)
- [Backend README](./backend/README.md)

---
Built for The Odin Project. Inspired by Instagram.
