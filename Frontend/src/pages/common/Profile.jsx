import { useEffect, useState } from "react";
import { Form, Button, Spinner, Modal } from "react-bootstrap";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { showError, showSuccess } from "../../utils/toast"
import api from "../../services/api";

import "./Profile.css";

export default function Profile() {

  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [requesting, setRequesting] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showEmailPassword, setShowEmailPassword] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await api.get("/auth/get-me");
      setUser(res.data.data);

    };
    fetchUser();
  }, []);



  if (!user) return <p className="p-4">Loading...</p>;

  // ================= EMAIL =================
  const handleRequestEmailChange = async () => {
    try {
      setRequesting(true);

      await api.post("/auth/request-email-change", {
        newEmail,
        password,
      });

      showSuccess("OTP sent to your new email");

      setUser((prev) => ({
        ...prev,
        pendingEmail: newEmail,
      }));

    } catch (err) {
      showError("Error");
    } finally {
      setRequesting(false);
    }
  };

  const handleConfirmEmail = async () => {
    try {
      const res = await api.post("/auth/confirm-email-change", { otp });

      setUser((prev) => ({
        ...prev,
        email: res.data.data.email,
        pendingEmail: null,
      }));

      showSuccess("Email updated successfully");


      // reset fields 
      setNewEmail("");
      setPassword("");
      setOtp("");

    } catch (err) {
      showError("Error");
    }
  };

  const handleCancelEmail = async () => {
    try {
      await api.post("/auth/cancel-email-change");

      setUser((prev) => ({
        ...prev,
        pendingEmail: null,
      }));

      showSuccess("Email change cancelled");

     

    } catch (err) {
      showError("Error");
    }
  };

  // ================= PASSWORD =================
  const handleChangePassword = async () => {
    try {
      await api.post("/auth/change-password", {
        oldPassword,
        newPassword,
      });

      showSuccess("Password changed. Please login again.");

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      showError( "Error");
    }
  };

  // ================= DELETE =================
  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const confirmDeleteAccount = async () => {
    try {
      setDeleting(true);

      await api.delete("/auth/delete-account");

      showSuccess("Account deleted successfully");

      navigate("/login");

    } catch (err) {
      showError("Error deleting account");

    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleBecomeInstructor = async () => {
    try {
      await api.post("/users/request-instructor"); 

      showSuccess("Instructor request sent");

      setUser((prev) => ({
        ...prev,
        instructorRequest: "pending",
      }));

    } catch (err) {
      showError("Error");
    }
  };

  return (
    <div className="profile-container">

      {/* HEADER */}
      <div className="profile-header">
        <h3>Account Settings</h3>
        <p>Manage your account details and security</p>
      </div>

      {/* ACCOUNT INFO */}
      <div className="section">
        <h5>Profile</h5>

        <div className="profile-info">
          <div>
            <label>Name</label>
            <p>{user.username}</p>
          </div>

          <div>
            <label>Email</label>
            <p>{user.email}</p>
          </div>

          <div>
            <label>Role</label>
            <p>{user.role}</p>
          </div>

          <div>
            <label>Status</label>
            <p>{user.accountStatus}</p>
          </div>

          <div>
            <label>Verified</label>
            <p>{user.verified ? "Yes" : "No"}</p>
          </div>
        </div>
      </div>

      {/* EMAIL */}
      <div className="section">
        <h5>Change Email</h5>

        {!user.pendingEmail ? (
          <>
            <Form.Control
              placeholder="New Email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />

            <div className="password-field mt-2">
              <Form.Control
                type={showEmailPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <span onClick={() => setShowEmailPassword(!showEmailPassword)}>
                {showEmailPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>

            <Button
              className="mt-3"
              onClick={handleRequestEmailChange}
              disabled={requesting || user.pendingEmail}
            >
              {requesting ? "Sending..." : "Request Change"}
            </Button>
          </>
        ) : (
          <>
            <Form.Control
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <div className="d-flex gap-2 mt-3">
              <Button onClick={handleConfirmEmail}>Verify</Button>
              <Button variant="outline-danger" onClick={handleCancelEmail}>
                Cancel
              </Button>
            </div>
          </>
        )
        }
      </div>

      {/* PASSWORD */}
      <div className="section">
        <h5>Password</h5>

        <div className="password-field">
          <Form.Control
            type={showOld ? "text" : "password"}
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <span onClick={() => setShowOld(!showOld)}>
            {showOld ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
        </div>

        <div className="password-field mt-2">
          <Form.Control
            type={showNew ? "text" : "password"}
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <span onClick={() => setShowNew(!showNew)}>
            {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
        </div>

        <Button className="mt-3" onClick={handleChangePassword}>
          Update Password
        </Button>
      </div>

      {/* INSTRUCTOR */}

      {user.role !== "admin" && (
        <div className="section">
          <h5>Instructor Access</h5>

          {user.instructorRequest === "none" && (
            <>
              <p className="text-muted">
                Become an instructor and start creating courses.
              </p>

              <Button variant="dark" onClick={handleBecomeInstructor}>
                Become Instructor
              </Button>
            </>
          )}

          {user.instructorRequest === "pending" && (
            <p className="warning">
              Your request is under review
            </p>
          )}

          {user.instructorRequest === "approved" && (
            <p className="success">
              You are now an instructor
            </p>
          )}

          {user.instructorRequest === "rejected" && (
            <>
              <p className="danger">Request rejected</p>

              <Button variant="outline-dark" onClick={handleBecomeInstructor}>
                Apply Again
              </Button>
            </>
          )}
        </div>
      )}

      {/* DANGER */}
      <div className="section danger-zone">
        <h5>Danger Zone</h5>

        <Button variant="danger" onClick={handleDeleteAccount}>
          Delete Account
        </Button>
      </div>

      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Account</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p className="mb-0">
            This action is <b>permanent</b> and cannot be undone.
            Are you sure you want to delete your account?
          </p>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDeleteModal(false)}
            disabled={deleting}
          >
            Cancel
          </Button>

          <Button
            variant="danger"
            onClick={confirmDeleteAccount}
            disabled={deleting}
          >
            {deleting ? (
              <>
                <Spinner size="sm" className="me-2" />
                Deleting...
              </>
            ) : (
              "Delete Account"
            )}
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
}