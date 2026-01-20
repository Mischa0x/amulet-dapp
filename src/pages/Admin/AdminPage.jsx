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

  // Email state
  const [activeTab, setActiveTab] = useState("users"); // "users" or "email"
  const [betaEmails, setBetaEmails] = useState([]);
  const [loadingBeta, setLoadingBeta] = useState(false);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [emailSending, setEmailSending] = useState(false);
  const [emailResult, setEmailResult] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const adminKey = localStorage.getItem("adminKey") || "";

      const response = await fetch(`${API_URL}/api/credits?action=admin-list`, {
        headers: {
          "x-admin-key": adminKey,
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

      const response = await fetch(`${API_URL}/api/credits?action=admin-adjust`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
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

  const fetchBetaEmails = useCallback(async () => {
    setLoadingBeta(true);
    try {
      const adminKey = localStorage.getItem("adminKey") || "";
      const response = await fetch(`${API_URL}/api/credits?action=admin-list-beta`, {
        headers: { "x-admin-key": adminKey },
      });

      if (!response.ok) throw new Error("Failed to fetch beta emails");

      const result = await response.json();
      setBetaEmails(result.emails || []);
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setLoadingBeta(false);
    }
  }, []);

  const handleSendEmail = async (testMode = false) => {
    if (!emailSubject.trim() || !emailBody.trim()) {
      alert("Subject and body are required");
      return;
    }

    setEmailSending(true);
    setEmailResult(null);

    try {
      const adminKey = localStorage.getItem("adminKey") || "";
      const response = await fetch(`${API_URL}/api/credits?action=admin-send-beta`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify({
          subject: emailSubject,
          html: emailBody,
          testMode,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to send emails");
      }

      const result = await response.json();
      setEmailResult(result);

      if (!testMode) {
        alert(`Successfully sent to ${result.sent} recipients!`);
      } else {
        alert(`Test email sent to first beta user!`);
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setEmailSending(false);
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

      {/* Tab Navigation */}
      <div className={styles.tabNav}>
        <button
          className={`${styles.tabButton} ${activeTab === "users" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("users")}
        >
          Users & Credits
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === "email" ? styles.tabActive : ""}`}
          onClick={() => {
            setActiveTab("email");
            if (betaEmails.length === 0) fetchBetaEmails();
          }}
        >
          Email Beta Users
        </button>
      </div>

      {activeTab === "email" && (
        <div className={styles.emailSection}>
          <div className={styles.emailStats}>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{betaEmails.length}</div>
              <div className={styles.statLabel}>Beta Signups</div>
            </div>
            <button
              onClick={fetchBetaEmails}
              disabled={loadingBeta}
              className={styles.refreshButton}
            >
              {loadingBeta ? "Loading..." : "Refresh List"}
            </button>
          </div>

          <div className={styles.emailComposer}>
            <h3>Compose Email</h3>

            <div className={styles.formGroup}>
              <label>Subject</label>
              <input
                type="text"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="Welcome to Amulet Beta!"
                className={styles.emailInput}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Body (HTML supported)</label>
              <textarea
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                placeholder="<h1>Welcome to Amulet!</h1><p>You've been selected for our closed beta...</p>"
                rows={12}
                className={styles.emailTextarea}
              />
            </div>

            <div className={styles.emailActions}>
              <button
                onClick={() => handleSendEmail(true)}
                disabled={emailSending || !emailSubject || !emailBody}
                className={styles.testButton}
              >
                {emailSending ? "Sending..." : "Send Test"}
              </button>
              <button
                onClick={() => {
                  if (window.confirm(`Send email to ${betaEmails.length} beta users?`)) {
                    handleSendEmail(false);
                  }
                }}
                disabled={emailSending || !emailSubject || !emailBody || betaEmails.length === 0}
                className={styles.sendAllButton}
              >
                {emailSending ? "Sending..." : `Send to All (${betaEmails.length})`}
              </button>
            </div>

            {emailResult && (
              <div className={styles.emailResult}>
                <p>Sent: {emailResult.sent} | Failed: {emailResult.failed || 0}</p>
                {emailResult.errors?.length > 0 && (
                  <details>
                    <summary>View errors</summary>
                    <pre>{JSON.stringify(emailResult.errors, null, 2)}</pre>
                  </details>
                )}
              </div>
            )}
          </div>

          <div className={styles.emailListSection}>
            <h3>Beta Email List ({betaEmails.length})</h3>
            <div className={styles.emailList}>
              {betaEmails.map((e) => (
                <div key={e.id} className={styles.emailItem}>
                  {e.email}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "users" && (
        <>
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
        </>
      )}
    </div>
  );
}
