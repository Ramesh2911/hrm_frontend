import React, { useEffect, useState } from "react";
import AdminSidebar from "../sidebars/AdminSidebar";
import EmployeeSidebar from "../sidebars/EmpSidebar";
import useAuth from "../../hooks/useAuth";

function Sidebar(props) {
  const { isAuthenticated } = useAuth();
  const { showSidebar } = props;

  const userData = localStorage.getItem("role_name");
  const [roleName, setRoleName] = useState(
    isAuthenticated && userData ? userData : null
  );

  return (
    <>
      <nav
        className={showSidebar ? "pc-sidebar mob-sidebar-active" : "pc-sidebar"}
      >
        <div className="navbar-wrapper">
          <div className="m-header">
            <a href="/" className="b-brand">
              <img
                src="/assets/images/logo.png"
                alt=""
                className="logo logo-lg"
              />
            </a>

          </div>

          <div className="navbar-content">
            <li className="pc-item pc-caption">
              <label>&nbsp;</label>
            </li>
            {roleName === "ADMIN" && <AdminSidebar {...props} />}
            {roleName === "EMPLOYEE" && <EmployeeSidebar {...props} />}
          </div>
        </div>
      </nav>
    </>
  );
}

export default Sidebar;
