# DonateBridge — Ishrat's Development Prompt

> **Copy-paste this entire prompt into an AI coding assistant to get your remaining features built.**

---

## Project Context

I'm working on **DonateBridge**, a MERN stack web app that connects donors with NGOs through an item-listing and pickup-request workflow. I'm **Ishrat (Member 3)** and I'm responsible for the **Admin Panel, Workflow & History** features.

**Tech stack**: MongoDB (local), Express.js, React (Vite), Node.js. JWT auth via httpOnly cookies. No TypeScript.

**My branch**: I need to create a new branch called `ishrat`. Run these commands first:
```bash
git checkout main
git pull origin main
git checkout -b ishrat
```

This ensures I'm working from the latest main branch code.

After completing and testing all features, commit and push the work to the `ishrat` branch:
```bash
git add .
git commit -m "Implement admin panel and donation workflow"
git push origin ishrat
```

Do not push directly to `main`.

---

## Current Codebase Structure

```
donatebridge-backend/
├── index.js                          # Express entry point, connects MongoDB, mounts routes
├── package.json                      # Dependencies: express, mongoose, bcryptjs, jsonwebtoken, cookie-parser, cors, dotenv
├── .env.example                      # PORT=4000, MONGODB_URI, JWT_SECRET, etc.
├── controllers/
│   ├── authController.js             # register, login, logout, me, updateProfile
│   └── donationPostController.js     # seedDonationPosts, listDonationPosts, getDonationPostById
├── models/
│   ├── user.js                       # User schema: name, email, password(hashed), phone, role(Donor/NGO/Admin), organizationName
│   └── donationPost.js              # DonationPost schema (Biva is updating this — see coordination section)
├── routes/
│   ├── authRoutes.js                 # POST /register, /login, /logout; GET /me; PATCH /me
│   └── donationPostRoutes.js         # GET /seed, GET /, GET /:id
├── middlewares/
│   ├── auth.js                       # authenticate (reads JWT from cookie) + authorize(...roles)
│   └── logger.js                     # Simple request logger
├── scripts/
│   └── seedAdmin.js                  # npm run seed:admin — creates an Admin user
└── data/
    └── dummyDonationPosts.js         # Seed data for donation posts

donatebridge-frontend/
├── package.json                      # Dependencies: react, react-dom, react-router
├── vite.config.js
├── index.html
└── src/
    ├── main.jsx                      # Routes: /, /browse, /login, /register, /profile, /ngo-dashboard
    ├── App.css                       # All styles (navbar, buttons, forms, browse, dashboard)
    ├── index.css
    ├── api/
    │   └── client.js                 # apiFetch wrapper + auth API functions
    ├── context/
    │   └── AuthContext.jsx           # useReducer-based auth state
    ├── components/
    │   ├── NavBar.jsx                # Guest/auth nav links, profile dropdown
    │   ├── Button.jsx                # Reusable button component
    │   └── ProtectedRoute.jsx        # Auth guard with optional requiredRole prop
    ├── pages/
    │   ├── Home.jsx                  # Landing/redirect page
    │   ├── Landing.jsx               # Hero + feature cards
    │   ├── BrowseItems.jsx           # Browse donated items
    │   ├── Login.jsx                 # Login form
    │   ├── Register.jsx              # Registration form
    │   ├── Profile.jsx               # Edit profile page
    │   └── NgoDashboard.jsx          # NGO donation posts table (Arin's work)
    └── data/
        └── items.js                  # Dummy items (will be removed by Biva)
```

---

## Important: Coordination with Teammates

**Biva (Member 1)** is building:
- Updated DonationPost model with `donor` (ObjectId ref to User) instead of `donorName`/`donorEmail`
- Status enum: `["Listed", "Requested", "Scheduled", "Collected"]` with default `"Listed"`
- `imageUrl` field on DonationPost

