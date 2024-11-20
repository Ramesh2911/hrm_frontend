import React, { useEffect, useMemo, useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import DataTable from "react-data-table-component";
import DataTableSettings from "../../helpers/DataTableSettings";
import {
   API_ALL_EMPLOYEE_LEAVES
}
   from '../../config/Api';

const LeavesDetails = (props) => {

   const [loadingIndicator, setLoadingIndicator] = useState(true);
   const [filterText, setFilterText] = useState("");
   const [leaveData, setLeaveData] = useState([]);
   const searchParam = [
      "employee_name",
      "total_leaves",
      "leaves_taken",
      "leaves_remaining"
   ];

   useEffect(() => {
      fetchEmployeeLeaves();
   }, []);

   const fetchEmployeeLeaves = () => {
      props.callRequest("GET", API_ALL_EMPLOYEE_LEAVES, true, null)
         .then((res) => {
            const result = res.data;
            setLeaveData(result);
            setLoadingIndicator(false);
         }).catch((e) => {
            console.log(e);
         });
   };

   const columns = [
      {
         name: <h5>Employee Name</h5>,
         selector: (row) => row.employee_name,
         sortable: true,
      },
      {
         name: <h5>Total Leave</h5>,
         selector: (row) => `${row.total_leaves} days`,
         sortable: true,
      },
      {
         name: <h5>Leave Taken</h5>,
         selector: (row) => `${row.leaves_taken} days`,
         sortable: true,
      },
      {
         name: <h5>Leave Remaning</h5>,
         selector: (row) => `${row.leaves_remaining} days`,
         sortable: true,
      }
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
               <h5>Leaves Details</h5>
            </div>
            <div className="card-body">
               <DataTable
                  columns={columns}
                  data={DataTableSettings.filterItems(
                     leaveData,
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

export default LeavesDetails;