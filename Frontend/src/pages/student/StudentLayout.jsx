import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { Nav } from "react-bootstrap";
import {
  Home,
  BookOpen,
  User,
  PanelRightOpen,
  PanelLeftOpen
} from "lucide-react";
import "./StudentLayout.css";

export default function StudentLayout() {
  const [collapsed, setCollapsed] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => {
    setCollapsed(prev => !prev);
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  const menu = [
    { label: "Dashboard", path: "/student/dashboard", icon: <Home size={18} /> },
    { label: "My Courses", path: "/student/my-courses", icon: <BookOpen size={18} /> },
    { label: "Profile", path: "/profile", icon: <User size={18} /> }
  ];

  return (
    <div className={`student-layout ${collapsed ? "collapsed" : ""}`}>

      {/* SIDEBAR */}
      <div className={`student-sidebar ${collapsed ? "collapsed" : ""}`}>

        <div className="sidebar-header">
          {!collapsed && <h5 className="mb-4 fw-bold">Student Panel</h5>}

          <div className="desktop-toggle" onClick={toggleSidebar}>
            {collapsed ? (
              <PanelLeftOpen size={20} />
            ) : (
              <PanelRightOpen size={20} />
            )}
          </div>
        </div>

        <Nav className="flex-column gap-2">
          {menu.map(item => (
            <div
              key={item.path}
              className={`sidebar-item ${
                location.pathname === item.path ? "active" : ""
              }`}
              onClick={() => handleNavigate(item.path)}
            >
              {item.icon}
              {!collapsed && <span>{item.label}</span>}
            </div>
          ))}
        </Nav>
      </div>

      {/* CONTENT */}
      <div className={`student-content ${collapsed ? "collapsed" : ""}`}>
        <Outlet />
      </div>

    </div>
  );
}