import React, { useEffect, useState } from 'react';
import {
   API_EMPLOYEES_VIEW,
   API_LIST_DEPARTMENT,
   API_LIST_DESIGNATION,
   API_LIST_PROJECTS,
   API_WEB_DOMAIN
}
   from '../../config/Api';
import { Link, useParams } from 'react-router-dom';

const ViewEmployee = (props) => {
   const { emp_id } = useParams();
   const [empData, setEmpData] = useState([]);
   const [departmentData, setDepartmentData] = useState([]);
   const [designationData, setDesignationData] = useState([]);
   const [projectData, setProjectData] = useState([]);

   useEffect(() => {
      fetchEmployeeDetails();
      fetchDepartment();
      fetchDesignation();
      fetchProject();
   }, []);

   const fetchEmployeeDetails = () => {
      props.callRequest("GET", `${API_EMPLOYEES_VIEW}/${emp_id}`, true, null)
         .then((res) => {
            const resultData = res.data?.data[0];
            setEmpData(resultData);
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

   const fetchDesignation = () => {
      props.callRequest("GET", API_LIST_DESIGNATION, true, null)
         .then((res) => {
            const sortedData = res.data?.data?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            setDesignationData(sortedData);
         }).catch((e) => {
            console.log(e);
         });
   };

   const fetchProject = () => {
      props.callRequest("GET", API_LIST_PROJECTS, true, null)
         .then((res) => {
            const sortedData = res.data?.data?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            setProjectData(sortedData);
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

   const getProjectName = (projectId) => {
      const project = projectData.find((dept) => dept.id === Number(projectId));
      return project ? project.project_title : "Project not assigned";
   };

   return (
      <>
         <div className="card">
            <div className="card-header">
               <h5>View Employee Profile</h5>
               <div className="d-flex justify-content-end">
               </div>
            </div>
            <div className="card-body">
               {empData ? (
                  <div className="project">
                     <div className="row border-bottom pb-3">
                        <div className="col-xl-8 col-lg-8">
                           <div className="d-flex align-items-center justify-content-start">
                              <img
                                 src={`${API_WEB_DOMAIN}/${empData.emp_pic}`}
                                 alt=""
                                 className="admission-profile-thumb me-3"
                              />
                              <div className="ms-3">
                                 <h4 className="fw-bold m-0 me-2">
                                    {`${empData?.first_name} ${empData?.last_name}`}
                                 </h4>
                                 <h5>
                                    {empData?.emp_id}
                                 </h5>
                              </div>
                           </div>
                        </div>
                        <div className="col-xl-4 col-lg-4">
                           <div className="d-flex align-items-center">
                              <i className="las la-phone me-2"></i>
                              <span>{empData?.phone}</span>
                              {empData?.alternate_phone !== null &&
                                 empData?.alternate_phone !== "" ? (
                                 <span>&nbsp;/&nbsp;{empData?.alternate_phone}</span>
                              ) : (
                                 ""
                              )}
                           </div>
                           <div className="d-flex align-items-center">
                              <i className="las la-envelope me-2"></i>
                              <span>{empData?.email}</span>
                           </div>
                           <div className="d-flex ">
                              <div className="text-muted lbl-w50">Joining Date:</div>{" "}
                              <span className="ml-4 ">
                                 {props.getFormatedDate(
                                    empData?.joining_date
                                 )}
                              </span>
                           </div>
                        </div>
                     </div>
                     <div className="row border-bottom pb-3">
                        <div className="col-xl-3 col-sm-6 mt-4">
                           <h5 className="fw-bold text-muted">
                              Nationality
                           </h5>
                           <span>{empData?.nationality}</span>
                        </div>
                        <div className="col-xl-3 col-sm-6 mt-4">
                           <h5 className="fw-bold text-muted">Date of Birth</h5>
                           <span>
                              {props.getFormatedDate(empData?.dob)}
                           </span>
                        </div>
                        <div className="col-xl-3 col-sm-6 mt-4">
                           <h5 className="fw-bold text-muted">Gender</h5>
                           <span>{empData?.gender}</span>
                        </div>
                        <div className="col-xl-3 col-sm-6 mt-4">
                           <h5 className="fw-bold text-muted">Status</h5>
                           <span>
                              {empData?.status === 1 && 'Active'}
                              {empData?.status === 2 && 'Job Left'}
                              {empData?.status === 3 && 'Suspended'}
                              {empData?.status === 4 && 'Terminated'}
                           </span>
                        </div>
                     </div>
                     <div className="row border-bottom pb-3">

                        <div className="col-xl-3 col-sm-6 mt-4">
                           <h5 className="fw-bold text-muted">Department</h5>
                           <span>{getDepartmentName(empData?.emp_department)}</span>
                        </div>
                        <div className="col-xl-3 col-sm-6 mt-4">
                           <h5 className="fw-bold text-muted">Position</h5>
                           <span>{getDesignationName(empData?.emp_position)}</span>
                        </div>
                        <div className="col-xl-3 col-sm-6 mt-4">
                           <h5 className="fw-bold text-muted">Project Name</h5>
                           <span>{getProjectName(empData?.assigned_project)}</span>
                        </div>
                        <div className="col-xl-3 col-sm-6 mt-4">
                           <h5 className="fw-bold text-muted">Total Holiday</h5>
                           <span>{empData?.holiday} days</span>
                        </div>
                     </div>
                     <div className="row border-bottom pb-3">
                        <div className="col-xl-3 col-sm-6 mt-4">
                           <h5 className="fw-bold text-muted">NI Number</h5>
                           <span>{empData?.ni_number}</span>
                        </div>
                        <div className="col-xl-3 col-sm-6 mt-4">
                           <h5 className="fw-bold text-muted">Full time hours</h5>
                           <span>{empData?.fulltime_hours} hours</span>
                        </div>
                        <div className="col-xl-3 col-sm-6 mt-4">
                           <h5 className="fw-bold text-muted">Contracted hours</h5>
                           <span>{empData?.contracted_hours} hours</span>
                        </div>
                        <div className="col-xl-3 col-sm-6 mt-4">
                           <h5 className="fw-bold text-muted">Notice Period</h5>
                           <span>{empData?.notice_period} days</span>
                        </div>
                     </div>
                     <div className="row border-bottom pb-3">
                        <div className="col-xl-3 col-sm-6 mt-4">
                           <h5 className="fw-bold text-muted">Account Name</h5>
                           <span>{empData?.account_name}</span>
                        </div>
                        <div className="col-xl-3 col-sm-6 mt-4">
                           <h5 className="fw-bold text-muted">Account Number</h5>
                           <span>{empData?.account_number}</span>
                        </div>
                        <div className="col-xl-3 col-sm-6 mt-4">
                           <h5 className="fw-bold text-muted">Bank Name</h5>
                           <span>{empData?.bank_name}</span>
                        </div>
                        <div className="col-xl-3 col-sm-6 mt-4">
                           <h5 className="fw-bold text-muted">S/C Number</h5>
                           <span>{empData?.sc_number}</span>
                        </div>
                     </div>
                     <div className="row border-bottom pb-3">
                        <div className="col-xl-3 col-sm-6 mt-4">
                           <h5 className="fw-bold text-muted">Salary Type</h5>
                           <span>{empData?.salary_option}</span>
                        </div>
                        <div className="col-xl-3 col-sm-6 mt-4">
                           <h5 className="fw-bold text-muted">
                              Salary
                           </h5>
                           <span>{props.getCurrencyFormat(empData?.salary)}</span>
                        </div>
                        <div className="col-xl-3 col-sm-6 mt-4">
                           <h5 className="fw-bold text-muted">Probation Period</h5>
                           <span>{empData?.probation_period} days</span>
                        </div>
                     </div>
                     <div className="row border-bottom pb-3">
                        <div className="col-xl-3 col-sm-6 mt-4">
                           <h5 className="fw-bold text-muted">Passport No.</h5>
                           <span>{empData?.passport_no}</span>
                        </div>
                        <div className="col-xl-3 col-sm-6 mt-4">
                           <h5 className="fw-bold text-muted">Passport Issue Date</h5>
                           <span>{props.getFormatedDate(empData?.passport_issue_date)}</span>
                        </div>
                        <div className="col-xl-3 col-sm-6 mt-4">
                           <h5 className="fw-bold text-muted">Passport Expiry Date</h5>
                           <span>{props.getFormatedDate(empData?.passport_expiry_date)}</span>
                        </div>
                        <div className="col-xl-3 col-sm-6 mt-4">
                           <h5 className="fw-bold text-muted">Passport Document</h5>
                           {empData?.passport_doc ? (
                              <Link
                                 to={`${API_WEB_DOMAIN}/${empData.passport_doc}`}
                                 target="_blank"
                                 className="d-flex align-items-center"
                              >
                                 <i className="las la-file-pdf me-2"></i> Download
                              </Link>
                           ) : (
                              <p className="text-danger">Document not uploaded</p>
                           )}
                        </div>
                     </div>
                     <div className="row border-bottom pb-3">
                        <div className="col-xl-3 col-sm-6 mt-4">
                           <h5 className="fw-bold text-muted">Visa/BRP No.</h5>
                           <span>{empData?.visa_no}</span>
                        </div>
                        <div className="col-xl-3 col-sm-6 mt-4">
                           <h5 className="fw-bold text-muted">Visa/BRP issue Date</h5>
                           <span>{props.getFormatedDate(empData?.visa_issue_date)}</span>
                        </div>
                        <div className="col-xl-3 col-sm-6 mt-4">
                           <h5 className="fw-bold text-muted">Visa/BRP Expiry Date</h5>
                           <span>{props.getFormatedDate(empData?.visa_expiry_date)}</span>
                        </div>
                        <div className="col-xl-3 col-sm-6 mt-4">
                           <h5 className="fw-bold text-muted">Visa/BRP Document</h5>
                           {empData?.visa_doc ? (
                              <Link
                                 to={`${API_WEB_DOMAIN}/${empData?.visa_doc}`}
                                 target="_blank"
                                 className="d-flex align-items-center"
                              >
                                 <i className="las la-file-pdf me-2"></i> Download
                              </Link>
                           ) : (
                              <p className="text-danger">Document not uploaded</p>
                           )}
                        </div>
                     </div>
                     <div className="row border-bottom pb-3">
                        <div className="col-xl-3 col-sm-6 mt-4">
                           <h5 className="fw-bold text-muted">City</h5>
                           <span>{empData?.city}</span>
                        </div>
                        <div className="col-xl-3 col-sm-6 mt-4">
                           <h5 className="fw-bold text-muted">Post Code</h5>
                           <span>{empData?.post_code}</span>
                        </div>
                        <div className="col-xl-3 col-sm-6 mt-4">
                           <h5 className="fw-bold text-muted">Address 1</h5>
                           <span>{empData?.address1}</span>
                        </div>
                        <div className="col-xl-3 col-sm-6 mt-4">
                           <h5 className="fw-bold text-muted">Address 2</h5>
                           <span>{empData?.address2}</span>
                        </div>
                     </div>
                     <div className="row border-bottom pb-3">
                        <div className="col-xl-3 col-sm-6 mt-4">
                           <h5 className="fw-bold text-muted">Address Document</h5>
                           {empData?.address_doc ? (
                              <Link
                                 to={`${API_WEB_DOMAIN}/${empData?.address_doc}`}
                                 target="_blank"
                                 className="d-flex align-items-center"
                              >
                                 <i className="las la-file-pdf me-2"></i> Download
                              </Link>
                           ) : (
                              <p className="text-danger">Document not uploaded</p>
                           )}
                        </div>
                        <div className="col-xl-3 col-sm-6 mt-4">
                           <h5 className="fw-bold text-muted">P45 Document</h5>
                           {empData?.p45_doc ? (
                              <Link
                                 to={`${API_WEB_DOMAIN}/${empData?.p45_doc}`}
                                 target="_blank"
                                 className="d-flex align-items-center"
                              >
                                 <i className="las la-file-pdf me-2"></i> Download
                              </Link>
                           ) : (
                              <p className="text-danger">Document not uploaded</p>
                           )}
                        </div>
                        <div className="col-xl-3 col-sm-6 mt-4">
                           <h5 className="fw-bold text-muted">Other Document</h5>
                           {empData?.others_doc ? (
                              <Link
                                 to={`${API_WEB_DOMAIN}/${empData?.others_doc}`}
                                 target="_blank"
                                 className="d-flex align-items-center"
                              >
                                 <i className="las la-file-pdf me-2"></i> Download
                              </Link>
                           ) : (
                              <p className="text-danger">Document not uploaded</p>
                           )}
                        </div>
                        <div className="col-xl-3 col-sm-6 mt-4">
                           <h5 className="fw-bold text-muted">Right To Work</h5>
                           {empData?.work_check ? (
                              <Link
                                 to={`${API_WEB_DOMAIN}/${empData?.work_check}`}
                                 target="_blank"
                                 className="d-flex align-items-center"
                              >
                                 <i className="las la-file-pdf me-2"></i> Download
                              </Link>
                           ) : (
                              <p className="text-danger">Document not uploaded</p>
                           )}
                        </div>
                     </div>
                  </div>
               ) : (
                  "Loading..."
               )}
            </div>
         </div>
      </>
   );
};

export default ViewEmployee;
