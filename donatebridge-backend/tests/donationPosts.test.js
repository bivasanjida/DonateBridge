import test from "node:test";
import assert from "node:assert/strict";

import DonationPost from "../models/donationPost.js";

test("DonationPost schema includes fields needed for NGO dashboard", () => {
  const fields = Object.keys(DonationPost.schema.paths);

  assert.ok(fields.includes("title"));
  assert.ok(fields.includes("category"));
  assert.ok(fields.includes("description"));
  assert.ok(fields.includes("donor"));
  assert.ok(fields.includes("status"));
  assert.ok(fields.includes("imageUrl"));
});
