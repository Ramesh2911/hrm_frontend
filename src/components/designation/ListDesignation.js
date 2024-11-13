import React, { useEffect, useMemo, useState } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import DataTable from "react-data-table-component";
import DataTableSettings from "../../helpers/DataTableSettings";
import { toast, ToastContainer } from 'react-toastify';
import {
   API_ADD_DESIGNATION,
   API_LIST_DEPARTMENT,
   API_LIST_DESIGNATION,
   API_UPDATE_DESIGNATION
}
   from '../../config/Api';
import { Link } from 'react-router-dom';

const ListDesignation = (props) => {

   useEffect(() => {
      fetchDepartment();
      fetchDesignation();
   }, []);

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

   const initialValues = {
      designation_name: "",
      department: ""
   };

   const [formValues, setFormValues] = useState(initialValues);
   const [formErrors, setFormErrors] = useState({});
   const [loadingIndicator, setLoadingIndicator] = useState(true);
   const [departmentData, setDepartmentData] = useState([]);
   const [designationData, setDesignationData] = useState([]);
   const [filterText, setFilterText] = useState("");
   const [showDesignation, setShowDesignation] = useState(false);
   const handleNoticeToggle = () => setShowDesignation(!showDesignation);
   const [btnEnable, setBtnEnable] = useState(false);
   const [isEditMode, setIsEditMode] = useState(false);
   const [currentId, setCurrentId] = useState(null);
   const searchParam = [
      "designation_name",
      "department",
   ];

   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormValues({ ...formValues, [name]: value });
   };

   const validateForm = () => {
      const {
         designation_name,
         department,
      } = formValues;
      const errors = {};
      let isValid = true;

      if (designation_name === "") {
         isValid = false;
         errors.designation_name = "Designation Name is required";
      }
      if (department === "") {
         isValid = false;
         errors.department = "Department is required";
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

      const apiEndpoint = isEditMode ? API_UPDATE_DESIGNATION : API_ADD_DESIGNATION;
      const method = isEditMode ? "PUT" : "POST";
      const data = isEditMode ? { ...formValues, id: currentId } : formValues;
      props
         .callRequest(method, apiEndpoint, true, data)
         .then((res) => {
            toast.success(`${res.data.message}`, {
               position: toast.POSITION.TOP_CENTER,
               autoClose: 2000,
            });
            handleNoticeToggle();
            setFormValues(initialValues);
            setBtnEnable(false);
            setIsEditMode(false);
            fetchDesignation();
         })
         .catch((e) => {
            setBtnEnable(false);
            toast.error(`${e.response.data.message}`, {
               position: toast.POSITION.TOP_CENTER,
               autoClose: 5000,
            });
         });
   };

   const handleEditClick = (designation) => {
      setFormValues({
         id: designation.id,
         designation_name: designation.designation_name,
         department: designation.department
      });
      setCurrentId(designation.id);
      setIsEditMode(true);
      handleNoticeToggle();
   };

   const columns = [
      {
         name: <h5>Designation Name</h5>,
         selector: (row) => row.designation_name,
         sortable: true,
      },
      {
         name: <h5>Department Name</h5>,
         selector: (row) => {
            const department = departmentData.find(dep => dep.id === row.department);
            return department ? department.department_name : "N/A";
         },
         sortable: true,
      },
      {
         name: <h6>Action</h6>,
         center: true,
         cell: (row) => (
            <>
               <Link onClick={() => handleEditClick(row)}>
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
      <div>
         <div className="card">
            <div className="card-header">
               <h5>All Designation</h5>
               <div className="d-flex justify-content-end">
                  <Button
                     className="link-action ms-3"
                     onClick={() => {
                        setIsEditMode(false);
                        setFormValues(initialValues);
                        handleNoticeToggle();
                     }}
                  >
                     Add Designation
                  </Button>
               </div>
            </div>
            <div className="card-body">
               <ToastContainer />
               <Modal
                  show={showDesignation}
                  onHide={handleNoticeToggle}
                  animation={false}
                  centered
                  backdrop={false}
               >
                  <Modal.Header closeButton>
                     <Modal.Title className="text-center">
                        {isEditMode ? "Edit Designation" : "Add Designation"}
                     </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                     <Form>
                        <Form.Group className="mb-3" controlId="designation_name">
                           <Form.Label>Designation Name</Form.Label>
                           <Form.Control
                              type="text"
                              name='designation_name'
                              value={formValues.designation_name || ""}
                              onChange={handleChange}
                              placeholder="Enter Designation name"
                              autoComplete='off'
                           />
                           <small className="error">
                              {formValues.designation_name === "" && formErrors.designation_name}
                           </small>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="department">
                           <Form.Label>Select Department</Form.Label>
                           <select
                              className="form-select"
                              aria-label="Select Department"
                              name="department"
                              value={formValues.department || ""}
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
                              {formValues.department === "" && formErrors.department}
                           </small>
                        </Form.Group>
                     </Form>
                  </Modal.Body>
                  <Modal.Footer>
                     <Button
                        disabled={btnEnable ? true : false}
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
                     designationData,
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
      </div>
   );
};

export default ListDesignation;
