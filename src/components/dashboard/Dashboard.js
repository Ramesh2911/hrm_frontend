import React, { useEffect, useState } from 'react';
import {
   API_DEPARTMENT_COUNT,
   API_DESIGNATION_COUNT,
   API_EMPLOYEE_STATUS,
   API_FETCH_EMPLOYEE,
   API_LIST_DEPARTMENT,
   API_LIST_DESIGNATION,
   API_LIST_PROJECTS,
   API_PROJECTS_COUNT
}
   from '../../config/Api';
import { Link } from 'react-router-dom';

const Dashboard = (props) => {

   const roleName = localStorage.getItem("role_name");
   const empId = localStorage.getItem('emp_id');

   const holidays = [
      { date: '2024-01-01', name: "New Year's Day", day: 'Wednesday' },
      { date: '2024-04-18', name: 'Good Friday', day: 'Friday' },
      { date: '2024-04-21', name: 'Easter Monday', day: 'Monday' },
      { date: '2024-05-05', name: 'Early May Bank Holiday', day: 'Monday' },
      { date: '2024-05-26', name: 'Spring Bank Holiday', day: 'Monday' },
      { date: '2024-08-25', name: 'Summer Bank Holiday', day: 'Monday' },
      { date: '2024-12-25', name: 'Christmas Day', day: 'Thursday' },
      { date: '2024-12-26', name: 'Boxing Day', day: 'Friday' },
   ];

   const [upcomingHoliday, setUpcomingHoliday] = useState(null);
   const [empCount, setEmpCount] = useState({ total_employees: 0, upcoming_birthdays: [] });
   const [projectCount, setProjectCount] = useState(0);
   const [departmentCount, setDepartmentCount] = useState(0);
   const [designationCount, setDesignationCount] = useState(0);
   const [empDetailsCount, setEmpDetailsCount] = useState([]);
   const [projectData, setProjectData] = useState([]);
   const [departmentData, setDepartmentData] = useState([]);
   const [designationData, setDesignationData] = useState([]);

   useEffect(() => {
      const today = new Date();
      const nextHoliday = holidays.find(holiday => new Date(holiday.date) > today);
      setUpcomingHoliday(nextHoliday);
   }, []);

   useEffect(() => {
      if (roleName === "ADMIN") {
         fetchEmpCount();
         fetchProjectCount();
         fetchDepartmentCount();
         fetchDesignationCount();
      } else if (roleName === "EMPLOYEE") {
         fetchDesignation();
         fetchDepartment();
         fetchProject();
         fetchEmpDetailsCount();
      }

   }, [roleName]);

   const fetchEmpCount = () => {
      props.callRequest("GET", API_EMPLOYEE_STATUS, true, null)
         .then((res) => {
            const result = res?.data?.data;
            setEmpCount(result);
         }).catch((e) => {
            console.log(e);
         });
   };

   const fetchProjectCount = () => {
      props.callRequest("GET", API_PROJECTS_COUNT, true, null)
         .then((res) => {
            const result = res?.data;
            setProjectCount(result);
         }).catch((e) => {
            console.log(e);
         });
   };

   const fetchDepartmentCount = () => {
      props.callRequest("GET", API_DEPARTMENT_COUNT, true, null)
         .then((res) => {
            const result = res?.data;
            setDepartmentCount(result);
         }).catch((e) => {
            console.log(e);
         });
   };

   const fetchDesignationCount = () => {
      props.callRequest("GET", API_DESIGNATION_COUNT, true, null)
         .then((res) => {
            const result = res?.data;
            setDesignationCount(result);
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

   const fetchEmpDetailsCount = () => {
      props.callRequest("GET", (`${API_FETCH_EMPLOYEE}/${empId}`), true, null)
         .then((res) => {
            const result = res?.data?.data;
            setEmpDetailsCount(result);
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
         <div className='p-3 d-flex justify-content-around mt-3'>
            {roleName === "ADMIN" && (
               <div className='px-3 pt-2 pb-3 border shadow-sm w-25'>
                  <div className='text-center pb-1'>
                     <Link to="/employees">
                        <h4>Employee</h4>
                     </Link>
                  </div>
                  <hr />
                  <div className='d-flex justify-content-between'>
                     <i className="las la-users"></i>
                     <h5>{empCount?.total_employees || 0}</h5>
                  </div>
               </div>
            )}
            <div className='px-3 pt-2 pb-3 border shadow-sm w-25'>
               <div className='text-center pb-1'>
                  {roleName === "ADMIN" ? (
                     <Link to="/project">
                        <h4>Project</h4>
                     </Link>
                  ) : (
                     <h4>Project</h4>
                  )}
               </div>
               <hr />
               <div className='d-flex justify-content-between'>
                  <i className="las la-briefcase"></i>
                  {roleName === "ADMIN" ? (
                     <h5>{projectCount?.data?.total_projects || 0}</h5>
                  ) : (
                     <h5>
                        {empDetailsCount?.assigned_project ? getProjectName(empDetailsCount?.assigned_project) : "Not Assigned"}
                     </h5>
                  )}
               </div>
            </div>
            <div className='px-3 pt-2 pb-3 border shadow-sm w-25'>
               <div className='text-center pb-1'>
                  {roleName === "ADMIN" ? (
                     <Link to="/department">
                        <h4>Department</h4>
                     </Link>
                  ) : (
                     <h4>Department</h4>
                  )}
               </div>
               <hr />
               <div className='d-flex justify-content-between'>
                  <i className="las la-home"></i>
                  {roleName === "ADMIN" ? (
                     <h5>{departmentCount?.data?.total_departments || 0}</h5>
                  ) : (
                     <h5>
                        {empDetailsCount?.emp_department ? getDepartmentName(empDetailsCount?.emp_department) : "Not Assigned"}
                     </h5>
                  )}
               </div>
            </div>
         </div>
         <div className='p-3 d-flex justify-content-around mt-3'>
            <div className='px-3 pt-2 pb-3 border shadow-sm w-25'>
               <div className='text-center pb-1'>
                  {roleName === "ADMIN" ? (
                     <Link to="/designation">
                        <h4>Designation</h4>
                     </Link>
                  ) : (
                     <h4>Designation</h4>
                  )}
               </div>
               <hr />
               <div className='d-flex justify-content-between'>
                  <i className="las la-file"></i>
                  {roleName === "ADMIN" ? (
                     <h5>{designationCount?.data?.total_designations || 0}</h5>
                  ) : (
                     <h5>
                        {empDetailsCount?.emp_position ? getDesignationName(empDetailsCount?.emp_position) : "Not Assigned"}
                     </h5>
                  )}
               </div>
            </div>
            <div className='px-3 pt-2 pb-3 border shadow-sm w-25'>
               <div className='text-center pb-1'>
                  <h4>Upcoming Holiday</h4>
               </div>
               <hr />
               <div>
                  {upcomingHoliday ? (
                     <div>
                        <h5>{upcomingHoliday.name}</h5>
                        <p>{props.getFormatedDate(upcomingHoliday.date)} - {upcomingHoliday.day}</p>
                     </div>
                  ) : (
                     <p>No upcoming holidays</p>
                  )}
               </div>
            </div>
         </div>
      </>
   );
};

export default Dashboard;
