import React, { useState, useEffect } from "react";
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarFooter,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
  CDBSidebarSubMenu,
} from 'cdbreact';
import { NavLink } from 'react-router-dom';
import { useLogoutUserMutation } from "../services/appApi";
import { useSelector } from "react-redux";
import { Modal, Button } from "react-bootstrap";


const Sidebar = () => {
  const user = useSelector((state) => state.user);
  const [minimizePicture, setMinimizePicture] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [logoutUser] = useLogoutUserMutation();
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [activeMenuItem, setActiveMenuItem] = useState(""); // State to track the currently clicked menu item

  // Function to handle browser resize
  const handleResize = () => {
    if (window.innerWidth <= 600) {
      setMinimizePicture(true);
    } else {
      setMinimizePicture(false);
    }
  };

  useEffect(() => {
    // Add event listener for resize
    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check on component mount

    // Cleanup: remove event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setCurrentDate(now.toLocaleDateString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  async function handleLogout(e) {
    e.preventDefault();
    try {
      // Use the appropriate payload for the logout request
      const payload = {
        _id: user._id, // Replace this with the correct property name for user ID
        newMessages: [], // Replace this with the correct property name for newMessages
      };
  
      await logoutUser(payload);
      // Redirect to the home page or any other page after successful logout
      window.location.replace("/");
    } catch (error) {
      // Handle any errors that occurred during logout
      console.error("Error logging out:", error);
    }
  }

  // Function to handle menu item click and update the state
  const handleMenuItemClick = (menuItem) => {
    setActiveMenuItem(menuItem);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  return (
    <div style={{ display: 'flex', overflow: 'scroll initial' }}>
      <CDBSidebar textColor="#fff" backgroundColor="#133664">
        <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large" onClick={() => setMinimizePicture(!minimizePicture)}></i>}>
          Main Menu
        </CDBSidebarHeader>
        
        {user && (
          <div className={`user-info ${minimizePicture ? 'minimize' : ''}`} style={{ borderBottom: "1px solid", padding: "10px" }}>
            <img
              src={user.picture}
              style={{
                width: minimizePicture ? 30 : 100, // Adjust the minimized width as desired
                height: minimizePicture ? 30 : 100, // Adjust the minimized height as desired
                objectFit: "cover",
                borderRadius: "80%",
                display: "block",
                margin: "0 auto",
              }}
              alt=""
            />
            
            {!minimizePicture && (
              <>
                <h3>{user.firstName} {user.lastName}</h3>
                <span>{user.userType}</span>
                <button className="label-button" onClick={handleShowModal}>
                  <span className="label">Logout</span>
                </button>
              </>
            )}
          </div>
        )}
      {user.userType === "Admin" && ( 
        <>
        <CDBSidebarContent className="sidebar-content">
          <CDBSidebarMenu>
            <NavLink exact to="/UserInformation" activeClassName="activeClicked">
              <CDBSidebarMenuItem
                className={`CDBSidebarMenuItem ${
                  activeMenuItem === "userInformation" ? "active" : ""
                }`}
                icon="user"
                onClick={() => handleMenuItemClick("userInformation")}
              >
                Manage User
              </CDBSidebarMenuItem>
            </NavLink>
            <NavLink exact to="/EventInformation" activeClassName="activeClicked">
              <CDBSidebarMenuItem
                className={`CDBSidebarMenuItem ${
                  activeMenuItem === "eventInformation" ? "active" : ""
                }`}
                icon="book"
                onClick={() => handleMenuItemClick("eventInformation")}
              >
                Manage Provider
              </CDBSidebarMenuItem>
            </NavLink>

          </CDBSidebarMenu>

            <CDBSidebarMenu>
                <CDBSidebarMenuItem icon="users">
                  <NavLink exact to="/Users" activeClassName="activeClicked">
                    Users
                  </NavLink>
                </CDBSidebarMenuItem>
                <CDBSidebarMenuItem icon="tasks">
                  <NavLink exact to="/Tasks" activeClassName="activeClicked">
                    Tasks
                  </NavLink>
                </CDBSidebarMenuItem>
              </CDBSidebarMenu>
        </CDBSidebarContent>
        </>
      )}


{user.userType === "Event Organizer" && ( 
        <>
        <CDBSidebarContent className="sidebar-content">
          <CDBSidebarMenu>
            <NavLink exact to="/dashboard" activeClassName="activeClicked">
              <CDBSidebarMenuItem
                className={`CDBSidebarMenuItem ${
                  activeMenuItem === "dashboard" ? "active" : ""
                }`}
                icon="columns"
                onClick={() => handleMenuItemClick("dashboard")}
              >
                Dashboard
              </CDBSidebarMenuItem>
            </NavLink>
            <NavLink exact to="/UserMonitor" activeClassName="activeClicked">
              <CDBSidebarMenuItem
                className={`CDBSidebarMenuItem ${
                  activeMenuItem === "userInformation" ? "active" : ""
                }`}
                icon="user"
                onClick={() => handleMenuItemClick("userInformation")}
              >
                Manage User
              </CDBSidebarMenuItem>
            </NavLink>
            <NavLink exact to="/EventInformation" activeClassName="activeClicked">
              <CDBSidebarMenuItem
                className={`CDBSidebarMenuItem ${
                  activeMenuItem === "eventInformation" ? "active" : ""
                }`}
                icon="book"
                onClick={() => handleMenuItemClick("eventInformation")}
              >
                Manage Event
              </CDBSidebarMenuItem>
            </NavLink>
          </CDBSidebarMenu>
        </CDBSidebarContent>
        </>
      )}

{user.userType === "Event Monitoring" && ( 
        <>
        <CDBSidebarContent className="sidebar-content">
          <CDBSidebarMenu>
            <NavLink exact to="/dashboard" activeClassName="activeClicked">
              <CDBSidebarMenuItem
                className={`CDBSidebarMenuItem ${
                  activeMenuItem === "dashboard" ? "active" : ""
                }`}
                icon="columns"
                onClick={() => handleMenuItemClick("dashboard")}
              >
                Dashboard
              </CDBSidebarMenuItem>
            </NavLink>
            <NavLink exact to="/EventMonitoring" activeClassName="activeClicked">
              <CDBSidebarMenuItem
                className={`CDBSidebarMenuItem ${
                  activeMenuItem === "eventInformation" ? "active" : ""
                }`}
                icon="book"
                onClick={() => handleMenuItemClick("eventInformation")}
              >
                Manage Event
              </CDBSidebarMenuItem>
            </NavLink>
          </CDBSidebarMenu>
        </CDBSidebarContent>
        </>
      )}

        <CDBSidebarFooter>
          <div style={{ textAlign: "center", padding: "5px" }}>
            <div>{currentTime}</div>
            <div>{currentDate}</div>
          </div>
        </CDBSidebarFooter>
      </CDBSidebar>

      {/* Logout Confirmation Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header className='titleModal'>
          <Modal.Title className="modal-title">Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body">Are you sure you want to logout?</Modal.Body>
        <Modal.Footer className="modal-footer">
          <Button variant="outline-secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleLogout}>
            Logout
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Sidebar;