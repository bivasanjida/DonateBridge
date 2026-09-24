# DonateBridge Backend

## Setup

```bash
npm install
# create .env with PORT, MONGODB_URI, JWT_SECRET, and CORS_ORIGIN
npm run dev
```

The default API base is `http://localhost:4000/api` and MongoDB is local at `mongodb://localhost:27017/donatebridge`.

## API

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| POST | `/auth/register` | Public | Register a Donor or NGO |
| POST | `/auth/login` | Public | Start an authenticated session |
| POST | `/auth/logout` | Public | Clear the session cookie |
| GET | `/auth/me` | Authenticated | Get the current user |
| PATCH | `/auth/me` | Authenticated | Update the current profile |
| GET | `/donation-posts` | Public | Browse listed donation posts |
| GET | `/donation-posts/:id` | Public | Get one donation post |
| POST | `/donation-posts` | Donor | Create a listing |
| GET | `/donation-posts/mine` | Donor | Get the donor's listings |
| PATCH | `/donation-posts/:id` | Donor | Update an owned listed item |
| DELETE | `/donation-posts/:id` | Donor | Delete an owned listed item |

## Models

`User` stores account, role, contact, and organization data. `DonationPost` stores donor-linked item listings and their pickup status.