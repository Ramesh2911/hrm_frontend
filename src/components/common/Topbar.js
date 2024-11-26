import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import {
  API_GET_NOTIFICATION,
  API_UPDATE_NOTIFICATION
}
  from "../../config/Api";
import axios from "axios";
import { Modal } from "react-bootstrap";
import moment from "moment";

function Topbar(props) {
  const empId = localStorage.getItem("emp_id");
  const isDefaultPwd = localStorage.getItem("is_default_pwd");
  const isClickable = isDefaultPwd === "1";
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { showTopbar } = props;
  const [userInfo, setUserInfo] = useState(null);
  const [roleName, setRoleName] = useState(null);
  const [data, setData] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [showData, setShowData] = useState(false);
  const handleToggle = async () => {
    setShowData(!showData);

    if (!showData && data.length > 0) {
      const notificationIds = data.map((notification) => notification.id);

      try {
        await axios.put(`${API_UPDATE_NOTIFICATION}`, { notificationIds });
        const updatedData = data.map((notification) => ({
          ...notification,
          status: 1,
        }));
        setData(updatedData);
      } catch (error) {
        console.error('Error updating notification statuses:', error);
      }
    }

    if (!showData && notificationCount > 0) {
      setNotificationCount(0);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
      return;
    } else {
      const role_name = localStorage.getItem("role_name");
      const username = localStorage.getItem("username");
      const first_name = localStorage.getItem("first_name");
      const last_name = localStorage.getItem("last_name");

      if (role_name === "EMPLOYEE") {
        setUserInfo(`${first_name} ${last_name}`);
      } else {
        setUserInfo(username);
      }
      setRoleName(role_name);
    }
  }, [isAuthenticated, navigate]);


  useEffect(() => {
    if (roleName) {
      fetchNotification();
    }
  }, [roleName]);

  const getFormatedDate = (datetime, format = "DD/MM/YYYY") => {
    const dateTime = moment(datetime);
    if (!dateTime.isValid()) {
      return "Invalid date";
    }
    return dateTime.format(format);
  };

  const fetchNotification = async () => {
    try {
      const queryParams = new URLSearchParams({
        role: roleName,
        ...(roleName === 'EMPLOYEE' && { emp_id: empId })
      }).toString();

      const response = await axios.get(`${API_GET_NOTIFICATION}?${queryParams}`);
      const sortedData = response.data.notifications.sort((a, b) => new Date(b.date) - new Date(a.date));
      setData(sortedData);
      setNotificationCount(response.data.count);
    } catch (e) {
      console.error(e);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loginStatus");
    localStorage.removeItem("token_expired_on");
    localStorage.removeItem("id");
    localStorage.removeItem("username");
    localStorage.removeItem("role_name");
    localStorage.removeItem("role_id");
    localStorage.removeItem("emp_id");
    localStorage.removeItem("first_name");
    localStorage.removeItem("last_name");
    localStorage.removeItem("is_default_pwd");

    setUserInfo(null);
    navigate("/");
  };

  return (
    <header
      className={showTopbar ? "pc-header mob-header-active" : "pc-header"}
    >
      <div className="header-wrapper">
        <div className="me-auto my-auto d-block">
          <h1 className="m-0">HR Management System</h1>
        </div>
        <div className="ms-auto">

          <div style={{ position: 'relative', display: 'inline-block', marginTop: '15px' }}>
            <i className="las la-bell"
              style={{ fontSize: '40px', color: 'black' }}
              onClick={handleToggle}
            >
            </i>
            {notificationCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-5px',
                  right: '-5px',
                  backgroundColor: '#ff4d4d',
                  borderRadius: '50%',
                  color: 'white',
                  padding: '5px 8px',
                  fontSize: '12px',
                }}
              >
                {notificationCount}
              </span>
            )}
          </div>

          <Modal
            show={showData}
            onHide={handleToggle}
            animation={false}
            centered
            backdrop={false}
          >
            <Modal.Header closeButton>
              <Modal.Title className="text-center">
                <Modal.Title>Notifications</Modal.Title>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Modal.Body>
                <ul className="list-unstyled">
                  {data.length > 0 ? (
                    data.map((notification, i) => (
                      <li key={i} className="d-flex justify-content-between">
                        <span>{notification.message}</span>
                        <span className="notification-date text-muted">{getFormatedDate(notification.date)}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-center">No notifications</li>
                  )}
                </ul>
              </Modal.Body>
            </Modal.Body>
          </Modal>

          <ul className="list-unstyled">
            <li className="dropdown pc-h-item">
              <a
                className="pc-head-link dropdown-toggle arrow-none me-0"
                data-bs-toggle="dropdown"
                href="#"
                role="button"
                aria-haspopup="false"
                aria-expanded="false"
              >

                <span>
                  <span className="user-name">
                    {userInfo}
                    <br />
                    <span className="user-desc">
                      Logged in as: {roleName}
                    </span>
                  </span>
                </span>
              </a>
              <div className="dropdown-menu dropdown-menu-end pc-h-dropdown">
                {roleName === "EMPLOYEE" && (
                  isClickable ? (
                    <Link
                      to={`/employee/view/${empId}`}
                      className="dropdown-item"
                    >
                      <i className="las la-user"></i>
                      <span>Profile</span>
                    </Link>
                  ) : (
                    <div className="dropdown-item">
                      <i className="las la-user"></i>
                      <span>Profile</span>
                    </div>
                  )
                )}
                <a href="#" onClick={logout} className="dropdown-item">
                  <i className="las la-sign-out-alt"></i>
                  <span>Logout</span>
                </a>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
