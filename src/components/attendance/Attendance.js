import React, { useEffect, useMemo, useState } from 'react';
import { Button, Col, Form, Row, Modal, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import {
   API_ADD_ATTENDANCE,
   API_FETCH_ATTENDANCE,
   API_FILTER_ATTENDANCE,
   API_LIST_ATTENDANCE,
   API_LIST_DEPARTMENT,
   API_LIST_DESIGNATION,
   API_LIST_EMPLOYEES,
   API_UPDATE_ATTENDANCE
}
   from '../../config/Api';
import jsPDF from "jspdf";
import "jspdf-autotable";

const Attendance = (props) => {

   const monthOptions = Object.values(props.getMonth());
   const roleName = localStorage.getItem("role_name");
   const empId = localStorage.getItem('emp_id');

   const initialValues = {
      attendance_date: "",
      attendance_login_time: "",
      attendance_logout_time: "",
   };

   const initialSearchValues = {
      emp_id: "",
      year: "",
      month: "",
   };

   useEffect(() => {
      if (roleName === 'ADMIN') {
         fetchEmployee();
         fetchDepartment();
         fetchDesignation();
      }
   }, []);

   const [filterValues, setFiltervalues] = useState(initialSearchValues);
   const [filterErrors, setFilterErrors] = useState({});
   const [formValues, setFormValues] = useState(initialValues);
   const [formErrors, setFormErrors] = useState({});
   const [btnEnable, setBtnEnable] = useState(false);
   const [loadingIndicator, setLoadingIndicator] = useState(true);
   const [showAttendance, setShowAttendance] = useState(false);
   const handleAttendanceToggle = () => setShowAttendance(!showAttendance);
   const [show, setShow] = useState(false);
   const [isEditMode, setIsEditMode] = useState(false);
   const [currentId, setCurrentId] = useState(null);
   const [attendanceData, setAttendanceData] = useState([]);
   const [close, setClose] = useState(false);
   const [employeeData, setEmployeeData] = useState([]);
   const [filterData, setFilterData] = useState(null);
   const [selectedEmployee, setSelectedEmployee] = useState(null);
   const [departmentData, setDepartmentData] = useState([]);
   const [designationData, setDesignationData] = useState([]);


   const handleToggle = () => setShow(!show);

   const calculateTotalHours = (loginTime, logoutTime) => {
      if (!loginTime || !logoutTime) {
         return 0.00;
      }

      const login = new Date(`1970-01-01T${loginTime}:00`);
      const logout = new Date(`1970-01-01T${logoutTime}:00`);

      if (logout < login) {
         logout.setDate(logout.getDate() + 1);
      }

      const diffInMilliseconds = logout - login;
      const totalMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
      const hours = Math.floor(totalMinutes / 60);

      const roundedHours = Math.round((hours + (totalMinutes % 60) / 60) * 100) / 100;

      return roundedHours;
   };

   const calculateDays = (loginTime, logoutTime) => {
      if (!loginTime || !logoutTime) {
         return 0;
      }

      const totalHours = calculateTotalHours(loginTime, logoutTime);
      if (totalHours <= 4) {
         return 0.5;
      }
      return 1;
   };

   const generateYearOptions = (startYear) => {
      const currentYear = new Date().getFullYear();
      const years = [];
      for (let i = currentYear; i >= startYear; i--) {
         years.push(i);
      }
      return years;
   };

   const yearOptions = generateYearOptions(2023);

   const fetchAttendance = () => {
      props.callRequest("GET", `${API_LIST_ATTENDANCE}/${empId}`, true, null)
         .then((res) => {
            const sortedData = res.data?.data?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            setAttendanceData(sortedData);
            setLoadingIndicator(false);
         }).catch((e) => {
            console.log(e);
         });
   };

   const fetchEmployee = () => {
      props.callRequest("GET", API_LIST_EMPLOYEES, true, null)
         .then((res) => {
            const sortedData = res.data?.data?.sort((a, b) => parseInt(b.emp_id) - parseInt(a.emp_id));
            setEmployeeData(sortedData);
            setLoadingIndicator(false);
         }).catch((e) => {
            console.log(e);
         });
   };

   const fetchDepartment = () => {
      props.callRequest("GET", API_LIST_DEPARTMENT, true, null)
         .then((res) => {
            const sortedData = res.data?.data?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            setDepartmentData(sortedData);
            setLoadingIndicator(false);
         }).catch((e) => {
            console.log(e);
         });
   };

   const fetchDesignation = () => {
      props.callRequest("GET", API_LIST_DESIGNATION, true, null)
         .then((res) => {
            const sortedData = res.data?.data?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            setDesignationData(sortedData);
            setLoadingIndicator(false);
         }).catch((e) => {
            console.log(e);
         });
   };

   const getDepartmentName = (departmentId) => {
      const department = departmentData.find((dept) => dept.id === Number(departmentId));
      return department ? department.department_name : "Unknown Department";
   };

   const getDesignationName = (designationId) => {
      const designation = designationData.find((dept) => dept.id === Number(designationId));
      return designation ? designation.designation_name : "Unknown Designation";
   };

   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormValues({ ...formValues, [name]: value });
   };

   const handleFilterChange = (e) => {
      const { name, value } = e.target;
      setFiltervalues({ ...filterValues, [name]: value });

      if (name === "emp_id") {
         const employee = employeeData.find(emp => emp.emp_id === value);
         setSelectedEmployee(employee);
      }
   };

   const validateForm = () => {
      const {
         attendance_date,
      } = formValues;
      const errors = {};
      let isValid = true;

      if (attendance_date === "") {
         isValid = false;
         errors.attendance_date = "Date is required";
      }

      setFormErrors(errors);
      return isValid;
   };

   const filterForm = () => {
      const {
         emp_id,
         year,
         month
      } = filterValues;
      const errors = {};
      let isValid = true;

      if (roleName === "ADMIN" && emp_id === "") {
         isValid = false;
         errors.emp_id = "Employee is required";
      }
      if (year === "") {
         isValid = false;
         errors.year = "Year is required";
      }
      if (month === "") {
         isValid = false;
         errors.month = "Month is required";
      }

      setFilterErrors(errors);
      return isValid;
   };

   const handleFilterSubmit = (e) => {
      if (e) {
         e.preventDefault();
         if (!filterForm()) {
            return false;
         }
      }
      setBtnEnable(true);

      let data;

      if (roleName === 'ADMIN') {
         data = {
            emp_id: filterValues.emp_id,
            year: filterValues.year,
            month: filterValues.month,
         };
      } else if (roleName === 'EMPLOYEE') {
         data = {
            emp_id: empId,
            year: filterValues.year,
            month: filterValues.month,
         };
      }

      props
         .callRequest("POST", API_FETCH_ATTENDANCE, true, data)
         .then((res) => {
            toast.success(`${res.data.message}`, {
               position: toast.POSITION.TOP_CENTER,
               autoClose: 2000,
            });
            setFilterData(res.data);
            setBtnEnable(false);
            handleToggle();
         })
         .catch((e) => {
            setBtnEnable(false);
            toast.error(`${e.response.data.message}`, {
               position: toast.POSITION.TOP_CENTER,
               autoClose: 5000,
            });
         });
   };

   const handleSubmit = (e) => {
      e.preventDefault();

      if (!validateForm()) {
         return false;
      }
      setBtnEnable(true);
      const roleName = localStorage.getItem('role_name');
      let data;

      if (roleName === "EMPLOYEE") {
         const emp_id = localStorage.getItem('emp_id');
         const first_name = localStorage.getItem('first_name');
         const last_name = localStorage.getItem('last_name');

         data = {
            emp_id,
            first_name,
            last_name,
            attendance_date: formValues.attendance_date,
            attendance_login_time: formValues.attendance_login_time,
            attendance_logout_time: formValues.attendance_logout_time,
         };
      } else {
         data = {
            id: formValues.id,
            emp_id: formValues.emp_id,
            first_name: formValues.first_name,
            last_name: formValues.last_name,
            attendance_date: formValues.attendance_date,
            attendance_login_time: formValues.attendance_login_time,
            attendance_logout_time: formValues.attendance_logout_time,
         };
      }

      const apiEndpoint = isEditMode ? API_UPDATE_ATTENDANCE : API_ADD_ATTENDANCE;
      const method = isEditMode ? "PUT" : "POST";
      const requestData = isEditMode ? { ...data, id: currentId } : data;

      props
         .callRequest(method, apiEndpoint, true, requestData)
         .then((res) => {
            toast.success(`${res.data.message}`, {
               position: toast.POSITION.TOP_CENTER,
               autoClose: 2000,
            });
            handleAttendanceToggle();
            setFormValues(initialValues);
            setBtnEnable(false);
            setIsEditMode(false);
            //handleFilterSubmit(emp_id, year, month);
            if (!isEditMode) {
               fetchAttendance();
            }
         })
         .catch((e) => {
            setBtnEnable(false);
            toast.error(`${e.response.data.message}`, {
               position: toast.POSITION.TOP_CENTER,
               autoClose: 5000,
            });
         });
   };

   const handleEditClick = (attendance) => {
      setFormValues({
         id: attendance.id,
         emp_id: attendance.emp_id,
         first_name: attendance.first_name,
         last_name: attendance.last_name,
         attendance_date: attendance.attendance_date,
         attendance_login_time: attendance.attendance_login_time,
         attendance_logout_time: attendance.attendance_logout_time
      });
      setCurrentId(attendance.id);
      setIsEditMode(true);
      handleAttendanceToggle();
   };

   const exportToPDF = () => {
      const doc = new jsPDF();

      const logoUrl = '/assets/images/logo.png';
      doc.addImage(logoUrl, 'PNG', 10, 10, 40, 20);

      doc.setFontSize(16);
      doc.text("Employee Attendance Report", 80, 10 + 20);

      const spacing = 10;
      const logoHeight = 20;
      const gapBetweenLogoAndName = 20;

      doc.setFontSize(12);
      if (selectedEmployee) {
         doc.text(`Employee Name: ${`${selectedEmployee.first_name} ${selectedEmployee.last_name}`}`, 10, 30 + logoHeight + gapBetweenLogoAndName);
         doc.text(`DOB: ${props.getFormatedDate(selectedEmployee.dob) || 'N/A'}`, 130, 30 + logoHeight + gapBetweenLogoAndName);
         doc.text(`Joining Date: ${props.getFormatedDate(selectedEmployee.joining_date) || 'N/A'}`, 10, 40 + logoHeight + gapBetweenLogoAndName);
         doc.text(`Department: ${getDepartmentName(selectedEmployee.emp_department) || 'N/A'}`, 130, 40 + logoHeight + gapBetweenLogoAndName);
         doc.text(`Designation: ${getDesignationName(selectedEmployee.emp_position) || 'N/A'}`, 10, 50 + logoHeight + gapBetweenLogoAndName);
         doc.text(`Year: ${filterValues.year}`, 130, 50 + logoHeight + gapBetweenLogoAndName);
         doc.text(`Month: ${monthOptions[filterValues.month - 1]}`, 10, 60 + logoHeight + gapBetweenLogoAndName);
      }

      const tableHeaders = [
         ["SL No", "Employee Name", "Date", "Time In", "Time Out", "Total Hours", "Day Count"]
      ];

      const tableData = filterData?.data?.map((item, index) => [
         index + 1,
         `${item.first_name} ${item.last_name}`,
         props.getFormatedDate(item.attendance_date),
         item.attendance_login_time,
         item.attendance_logout_time,
         calculateTotalHours(item.attendance_login_time, item.attendance_logout_time),
         calculateDays(item.attendance_login_time, item.attendance_logout_time)
      ]);

      const tableStartY = 70 + spacing + logoHeight + gapBetweenLogoAndName;

      doc.autoTable({
         head: tableHeaders,
         body: tableData,
         startY: tableStartY,
         theme: "grid",
      });

      doc.setFontSize(12);
      const totalDaysY = doc.lastAutoTable.finalY + 10;
      const totalDays = filterData?.data?.reduce((total, item) => {
         return total + calculateDays(item.attendance_login_time, item.attendance_logout_time);
      }, 0) || 0;
      doc.text(`Total Days: ${totalDays}`, 10, totalDaysY);

      const pdfURL = doc.output("bloburl");
      window.open(pdfURL, "_blank");
   };

   return (
      <>
         {roleName === "EMPLOYEE" ? (
            <div className="card">
               <div className="card-header">
                  <h5>Attendance</h5>
                  <div className="d-flex justify-content-end">
                     {roleName === "EMPLOYEE" && (
                        <div>
                           {!close ? (
                              <Button
                                 className="link-action"
                                 onClick={() => {
                                    handleToggle();
                                    setFiltervalues({
                                       ...filterValues,
                                       year: "",
                                       month: "",
                                    });
                                 }}
                              >
                                 <i className="las la-filter me-2"></i>Filter
                              </Button>
                           ) : (
                              <Button
                                 className="link-action"
                                 onClick={() => {
                                    setClose(true);
                                    setFiltervalues({
                                       ...filterValues,
                                       year: "",
                                       month: "",
                                    });
                                 }}
                              >
                                 <i className="las la-times me-2"></i>Filter
                              </Button>
                           )}
                           <Button
                              className="link-action ms-3"
                              onClick={() => {
                                 setIsEditMode(false);
                                 setFormValues(initialValues);
                                 handleAttendanceToggle();
                              }}
                           >
                              Add Attendance
                           </Button>
                        </div>
                     )}
                  </div>
               </div>

               <Modal
                  show={show}
                  onHide={handleToggle}
                  animation={false}
                  centered
                  backdrop={false}
               >
                  <Modal.Header closeButton>
                     <Modal.Title className="text-center">Search</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                     <Form>
                        <Row>
                           <Col lg={12}>
                              <Form.Group className="mb-3" controlId="year">
                                 <Form.Label>Year</Form.Label>
                                 <select
                                    className="form-select"
                                    name="year"
                                    value={filterValues.year || ""}
                                    onChange={handleFilterChange}
                                 >
                                    <option value="">Select Year</option>
                                    {yearOptions.map((year, index) => (
                                       <option key={index} value={year}>
                                          {year}
                                       </option>
                                    ))}
                                 </select>
                                 <small className="error">
                                    {!filterValues.year && filterErrors.year}
                                 </small>
                              </Form.Group>
                           </Col>
                           <Col lg={12}>
                              <Form.Group className="mb-3" controlId="month">
                                 <Form.Label>Month</Form.Label>
                                 <select
                                    className="form-select"
                                    name="month"
                                    value={filterValues.month || ""}
                                    onChange={handleFilterChange}
                                 >
                                    <option value="">Select</option>
                                    {monthOptions.map((month, index) => (
                                       <option key={index} value={index + 1}>
                                          {month}
                                       </option>
                                    ))}
                                 </select>
                                 <small className="error">
                                    {!filterValues.month && filterErrors.month}
                                 </small>
                              </Form.Group>
                           </Col>
                        </Row>
                     </Form>
                  </Modal.Body>
                  <Modal.Footer>
                     <Button
                        variant="primary"
                        onClick={handleFilterSubmit}
                     >
                        Apply
                     </Button>
                  </Modal.Footer>
               </Modal>

               <div className="card-body">
                  <ToastContainer />
                  <Modal
                     show={showAttendance}
                     onHide={handleAttendanceToggle}
                     animation={false}
                     centered
                     backdrop={false}
                  >
                     <Modal.Header closeButton>
                        <Modal.Title className="text-center">
                           {isEditMode ? "Edit Attendance" : "Add Attendance"}
                        </Modal.Title>
                     </Modal.Header>
                     <Modal.Body>
                        <Form>
                           <Form.Group className="mb-3" controlId="attendance_date">
                              <Form.Label>Date</Form.Label>
                              <Form.Control
                                 type="date"
                                 name="attendance_date"
                                 value={formValues.attendance_date || ""}
                                 onChange={handleChange}
                                 max={new Date().toISOString().split('T')[0]}
                                 autoComplete="off"
                              />
                              <small className="error">
                                 {formValues.attendance_date === "" && formErrors.attendance_date}
                              </small>
                           </Form.Group>
                           <Form.Group className="mb-3" controlId="attendance_login_time">
                              <Form.Label>Login Time(24 hours)</Form.Label>
                              <Form.Control
                                 type="time"
                                 name="attendance_login_time"
                                 value={formValues.attendance_login_time || ""}
                                 onChange={handleChange}
                                 autoComplete="off"
                              />
                           </Form.Group>
                           <Form.Group className="mb-3" controlId="attendance_logout_time">
                              <Form.Label>Logout Time(24 hours)</Form.Label>
                              <Form.Control
                                 type="time"
                                 name="attendance_logout_time"
                                 value={formValues.attendance_logout_time || ""}
                                 onChange={handleChange}
                                 autoComplete="off"
                              />
                           </Form.Group>
                        </Form>
                     </Modal.Body>
                     <Modal.Footer>
                        <Button disabled={btnEnable} variant="primary" onClick={handleSubmit}>
                           {isEditMode ? "Update" : "Save"}
                        </Button>
                     </Modal.Footer>
                  </Modal>
                  <div className="card-body">
                     {filterData?.data?.length > 0 ? (
                        <Table striped bordered hover>
                           <thead>
                              <tr>
                                 <th>Date</th>
                                 <th>Log In Time</th>
                                 <th>Log Out Time</th>
                                 <th>Total Hours</th>
                                 <th>Action</th>
                              </tr>
                           </thead>
                           <tbody>
                              {filterData?.data?.map((item) => (
                                 <tr key={props.getFormatedDate(item.attendance_date)}>
                                    <td>{props.getFormatedDate(item.attendance_date)}</td>
                                    <td>{item.attendance_login_time}</td>
                                    <td>{item.attendance_logout_time}</td>
                                    <td>{calculateTotalHours(item.attendance_login_time, item.attendance_logout_time)}</td>
                                    <td>
                                       <>
                                          <Link onClick={() => handleEditClick(item)}>
                                             <i className="la la-edit"></i>
                                          </Link>
                                       </>
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </Table>
                     ) : (
                        <div className="d-flex justify-content-center align-items-center p-2">
                           No records to display
                        </div>
                     )}
                  </div>
               </div>
            </div>
         ) : (
            <div>
               <Row className="pb-3">
                  <Col lg={3}>
                     <Form.Group controlId="emp_id">
                        <Form.Label>Employee</Form.Label>
                        <select
                           className="form-select"
                           name="emp_id"
                           value={filterValues.emp_id || ""}
                           onChange={handleFilterChange}
                        >
                           <option value="">Select Employee</option>
                           {employeeData?.map((option, i) => (
                              <option key={i} value={option.emp_id}>
                                 {`${option.first_name} ${option.last_name}`}
                              </option>
                           ))}
                        </select>
                        <small className="error">
                           {!filterValues.emp_id && filterErrors.emp_id}
                        </small>
                     </Form.Group>
                  </Col>
                  <Col lg={3}>
                     <Form.Group controlId="year">
                        <Form.Label>Year</Form.Label>
                        <select
                           className="form-select"
                           name="year"
                           value={filterValues.year || ""}
                           onChange={handleFilterChange}
                        >
                           <option value="">Select Year</option>
                           {yearOptions.map((year, index) => (
                              <option key={index} value={year}>
                                 {year}
                              </option>
                           ))}
                        </select>
                        <small className="error">
                           {filterValues.year === "" && filterErrors.year}
                        </small>
                     </Form.Group>
                  </Col>
                  <Col lg={3}>
                     <Form.Group className="mb-3" controlId="month">
                        <Form.Label>Month</Form.Label>
                        <select
                           className="form-select"
                           name="month"
                           value={filterValues.month || ""}
                           onChange={handleFilterChange}
                        >
                           <option value="">Select</option>
                           {monthOptions.map((month, index) => (
                              <option key={index} value={index + 1}>
                                 {month}
                              </option>
                           ))}
                        </select>
                        <small className="error">
                           {filterValues.month === "" && filterErrors.month}
                        </small>
                     </Form.Group>
                  </Col>
                  <Col lg={2}>
                     <div className="mt-3 pt-1"></div>
                     <Button
                        className="btn btn-primary mt-2"
                        onClick={handleFilterSubmit}
                     >
                        Search
                     </Button>
                  </Col>
               </Row>
               <div className="card">
                  <div className="card-header">
                     <h5>Attendance</h5>
                     {filterData?.data?.length > 0 && (
                        <div className="d-flex justify-content-end">
                           <Button
                              className="link-action ms-3"
                              onClick={exportToPDF}
                           >
                              Export
                           </Button>
                        </div>
                     )}
                  </div>
                  <div className="card-body">
                     {filterData?.data?.length > 0 ? (
                        <Table striped bordered hover>
                           <thead>
                              <tr>
                                 <th>Date</th>
                                 <th>Log In Time</th>
                                 <th>Log Out Time</th>
                                 <th>Total Hours</th>
                                 <th>Name</th>
                                 <th>Days</th>
                                 <th>Action</th>
                              </tr>
                           </thead>
                           <tbody>
                              {filterData?.data?.map((item) => (
                                 <tr key={props.getFormatedDate(item.attendance_date)}>
                                    <td>{props.getFormatedDate(item.attendance_date)}</td>
                                    <td>{item.attendance_login_time}</td>
                                    <td>{item.attendance_logout_time}</td>
                                    <td>{calculateTotalHours(item.attendance_login_time, item.attendance_logout_time)}</td>
                                    <td>{`${item.first_name} ${item.last_name}`}</td>
                                    <td>{calculateDays(item.attendance_login_time, item.attendance_logout_time)}</td>
                                    <td>
                                       <>
                                          <Link onClick={() => handleEditClick(item)}>
                                             <i className="la la-edit"></i>
                                          </Link>
                                          <Link>
                                             <i className="la la-trash"></i>
                                          </Link>
                                       </>
                                    </td>
                                 </tr>
                              ))}
                              <tr>
                                 <td colSpan="5" style={{ fontWeight: "bold" }}>Total Days</td>
                                 <td style={{ fontWeight: "bold" }}>
                                    {filterData?.data?.reduce((total, item) => total + calculateDays(item.attendance_login_time, item.attendance_logout_time), 0)}
                                 </td>
                                 <td></td>
                              </tr>
                           </tbody>
                        </Table>
                     ) : (
                        <div className="d-flex justify-content-center align-items-center p-2">
                           No records to display
                        </div>
                     )}
                     <div>
                        <ToastContainer />
                        <Modal
                           show={showAttendance}
                           onHide={handleAttendanceToggle}
                           animation={false}
                           centered
                           backdrop={false}
                        >
                           <Modal.Header closeButton>
                              <Modal.Title className="text-center">
                                 {isEditMode ? "Edit Attendance" : "Add Attendance"}
                              </Modal.Title>
                           </Modal.Header>
                           <Modal.Body>
                              <Form>
                                 <Form.Group className="mb-3" controlId="attendance_date">
                                    <Form.Label>Date</Form.Label>
                                    <Form.Control
                                       type="date"
                                       name="attendance_date"
                                       value={formValues.attendance_date || ""}
                                       onChange={handleChange}
                                       max={new Date().toISOString().split('T')[0]}
                                       autoComplete="off"
                                    />
                                    <small className="error">
                                       {formValues.attendance_date === "" && formErrors.attendance_date}
                                    </small>
                                 </Form.Group>
                                 <Form.Group className="mb-3" controlId="attendance_login_time">
                                    <Form.Label>Login</Form.Label>
                                    <Form.Control
                                       type="time"
                                       name="attendance_login_time"
                                       value={formValues.attendance_login_time || ""}
                                       onChange={handleChange}
                                       autoComplete="off"
                                    />
                                 </Form.Group>
                                 <Form.Group className="mb-3" controlId="attendance_logout_time">
                                    <Form.Label>Logout</Form.Label>
                                    <Form.Control
                                       type="time"
                                       name="attendance_logout_time"
                                       value={formValues.attendance_logout_time || ""}
                                       onChange={handleChange}
                                       autoComplete="off"
                                    />
                                 </Form.Group>
                              </Form>
                           </Modal.Body>
                           <Modal.Footer>
                              <Button
                                 disabled={btnEnable}
                                 variant="primary"
                                 onClick={handleSubmit}
                              >
                                 {isEditMode ? "Update" : "Save"}
                              </Button>
                           </Modal.Footer>
                        </Modal>
                     </div>
                  </div>
               </div>
            </div>
         )}
      </>
   );
};

export default Attendance;