**Arin (Member 2)** is building:
- PickupRequest model at `donatebridge-backend/models/pickupRequest.js` with fields:
  - `item` (ObjectId ref DonationPost)
  - `ngo` (ObjectId ref User)
  - `status` enum: `["Pending", "Approved", "Rejected", "Scheduled", "Collected"]`
  - `message` (String, optional — NGO's note)
  - `scheduledDate` (Date, optional)
  - `scheduledTime` (String, optional)
  - `collectionAddress` (String, optional)
  - `adminNotes` (String, optional)
- Pickup request API routes at `/api/pickup-requests`
- `GET /api/pickup-requests/all` — Admin-only route that returns all requests (you'll use this!)

**Your admin panel will consume Arin's PickupRequest model and API.** If Arin's model isn't merged yet when you start, create the model yourself with the same fields listed above — it will merge cleanly later since you'll have the same structure.

---

## Existing Code Patterns (FOLLOW THESE)

### Backend Controller Pattern
```javascript
export const someAction = async (req, res) => {
  try {
    // ... logic
    return res.status(200).json({ data });
  } catch (error) {
    console.error("Error description:", error);
    return res.status(500).json({ error: "User-friendly message" });
  }
};
```

### Backend Route with Auth + Role Pattern
```javascript
import express from "express";
import { authenticate, authorize } from "../middlewares/auth.js";
const router = express.Router();

// Admin-only route
router.get("/", authenticate, authorize("Admin"), someController);

export default router;
```

### Existing `auth.js` Middleware
```javascript
// authenticate — reads JWT from cookie, sets req.user = { id, role }
// authorize(...roles) — checks if req.user.role is in allowed roles
// Usage: router.get("/", authenticate, authorize("Admin"), controller)
```

### Frontend Page Pattern
```javascript
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";

const MyPage = () => {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData()
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="some-page">
      {error && <p className="form-error">{error}</p>}
      {loading ? <p>Loading...</p> : /* render data */}
    </div>
  );
};
export default MyPage;
```

### Existing Admin User
An admin user can be created using: `npm run seed:admin`
- Email: `admin@donatebridge.local`
- Password: `Admin123!`
- This runs `scripts/seedAdmin.js` which creates a user with role "Admin"

---

## YOUR TASKS (Ishrat — Member 3)

### Task 1: Admin Dashboard Overview Page

**Create `donatebridge-frontend/src/pages/AdminDashboard.jsx`**:
- This is the admin's home page — a dashboard with summary stats
- Display stat cards showing:
  - **Total Items**: count of all donation posts
  - **Listed Items**: items with status "Listed" (available for request)
  - **Pending Requests**: pickup requests with status "Pending" (waiting for admin action)
  - **Scheduled Pickups**: requests with status "Scheduled"
  - **Completed Donations**: items/requests with status "Collected"
  - **Total Users**: count of all registered users
- Below the stats, show a **"Recent Pickup Requests"** section — last 5 pending requests as a mini-table with: item title, NGO name, requested date, and a "Review" link that goes to the verification panel

**Backend** — create `donatebridge-backend/controllers/adminController.js`:
- `getDashboardStats`:
  - Counts items by status from DonationPost model
  - Counts requests by status from PickupRequest model
  - Counts total users from User model
  - Returns all stats in one response
  - Admin only

**Create `donatebridge-backend/routes/adminRoutes.js`**:
```
GET /api/admin/stats — authenticate, authorize("Admin") → getDashboardStats
```

**Mount in `index.js`**: `app.use("/api/admin", adminRouter)`

**Add API function in `client.js`**: `export const fetchAdminStats = () => apiFetch("/admin/stats");`

**Add route in `main.jsx`**: `/admin` wrapped in `<ProtectedRoute requiredRole="Admin">`

**Add CSS to `App.css`** for the dashboard:
```css
/* ---------- Admin dashboard ---------- */
.admin-dashboard {
    padding: 32px 24px 60px;
    max-width: 1280px;
    margin: 0 auto;
}

.admin-dashboard h1 {
    font-size: 32px;
    color: #1f2937;
    margin-bottom: 8px;
}

.admin-subtitle {
    color: #6b7280;
    margin-bottom: 28px;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
    margin-bottom: 40px;
}

.stat-card {
    background: #fff;
    border: 1px solid #e2e2e2;
    border-radius: 12px;
    padding: 20px;
    text-align: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.stat-card .stat-number {
    font-size: 36px;
    font-weight: 700;
    color: #2e7d63;
    display: block;
    margin-bottom: 6px;
}

.stat-card .stat-label {
    font-size: 14px;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}
```

---

### Task 2: Admin Verification Panel — Approve/Reject Requests

**Create `donatebridge-frontend/src/pages/AdminVerification.jsx`**:
- Shows ALL pickup requests (fetched from `/api/pickup-requests/all` — Arin's API)
- Display as a table with columns:
  - Item title (with link to item detail)
  - NGO name + organization name
  - NGO's message (if any)
  - Request date (formatted)
  - Current status (badge)
  - **Actions column** with buttons depending on status:
    - If **Pending**: Show "Approve" (green) and "Reject" (red) buttons
    - If **Approved**: Show "Schedule Pickup" button
    - If **Scheduled**: Show "Mark Collected" button
    - If **Rejected** or **Collected**: No action buttons (just status badge)
- Filter tabs at the top: All | Pending | Approved | Scheduled | Rejected | Collected
- When "Approve" is clicked: Update the request status to "Approved", optionally add admin notes
- When "Reject" is clicked: Show a small input for rejection reason, update status to "Rejected", set the item status back to "Listed"

**Backend** — add to `donatebridge-backend/controllers/adminController.js` (or create a dedicated `pickupRequestAdminController.js`):

- **`approvePickupRequest`**:
  - Admin only
  - Takes request ID from params, optional `adminNotes` from body
  - Updates PickupRequest status from "Pending" → "Approved"

- **`rejectPickupRequest`**:
  - Admin only
  - Updates PickupRequest status to "Rejected"
  - Sets `adminNotes` with the rejection reason
  - Changes the DonationPost status back to "Listed" (so other NGOs can request it)

**Add routes to `adminRoutes.js`**:
```
PATCH /api/admin/pickup-requests/:id/approve — authenticate, authorize("Admin")
PATCH /api/admin/pickup-requests/:id/reject  — authenticate, authorize("Admin")
```

**Add API functions in `client.js`**:
```javascript
export const approvePickupRequest = (id, data) =>
  apiFetch(`/admin/pickup-requests/${id}/approve`, { method: "PATCH", body: data });

export const rejectPickupRequest = (id, data) =>
  apiFetch(`/admin/pickup-requests/${id}/reject`, { method: "PATCH", body: data });
```

**Add route in `main.jsx`**: `/admin/verification` wrapped in `<ProtectedRoute requiredRole="Admin">`

---

### Task 3: Pickup Scheduling

When an admin approves a request, they can then schedule the actual pickup.

**Update `donatebridge-frontend/src/pages/AdminVerification.jsx`** (or create a separate `SchedulePickup.jsx` page):
- When admin clicks "Schedule Pickup" on an approved request, show a form/modal with:
  - Pickup date (date input)
  - Pickup time slot (text input, e.g., "10:00 AM - 12:00 PM")
  - Collection address (text input — pre-fill with item's pickupLocation)
  - Admin notes (optional textarea)
- On submit, update the request

**Backend** — add to admin controller:
- **`schedulePickup`**:
  - Admin only
  - Takes `scheduledDate`, `scheduledTime`, `collectionAddress`, `adminNotes` from body
  - Updates PickupRequest: status → "Scheduled", sets the schedule fields
  - Updates DonationPost: status → "Scheduled"

**Add route**:
```
PATCH /api/admin/pickup-requests/:id/schedule — authenticate, authorize("Admin")
```

**Add API function**:
```javascript
export const schedulePickup = (id, data) =>
  apiFetch(`/admin/pickup-requests/${id}/schedule`, { method: "PATCH", body: data });
```

---

### Task 4: Collection Confirmation

**Backend** — add to admin controller:
- **`confirmCollection`**:
  - Admin only
  - Updates PickupRequest: status → "Collected"
  - Updates DonationPost: status → "Collected"

**Add route**:
```
PATCH /api/admin/pickup-requests/:id/collect — authenticate, authorize("Admin")
```

**Frontend** — In AdminVerification page, the "Mark Collected" button on scheduled requests should call this endpoint. On success, refresh the list.

**Add API function**:
```javascript
export const confirmCollection = (id) =>
  apiFetch(`/admin/pickup-requests/${id}/collect`, { method: "PATCH" });
```

---

### Task 5: Donation History Page

**Create `donatebridge-frontend/src/pages/DonationHistory.jsx`**:
- Shows ALL collected donations (pickup requests with status "Collected")
- Display as a table with:
  - Item title and category
  - Donor name
  - NGO name and organization
  - Pickup date (scheduled date)
  - Collection address
  - Collected date (updatedAt of the request)
- Add a search bar to filter by item title or donor/NGO name
- Show total count at the top: "X donations completed"

**Backend** — add to admin controller:
- **`getDonationHistory`**:
  - Admin only
  - Fetches all PickupRequests with status "Collected"
  - Populates `item` (title, category, pickupLocation, imageUrl) and `ngo` (name, organizationName, email)
  - Also populate the item's `donor` field (name, email)
  - Sort by `updatedAt` descending (most recent collections first)

**Add route**: `GET /api/admin/history — authenticate, authorize("Admin")`

**Add API function**: `export const fetchDonationHistory = () => apiFetch("/admin/history");`

**Add route in `main.jsx`**: `/admin/history` wrapped in `<ProtectedRoute requiredRole="Admin">`

**Add CSS for the history page**: Reuse the `.dashboard-table-wrap` and `.dashboard-table` classes from the NGO dashboard (already in App.css).

---

### Task 6: Admin User Management Page

**Create `donatebridge-frontend/src/pages/AdminUsers.jsx`**:
- Shows all registered users in a table
- Columns: Name, Email, Phone, Role (badge), Organization (for NGOs), Registered Date
- Role badge colors:
  - Donor → green
  - NGO → blue
  - Admin → purple
- Filter by role (dropdown: All, Donor, NGO, Admin)
- Search by name or email
- **No delete/edit functionality** (keep it simple — just a view-only list for now)

**Backend** — add to admin controller:
- **`getAllUsers`**:
  - Admin only
  - Fetches all users (excluding password)
  - Sort by `createdAt` descending

**Add route**: `GET /api/admin/users — authenticate, authorize("Admin")`

**Add API function**: `export const fetchAllUsers = () => apiFetch("/admin/users");`

**Add route in `main.jsx`**: `/admin/users` wrapped in `<ProtectedRoute requiredRole="Admin">`

---

### Task 7: Admin Navigation

**Update `donatebridge-frontend/src/components/NavBar.jsx`**:
- Add Admin-specific nav links (similar to how NGO Dashboard is added for NGO users):
  ```javascript
  const adminPages = [
    { link: "/admin", text: "Dashboard" },
    { link: "/admin/verification", text: "Verification" },
    { link: "/admin/history", text: "History" },
    { link: "/admin/users", text: "Users" },
  ];
  ```
- In the `authPages` array, conditionally add admin pages when `user.role === "Admin"`
- Admin should NOT see Donor-specific links (like "My Items") or NGO-specific links (like "NGO Dashboard")

---

### Task 8: Add Documentation

After completing all features, add documentation:

1. **Add inline comments** to every new file you create. At the top of each file, add a comment block:
   ```javascript
   /**
    * [File Name] - [Brief description]
    * Part of DonateBridge - Community Item Donation & Pickup Platform
    * 
    * [What this file does in 2-3 sentences]
    */
   ```

2. **Create `donatebridge-backend/ADMIN_API.md`** documenting:
   - All admin API endpoints with method, path, and description
   - The complete pickup workflow: Listed → Requested → Approved → Scheduled → Collected
   - How each admin action changes the status
   - Dashboard stats explained

3. **Create a `donatebridge-frontend/ADMIN_PAGES.md`** documenting:
   - All admin pages and what they do
   - How to log in as admin (email/password from seed script)
   - Screenshots or descriptions of each page

4. **Add JSDoc comments** above each controller function:
   ```javascript
   /**
    * Get dashboard statistics for the admin overview page.
    * 
    * @route GET /api/admin/stats
    * @access Admin only
    * @returns {Object} counts - Item counts by status, request counts, user count
    */
   ```

---

## IMPORTANT RULES

1. **Keep it simple**. We are 2nd year 2nd semester students. No complex design patterns, no Redux, no custom hooks library. Just useState, useEffect, useContext, and simple components.
2. **Follow existing code style**. Look at how authController.js, Login.jsx, NgoDashboard.jsx are written. Match that style exactly.
3. **Use ES modules** (`import`/`export`), not CommonJS. The project has `"type": "module"`.
4. **MongoDB is local**. Connection string is `mongodb://localhost:27017/donatebridge`.
5. **Add all new CSS to the bottom of `App.css`**. Use the existing naming convention.
6. **Test each feature** by running `npm run dev` in both backend and frontend directories.
7. **Don't install new npm packages** unless absolutely necessary.
8. **Don't modify Biva's auth files or Arin's NGO dashboard/pickup request files** — those are their responsibility.
9. **Use the existing `authenticate` and `authorize` middlewares** from `middlewares/auth.js` — don't create new ones.
10. **Create your branch first**: `git checkout -b ishrat` from main before making any changes.

---

## Summary of Files to Create/Modify

### New Files:
- `donatebridge-backend/controllers/adminController.js`
- `donatebridge-backend/routes/adminRoutes.js`
- `donatebridge-frontend/src/pages/AdminDashboard.jsx`
- `donatebridge-frontend/src/pages/AdminVerification.jsx`
- `donatebridge-frontend/src/pages/DonationHistory.jsx`
- `donatebridge-frontend/src/pages/AdminUsers.jsx`
- `donatebridge-backend/ADMIN_API.md`
- `donatebridge-frontend/ADMIN_PAGES.md`

### Modified Files:
- `donatebridge-backend/index.js` (mount admin routes)
- `donatebridge-frontend/src/api/client.js` (add admin API functions)
- `donatebridge-frontend/src/main.jsx` (add admin routes)
- `donatebridge-frontend/src/components/NavBar.jsx` (add Admin nav links)
- `donatebridge-frontend/src/App.css` (add admin page styles)

### Models You'll Import (built by teammates):
- `donatebridge-backend/models/donationPost.js` (Biva's updated version with `donor` ref)
- `donatebridge-backend/models/pickupRequest.js` (Arin's model)
- `donatebridge-backend/models/user.js` (existing)

> **If Arin's PickupRequest model doesn't exist yet when you start coding**, create it yourself with the exact field definitions listed in the "Coordination with Teammates" section above. When Arin's branch is merged, the model will match.
