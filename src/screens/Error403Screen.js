import { useState, useEffect, useRef } from "react";
import { Row, Col } from "react-bootstrap";
import Topbar from "../components/common/Topbar";
import MobileLogo from "../components/common/MobileLogo";
import Sidebar from "../components/common/Sidebar";

function Error403Screen() {
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

      <div class="pc-container" ref={sidebarRef}>
        <div class="pcoded-content">
          <div class="page-header">
            <div class="page-block">
              <div class="row align-items-center">
                <div class="col-md-6">
                  <div class="page-header-title">
                    <h5 class="m-b-10">Forbidden Access</h5>
                  </div>
                </div>
                <div class="col-md-6 text-end">
                  <ul class="breadcrumb">
                    <li class="breadcrumb-item">&nbsp;</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-sm-12">
              <div class="card">
                <div class="card-body">
                  <Row>
                    <Col md={6} xs={12}>
                      <img
                        src="/assets/images/img_404.png"
                        alt="user-image"
                        className="user-avtar"
                      />
                    </Col>

                    <Col md={6} xs={12}>
                      <div className="mt-5 py-5">
                        <h1 className="h3">Awww...Don't Cry</h1>
                        <p>It's just an forbidden error!</p>
                        <p className="my-5">
                          Sorry, you do not have permission to access this page.
                          Please contact the system administrator if you believe
                          this is an error.
                        </p>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Error403Screen;
