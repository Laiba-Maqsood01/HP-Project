import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, LogOut, Power } from "lucide-react";
import ConfirmModal from "./ConfirmModal";

const DASHBOARD_ROUTE = {
  student: "/student/dashboard",
  instructor: "/instructor/dashboard",
  admin: "/admin",
};

export default function ProfileDropdown({ user, onLogout, onLogoutAll }) {

  const [showLogoutAllModal, setShowLogoutAllModal] = useState(false);

  const [open, setOpen] = useState(false);
  const ref = useRef();
  const navigate = useNavigate();

  if (!user) return null;

  // close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="position-relative">

      {/* Avatar Button */}
      <div
        onClick={() => setOpen(!open)}
        className="d-flex align-items-center justify-content-center"
        style={{
          width: "42px",
          height: "42px",
          borderRadius: "50%",
          background: "#111",
          color: "#fff",
          fontWeight: "600",
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        {user?.username?.charAt(0).toUpperCase() || "U"}
      </div>

      {/* FLOATING PANEL */}
      <div
        className="shadow-lg"
        style={{
          position: "absolute",
          right: 0,
          top: "55px",
          width: "280px",
          background: "#fff",
          borderRadius: "16px",
          padding: "12px",
          transform: open ? "scale(1)" : "scale(0.95)",
          opacity: open ? 1 : 0,
          visibility: open ? "visible" : "hidden",
          transition: "0.15s ease",
          zIndex: 9999,
        }}
      >

        {/* USER INFO */}
        <div style={{ padding: "8px 10px" }}>
          <div style={{ fontWeight: 600 }}>{user?.username}</div>
          <div style={{ fontSize: "12px", color: "#666" }}>
            {user?.email}
          </div>
          <div style={{ fontSize: "12px", marginTop: "4px", color: "#888" }}>
            {user?.role.toUpperCase()}
          </div>
        </div>

        <hr style={{ margin: "8px 0" }} />

        {/* MENU ITEMS */}
        <button
          onClick={() => {
            navigate(DASHBOARD_ROUTE[user?.role || "student"]);
            setOpen(false);
          }}
          className="w-100 text-start btn btn-light"
          style={{ borderRadius: "10px" }}
        >
          <LayoutDashboard size={18} /> Dashboard
        </button>


        <hr style={{ margin: "8px 0" }} />

        <button
          onClick={() => {
            onLogout();
            setOpen(false);
          }}
          className="w-100 text-start btn btn-light text-danger"
          style={{ borderRadius: "10px" }}
        >
          <LogOut size={18} /> Logout
        </button>

        <hr style={{ margin: "8px 0" }} />

        <button
          onClick={() => setShowLogoutAllModal(true)}
          className="w-100 text-start btn btn-light text-warning"
          style={{ borderRadius: "10px" }}
        >
          <Power size={18} /> Logout All Devices
        </button>

      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        show={showLogoutAllModal}
        onClose={() => setShowLogoutAllModal(false)}
        onConfirm={() => {
          onLogoutAll();
          setShowLogoutAllModal(false);
          setOpen(false); // close dropdown
        }}
        title="Logout from all devices"
       message="You will be logged out from all devices including this one. Do you want to continue?"
      />
    </div>
  );
}