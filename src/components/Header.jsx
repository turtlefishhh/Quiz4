import React from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Container } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";

function Header() {
  return (
    <header>
      <Navbar expand="lg" className="app-nav" variant="dark">
        <Container>
          <Navbar.Brand
            as={Link}
            to="/"
            className="app-brand"
            style={{ color: "black" }}
          >
            Project Flow
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="app-nav" />
          <Navbar.Collapse id="app-nav">
            <div className="app-nav-inner">
              <Nav className="app-nav-links">
                <Nav.Link
                  as={NavLink}
                  to="/projects"
                  style={{ color: "black" }}
                  end
                >
                  Projects
                </Nav.Link>
                <Nav.Link as={NavLink} to="/reports" style={{ color: "black" }}>
                  Reports
                </Nav.Link>
                <Nav.Link as={NavLink} to="/activity" style={{ color: "black" }}>
                  Activity
                </Nav.Link>
              </Nav>

              <Nav className="app-nav-actions">
                <DropdownButton
                  id="dropdown-manage-button"
                  title="Manage"
                  className="dropdown"
                >
                  <Dropdown.Item as={NavLink} to="/projects">
                    View Projects
                  </Dropdown.Item>
                  <Dropdown.Item as={NavLink} to="/projects/create">
                    Create Project
                  </Dropdown.Item>
                  <Dropdown.Item as={NavLink} to="/tasks/create">
                    Create Task
                  </Dropdown.Item>
                  <Dropdown.Item as={NavLink} to="/users/create">
                    Create User
                  </Dropdown.Item>
                </DropdownButton>
              </Nav>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}

export default Header;
