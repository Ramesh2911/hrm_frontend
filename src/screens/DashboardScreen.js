import React, { useEffect, useRef, useState } from 'react';
import { Link } from "react-router-dom";
import Topbar from "../../src/components/common/Topbar";
import MobileLogo from "../../src/components/common/MobileLogo";
import Sidebar from "../../src/components/common/Sidebar";
import Dashboard from '../components/dashboard/Dashboard';

const DashboardScreen = (props) => {
  const [showTopbar, setShowTopbar] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [changeIcon, setChangeIcon] = useState(false);

  const handleShowTopbar = () => {
    setShowTopbar(!showTopbar);
  };
  const handleShowSidebar = () => {
    setShowSidebar(!showSidebar);
  };
  const handleChangeIcon = () => {
    setChangeIcon(!changeIcon);
  };

  const sidebarRef = useRef();
  useEffect(() => {
    let clickToCloseSidebar = (e) => {
      if (sidebarRef.current.contains(e.target)) {
        setShowSidebar(false);
      }
    };

    document.addEventListener("mousedown", clickToCloseSidebar);
    return () => {
      document.removeEventListener("mousedown", clickToCloseSidebar);
    };
  }, []);

  return (
    <>
      <MobileLogo
        handleShowTopbar={handleShowTopbar}
        changeIcon={changeIcon}
        handleChangeIcon={handleChangeIcon}
        handleShowSidebar={handleShowSidebar}
      />

      <Sidebar
        showSidebar={showSidebar}
        handleShowSidebar={handleShowSidebar}
      />

      <Topbar showTopbar={showTopbar} />

      <div className="pc-container" ref={sidebarRef}>
        <div className="pcoded-content">
          <div className="page-header">
            <div className="page-block">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <div className="page-header-title">
                    <h5 className="m-b-10">Dashboard</h5>
                  </div>
                </div>
                <div className="col-md-6 text-end">
                  <ul className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to={"/dashboard"}>Dashboard</Link>
                    </li>
                    {/* <li className="breadcrumb-item">Document</li> */}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-12">
              <Dashboard {...props} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardScreen;
