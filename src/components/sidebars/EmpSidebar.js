import { Link } from "react-router-dom";

function EmployeeSidebar(props) {
  const isDefaultPwd = localStorage.getItem("is_default_pwd");
  const isClickable = isDefaultPwd === "1";

  return (
    <div className="accordion" id="accordionExample">
      <li className="pc-item pc-hasmenu active">
        {isClickable ? (
          <Link to="/dashboard" className="pc-link">
            <div className="d-flex align-items-center">
              <i className="las la-chart-bar"></i>
              <span className="ms-3">Dashboard</span>
            </div>
          </Link>
        ) : (
          <div className="pc-link disabled">
            <div className="d-flex align-items-center">
              <i className="las la-chart-bar"></i>
              <span className="ms-3">Dashboard</span>
            </div>
          </div>
        )}
      </li>
      <li className="pc-item pc-hasmenu active">
        {isClickable ? (
          <Link to="/attendance" className="pc-link">
            <div className="d-flex align-items-center">
              <i className="las la-user-check"></i>
              <span className="ms-3">Attendance</span>
            </div>
          </Link>
        ) : (
          <div className="pc-link disabled">
            <div className="d-flex align-items-center">
              <i className="las la-user-check"></i>
              <span className="ms-3">Attendance</span>
            </div>
          </div>
        )}
      </li>
      <li className="pc-item pc-hasmenu active">
        {isClickable ? (
          <Link to="/leaves" className="pc-link">
            <div className="d-flex align-items-center">
              <i className="las la-door-open"></i>
              <span className="ms-3">Leaves</span>
            </div>
          </Link>
        ) : (
          <div className="pc-link disabled">
            <div className="d-flex align-items-center">
              <i className="las la-door-open"></i>
              <span className="ms-3">Leaves</span>
            </div>
          </div>
        )}
      </li>
      <li className="pc-item pc-hasmenu active">
        {isClickable ? (
          <Link to="/document" className="pc-link">
            <div className="d-flex align-items-center">
              <i className="las la-file"></i>
              <span className="ms-3">Documents</span>
            </div>
          </Link>
        ) : (
          <div className="pc-link disabled">
            <div className="d-flex align-items-center">
              <i className="las la-file"></i>
              <span className="ms-3">Documents</span>
            </div>
          </div>
        )}
      </li>
      <li className={`pc-item pc-hasmenu ${isClickable ? "" : "disabled"}`}>
        {isClickable ? (
          <a className="pc-link">
            <div className="d-flex align-items-center">
              <i className="las la-user"></i>
              <span
                className="ms-3"
                data-bs-toggle="collapse"
                href="#payroll"
                role="button"
                aria-expanded="false"
                aria-controls="collapseExample"
              >
                Payroll
              </span>
            </div>
          </a>
        ) : (
          <div className="pc-link disabled">
            <div className="d-flex align-items-center">
              <i className="las la-user"></i>
              <span className="ms-3">Payroll</span>
            </div>
          </div>
        )}
        {isClickable && (
          <ul
            className="pc-submenu accordion-collapse collapse"
            id="payroll"
            aria-labelledby="headingOne"
            data-bs-parent="#accordionExample"
          >
            <li className="pc-item">
              <Link to="/pay-slips" className="pc-link">
                Pay Slips
              </Link>
            </li>
            <li className="pc-item">
              <Link to="/p60" className="pc-link">
                P60
              </Link>
            </li>
          </ul>
        )}
      </li>
    </div>
  );
}

export default EmployeeSidebar;
