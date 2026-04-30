import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Nav } from "react-bootstrap";
import "./InstructorLayout.css"
import { BarChart, Book, PlusSquare, User, PanelRightOpen, PanelLeftOpen } from "lucide-react";

export default function InstructorLayout() {

  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(prev => !prev);
  };

  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    { label: "Dashboard", path: "/instructor/dashboard", icon: <BarChart size={18} /> },
    { label: "Manage Courses", path: "/instructor/courses", icon: <Book size={18} /> },
    { label: "Create Course", path: "/instructor/create-course", icon: <PlusSquare size={18} /> },
    { label: "Profile", path: "/profile", icon: <User size={18} /> },
  ];

  return (
  <div className={`instructor-layout ${collapsed ? "collapsed" : ""}`}>

    {/* SIDEBAR */}
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>

      <div className="sidebar-header">
        {!collapsed && <h5 className="mb-4 fw-bold">Instructor</h5>}

        <div className="toggle-btn" onClick={toggleSidebar}>
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
            onClick={() => navigate(item.path)}
          >
            {item.icon}
            {!collapsed && <span>{item.label}</span>}
          </div>
        ))}
      </Nav>
    </div>

    {/* CONTENT */}
    <div className={`content ${collapsed ? "collapsed" : ""}`}>
      <Outlet />
    </div>

  </div>
);
}