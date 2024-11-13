import React, { useEffect, useRef, useState } from "react";


import Topbar from "../../components/common/Topbar";
import MobileLogo from "../../components/common/MobileLogo";
import Sidebar from "../../components/common/Sidebar";
import ChangePassword from "../../components/authentication/ChangePassword";



const ChangePasswordScreen = (props) => {
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
                    <h5 className="m-b-10">Password Change</h5>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-12">
              <ChangePassword {...props} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangePasswordScreen;
