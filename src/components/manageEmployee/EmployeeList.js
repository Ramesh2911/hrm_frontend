import React, { useEffect, useMemo, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import DataTable from "react-data-table-component";
import DataTableSettings from "../../helpers/DataTableSettings";
import { Link, useNavigate } from 'react-router-dom';
import { API_LIST_DESIGNATION, API_LIST_EMPLOYEES } from '../../config/Api';

const ListEmployee = (props) => {

   const navigate = useNavigate();
   const [loadingIndicator, setLoadingIndicator] = useState(true);
   const [filterText, setFilterText] = useState("");
   const [employeeData, setEmployeeData] = useState([]);
   const [designationData, setDesignationData] = useState([]);
   const searchParam = [
      "emp_id",
      "email",
      "first_name",
      "last_name",
      "nationality",
   ];

   useEffect(() => {
      fetchEmployee();
      fetchDesignation();
   }, []);

   const fetchEmployee = () => {
      props.callRequest("GET", API_LIST_EMPLOYEES, true, null)
         .then((res) => {
            const sortedData = res.data?.data?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            setEmployeeData(sortedData);
            setLoadingIndicator(false);
         })
         .catch((e) => {
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

   const getPositionName = (designationId) => {
      const designation = designationData.find(d => d.id === Number(designationId));
      return designation ? designation.designation_name : "Unknown";
   };

   const columns = [
      {
         name: <h5>Employee ID</h5>,
         selector: (row) => (
            <Link
               to={`/employee/view/${row.emp_id}`}
            >
               {row.emp_id}
            </Link>
         ),
         sortable: true,
      },
      {
         name: <h5>Full Name</h5>,
         selector: (row) => `${row.first_name} ${row.last_name}`,
         sortable: true,
      },
      {
         name: <h5>Email</h5>,
         selector: (row) => (
            <span title={row.email}>
               {row.email.length > 15 ? row.email.substring(0, 15) + "..." : row.email}
            </span>
         ),
         sortable: true,
      },
      {
         name: <h5>Phone</h5>,
         selector: (row) => row.phone,
         sortable: true,
      },
      {
         name: <h5>Nationality</h5>,
         selector: (row) => row.nationality,
         sortable: true,
      },
      {
         name: <h5>Passport Exp Date</h5>,
         selector: (row) => {
            const expiryDate = new Date(row.passport_expiry_date);
            const currentDate = new Date();
            const diffInMonths = (expiryDate.getFullYear() - currentDate.getFullYear()) * 12
               + (expiryDate.getMonth() - currentDate.getMonth());
            const backgroundColor = diffInMonths <= 1
               ? 'red'
               : diffInMonths <= 3
                  ? 'yellow'
                  : 'transparent';

            return (
               <span style={{
                  backgroundColor: backgroundColor,
                  color: 'black',
                  padding: '5px',
                  borderRadius: '5px'
               }}>
                  {props.getFormatedDate(row.passport_expiry_date)}
               </span>
            );
         },
         sortable: true,
      },
      {
         name: <h5>Visa/BRP Exp Date</h5>,
         selector: (row) => {
            const expiryDate = new Date(row.visa_expiry_date);
            const currentDate = new Date();
            const diffInMonths = (expiryDate.getFullYear() - currentDate.getFullYear()) * 12
               + (expiryDate.getMonth() - currentDate.getMonth());
            const backgroundColor = diffInMonths <= 1
               ? 'red'
               : diffInMonths <= 3
                  ? 'yellow'
                  : 'transparent';

            return (
               <span style={{
                  backgroundColor: backgroundColor,
                  color: 'black',
                  padding: '5px',
                  borderRadius: '5px'
               }}>
                  {props.getFormatedDate(row.visa_expiry_date)}
               </span>
            );
         },
         sortable: true,
      },
      {
         name: <h5>Position</h5>,
         selector: (row) => getPositionName(row.emp_position),
         sortable: true,
      },
      {
         name: <h6>Action</h6>,
         center: true,
         cell: (row) => (
            <>
               <Link to={`/employee/edit/${row.emp_id}`}>
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
               <h5>All Employee</h5>
               <div className="d-flex justify-content-end">
                  <Button
                     className="link-action ms-3"
                     onClick={() => navigate("/employee/new")}
                  >
                     Add Employee
                  </Button>
               </div>
            </div>
            <div className="card-body">
               <DataTable
                  columns={columns}
                  data={DataTableSettings.filterItems(
                     employeeData,
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

export default ListEmployee;