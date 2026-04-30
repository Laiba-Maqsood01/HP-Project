import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./AppFooter.css";

const DEFAULT_SECTIONS = [
  {
    title: "Product",
    links: [
      { name: "Courses", href: "/courses", internal: true },
      { name: "Pricing", href: "/pricing", internal: true },
      { name: "Student Dashboard", href: "/student/dashboard", internal: true },
      { name: "Instructor Tools", href: "/instructor/manage-courses", internal: true },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About", href: "/about", internal: true },
      { name: "Team", href: "/team", internal: true },
      { name: "Blog", href: "/blog", internal: true },
      { name: "Careers", href: "/careers", internal: true },
    ],
  },
  {
    title: "Resources",
    links: [
      { name: "Help Center", href: "/help", internal: true },
      { name: "Contact", href: "/contact", internal: true },
      { name: "Request Instructor", href: "/request-instructor", internal: true },
      { name: "Privacy", href: "/privacy-policy", internal: true },
    ],
  },
];

const DEFAULT_SOCIAL_LINKS = [
  { label: "Instagram", href: "#", short: "IG" },
  { label: "Facebook", href: "#", short: "FB" },
  { label: "Twitter", href: "#", short: "X" },
  { label: "LinkedIn", href: "#", short: "IN" },
];

const DEFAULT_LEGAL_LINKS = [
  { name: "Terms and Conditions", href: "/terms", internal: true },
  { name: "Privacy Policy", href: "/privacy-policy", internal: true },
];

function FooterLink({ href, internal, children }) {
  if (internal) {
    return (
      <Link to={href} className="app-footer-link">
        {children}
      </Link>
    );
  }

  return (
    <a href={href} className="app-footer-link">
      {children}
    </a>
  );
}

export default function AppFooter({
  brand = {
    title: "LearnSphere",
    short: "LS",
    href: "/",
  },
  sections = DEFAULT_SECTIONS,
  description = "LearnSphere helps students, instructors, and admins collaborate in one modern learning platform.",
  socialLinks = DEFAULT_SOCIAL_LINKS,
  copyright = `© ${new Date().getFullYear()} LearnSphere. All rights reserved.`,
  legalLinks = DEFAULT_LEGAL_LINKS,
}) {
  return (
    <footer className="app-footer">
      <Container>
        <Row className="g-4 align-items-start">
          <Col lg={4}>
            <Link to={brand.href} className="app-footer-brand">
              <span className="app-footer-logo">{brand.short}</span>
              <span className="app-footer-title">{brand.title}</span>
            </Link>
            <p className="app-footer-description mb-4">{description}</p>
            <ul className="app-footer-social list-unstyled d-flex align-items-center gap-2 mb-0">
              {socialLinks.map((item) => (
                <li key={item.label}>
                  <a href={item.href} aria-label={item.label} className="app-footer-social-link">
                    {item.short}
                  </a>
                </li>
              ))}
            </ul>
          </Col>

          <Col lg={8}>
            <Row className="g-4">
              {sections.map((section) => (
                <Col md={4} sm={6} key={section.title}>
                  <h3 className="app-footer-heading">{section.title}</h3>
                  <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
                    {section.links.map((link) => (
                      <li key={link.name}>
                        <FooterLink href={link.href} internal={link.internal}>
                          {link.name}
                        </FooterLink>
                      </li>
                    ))}
                  </ul>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>

        <div className="app-footer-bottom d-flex flex-column flex-md-row justify-content-between gap-3 align-items-start align-items-md-center">
          <p className="mb-0 app-footer-copy">{copyright}</p>
          <ul className="list-unstyled d-flex flex-column flex-sm-row gap-2 gap-sm-3 mb-0">
            {legalLinks.map((link) => (
              <li key={link.name}>
                <FooterLink href={link.href} internal={link.internal}>
                  {link.name}
                </FooterLink>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
