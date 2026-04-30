import { useAuth } from "../../context/AuthContext";
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import {
  Accordion,
  Button,
  Container,
  Nav,
  Navbar,
  NavDropdown,
  Offcanvas,
} from "react-bootstrap";
import "./AppNavbar.css";
import { showSuccess } from "../../utils/toast";
import ProfileDropdown from "../common/ProfileDropdown";

const DASHBOARD_ROUTE = {
  student: "/student/dashboard",
  instructor: "/instructor/dashboard",
  admin: "/admin/dashboard"
};

const DEFAULT_MENU = [
  { title: "Home", url: "/", roles: ["guest", "student", "instructor", "admin"] },
  {
    title: "Courses",
    url: "/courses",
    roles: ["guest", "student", "instructor", "admin"],
    items: [
      {
        title: "All Courses",
        description: "Browse all published courses.",
        url: "/courses",
        roles: ["guest", "student", "instructor", "admin"],
      },
      {
        title: "My Learning",
        description: "Continue where you left off.",
        url: "/student/my-courses",
        roles: ["student"],
      },
      {
        title: "Instructor Panel",
        description: "Create and manage your courses.",
        url: "/instructor/courses",
        roles: ["instructor"],
      },
    ],
  },
  {
    title: "Resources",
    url: "/about",
    items: [
      {
        title: "About",
        description: "Know our LMS mission and approach.",
        url: "/about",
      }
    ],
  },
];

export default function AppNavbar(
  {
    brand = { title: "LearnSphere", short: "LS", url: "/" },
    menu = DEFAULT_MENU,
    auth = {
      login: { text: "Log in", url: "/login" },
      signup: { text: "Sign up", url: "/register" },
    }
  }) {

  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const navigate = useNavigate();

  const { user, logout, logoutAll, loading, isAuthenticated } = useAuth();

  const handleLogout = async () => {
    await logout();
    showSuccess("Logged out Successfully!")
    navigate("/login");
  };

  const handleLogoutAll = async () => {
    await logoutAll();
    showSuccess("Logged out from all devices!");
    navigate("/login");
  };

  const handleNavClick = () => {
    setShowOffcanvas(false);
  };

  const role = user?.role || "guest";

  const isAllowed = (roles, role) => {
    if (!roles || roles.length === 0) return true; // public by default
    return roles.includes(role);
  };

  const filteredMenu = useMemo(() => {
    return menu
      .filter(item => isAllowed(item.roles, role))
      .map(item => {
        if (!item.items) return item;

        return {
          ...item,
          items: item.items.filter(sub =>
            isAllowed(sub.roles, role)
          ),
        };
      });
  }, [menu, user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const groupedMobileMenu = filteredMenu;

  return (
    <Navbar expand="lg" className="app-navbar py-3 fixed-top">
      <Container>
        <Navbar.Brand as={Link} to={brand.url} className="d-flex align-items-center gap-2">
          <span className="app-navbar-logo d-inline-flex align-items-center justify-content-center">
            {brand.short}
          </span>
          <span className="app-navbar-title">{brand.title}</span>
        </Navbar.Brand>

        {/* <Navbar.Toggle aria-controls="app-navbar-offcanvas" /> */}
        <div className="d-flex align-items-center gap-2 ms-auto">

          {/* Account Button (VISIBLE ON MOBILE) */}
          {isAuthenticated && (
            <div className="d-lg-none">
              <ProfileDropdown user={user} onLogout={handleLogout} onLogoutAll={handleLogoutAll} />
            </div>
          )}

          {/* Hamburger */}
          <Navbar.Toggle
            aria-controls="app-navbar-offcanvas"
            onClick={() => setShowOffcanvas(true)} />

        </div>

        <Navbar.Collapse className="d-none d-lg-flex">
          <Nav className="me-auto ms-4 gap-lg-1">
            {filteredMenu.map((item) => {
              if (item.items?.length) {
                return (
                  <NavDropdown
                    key={item.title}
                    title={item.title}
                    id={`desktop-nav-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                    className="app-nav-dropdown"
                  >
                    {item.items.map((subItem) => (
                      <NavDropdown.Item
                        key={subItem.title}
                        as={Link}
                        to={subItem.url}
                        className="app-dropdown-item"
                      >
                        <div className="fw-semibold">{subItem.title}</div>
                        {subItem.description ? (
                          <div className="app-dropdown-description">{subItem.description}</div>
                        ) : null}
                      </NavDropdown.Item>
                    ))}
                  </NavDropdown>
                );
              }

              return (
                <Nav.Link key={item.title} as={Link} to={item.url} className="app-nav-link">
                  {item.title}
                </Nav.Link>
              );
            })}
          </Nav>

          <div className="d-flex align-items-center gap-2">
            {!isAuthenticated ? (
              <>
                <Button as={Link} to={auth.login.url} variant="outline-dark" size="sm">
                  {auth.login.text}
                </Button>
                <Button as={Link} to={auth.signup.url} variant="dark" size="sm">
                  {auth.signup.text}
                </Button>
              </>
            ) : (
              <ProfileDropdown user={user} onLogout={handleLogout}  onLogoutAll={handleLogoutAll} />
            )}
          </div>

        </Navbar.Collapse>

        <Navbar.Offcanvas
          show={showOffcanvas}
          onHide={() => setShowOffcanvas(false)}
          id="app-navbar-offcanvas"
          placement="end"
          className="d-lg-none">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title className="d-flex align-items-center gap-2">
              <span className="app-navbar-logo d-inline-flex align-items-center justify-content-center">
                {brand.short}
              </span>
              <span className="app-navbar-title">{brand.title}</span>
            </Offcanvas.Title>
          </Offcanvas.Header>

          <Offcanvas.Body className="d-flex flex-column">
            <Accordion flush className="mb-4">
              {groupedMobileMenu.map((item, idx) => {
                if (item.items?.length) {
                  return (
                    <Accordion.Item eventKey={String(idx)} key={item.title}>
                      <Accordion.Header>{item.title}</Accordion.Header>
                      <Accordion.Body className="px-2">
                        <div className="d-flex flex-column gap-2">
                          {item.items.map((subItem) => (
                            <Link key={subItem.title} to={subItem.url} className="app-mobile-link" onClick={handleNavClick}>
                              <span className="fw-semibold">{subItem.title}</span>
                              {subItem.description ? (
                                <small className="d-block text-muted">{subItem.description}</small>
                              ) : null}
                            </Link>
                          ))}
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                  );
                }

                return (
                  <div key={item.title} className="py-2 border-bottom">
                    {/* <Link to={item.url} className="app-mobile-link fw-semibold "> */}
                    <Link to={item.url} className="app-mobile-link fw-semibold" onClick={handleNavClick}>
                      {item.title}
                    </Link>
                  </div>
                );
              })}
            </Accordion>

            <div className="mt-auto d-grid gap-2">
              {!isAuthenticated && (
                <>
                  <Button as={Link} to={auth.login.url} variant="outline-dark">
                    {auth.login.text}
                  </Button>
                  <Button as={Link} to={auth.signup.url} variant="dark">
                    {auth.signup.text}
                  </Button>
                </>
              )}
            </div>

          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
}
