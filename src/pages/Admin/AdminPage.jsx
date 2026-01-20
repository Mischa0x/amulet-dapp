// pages/Admin/AdminPage.jsx
import { useState, useEffect, useCallback } from "react";
import { useAccount } from "wagmi";
import styles from "./AdminPage.module.css";

const API_URL = import.meta.env.VITE_API_URL || "";

export default function AdminPage() {
  const { address } = useAccount();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [adjustAmount, setAdjustAmount] = useState("");
  const [adjustReason, setAdjustReason] = useState("");
  const [adjusting, setAdjusting] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const adminKey = localStorage.getItem("adminKey") || "";

      const response = await fetch(`${API_URL}/api/admin/users`, {
        headers: {
          "x-admin-key": adminKey,
          "x-wallet-address": address || "",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized - Admin access required");
        }
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleAdjustCredits = async (e) => {
    e.preventDefault();
    if (!selectedUser || !adjustAmount) return;

    setAdjusting(true);
    try {
      const adminKey = localStorage.getItem("adminKey") || "";

      const response = await fetch(`${API_URL}/api/admin/users?action=adjust-credits`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
          "x-wallet-address": address || "",
        },
        body: JSON.stringify({
          address: selectedUser.address,
          amount: parseInt(adjustAmount),
          reason: adjustReason || "Admin adjustment",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to adjust credits");
      }

      const result = await response.json();
      alert(`Credits adjusted! New balance: ${result.newBalance}`);

      // Refresh data
      await fetchUsers();
      setSelectedUser(null);
      setAdjustAmount("");
      setAdjustReason("");
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setAdjusting(false);
    }
  };

  const filteredUsers = data?.users?.filter((user) =>
    user.address.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const formatDate = (timestamp) => {
    if (!timestamp) return "-";
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const truncateAddress = (addr) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading admin data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Access Denied</h2>
          <p>{error}</p>
          <div className={styles.adminKeyInput}>
            <input
              type="password"
              placeholder="Enter admin key..."
              onChange={(e) => {
                localStorage.setItem("adminKey", e.target.value);
              }}
            />
            <button onClick={fetchUsers}>Retry</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Admin Dashboard</h1>
        <p>User Credits & Rewards Management</p>
      </header>

      {/* Summary Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{data?.totalUsers || 0}</div>
          <div className={styles.statLabel}>Total Users</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{data?.totalCreditsInCirculation?.toLocaleString() || 0}</div>
          <div className={styles.statLabel}>Credits in Circulation</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{data?.totalCreditsUsed?.toLocaleString() || 0}</div>
          <div className={styles.statLabel}>Total Credits Used</div>
        </div>
      </div>

      {/* Search */}
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search by wallet address..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        <button onClick={fetchUsers} className={styles.refreshButton}>
          Refresh
        </button>
      </div>

      {/* Adjust Credits Modal */}
      {selectedUser && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Adjust Credits</h3>
            <p className={styles.modalAddress}>{selectedUser.address}</p>
            <p className={styles.modalBalance}>Current Balance: {selectedUser.balance}</p>

            <form onSubmit={handleAdjustCredits}>
              <div className={styles.formGroup}>
                <label>Amount (positive to add, negative to subtract)</label>
                <input
                  type="number"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(e.target.value)}
                  placeholder="e.g., 100 or -50"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Reason</label>
                <input
                  type="text"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="Reason for adjustment..."
                />
              </div>
              <div className={styles.modalActions}>
                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={adjusting || !adjustAmount}
                  className={styles.submitButton}
                >
                  {adjusting ? "Adjusting..." : "Adjust Credits"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className={styles.tableContainer}>
        <table className={styles.usersTable}>
          <thead>
            <tr>
              <th>Wallet Address</th>
              <th>Balance</th>
              <th>Free Claimed</th>
              <th>Staked</th>
              <th>Purchased</th>
              <th>Total Used</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.address}>
                <td className={styles.addressCell}>
                  <span className={styles.fullAddress}>{user.address}</span>
                  <span className={styles.truncatedAddress}>{truncateAddress(user.address)}</span>
                </td>
                <td className={styles.balanceCell}>{user.balance}</td>
                <td>{formatDate(user.freeClaimedAt)}</td>
                <td>{user.stakedCredits}</td>
                <td>{user.purchasedCredits}</td>
                <td>{user.totalUsed}</td>
                <td>
                  <button
                    className={styles.adjustButton}
                    onClick={() => setSelectedUser(user)}
                  >
                    Adjust
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className={styles.noResults}>
            No users found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
