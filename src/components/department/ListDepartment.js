import React, { useEffect, useMemo, useState } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import DataTable from "react-data-table-component";
import DataTableSettings from "../../helpers/DataTableSettings";
import {
   API_ADD_DEPARTMENT,
   API_DELETE_DEPARTMENT,
   API_LIST_DEPARTMENT,
   API_UPDATE_DEPARTMENT
}
   from '../../config/Api';
import { toast, ToastContainer } from 'react-toastify';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const ListDepartment = (props) => {

   const initialValues = {
      department_name: "",
      department_functionality: ""
   };

   const [formValues, setFormValues] = useState(initialValues);
   const [formErrors, setFormErrors] = useState({});
   const [loadingIndicator, setLoadingIndicator] = useState(true);
   const [departmentData, setDepartmentData] = useState([]);
   const [filterText, setFilterText] = useState("");
   const [showDepartment, setShowDepartment] = useState(false);
   const handleNoticeToggle = () => setShowDepartment(!showDepartment);
   const [btnEnable, setBtnEnable] = useState(false);
   const [isEditMode, setIsEditMode] = useState(false);
   const [currentId, setCurrentId] = useState(null);
   const searchParam = [
      "department_name",
      "department_functionality",
   ];

   useEffect(() => {
      fetchDepartment();
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

   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormValues({ ...formValues, [name]: value });
   };

   const validateForm = () => {
      const {
         department_name,
         department_functionality,
      } = formValues;
      const errors = {};
      let isValid = true;

      if (department_name === "") {
         isValid = false;
         errors.department_name = "Department Name is required";
      }
      if (department_functionality === "") {
         isValid = false;
         errors.department_functionality = "Functionality is required";
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

      const apiEndpoint = isEditMode ? API_UPDATE_DEPARTMENT : API_ADD_DEPARTMENT;
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
            fetchDepartment();
         })
         .catch((e) => {
            setBtnEnable(false);
            toast.error(`${e.response.data.message}`, {
               position: toast.POSITION.TOP_CENTER,
               autoClose: 5000,
            });
         });
   };

   const handleEditClick = (department) => {
      setFormValues({
         id: department.id,
         department_name: department.department_name,
         department_functionality: department.department_functionality
      });
      setCurrentId(department.id);
      setIsEditMode(true);
      handleNoticeToggle();
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

            props.callRequest("DELETE", `${API_DELETE_DEPARTMENT}/${id}`, true)
               .then((res) => {

                  fetchDepartment();

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
         name: <h5>Name</h5>,
         selector: (row) => row.department_name,
         sortable: true,
      },
      {
         name: <h5>Description</h5>,
         selector: (row) => row.department_functionality,
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
               <Link onClick={() => handleDeleteClick(row.id)}>
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
               <h5>All Department</h5>
               <div className="d-flex justify-content-end">
                  <Button
                     className="link-action ms-3"
                     onClick={() => {
                        setIsEditMode(false);
                        setFormValues(initialValues);
                        handleNoticeToggle();
                     }}
                  >
                     Add Department
                  </Button>
               </div>
            </div>
            <div className="card-body">
               <ToastContainer />
               <Modal
                  show={showDepartment}
                  onHide={handleNoticeToggle}
                  animation={false}
                  centered
                  backdrop={false}
               >
                  <Modal.Header closeButton>
                     <Modal.Title className="text-center">
                        {isEditMode ? "Edit Department" : "Add Department"}
                     </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                     <Form>
                        <Form.Group className="mb-3" controlId="department_name">
                           <Form.Label>Department Name</Form.Label>
                           <Form.Control
                              type="text"
                              name='department_name'
                              value={formValues.department_name || ""}
                              onChange={handleChange}
                              placeholder="Enter Department Name"
                              autoComplete='off'
                           />
                           <small className="error">
                              {formValues.department_name === "" && formErrors.department_name}
                           </small>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="department_functionality">
                           <Form.Label>Functionality</Form.Label>
                           <Form.Control
                              as="textarea"
                              rows={3}
                              type="text"
                              name='department_functionality'
                              value={formValues.department_functionality || ""}
                              onChange={handleChange}
                              placeholder="Enter Functionality"
                              autoComplete='off'
                           />
                           <small className="error">
                              {formValues.department_functionality === "" && formErrors.department_functionality}
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
                     departmentData,
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

export default ListDepartment;
