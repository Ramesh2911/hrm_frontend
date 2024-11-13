import React, { useEffect, useMemo, useState } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import { API_FETCH_DOCUMENTS, API_LIST_EMPLOYEES, API_UPLOAD_DOCUMENTS, API_WEB_DOMAIN } from '../../config/Api';
import DataTable from 'react-data-table-component';
import DataTableSettings from '../../helpers/DataTableSettings';
import { Link } from 'react-router-dom';

const Document = (props) => {

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
   const [show, setShow] = useState(false);
   const [employeeData, setEmployeeData] = useState([]);
   const [file, setFile] = useState(null);
   const [customFileName, setCustomFileName] = useState('');
   const [btnEnable, setBtnEnable] = useState(false);
   const [loadingIndicator, setLoadingIndicator] = useState(true);
   const [filterText, setFilterText] = useState("");
   const [documentData, setDocumentData] = useState([]);
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
      fetchDocuments();
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

   const fetchDocuments = async () => {
      try {
         const queryParams = new URLSearchParams({
            role: roleName,
            ...(roleName === 'EMPLOYEE' && { emp_id: empId })
         }).toString();

         const res = await props.callRequest("GET", `${API_FETCH_DOCUMENTS}?${queryParams}`, true);
         const sortedData = res.data?.data?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
         setDocumentData(sortedData);
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
      const { name, value } = e.target;
      setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
   };

   const handleFileChange = (e) => {
      const selectedFile = e.target.files[0];
      if (selectedFile) {
         setFile(selectedFile);
         setCustomFileName(selectedFile.name);
         setFormValues((prevValues) => ({ ...prevValues, doc_file: selectedFile }));
      }
   };

   const handleClose = () => {
      setShow(false);
      setFile(null);
      setCustomFileName('');
      setFormValues(initialValues);
      setFormErrors({});
   };

   const handleShow = () => setShow(true);

   const validateForm = () => {
      const {
         send_to,
      } = formValues;
      const errors = {};
      let isValid = true;

      if (send_to === "") {
         isValid = false;
         errors.send_to = "Send to is required";
      }


      setFormErrors(errors);
      return isValid;
   };

   const handleSave = (e) => {
      e.preventDefault();

      if (!validateForm()) {
         return false;
      }

      setBtnEnable(true);

      const formData = new FormData();
      formData.append('doc_file', file);
      formData.append('send_to', formValues.send_to);
      formData.append('sender', roleName === "ADMIN" ? '1' : localStorage.getItem("emp_id"));
      formData.append('date', new Date().toISOString());

      props
         .callRequest("POST", API_UPLOAD_DOCUMENTS, true, formData)
         .then((res) => {
            toast.success(`${res.data.message}`, {
               position: toast.POSITION.TOP_CENTER,
               autoClose: 2000,
            });
            handleClose();
            setFormValues(initialValues);
            fetchDocuments();
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

   const columns = [
      {
         name: <h5>Sender</h5>,
         selector: (row) => {
            if (row.sender === "1") {
               return "Admin";
            } else {
               return firstName && lastName ? `${firstName} ${lastName}` : getEmployeeName(row.sender);
            }
         },
         sortable: true,
      },
      {
         name: <h5>Receiver</h5>,
         sortable: true,
         selector: (row) => {
            if (roleName === 'ADMIN') {
               if (row.receiver === "1") return "Admin";
               if (row.receiver === "0") return "All Employees";
               return getEmployeeName(row.receiver);
            } else if (roleName === 'EMPLOYEE') {
               if (row.receiver === "0") return "All Employees";
               if (row.receiver === "1") return "Admin";
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
               <Link
                  to={`${API_WEB_DOMAIN}/${row.doc_file}`}
                  target="_blank"
                  style={{ marginRight: '10px' }}
               >
                  <i className="la la-eye"></i>
               </Link>
               <Link >
                  <i className="la la-edit"></i>
               </Link>
               <Link>
                  <i className="la la-trash"></i>
               </Link>
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
               <h5>{roleName === "ADMIN" ? "All Documents" : "Documents"}</h5>
               <div className="d-flex justify-content-end">
                  <Button className="link-action ms-3" onClick={handleShow}>
                     Add Document
                  </Button>
               </div>
            </div>
            <div className="card-body">
               <ToastContainer />
               <Modal
                  show={show}
                  onHide={handleClose}
                  centered
                  backdrop="static"
               >
                  <Modal.Header closeButton>
                     <Modal.Title>Add Document</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                     <Form>
                        <Form.Group controlId="formFile" className="mb-3">
                           <Form.Label>Upload File</Form.Label>
                           <Form.Control type="file" name="doc_file" onChange={handleFileChange} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="customFileName">
                           <Form.Label>Custom File Name</Form.Label>
                           <Form.Control
                              type="text"
                              value={customFileName}
                              onChange={(e) => setCustomFileName(e.target.value)}
                              placeholder="Enter custom file name"
                           />
                        </Form.Group>
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
                              {roleName === "ADMIN" ? (
                                 <>
                                    <option value="0">All</option>
                                    {employeeData.map((option, i) => (
                                       <option key={i} value={option.emp_id}>
                                          {`${option.first_name} ${option.last_name}`}
                                       </option>
                                    ))}
                                 </>
                              ) : (
                                 <option value="1">Admin</option>
                              )}
                           </select>
                           <small className="error">
                              {formValues.send_to === "" && formErrors.send_to}
                           </small>
                        </Form.Group>
                     </Form>
                  </Modal.Body>
                  <Modal.Footer>
                     <Button variant="primary" onClick={handleSave}>
                        Save
                     </Button>
                  </Modal.Footer>
               </Modal>
               <DataTable
                  columns={columns}
                  data={DataTableSettings.filterItems(
                     documentData,
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

export default Document;
