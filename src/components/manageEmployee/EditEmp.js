import { useCallback, useEffect, useState } from "react";
import { Row, Col, Button, Form, Modal } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import {
   API_EMPLOYEES_VIEW,
   API_LIST_DEPARTMENT,
   API_LIST_DESIGNATION,
   API_UPDATE_EMPLOYEE
}
   from "../../config/Api";

const EditEmployee = (props) => {
   const { emp_id } = useParams();
   const navigate = useNavigate();

   useEffect(() => {
      fetchDesignation();
      fetchDepartment();
   }, []);

   useEffect(() => {
      fetchEmployeeDetails();
   }, [emp_id]);

   const fetchDesignation = () => {
      props.callRequest("GET", API_LIST_DESIGNATION, true, null)
         .then((res) => {
            const sortedData = res.data?.data?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            setDesignationData(sortedData);
         }).catch((e) => {
            console.log(e);
         });
   };

   const fetchDepartment = () => {
      props.callRequest("GET", API_LIST_DEPARTMENT, true, null)
         .then((res) => {
            const sortedData = res.data?.data?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            setDepartmentData(sortedData);
         }).catch((e) => {
            console.log(e);
         });
   };

   const fetchEmployeeDetails = () => {
      props.callRequest("GET", `${API_EMPLOYEES_VIEW}/${emp_id}`, true, null)
         .then((res) => {
            const resultData = res.data?.data[0];
            setFormValues({
               first_name: resultData?.first_name || "",
               last_name: resultData?.last_name || "",
               dob: resultData?.dob || "",
               phone: resultData?.phone || "",
               alternate_phone: resultData?.alternate_phone || "",
               email: resultData?.email || "",
               address1: resultData?.address1 || "",
               address2: resultData?.address2 || "",
               city: resultData?.city || "",
               post_code: resultData?.post_code || "",
               gender: resultData?.gender || "",
               nationality: resultData?.nationality || "",
               passport_no: resultData?.passport_no || "",
               passport_issue_date: resultData?.passport_issue_date || "",
               passport_expiry_date: resultData?.passport_expiry_date || "",
               passport_doc: resultData?.passport_doc || "",
               visa_no: resultData?.visa_no || "",
               visa_issue_date: resultData?.visa_issue_date || "",
               visa_expiry_date: resultData?.visa_expiry_date || "",
               visa_doc: resultData?.visa_doc || "",
               emp_position: resultData?.emp_position || "",
               emp_department: resultData?.emp_department || "",
               salary: resultData?.salary || "",
               joining_date: resultData?.joining_date || "",
               emp_pic: resultData?.emp_pic || "",
               address_doc: resultData?.address_doc || "",
               p45_doc: resultData?.p45_doc || "",
               others_doc: resultData?.others_doc || "",
               status: resultData?.status || "",
               probation_period: resultData?.probation_period || "",
               ni_number: resultData?.ni_number || "",
               contracted_hours: resultData?.contracted_hours || "",
               fulltime_hours: resultData?.fulltime_hours || "",
               holiday: resultData?.holiday || "",
               salary_option: resultData?.salary_option || "",
               account_name: resultData?.account_name || "",
               account_number: resultData?.account_number || "",
               bank_name: resultData?.bank_name || "",
               sc_number: resultData?.sc_number || "",
               notice_period: resultData?.notice_period || "",
               work_check: resultData?.work_check || "",
            });
         }).catch((e) => {
            console.log(e);
         });
   };

   const genderOption = [
      { label: "Select", value: "" },
      { label: "MALE", value: "Male" },
      { label: "FEMALE", value: "Female" },
      { label: "OTHER", value: "Other" },
   ];

   const statusOption = [
      { label: "Active", value: "1" },
      { label: "Job Left", value: "2" },
      { label: "Suspended", value: "3" },
      { label: "Terminated", value: "4" },
   ];

   const salaryOption = [
      { label: "Select Salary Period", value: "" },
      { label: "ANNUAL", value: "Annual" },
      { label: "MONTHLY", value: "Monthly" },
      { label: "DAILY", value: "Daily" },
      { label: "HOURLY", value: "Hourly" },
   ];

   const initialValues = {
      first_name: "",
      last_name: "",
      dob: "",
      phone: "",
      alternate_phone: "",
      email: "",
      address1: "",
      address2: "",
      city: "",
      post_code: "",
      gender: "",
      nationality: "",
      passport_no: "",
      passport_issue_date: "",
      passport_expiry_date: "",
      passport_doc: null,
      visa_no: "",
      visa_issue_date: "",
      visa_expiry_date: "",
      visa_doc: null,
      emp_position: "",
      emp_department: "",
      salary: "",
      joining_date: "",
      emp_pic: null,
      address_doc: null,
      p45_doc: null,
      others_doc: null,
      work_check: null,
      status: "",
   };

   const [formValues, setFormValues] = useState(initialValues);
   const [formErrors, setFormErrors] = useState({});
   const [btnEnable, setBtnEnable] = useState(false);
   const [departmentData, setDepartmentData] = useState([]);
   const [designationData, setDesignationData] = useState([]);

   const handleChange = (e) => {
      const { name, type, value, files } = e.target;
      if (type === "file") {
         setFormValues((prevValues) => ({ ...prevValues, [name]: files[0] }));
      } else {
         setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
      }
   };

   const validateForm = () => {
      const {
         first_name,
         last_name,
         dob,
         email,
         phone,
         address1,
         address2,
         post_code,
         city,
         gender,
         passport_no,
         passport_issue_date,
         passport_expiry_date,
         visa_no,
         visa_issue_date,
         visa_expiry_date,
         emp_position,
         emp_department,
         salary,
         joining_date,
         nationality,
      } = formValues;
      const errors = {};
      let isValid = true;

      if (first_name === "") {
         isValid = false;
         errors.first_name = "First name is required";
      } else if (first_name !== "" && !props.checkAlphaOnly(first_name)) {
         isValid = false;
         errors.first_name_not_valid = "Valid entry only alphabets, space and dot";
      }
      if (last_name === "") {
         isValid = false;
         errors.last_name = "Last name is required";
      } else if (last_name !== "" && !props.checkAlphaOnly(last_name)) {
         isValid = false;
         errors.last_name_not_valid = "Valid entry only alphabets, space and dot";
      }
      if (dob === "") {
         isValid = false;
         errors.dob = "Date is required";
      } else if (dob !== "" && !props.isValidDate(dob)) {
         isValid = false;
         errors.valid_date = "Date is not valid";
      }
      if (email === "") {
         isValid = false;
         errors.email = "Email is required";
      }
      if (phone === "") {
         isValid = false;
         errors.phone = "Phone is required";
      }
      if (address1 === "") {
         isValid = false;
         errors.address1 = "Address 1 is required";
      }
      if (address2 === "") {
         isValid = false;
         errors.address2 = "Address 2 is required";
      }
      if (post_code === "") {
         isValid = false;
         errors.post_code = "Post code is required";
      }
      if (gender === "") {
         isValid = false;
         errors.gender = "Gender is required";
      }
      if (nationality === "") {
         isValid = false;
         errors.nationality = "Nationality is required";
      }
      if (passport_no === "") {
         isValid = false;
         errors.passport_no = "Passport No. is required";
      }
      if (passport_issue_date === "") {
         isValid = false;
         errors.passport_issue_date = "Passport issue date is required";
      } else if (passport_issue_date !== "" && !props.isValidDate(passport_issue_date)) {
         isValid = false;
         errors.valid_passport_issue_date = "Passport issue date is not valid";
      }
      if (passport_expiry_date === "") {
         isValid = false;
         errors.passport_expiry_date = "Passport expiry date is required";
      } else if (passport_expiry_date !== "" && !props.isValidDate(passport_expiry_date)) {
         isValid = false;
         errors.valid_passport_expiry_date = "Passport expiry date is not valid";
      }
      if (visa_no === "") {
         isValid = false;
         errors.visa_no = "Visa No. is required";
      }
      if (visa_issue_date === "") {
         isValid = false;
         errors.visa_issue_date = "Visa issue date is required";
      } else if (visa_issue_date !== "" && !props.isValidDate(visa_issue_date)) {
         isValid = false;
         errors.valid_visa_issue_date = "Visa issue date is not valid";
      }
      if (visa_expiry_date === "") {
         isValid = false;
         errors.visa_expiry_date = "Visa expiry date is required";
      } else if (visa_expiry_date !== "" && !props.isValidDate(visa_expiry_date)) {
         isValid = false;
         errors.valid_visa_expiry_date = "Visa expiry date is not valid";
      }
      if (!emp_position) {
         isValid = false;
         errors.emp_position = "Position is required";
      }
      if (!emp_department) {
         isValid = false;
         errors.emp_department = "Department is required";
      }
      if (!salary) {
         isValid = false;
         errors.salary = "Salary is required";
      }
      if (!joining_date) {
         isValid = false;
         errors.joining_date = "Joining date is required";
      } else if (joining_date !== "" && !props.isValidDate(joining_date)) {
         isValid = false;
         errors.valid_joining_date = "Joining date is not valid";
      }
      if (!city) {
         isValid = false;
         errors.city = "City is required";
      }

      setFormErrors(errors);
      return isValid;
   };

   const handleSubmit = (e) => {
      e.preventDefault();
      if (!validateForm()) return;

      setBtnEnable(true);

      const formData = new FormData();

      Object.keys(formValues).forEach((key) => {
         const value = formValues[key];

         if (value instanceof File) {
            formData.append(key, value);
         } else {
            formData.append(key, value);
         }
      });

      props.callRequest("PUT", `${API_UPDATE_EMPLOYEE}/${emp_id}`, true, formData)
         .then((res) => {
            toast.success(`${res.data.message}`, {
               position: toast.POSITION.TOP_CENTER,
               autoClose: 2000,
            });
            setFormValues(initialValues);
            setBtnEnable(false);
            setTimeout(() => navigate('/employees'), 3000);
         })
         .catch((e) => {
            setBtnEnable(false);
            const errorMessage = e.response?.data?.error || "Something went wrong. Please try again.";
            toast.error(errorMessage, {
               position: toast.POSITION.TOP_CENTER,
               autoClose: 5000,
            });
         });
   };

   return (
      <>
         <Form onSubmit={handleSubmit}>
            <ToastContainer />
            <>
               <Row className="mb-3">
                  <Col lg={4}>
                     <Form.Group controlId="first_name">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control
                           type="text"
                           name="first_name"
                           value={formValues.first_name || ""}
                           placeholder="Enter First Name"
                           onChange={handleChange}
                           autoComplete="off"
                        />
                        <small className="error">
                           {formValues.first_name === ""
                              ? formErrors.first_name
                              : formValues.first_name !== "" &&
                                 !props.checkAlphaOnly(formValues.first_name)
                                 ? formErrors.first_name_not_valid
                                 : ""}
                        </small>
                     </Form.Group>
                  </Col>
                  <Col lg={4}>
                     <Form.Group controlId="last_name">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control
                           type="text"
                           name="last_name"
                           value={formValues.last_name || ""}
                           placeholder="Enter Last Name"
                           onChange={handleChange}
                           autoComplete="off"
                        />
                        <small className="error">
                           {formValues.last_name === ""
                              ? formErrors.last_name
                              : formValues.last_name !== "" &&
                                 !props.checkAlphaOnly(formValues.last_name)
                                 ? formErrors.last_name_not_valid
                                 : ""}
                        </small>
                     </Form.Group>
                  </Col>
                  <Col lg={4}>
                     <Form.Group controlId="dob">
                        <Form.Label>Date of Birth</Form.Label>
                        <Form.Control
                           type="date"
                           name="dob"
                           value={formValues.dob || ""}
                           onChange={handleChange}
                        />
                        <small className="error">
                           {formValues.dob === ""
                              ? formErrors.dob
                              : formValues.dob !== "" &&
                                 !props.isValidDate(formValues.dob)
                                 ? formErrors.valid_dob
                                 : ""}
                        </small>
                     </Form.Group>
                  </Col>
               </Row>
               <Row className="mb-3">
                  <Col lg={4}>
                     <Form.Group controlId="phone">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control
                           type="text"
                           name="phone"
                           value={formValues.phone || ""}
                           placeholder="e.g. 9876543210"
                           onChange={handleChange}
                           onKeyDown={props.handleKeyPress}
                           autoComplete="off"
                        />
                        <small className="error">
                           {formValues.phone === "" && formErrors.phone}
                        </small>
                     </Form.Group>
                  </Col>
                  <Col lg={4}>
                     <Form.Group controlId="alternate_phone">
                        <Form.Label>Alternate Phone Number</Form.Label>
                        <Form.Control
                           type="text"
                           name="alternate_phone"
                           value={formValues.alternate_phone || ""}
                           placeholder="e.g. 9876543210"
                           onChange={handleChange}
                           onKeyDown={props.handleKeyPress}
                           autoComplete="off"
                        />
                     </Form.Group>
                  </Col>
                  <Col lg={4}>
                     <Form.Group controlId="email">
                        <Form.Label>Email ID</Form.Label>
                        <Form.Control
                           type="text"
                           name="email"
                           value={formValues.email || ""}
                           placeholder="Enter Email Address"
                           onChange={handleChange}
                           autoComplete="off"
                        />
                        <small className="error">
                           {formValues.email === "" && formErrors.email}
                        </small>
                     </Form.Group>
                  </Col>
               </Row>
               <Row className="mb-3">
                  <Col lg={4}>
                     <Form.Group controlId="status">
                        <Form.Label>Status</Form.Label>
                        <select
                           className="form-select"
                           aria-label="Select Gender"
                           name="status"
                           value={formValues.status || ""}
                           onChange={handleChange}
                           autoComplete="off"
                        >
                           {statusOption.map((option, i) => (
                              <option key={i} value={option.value}>
                                 {option.label}
                              </option>
                           ))}
                        </select>
                     </Form.Group>
                  </Col>
                  <Col lg={4}>
                     <Form.Group controlId="gender">
                        <Form.Label>Gender</Form.Label>
                        <select
                           className="form-select"
                           aria-label="Select Gender"
                           name="gender"
                           value={formValues.gender || ""}
                           onChange={handleChange}
                           autoComplete="off"
                        >
                           {genderOption.map((option, i) => (
                              <option key={i} value={option.value}>
                                 {option.label}
                              </option>
                           ))}
                        </select>
                        <small className="error">
                           {formValues.gender === "" && formErrors.gender}
                        </small>
                     </Form.Group>
                  </Col>
                  <Col lg={4}>
                     <Form.Group controlId="nationality">
                        <Form.Label>Nationality</Form.Label>
                        <Form.Control
                           type="text"
                           name="nationality"
                           value={formValues.nationality || ""}
                           placeholder="Enter Your Nationality"
                           onChange={handleChange}
                           autoComplete="off"
                        />
                        <small className="error">
                           {formValues.nationality === "" &&
                              formErrors.nationality}
                        </small>
                     </Form.Group>
                  </Col>
               </Row>
               <Row className="mb-3">
                  <Col lg={4}>
                     <Form.Group controlId="emp_position">
                        <Form.Label>Employee position</Form.Label>
                        <select
                           className="form-select"
                           aria-label="Select position"
                           name="emp_position"
                           value={formValues.emp_position || ""}
                           onChange={handleChange}
                        >
                           <option value="">
                              Select a Position
                           </option>
                           {designationData?.map((option, i) => (
                              <option key={i} value={option.id}>
                                 {option.designation_name}
                              </option>
                           ))}
                        </select>
                        <small className="error">
                           {formValues.emp_position === "" && formErrors.emp_position}
                        </small>
                     </Form.Group>
                  </Col>
                  <Col lg={4}>
                     <Form.Group controlId="emp_department">
                        <Form.Label>Departmant</Form.Label>
                        <select
                           className="form-select"
                           aria-label="Select department"
                           name="emp_department"
                           value={formValues.emp_department || ""}
                           onChange={handleChange}
                        >
                           <option value="">
                              Select a Department
                           </option>
                           {departmentData?.map((option, i) => (
                              <option key={i} value={option.id}>
                                 {option.department_name}
                              </option>
                           ))}
                        </select>
                        <small className="error">
                           {formValues.emp_department === "" && formErrors.emp_department}
                        </small>
                     </Form.Group>
                  </Col>
                  <Col lg={4}>
                     <Form.Group controlId="probation_period">
                        <Form.Label>Probation Period</Form.Label>
                        <Form.Control
                           type="text"
                           name="probation_period"
                           value={formValues.probation_period || ""}
                           placeholder="Enter Probation Period "
                           onChange={handleChange}
                           autoComplete="off"
                        />
                        <small className="error">
                           {formValues.probation_period === "" &&
                              formErrors.probation_period}
                        </small>
                     </Form.Group>
                  </Col>
               </Row>
               <Row className="mb-3">
                  <Col lg={4}>
                     <Form.Group controlId="ni_number">
                        <Form.Label>NI Number</Form.Label>
                        <Form.Control
                           type="text"
                           name="ni_number"
                           value={formValues.ni_number || ""}
                           placeholder="Enter NI Number"
                           onChange={handleChange}
                           autoComplete="off"
                        />
                        <small className="error">
                           {formValues.ni_number === "" &&
                              formErrors.ni_number}
                        </small>
                     </Form.Group>
                  </Col>
                  <Col lg={4}>
                     <Form.Group controlId="contracted_hours">
                        <Form.Label>Contracted Hours</Form.Label>
                        <Form.Control
                           type="text"
                           name="contracted_hours"
                           value={formValues.contracted_hours || ""}
                           placeholder="Enter contracted hours"
                           onChange={handleChange}
                           autoComplete="off"
                        />
                        <small className="error">
                           {formValues.contracted_hours === "" &&
                              formErrors.contracted_hours}
                        </small>
                     </Form.Group>
                  </Col>
                  <Col lg={4}>
                     <Form.Group controlId="fulltime_hours">
                        <Form.Label>Full Time Hours</Form.Label>
                        <Form.Control
                           type="text"
                           name="fulltime_hours"
                           value={formValues.fulltime_hours || ""}
                           placeholder="Enter Full Time hours"
                           onChange={handleChange}
                           autoComplete="off"
                        />
                        <small className="error">
                           {formValues.fulltime_hours === "" &&
                              formErrors.fulltime_hours}
                        </small>
                     </Form.Group>
                  </Col>
               </Row>
               <Row className="mb-3">
                  <Col lg={4}>
                     <Form.Group controlId="holiday">
                        <Form.Label>Entitled Holiday per Year</Form.Label>
                        <Form.Control
                           type="text"
                           name="holiday"
                           value={formValues.holiday || ""}
                           placeholder="Enter holiday"
                           onChange={handleChange}
                           autoComplete="off"
                        />
                        <small className="error">
                           {formValues.holiday === "" &&
                              formErrors.holiday}
                        </small>
                     </Form.Group>
                  </Col>
                  <Col lg={4}>
                     <Form.Group controlId="salary_option">
                        <Form.Label>Salary Period</Form.Label>
                        <select
                           className="form-select"
                           aria-label="Select Salary"
                           name="salary_option"
                           value={formValues.salary_option || ""}
                           onChange={handleChange}
                           autoComplete="off"
                        >
                           {salaryOption.map((option, i) => (
                              <option key={i} value={option.value}>
                                 {option.label}
                              </option>
                           ))}
                        </select>
                        <small className="error">
                           {formValues.salary_option === "" && formErrors.salary_option}
                        </small>
                     </Form.Group>
                  </Col>
                  <Col lg={4}>
                     <Form.Group controlId="salary">
                        <Form.Label>Salary</Form.Label>
                        <Form.Control
                           type="text"
                           name="salary"
                           placeholder="Enter Salary Amount"
                           value={formValues.salary || ""}
                           onKeyDown={props.handleKeyPress}
                           onChange={handleChange}
                           autoComplete="off"
                        />
                        <small className="error">
                           {formValues.salary === "" && formErrors.salary}
                        </small>
                     </Form.Group>
                  </Col>
               </Row>
               <Row className="mb-3">
                  <Col lg={4}>
                     <Form.Group controlId="account_name">
                        <Form.Label>Account name</Form.Label>
                        <Form.Control
                           type="text"
                           name="account_name"
                           value={formValues.account_name || ""}
                           placeholder="Enter Account name "
                           onChange={handleChange}
                           autoComplete="off"
                        />
                        <small className="error">
                           {formValues.account_name === "" &&
                              formErrors.account_name}
                        </small>
                     </Form.Group>
                  </Col>
                  <Col lg={4}>
                     <Form.Group controlId="account_number">
                        <Form.Label>Account Number</Form.Label>
                        <Form.Control
                           type="text"
                           name="account_number"
                           value={formValues.account_number || ""}
                           placeholder="Enter Account number "
                           onChange={handleChange}
                           onKeyDown={props.handleKeyPress}
                           autoComplete="off"
                        />
                        <small className="error">
                           {formValues.account_number === "" &&
                              formErrors.account_number}
                        </small>
                     </Form.Group>
                  </Col>
                  <Col lg={4}>
                     <Form.Group controlId="bank_name">
                        <Form.Label>Bank Name</Form.Label>
                        <Form.Control
                           type="text"
                           name="bank_name"
                           value={formValues.bank_name || ""}
                           placeholder="Enter Bank name"
                           onChange={handleChange}
                           autoComplete="off"
                        />
                        <small className="error">
                           {formValues.bank_name === "" &&
                              formErrors.bank_name}
                        </small>
                     </Form.Group>
                  </Col>
               </Row>
               <Row className="mb-3">
                  <Col lg={4}>
                     <Form.Group controlId="sc_number">
                        <Form.Label>S/C Number</Form.Label>
                        <Form.Control
                           type="text"
                           name="sc_number"
                           value={formValues.sc_number || ""}
                           placeholder="Enter S/C number"
                           onChange={handleChange}
                           onKeyDown={props.handleKeyPress}
                           autoComplete="off"
                        />
                        <small className="error">
                           {formValues.sc_number === "" &&
                              formErrors.sc_number}
                        </small>
                     </Form.Group>
                  </Col>
                  <Col lg={4}>
                     <Form.Group controlId="notice_period">
                        <Form.Label>Notice Period</Form.Label>
                        <Form.Control
                           type="text"
                           name="notice_period"
                           value={formValues.notice_period || ""}
                           placeholder="Enter notice period"
                           onChange={handleChange}
                           autoComplete="off"
                        />
                        <small className="error">
                           {formValues.notice_period === "" &&
                              formErrors.notice_period}
                        </small>
                     </Form.Group>
                  </Col>
                  <Col lg={4}>
                     <Form.Group controlId="joining_date">
                        <Form.Label>Joining Date</Form.Label>
                        <Form.Control
                           type="date"
                           name="joining_date"
                           value={formValues.joining_date || ""}
                           onChange={handleChange}
                           autoComplete="off"
                        />
                        <small className="error">
                           {formValues.joining_date === ""
                              ? formErrors.joining_date
                              : formValues.joining_date !== "" &&
                                 !props.isValidDate(formValues.joining_date)
                                 ? formErrors.valid_joining_date
                                 : ""}
                        </small>
                     </Form.Group>
                  </Col>
               </Row>
               <Row className="mb-3">
                  <Col lg={4}>
                     <Form.Group controlId="passport_no">
                        <Form.Label>Passport Number</Form.Label>
                        <Form.Control
                           type="text"
                           name="passport_no"
                           value={formValues.passport_no || ""}
                           placeholder="Enter Passport Number"
                           onChange={handleChange}
                           autoComplete="off"
                        />
                        <small className="error">
                           {formValues.passport_no === "" &&
                              formErrors.passport_no}
                        </small>
                     </Form.Group>
                  </Col>
                  <Col lg={4}>
                     <Form.Group controlId="passport_issue_date">
                        <Form.Label>Passport Issue Date</Form.Label>
                        <Form.Control
                           type="date"
                           name="passport_issue_date"
                           value={formValues.passport_issue_date || ""}
                           onChange={handleChange}
                           autoComplete="off"
                           max={new Date().toISOString().split('T')[0]}
                        />
                        <small className="error">
                           {formValues.passport_issue_date === ""
                              ? formErrors.passport_issue_date
                              : formValues.passport_issue_date !== "" &&
                                 !props.isValidDate(formValues.passport_issue_date)
                                 ? formErrors.valid_passport_issue_date
                                 : ""}
                        </small>
                     </Form.Group>
                  </Col>
                  <Col lg={4}>
                     <Form.Group controlId="passport_expiry_date">
                        <Form.Label>Passport expiry Date</Form.Label>
                        <Form.Control
                           type="date"
                           name="passport_expiry_date"
                           value={formValues.passport_expiry_date || ""}
                           onChange={handleChange}
                           autoComplete="off"
                           min={new Date().toISOString().split("T")[0]}
                        />
                        <small className="error">
                           {formValues.passport_expiry_date === ""
                              ? formErrors.passport_expiry_date
                              : formValues.passport_expiry_date !== "" &&
                                 !props.isValidDate(formValues.passport_expiry_date)
                                 ? formErrors.valid_passport_expiry_date
                                 : ""}
                        </small>
                     </Form.Group>
                  </Col>
               </Row>
               <Row className="mb-3">
                  <Col lg={4}>
                     <Form.Group controlId="visa_no">
                        <Form.Label>Visa/BRP Number</Form.Label>
                        <Form.Control
                           type="text"
                           name="visa_no"
                           value={formValues.visa_no || ""}
                           placeholder="Enter Visa/BRP Number"
                           onChange={handleChange}
                           autoComplete="off"
                        />
                        <small className="error">
                           {formValues.visa_no === "" &&
                              formErrors.visa_no}
                        </small>
                     </Form.Group>
                  </Col>
                  <Col lg={4}>
                     <Form.Group controlId="visa_issue_date">
                        <Form.Label>Visa/BRP Issue Date</Form.Label>
                        <Form.Control
                           type="date"
                           name="visa_issue_date"
                           value={formValues.visa_issue_date || ""}
                           onChange={handleChange}
                           autoComplete="off"
                           max={new Date().toISOString().split('T')[0]}
                        />
                        <small className="error">
                           {formValues.visa_issue_date === ""
                              ? formErrors.visa_issue_date
                              : formValues.visa_issue_date !== "" &&
                                 !props.isValidDate(formValues.visa_issue_date)
                                 ? formErrors.validvisa_issue_date
                                 : ""}
                        </small>
                     </Form.Group>
                  </Col>
                  <Col lg={4}>
                     <Form.Group controlId="visa_expiry_date">
                        <Form.Label>Visa/BRP expiry Date</Form.Label>
                        <Form.Control
                           type="date"
                           name="visa_expiry_date"
                           value={formValues.visa_expiry_date || ""}
                           onChange={handleChange}
                           autoComplete="off"
                           min={new Date().toISOString().split("T")[0]}
                        />
                        <small className="error">
                           {formValues.visa_expiry_date === ""
                              ? formErrors.visa_expiry_date
                              : formValues.visa_expiry_date !== "" &&
                                 !props.isValidDate(formValues.visa_expiry_date)
                                 ? formErrors.valid_visa_expiry_date
                                 : ""}
                        </small>
                     </Form.Group>
                  </Col>
               </Row>
               <Row className="mb-3">
                  <Col lg={6}>
                     <Form.Group controlId="address1">
                        <Form.Label>Address (1st line)</Form.Label>
                        <Form.Control
                           as="textarea"
                           rows={3}
                           name="address1"
                           placeholder="Enter address1"
                           value={formValues.address1 || ""}
                           onChange={handleChange}
                           autoComplete="off"
                        />
                        <small className="error">
                           {formValues.address1 === "" &&
                              formErrors.address1}
                        </small>
                     </Form.Group>
                  </Col>
                  <Col lg={6}>
                     <Form.Group controlId="address2">
                        <Form.Label>Address (2nd Line)</Form.Label>
                        <Form.Control
                           as="textarea"
                           rows={3}
                           name="address2"
                           placeholder="Enter address2"
                           value={formValues.address2 || ""}
                           onChange={handleChange}
                        />
                        <small className="error">
                           {formValues.address2 === "" &&
                              formErrors.address2}
                        </small>
                     </Form.Group>
                  </Col>
               </Row>
               <Row className="mb-3">
                  <Col lg={4}>
                     <Form.Group controlId="city">
                        <Form.Label>City</Form.Label>
                        <Form.Control
                           type="text"
                           name="city"
                           value={formValues.city || ""}
                           placeholder="Enter city name "
                           onChange={handleChange}
                           autoComplete="off"
                        />
                        <small className="error">
                           {formValues.city === "" && formErrors.city}
                        </small>
                     </Form.Group>
                  </Col>
                  <Col lg={4}>
                     <Form.Group controlId="post_code">
                        <Form.Label>Post Code</Form.Label>
                        <Form.Control
                           type="text"
                           name="post_code"
                           value={formValues.post_code || ""}
                           placeholder="Enter Post Code "
                           onChange={handleChange}
                           autoComplete="off"
                        />
                        <small className="error">
                           {formValues.post_code === "" && formErrors.post_code}
                        </small>
                     </Form.Group>
                  </Col>
               </Row>
               <Row className="mb-3">
                  <Col lg={4}>
                     <Form.Group controlId="work_check">
                        <Form.Label>Right to Work check</Form.Label>
                        {formValues.work_check && typeof formValues.work_check === 'string' && (
                           <div>
                              <span>Current File: {formValues.work_check.split('-').pop()}</span>
                           </div>
                        )}
                        <Form.Control
                           type="file"
                           name="work_check"
                           onChange={handleChange}
                        />
                     </Form.Group>
                  </Col>
                  <Col lg={4}>
                     <Form.Group controlId="passport_doc">
                        <Form.Label>Upload Passport Document</Form.Label>
                        {formValues.passport_doc && typeof formValues.passport_doc === 'string' && (
                           <div>
                              <span>Current File: {formValues.passport_doc.split('-').pop()}</span>
                           </div>
                        )}
                        <Form.Control
                           type="file"
                           name="passport_doc"
                           onChange={handleChange}
                        />
                     </Form.Group>
                  </Col>
                  <Col lg={4}>
                     <Form.Group controlId="visa_doc">
                        <Form.Label>Upload Visa/BRP Document</Form.Label>
                        {formValues.visa_doc && typeof formValues.visa_doc === 'string' && (
                           <div>
                              <span>Current File: {formValues.visa_doc.split('-').pop()}</span>
                           </div>
                        )}
                        <Form.Control
                           type="file"
                           name="visa_doc"
                           onChange={handleChange}
                        />
                     </Form.Group>
                  </Col>
               </Row>
               <Row className="mb-3">
                  <Col lg={4}>
                     <Form.Group controlId="address_doc">
                        <Form.Label>Upload Proof of Address</Form.Label>
                        {formValues.address_doc && typeof formValues.address_doc === 'string' && (
                           <div>
                              <span>Current File: {formValues.address_doc.split('-').pop()}</span>
                           </div>
                        )}
                        <Form.Control
                           type="file"
                           name="address_doc"
                           onChange={handleChange}
                        />
                     </Form.Group>
                  </Col>
                  <Col lg={4}>
                     <Form.Group controlId="p45_doc">
                        <Form.Label>Upload P45 Document</Form.Label>
                        {formValues.p45_doc && typeof formValues.p45_doc === 'string' && (
                           <div>
                              <span>Current File: {formValues.p45_doc.split('-').pop()}</span>
                           </div>
                        )}
                        <Form.Control
                           type="file"
                           name="p45_doc"
                           onChange={handleChange}
                        />
                     </Form.Group>
                  </Col>
                  <Col lg={4}>
                     <Form.Group controlId="others_doc">
                        <Form.Label>Upload Others Document</Form.Label>
                        {formValues.others_doc && typeof formValues.others_doc === 'string' && (
                           <div>
                              <span>Current File: {formValues.others_doc.split('-').pop()}</span>
                           </div>
                        )}
                        <Form.Control
                           type="file"
                           name="others_doc"
                           onChange={handleChange}
                        />
                     </Form.Group>
                  </Col>
               </Row>
               <Row className="mb-3">
                  <Col lg={4}>
                     <Form.Group controlId="emp_pic">
                        <Form.Label>Upload Photo</Form.Label>
                        {formValues.emp_pic && typeof formValues.emp_pic === 'string' && (
                           <div>
                              <span>Current File: {formValues.emp_pic.split('-').pop()}</span>
                           </div>
                        )}
                        <Form.Control
                           type="file"
                           name="emp_pic"
                           onChange={handleChange}
                        />
                     </Form.Group>
                  </Col>
               </Row>
            </>
            <div className="mt-2 text-end">
               <Button
                  disabled={btnEnable ? true : false}
                  type="submit"
                  className="btn btn-primary mt-2"
               >
                  Update
               </Button>
            </div>
         </Form>
      </>
   );
};

export default EditEmployee;
