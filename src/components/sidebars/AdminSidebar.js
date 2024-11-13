import { Link } from "react-router-dom";

function AdminSidebar(props) {

  return (
    <div className="accordion" id="accordionExample">
      <li className="pc-item pc-hasmenu active">
        <Link to="/dashboard" className="pc-link ">
          <div className="d-flex align-items-center">
            <i className="las la-tachometer-alt"></i>
            <span className="ms-3">Dashboard</span>
          </div>
        </Link>
      </li>
      <li className="pc-item pc-hasmenu active">
        <Link to="/employees" className="pc-link ">
          <div className="d-flex align-items-center">
            <i className="las la-users"></i>
            <span className="ms-3">Manage Employees</span>
          </div>
        </Link>
      </li>
      <li className="pc-item pc-hasmenu active">
        <Link to="/document" className="pc-link ">
          <div className="d-flex align-items-center">
            <i className="las la-file"></i>
            <span className="ms-3">Documents</span>
          </div>
        </Link>
      </li>
      <li className="pc-item pc-hasmenu active">
        <Link to="/project" className="pc-link ">
          <div className="d-flex align-items-center">
            <i className="las la-briefcase"></i>
            <span className="ms-3">Project Info</span>
          </div>
        </Link>
      </li>
      <li className="pc-item pc-hasmenu active">
        <Link to="/attendance" className="pc-link ">
          <div className="d-flex align-items-center">
            <i className="las la-user-check"></i>
            <span className="ms-3">Attendance</span>
          </div>
        </Link>
      </li>
      <li className="pc-item pc-hasmenu active">
        <Link to="/leaves" className="pc-link ">
          <div className="d-flex align-items-center">
            <i className="las la-door-open"></i>
            <span className="ms-3">Leaves</span>
          </div>
        </Link>
      </li>
      <li className="pc-item pc-hasmenu">
        <a className="pc-link ">
          <div className="d-flex align-items-center">
            <i className="las la-building"></i>
            <span
              className="ms-3"
              data-bs-toggle="collapse"
              href="#company"
              role="button"
              aria-expanded="false"
              aria-controls="collapseExample"
            >
              Company
            </span>
          </div>
        </a>
        <ul
          className="pc-submenu accordion-collapse  collapse"
          id="company"
          aria-labelledby="headingOne"
          data-bs-parent="#accordionExample"
        >
          <li className="pc-item">
            <Link
              to="/department"
              className="pc-link"
            >
              Department
            </Link>
          </li>
          <li className="pc-item">
            <Link to="/designation" className="pc-link">
              Designation
            </Link>
          </li>
        </ul>
      </li>
      <li className="pc-item pc-hasmenu">
        <a className="pc-link ">
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
        <ul
          className="pc-submenu accordion-collapse  collapse"
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
      </li>
    </div>
  );
}

export default AdminSidebar;
