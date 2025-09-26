# Fauxstagram Backend

## Tech Stack
- Node.js
- Express
- Prisma ORM (PostgreSQL)
- JWT authentication
- Multer (image uploads)
- Cloudinary (image hosting)

## Environment Variables
Create a `.env` file in `backend/`:
```
DATABASE_URL=your_postgres_url
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

## Scripts
- `npm run dev` — Start dev server (nodemon)
- `npm start` — Start server
- `npx prisma migrate dev` — Run migrations
- `npx prisma studio` — View/manage DB

## API Endpoints
- `/auth` — Register/login
- `/users` — Profile, follow/unfollow
- `/posts` — CRUD posts, comments, likes
- `/messages` — Direct messaging

## Deployment
- Deploy to Render, Heroku, etc.
- Set all required environment variables

---
See [main README](../README.md) for full project info.
