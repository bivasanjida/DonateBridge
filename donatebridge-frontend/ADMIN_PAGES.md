# DonateBridge Admin Pages

This document outlines the admin-only pages that are part of the DonateBridge control panel.

## Accessing the admin panel

Use the admin seed account created by the backend:

- Email: admin@donatebridge.local
- Password: Admin123!

Run the backend seed script before logging in:

```bash
cd donatebridge-backend
npm run seed:admin
```

Then log in from the frontend using the admin email and password.

## Admin pages

### Dashboard

The admin dashboard shows summary cards for the current platform state:

- Total items
- Listed items
- Pending requests
- Scheduled pickups
- Completed donations
- Total users

It also includes the five most recent pending requests with a quick Review link.

### Verification

The verification page lets admins manage the end-to-end pickup workflow:

- Approve a pending request
- Reject a request with a reason
- Schedule a pickup with date, time, address, and notes
- Mark a collected donation as complete

This page uses the admin pickup request routes and refreshes after each action.

### Donation History

The history page displays all collected donations with the related donor and NGO information. It includes a search box so the admin can quickly filter records by item name, donor, or NGO.

### Users

The user management page is a read-only list of all system users. It includes filters for role and search by name or email.

## Typical workflow

1. NGO requests a donation item.
2. Admin reviews the request in the verification panel.
3. Admin approves the request or rejects it.
4. If approved, the admin schedules the pickup.
5. Once the pickup is complete, the admin confirms collection.
6. The donation is then shown under the admin history page.

## Screenshots

The admin pages are designed for a simple dashboard layout with summary cards, filter tabs, and data tables. Each page follows the same DonateBridge color palette and table styling used elsewhere in the app.
