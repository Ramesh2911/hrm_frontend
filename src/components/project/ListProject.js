import React, { useEffect, useMemo, useState } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import DataTable from "react-data-table-component";
import DataTableSettings from "../../helpers/DataTableSettings";
import {
   API_ADD_PROJECT,
   API_LIST_EMPLOYEES,
   API_LIST_PROJECTS,
   API_UPDATE_PROJECT
}
   from '../../config/Api';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

const ListProject = (props) => {

   const initialValues = {
      project_title: "",
      project_description: "",
      project_start_date: "",
      project_end_date: "",
      project_assign_to: ""
   };

   const [formValues, setFormValues] = useState(initialValues);
   const [formErrors, setFormErrors] = useState({});
   const [loadingIndicator, setLoadingIndicator] = useState(true);
   const [projectData, setProjectData] = useState([]);
   const [filterText, setFilterText] = useState("");
   const [showProject, setShowProject] = useState(false);
   const handleNoticeToggle = () => setShowProject(!showProject);
   const [btnEnable, setBtnEnable] = useState(false);
   const [employeeData, setEmployeeData] = useState([]);
   const [isEditMode, setIsEditMode] = useState(false);
   const [currentId, setCurrentId] = useState(null);
   const searchParam = [
      "project_title",
      "project_description",
   ];

   useEffect(() => {
      fetchEmployee();
      fetchProject();
   }, []);

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

   const fetchProject = () => {
      props.callRequest("GET", API_LIST_PROJECTS, true, null)
         .then((res) => {
            const sortedData = res.data?.data?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            setProjectData(sortedData);
            setLoadingIndicator(false);
         }).catch((e) => {
            console.log(e);
         });
   };

   const getProjectDuration = (startDate, endDate) => {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (isNaN(start) || isNaN(end)) {
         return "Invalid dates";
      }
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return `${diffDays} days`;
   };

   const getEmployeeName = (assignedTo) => {
      const employee = employeeData.find(emp => emp.emp_id === assignedTo);
      return employee ? `${employee.first_name} ${employee.last_name}` : "Unknown";
   };

   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormValues({ ...formValues, [name]: value });
   };

   const validateForm = () => {
      const {
         project_title,
         project_description,
         project_start_date,
         project_end_date,
         project_assign_to
      } = formValues;
      const errors = {};
      let isValid = true;

      if (project_title === "") {
         isValid = false;
         errors.project_title = "Project Titel is required";
      }
      if (project_description === "") {
         isValid = false;
         errors.project_description = "Project Description is required";
      }
      if (project_start_date === "") {
         isValid = false;
         errors.project_start_date = "Start date is required";
      } else if (project_start_date !== "" && !props.isValidDate(project_start_date)) {
         isValid = false;
         errors.valid_start_date = "Start date is not valid";
      }
      if (project_end_date === "") {
         isValid = false;
         errors.project_end_date = "End date is required";
      } else if (project_end_date !== "" && !props.isValidDate(project_end_date)) {
         isValid = false;
         errors.valid_end_date = "End date is not valid";
      }
      if (project_assign_to === "") {
         isValid = false;
         errors.project_assign_to = "Project Assign is required";
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

      const apiEndpoint = isEditMode ? API_UPDATE_PROJECT : API_ADD_PROJECT;
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
            fetchProject();
         })
         .catch((e) => {
            setBtnEnable(false);
            toast.error(`${e.response.data.message}`, {
               position: toast.POSITION.TOP_CENTER,
               autoClose: 5000,
            });
         });
   };

   const handleEditClick = (project) => {
      setFormValues({
         id: project.id,
         project_title: project.project_title,
         project_description: project.project_description,
         project_start_date: project.project_start_date,
         project_end_date: project.project_end_date,
         project_assign_to: project.project_assign_to
      });
      setCurrentId(project.id);
      setIsEditMode(true);
      handleNoticeToggle();
   };

   const columns = [
      {
         name: <h5>Employee Name</h5>,
         selector: (row) => getEmployeeName(row.project_assign_to),
         sortable: true,
      },
      {
         name: <h5>Project Name</h5>,
         selector: (row) => row.project_title,
         sortable: true,
      },
      {
         name: <h5>Project Description</h5>,
         selector: (row) => row.project_description,
         sortable: true,
      },
      {
         name: <h5>Start Date</h5>,
         selector: (row) => props.getFormatedDate(row.project_start_date),
         sortable: true,
      },
      {
         name: <h5>End Date</h5>,
         selector: (row) => props.getFormatedDate(row.project_end_date),
         sortable: true,
      },
      {
         name: <h5>Duration</h5>,
         selector: (row) => getProjectDuration(row.project_start_date, row.project_end_date),
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
      <>
         <div className="card">
            <div className="card-header">
               <h5>All Project</h5>
               <div className="d-flex justify-content-end">
                  <Button
                     className="link-action ms-3"
                     onClick={() => {
                        setIsEditMode(false);
                        setFormValues(initialValues);
                        handleNoticeToggle();
                     }}
                  >
                     Add Project
                  </Button>
               </div>
            </div>
            <div className="card-body">
               <ToastContainer />
               <Modal
                  show={showProject}
                  onHide={handleNoticeToggle}
                  animation={false}
                  centered
                  backdrop={false}

               >
                  <Modal.Header closeButton>
                     <Modal.Title className="text-center">
                        {isEditMode ? "Edit Project" : "Add Project"}
                     </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                     <Form>
                        <Form.Group className="mb-3" controlId="project_title">
                           <Form.Label>Project Title</Form.Label>
                           <Form.Control
                              type="text"
                              name='project_title'
                              value={formValues.project_title || ""}
                              placeholder="Enter Project Titel"
                              onChange={handleChange}
                              autoComplete="off"
                           />
                           <small className="error">
                              {formValues.project_title === "" && formErrors.project_title}
                           </small>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="project_description">
                           <Form.Label>Project Description</Form.Label>
                           <Form.Control
                              as="textarea"
                              rows={3}
                              name="project_description"
                              value={formValues.project_description || ""}
                              placeholder="Enter Project Description"
                              onChange={handleChange}
                              autoComplete='off'
                           />
                           <small className="error">
                              {formValues.project_description === "" && formErrors.project_description}
                           </small>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="project_start_date">
                           <Form.Label>Start Date</Form.Label>
                           <Form.Control
                              type="date"
                              name="project_start_date"
                              value={formValues.project_start_date || ""}
                              onChange={handleChange}
                              autoComplete='off'
                           />
                           <small className="error">
                              {formValues.project_start_date === ""
                                 ? formErrors.project_start_date
                                 : formValues.project_start_date !== "" &&
                                    !props.isValidDate(formValues.project_start_date)
                                    ? formErrors.valid_start_date
                                    : ""}
                           </small>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="project_end_date">
                           <Form.Label>End Date</Form.Label>
                           <Form.Control
                              type="date"
                              name="project_end_date"
                              value={formValues.project_end_date || ""}
                              onChange={handleChange}
                              autoComplete='off'
                           />
                           <small className="error">
                              {formValues.project_end_date === ""
                                 ? formErrors.project_end_date
                                 : formValues.project_end_date !== "" &&
                                    !props.isValidDate(formValues.project_end_date)
                                    ? formErrors.valid_end_date
                                    : ""}
                           </small>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="project_assign_to">
                           <Form.Label>Assign To</Form.Label>
                           <select
                              className="form-select"
                              aria-label="Select Assign"
                              name="project_assign_to"
                              value={formValues.project_assign_to || ""}
                              onChange={handleChange}
                           >
                              <option value="">
                                 Select Name
                              </option>
                              {employeeData?.map((option, i) => (
                                 <option key={i} value={option.emp_id}>
                                    {`${option.first_name} ${option.last_name}`}
                                 </option>
                              ))}
                           </select>
                           <small className="error">
                              {formValues.project_assign_to === "" && formErrors.project_assign_to}
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
                     projectData,
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

export default ListProject;
