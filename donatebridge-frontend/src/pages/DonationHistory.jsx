/**
 * DonationHistory - Displays successfully completed donation records for admins.
 * Part of DonateBridge - Community Item Donation & Pickup Platform
 *
 * This page provides an audit-style history of all collected donations and lets
 * admins search the completed records by person or item.
 */
import { useEffect, useMemo, useState } from "react";
import { fetchDonationHistory } from "../api/client";

const formatDate = (value) => {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const DonationHistory = () => {
  const [records, setRecords] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await fetchDonationHistory();
        setRecords(data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  const filteredRecords = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return records;

    return records.filter((record) => {
      const itemTitle = record.item?.title || "";
      const donorName = record.item?.donor?.name || "";
      const ngoName = record.ngo?.name || "";
      const donorEmail = record.item?.donor?.email || "";
      const ngoOrg = record.ngo?.organizationName || "";

      return [itemTitle, donorName, donorEmail, ngoName, ngoOrg]
        .join(" ")
        .toLowerCase()
        .includes(search);
    });
  }, [query, records]);

  return (
    <div className="admin-dashboard">
      <h1>Donation History</h1>
      <p className="admin-subtitle">Review all completed donations and collections.</p>

      {error && <p className="form-error">{error}</p>}

      <div className="history-toolbar">
        <input
          type="search"
          placeholder="Search by item, donor, or NGO"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <span className="history-count">{filteredRecords.length} donations completed</span>
      </div>

      {loading ? (
        <p>Loading donation history...</p>
      ) : (
        <div className="dashboard-table-wrap">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Donor</th>
                <th>NGO</th>
                <th>Pickup Date</th>
                <th>Collection Address</th>
                <th>Collected</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan="6" className="empty-table">No collected donations found.</td>
                </tr>
              ) : (
                filteredRecords.map((record) => (
                  <tr key={record._id}>
                    <td>
                      {record.item?.title || "Unknown item"}
                      <div className="table-subtext">{record.item?.category || "—"}</div>
                    </td>
                    <td>
                      {record.item?.donor?.name || "Unknown donor"}
                      <div className="table-subtext">{record.item?.donor?.email || "—"}</div>
                    </td>
                    <td>
                      {record.ngo?.name || "Unknown NGO"}
                      <div className="table-subtext">{record.ngo?.organizationName || "—"}</div>
                    </td>
                    <td>{formatDate(record.scheduledDate)}</td>
                    <td>{record.collectionAddress || record.item?.pickupLocation || "—"}</td>
                    <td>{formatDate(record.updatedAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DonationHistory;
