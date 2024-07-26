// eslint-disable-next-line
import React, { useState } from "react";
import { Nav, Navbar, Container, NavDropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { FaSignOutAlt } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/ALTRUST-light-1536x326.png";
import { useLogoutUserMutation } from "../services/appApi";
import "./Navigation.css";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../features/userSlice"; // Import clearUser action

function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [logoutUser] = useLogoutUserMutation();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  async function handleLogout(e) {
    e.preventDefault();
    await logoutUser(user);
    dispatch(clearUser()); // Clear the user state
    navigate("/"); // Redirect to home page
  }

  const isRegisterPath = location.pathname.startsWith("/register/");

  if (isRegisterPath) {
    return null;
  }
  return (
    <>
      <Navbar expand="lg" style={{ backgroundColor: "#133664" }}>
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>
              <img src={logo} style={{ width: '100%', height: '60px' }} alt="" />
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              {!isRegisterPath && (
                <>
                  <LinkContainer to="/search">
                    <Nav.Link className="nav-center" style={{ color: "#cfcfcf" }}>Search</Nav.Link>
                  </LinkContainer>
                </>
              )}
              {user && (
                <NavDropdown
                  title={
                    <>
                      <img
                        src={user.picture}
                        style={{
                          width: 30,
                          height: 30,
                          marginRight: 10,
                          objectFit: "cover",
                          borderRadius: "80%",
                        }}
                        alt=""
                      />
                      {user.name}
                    </>
                  }
                  id="basic-nav-dropdown"
                >
                  <NavDropdown.Item onClick={handleLogout}>
                    <div className="item-container">
                      <FaSignOutAlt className="icon LogoutIcon" />
                      <span className="label">Logout</span>
                    </div>
                  </NavDropdown.Item>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default Navigation;
