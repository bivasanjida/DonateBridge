# DonateBridge Admin API

This document describes the admin-only API endpoints used by the DonateBridge management dashboard.

## Admin routes

| Method | Path | Description |
| --- | --- | --- |
| GET | /api/admin/stats | Returns dashboard totals for items, requests, and users. |
| GET | /api/admin/history | Returns all collected donation records with donor and NGO details. |
| GET | /api/admin/users | Returns all registered users without including passwords. |
| GET | /api/admin/pickup-requests/all | Returns every pickup request across the platform. |
| PATCH | /api/admin/pickup-requests/:id/approve | Approves a pending request. |
| PATCH | /api/admin/pickup-requests/:id/reject | Rejects a request and reopens the item to other NGOs. |
| PATCH | /api/admin/pickup-requests/:id/schedule | Schedules the pickup date, time, and address. |
| PATCH | /api/admin/pickup-requests/:id/collect | Marks the pickup as collected. |

All admin routes use the shared `authenticate` and `authorize("Admin")` middleware from the backend.

## Pickup workflow

The donation movement across the platform is:

Listed -> Requested -> Approved -> Scheduled -> Collected

### Status changes

- Listed: item is available for NGOs to request.
- Requested: NGO has submitted a pickup request. The request begins in `Pending` status.
- Pending: admin reviews the request.
- Approved: admin approves the request and the pickup is ready for scheduling.
- Scheduled: admin sets the date, time, and collection address.
- Collected: admin confirms the donation was collected.
- Rejected: admin rejects the request and the item is reset to `Listed`.

## Dashboard stats explained

The admin dashboard calculates the following metrics:

- Total Items: total number of donation posts in the database.
- Listed Items: posts currently available for requests.
- Pending Requests: pickup requests waiting for admin review.
- Scheduled Pickups: requests already assigned a pickup date and time.
- Completed Donations: requests with `Collected` status.
- Total Users: all registered users in the system.

## Notes

The admin panel consumes these endpoints through the frontend API client and is built around existing MongoDB models for `User`, `DonationPost`, and `PickupRequest`.
