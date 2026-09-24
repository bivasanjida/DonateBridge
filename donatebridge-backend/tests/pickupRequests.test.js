import test from "node:test";
import assert from "node:assert/strict";

import PickupRequest from "../models/pickupRequest.js";

test("PickupRequest schema includes fields needed for NGO pickup workflow", () => {
  const fields = Object.keys(PickupRequest.schema.paths);

  assert.ok(fields.includes("item"));
  assert.ok(fields.includes("ngo"));
  assert.ok(fields.includes("status"));
  assert.ok(fields.includes("message"));
  assert.ok(fields.includes("scheduledDate"));
  assert.ok(fields.includes("scheduledTime"));
  assert.ok(fields.includes("collectionAddress"));
  assert.ok(fields.includes("adminNotes"));
});
