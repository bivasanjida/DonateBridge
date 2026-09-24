<!--
  PICKUP_REQUESTS.md - documentation for NGO item pickup requests.
  Part of DonateBridge - Community Item Donation & Pickup Platform

  This document describes the pickup request model, API endpoints,
  and the status flow used by the NGO workflow.
-->

# Pickup Requests

## Model fields

The `PickupRequest` model stores the following fields:

- `item`: ObjectId reference to the related donation post
- `ngo`: ObjectId reference to the requesting NGO user
- `status`: one of `Pending`, `Approved`, `Rejected`, `Scheduled`, `Collected`
- `message`: optional note from the NGO
- `scheduledDate`: date set by admin after approval
- `scheduledTime`: time range such as `10:00 AM - 12:00 PM`
- `collectionAddress`: address used for the scheduled collection
- `adminNotes`: admin notes about approval or rejection
- `createdAt`, `updatedAt`: timestamps from MongoDB

A unique compound index prevents one NGO from requesting the same item twice.

## Endpoints

### NGO endpoints

- `POST /api/pickup-requests`
  - Creates a new pickup request for a listed item.
  - Requires NGO auth.
  - Body: `{ itemId, message }`

- `GET /api/pickup-requests/mine`
  - Returns all requests created by the logged-in NGO.
  - Requires NGO auth.

- `DELETE /api/pickup-requests/:id`
  - Cancels a pending pickup request.
  - Requires NGO auth.
  - Only the owner of the request can cancel it.

### Admin endpoints

- `GET /api/pickup-requests/all`
  - Returns all requests in the system.
  - Requires Admin auth.

- `PATCH /api/pickup-requests/:id`
  - Reserved for future admin approval or scheduling updates.
  - Requires Admin auth.

## Workflow

1. An NGO browses the listed items and clicks Request Pickup.
2. The request is created with status `Pending`.
3. The related donation post status changes from `Listed` to `Requested`.
4. Admin reviews the request. The admin may approve or reject it.
5. Once approved, the admin can schedule the collection date, time, and address.
6. The pickup request moves to `Scheduled` when collection is confirmed.
7. After the item has been handed over, the request status becomes `Collected`.

## Status transition logic

- `Listed` -> `Requested`: NGO creates a pickup request.
- `Pending` -> `Approved`: admin accepts the request.
- `Pending` -> `Rejected`: admin rejects the request and does not schedule collection.
- `Approved` -> `Scheduled`: admin sets date, time, and address.
- `Scheduled` -> `Collected`: item is collected successfully.
- `Pending` -> cancelled: NGO may cancel before the admin acts.

A cancelled request resets the corresponding donation post back to `Listed` so another NGO can request it.
