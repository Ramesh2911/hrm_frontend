import React, { useEffect, useMemo, useState } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import DataTable from "react-data-table-component";
import DataTableSettings from "../../helpers/DataTableSettings";
import { toast, ToastContainer } from 'react-toastify';
import {
   API_ADD_PAY_SLIPS,
   API_DELETE_PAY_SLIPS,
   API_FETCH_PAY_SLIPS,
   API_LIST_EMPLOYEES,
   API_UPDATE_PAY_SLIPS,
   API_WEB_DOMAIN
}
   from '../../config/Api';
import { Link } from 'react-router-dom';
import Swal from "sweetalert2";

const PaySlips = (props) => {

   const roleName = localStorage.getItem("role_name");
   const empId = localStorage.getItem('emp_id');
   const firstName = localStorage.getItem('first_name');
   const lastName = localStorage.getItem('last_name');

   const initialValues = {
      doc_file: null,
      send_to: ""
   };

   const [formValues, setFormValues] = useState(initialValues);
   const [formErrors, setFormErrors] = useState({});
   const [loadingIndicator, setLoadingIndicator] = useState(true);
   const [filterText, setFilterText] = useState("");
   const [isEditMode, setIsEditMode] = useState(false);
   const [btnEnable, setBtnEnable] = useState(false);
   const [employeeData, setEmployeeData] = useState([]);
   const [currentId, setCurrentId] = useState(null);
   const [payData, setPayData] = useState([]);
   const [show, setShow] = useState(false);
   const handleToggle = () => setShow(!show);
   const searchParam = [
      "sender",
      "receiver",
      "doc_file",
      "date"
   ];

   useEffect(() => {
      if (roleName === "ADMIN") {
         fetchEmployee();
      }
   }, [roleName]);

   useEffect(() => {
      fetchPaySlips();
   }, []);

   const fetchEmployee = async () => {
      try {
         const res = await props.callRequest("GET", API_LIST_EMPLOYEES, true, null);
         const sortedData = res.data?.data?.sort((a, b) => parseInt(b.emp_id) - parseInt(a.emp_id));
         setEmployeeData(sortedData);
      } catch (e) {
         console.log(e);
         toast.error('Error fetching employee data');
      }
   };

   const fetchPaySlips = async () => {
      try {
         const queryParams = new URLSearchParams({
            role: roleName,
            ...(roleName === 'EMPLOYEE' && { emp_id: empId })
         }).toString();

         const res = await props.callRequest("GET", `${API_FETCH_PAY_SLIPS}?${queryParams}`, true);
         const sortedData = res.data?.data?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
         setPayData(sortedData);
         setLoadingIndicator(false);
      } catch (e) {
         console.log(e);
         toast.error('Error fetching documents');
      }
   };

   const getEmployeeName = (assignedTo) => {
      const employee = employeeData.find(emp => emp.emp_id === assignedTo);
      return employee ? `${employee.first_name} ${employee.last_name}` : "Unknown";
   };

   const handleChange = (e) => {
      const { name, value, files } = e.target;
      if (name === "doc_file") {
         setFormValues((prevValues) => ({ ...prevValues, [name]: files[0] || null }));
      } else {
         setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
      }
   };

   const validateForm = () => {
      const {
         doc_file,
         send_to,
      } = formValues;
      const errors = {};
      let isValid = true;

      if (doc_file === null) {
         isValid = false;
         errors.doc_file = "File upload is required";
      }
      if (send_to === "") {
         isValid = false;
         errors.send_to = "Field is required";
      }

      setFormErrors(errors);
      return isValid;
   };

   const handleSubmit = (e) => {
      e.preventDefault();

      if (!validateForm()) {
         return false;
      }

      setBtnEnable(true);

      const selectedEmployee = employeeData.find(
         (employee) => employee.emp_id === formValues.send_to
      );

      const formData = new FormData();
      formData.append('doc_file', formValues.doc_file);
      formData.append('send_to', formValues.send_to);
      formData.append('sender', 1);
      formData.append('date', new Date().toISOString());
      formData.append('first_name', selectedEmployee.first_name);
      formData.append('last_name', selectedEmployee.last_name);

      if (isEditMode) {
         formData.append('id', currentId);
      }

      const apiEndpoint = isEditMode ? `${API_UPDATE_PAY_SLIPS}/${currentId}` : API_ADD_PAY_SLIPS;
      const method = isEditMode ? "PUT" : "POST";

      props
         .callRequest(method, apiEndpoint, true, formData)
         .then((res) => {
            toast.success(`${res.data.message}`, {
               position: toast.POSITION.TOP_CENTER,
               autoClose: 2000,
            });
            handleToggle();
            setFormValues(initialValues);
            fetchPaySlips();
         })
         .catch((e) => {
            setBtnEnable(false);

            if (e.response && e.response.data && e.response.data.error) {
               toast.error(e.response.data.error, {
                  position: toast.POSITION.TOP_CENTER,
                  autoClose: 5000,
               });
            } else {
               toast.error("Something went wrong. Please try again.", {
                  position: toast.POSITION.TOP_CENTER,
                  autoClose: 5000,
               });
            }
         });
   };

   const handleEditClick = (PaySlips) => {
      const fileName = PaySlips.doc_file.split('-').slice(1).join('-');
      setFormValues({
         id: PaySlips.id,
         doc_file: fileName,
         send_to: PaySlips.receiver,
      });
      setCurrentId(PaySlips.id);
      setIsEditMode(true);
      handleToggle();
   };

   const handleDeleteClick = (id) => {
      Swal.fire({
         title: "Are you sure?",
         text: "You won't be able to revert this!",
         icon: "warning",
         showCancelButton: true,
         confirmButtonColor: "#3085d6",
         cancelButtonColor: "#d33",
         confirmButtonText: "Yes, delete it!"
      }).then((result) => {
         if (result.isConfirmed) {
            setBtnEnable(true);

            props.callRequest("DELETE", `${API_DELETE_PAY_SLIPS}/${id}`, true)
               .then((res) => {
                  fetchPaySlips();

                  Swal.fire({
                     title: "Deleted!",
                     text: "Your file has been deleted.",
                     icon: "success"
                  });
               })
               .catch((e) => {
                  setBtnEnable(false);
                  if (e.response && e.response.data && e.response.data.error) {
                     toast.error(e.response.data.error, {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 5000,
                     });
                  } else {
                     toast.error("Something went wrong. Please try again.", {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 5000,
                     });
                  }
               });
         }
      });
   };

   const columns = [
      {
         name: <h5>Sender</h5>,
         selector: (row) => {
            if (row.sender === "1") {
               return "Admin";
            }
         },
         sortable: true,
      },
      {
         name: <h5>Receiver</h5>,
         sortable: true,
         selector: (row) => {
            if (roleName === 'ADMIN') {
               return getEmployeeName(row.receiver);
            } else if (roleName === 'EMPLOYEE') {
               return `${firstName} ${lastName}`;
            }
            return "Unknown";
         },
      },
      {
         name: <h5>Upload File</h5>,
         selector: (row) => row.doc_file.split('-').slice(1).join('-'),
         sortable: true,
      },
      {
         name: <h5>Date</h5>,
         selector: (row) => props.getFormatedDate(row.date),
         sortable: true,
      },
      {
         name: <h6>Action</h6>,
         center: true,
         cell: (row) => (
            <>
               <button
                  style={{
                     marginRight: '10px',
                     backgroundColor: '#007bff',
                     color: '#fff',
                     border: 'none',
                     borderRadius: '4px',
                     padding: '5px 10px',
                     cursor: 'pointer',
                  }}
                  onClick={() => {
                     const fileName = row.doc_file.split('-').slice(1).join('-');
                     const blob = new Blob([row.doc_file_content], { type: 'application/octet-stream' });
                     const link = document.createElement('a');
                     link.href = URL.createObjectURL(blob);
                     link.setAttribute('download', fileName);
                     document.body.appendChild(link);
                     link.click();
                     document.body.removeChild(link);
                  }}>
                  <i className="la la-download"></i>
               </button>
               <Link
                  to={`${API_WEB_DOMAIN}/${row.doc_file}`}
                  target="_blank"
                  style={{ marginRight: '10px' }}
               >
                  <i className="la la-eye"></i>
               </Link>
               {roleName === 'ADMIN' && (
                  <>
                     <Link onClick={() => handleDeleteClick(row.id)}>
                        <i className="la la-trash"></i>
                     </Link>
                  </>
               )}
            </>
         ),
      },
   ];

   const subHeaderComponentMemo = useMemo(() => {
      return (
         <div>
            <Row>
               <Col lg={12}>
                  <Form className="d-flex">
                     <Form.Control
                        type="search"
                        placeholder="Search..."
                        className="me-2 rounded-pill"
                        aria-label="Search"
                        onChange={(e) => setFilterText(e.target.value)}
                     />
                  </Form>
               </Col>
            </Row>
         </div>
      );
   }, []);

   return (
      <>
         <div className="card">
            <div className="card-header">
               <h5>{roleName === "ADMIN" ? "All Pay Slips" : "Pay Slips"}</h5>
               {roleName === "ADMIN" && (
                  <div className="d-flex justify-content-end">
                     <Button
                        className="link-action ms-3"
                        onClick={() => {
                           setIsEditMode(false);
                           setFormValues(initialValues);
                           handleToggle();
                        }}
                     >
                        Add Pay Slips
                     </Button>
                  </div>
               )}
            </div>
            <div className="card-body">
               <ToastContainer />
               <Modal
                  show={show}
                  onHide={handleToggle}
                  animation={false}
                  centered
                  backdrop={false}

               >
                  <Modal.Header closeButton>
                     <Modal.Title className="text-center">
                        {isEditMode ? "Edit Pay Slips" : "Add Pay Slips"}
                     </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                     <Form>
                        <Form.Group className="mb-3" controlId="send_to">
                           <Form.Label>Send To</Form.Label>
                           <select
                              className="form-select"
                              aria-label="Select Send"
                              name="send_to"
                              value={formValues.send_to}
                              onChange={handleChange}
                           >
                              <option value="">Select Name</option>
                              <>
                                 {employeeData.map((option, i) => (
                                    <option key={i} value={option.emp_id}>
                                       {`${option.first_name} ${option.last_name}`}
                                    </option>
                                 ))}
                              </>
                           </select>
                           <small className="error">
                              {formValues.send_to === "" && formErrors.send_to}
                           </small>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="doc_file">
                           <Form.Label>Upload File</Form.Label>
                           {isEditMode && formValues.doc_file && typeof formValues.doc_file === 'string' && (
                              <div>
                                 <span>Current File: {formValues.doc_file}</span>
                              </div>
                           )}
                           <Form.Control
                              type="file"
                              name="doc_file"
                              onChange={handleChange}
                           />
                           <small className="error">
                              {formValues.doc_file === "" && formErrors.doc_file}
                           </small>
                        </Form.Group>
                     </Form>
                  </Modal.Body>
                  <Modal.Footer>
                     <Button
                        //disabled={btnEnable ? true : false}
                        variant="primary"
                        onClick={handleSubmit}
                     >
                        {isEditMode ? "Update" : "Save"}
                     </Button>
                  </Modal.Footer>
               </Modal>
               <DataTable
                  columns={columns}
                  data={DataTableSettings.filterItems(
                     payData,
                     searchParam,
                     filterText
                  )}
                  pagination
                  paginationPerPage={DataTableSettings.paginationPerPage}
                  paginationRowsPerPageOptions={
                     DataTableSettings.paginationRowsPerPageOptions
                  }
                  progressPending={loadingIndicator}
                  subHeader
                  fixedHeaderScrollHeight="400px"
                  subHeaderComponent={subHeaderComponentMemo}
                  persistTableHead
               />
            </div>
         </div>
      </>
   );
};

export default PaySlips;
