import React, { useEffect, useMemo, useState } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import DataTable from "react-data-table-component";
import DataTableSettings from "../../helpers/DataTableSettings";
import {
   API_ADD_LEAVES,
   API_ALL_LEAVES,
   API_APPROVE_LEAVES,
   API_TAKEN_LEAVES_COUNT,
   API_LIST_LEAVES,
   API_REJECT_LEAVES,
   API_REMANING_LEAVES_COUNT
}
   from '../../config/Api';
import { toast, ToastContainer } from 'react-toastify';

const ListLeave = (props) => {

   const roleName = localStorage.getItem("role_name");
   const empId = localStorage.getItem('emp_id');
   const firstName = localStorage.getItem('first_name');
   const lastName = localStorage.getItem('last_name');

   const initialValues = {
      from_date: "",
      to_date: "",
      duration: "",
      description: "",
      date: "",
   };
   const [formValues, setFormValues] = useState(initialValues);
   const [formErrors, setFormErrors] = useState({});
   const [loadingIndicator, setLoadingIndicator] = useState(true);
   const [filterText, setFilterText] = useState("");
   const [show, setShow] = useState(false);
   const handleClose = () => setShow(false);
   const handleShow = () => setShow(true);
   const [selectedOption, setSelectedOption] = useState(null);
   const [duration, setDuration] = useState('');
   const [durationDate, setDurationDate] = useState('');
   const [btnEnable, setBtnEnable] = useState(false);
   const [countData, setCountData] = useState(0);
   const [remaningCountData, setRemaningCountData] = useState(0);
   const [fetchData, setFectchData] = useState([]);
   const [allLeavesData, setAllLeavesData] = useState([]);
   const searchParam = [
      "from_date",
      "to_date",
      "duration",
      "description",
   ];

   useEffect(() => {
      const { from_date, to_date } = formValues;

      if (from_date && to_date) {
         const fromDate = new Date(from_date);
         const toDate = new Date(to_date);
         const timeDifference = toDate - fromDate;
         const dayDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
         setDuration(dayDifference + 1);
      } else {
         setDuration('');
      }
   }, [formValues.from_date, formValues.to_date]);

   useEffect(() => {
      if (formValues.date) {
         setDurationDate(0.5);
      } else {
         setDurationDate('');
      }
   }, [formValues.date]);

   useEffect(() => {
      if (roleName === "EMPLOYEE") {
         fetchCount();
         fetchLeaves();
         fetchRemaningCount();
      } else if (roleName === "ADMIN") {
         fetchAllLeaves();
      }
   }, [roleName]);

   const fetchCount = () => {
      props.callRequest("GET", (`${API_TAKEN_LEAVES_COUNT}/${empId}`), true, null)
         .then((res) => {
            const result = res?.data;
            setCountData(result);
         }).catch((e) => {
            console.log(e);
         });
   };

   const fetchRemaningCount = () => {
      props.callRequest("GET", (`${API_REMANING_LEAVES_COUNT}/${empId}`), true, null)
         .then((res) => {
            const result = res?.data;
            setRemaningCountData(result);
         }).catch((e) => {
            console.log(e);
         });
   };

   const fetchLeaves = () => {
      props.callRequest("GET", (`${API_LIST_LEAVES}/${empId}`), true, null)
         .then((res) => {
            const sortedData = res.data?.data?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            setFectchData(sortedData);
            setLoadingIndicator(false);
         }).catch((e) => {
            console.log(e);
         });
   };

   const fetchAllLeaves = () => {
      props.callRequest("GET", API_ALL_LEAVES, true, null)
         .then((res) => {
            const sortedData = res.data?.data?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            setAllLeavesData(sortedData);
            setLoadingIndicator(false);
         }).catch((e) => {
            console.log(e);
         });
   };

   const getStatusText = (status) => {
      switch (status) {
         case 1:
            return { text: "Pending", color: "orange" };
         case 2:
            return { text: "Approved", color: "green" };
         case 3:
            return { text: "Rejected", color: "red" };
         default:
            return { text: "Unknown", color: "gray" };
      }
   };

   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormValues({ ...formValues, [name]: value });
   };

   const handleModalClose = () => {
      setSelectedOption(null);
      handleClose();
   };

   const handleRadioChange = (e) => {
      setSelectedOption(e.target.value);
   };

   const validateForm = () => {
      const {
         from_date,
         to_date,
         date,
         description,
      } = formValues;
      const errors = {};
      let isValid = true;

      if (selectedOption === 'dayOrMore') {
         if (from_date === "") {
            isValid = false;
            errors.from_date = "From date is required";
         }
         if (to_date === "") {
            isValid = false;
            errors.to_date = "To date is required";
         }
         if (description === "") {
            isValid = false;
            errors.description = "Description is required";
         }
      } else if (selectedOption === 'lessThanDay') {
         if (date === "") {
            isValid = false;
            errors.date = "Date is required";
         }
         if (description === "") {
            isValid = false;
            errors.description = "Description is required";
         }
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

      let data;

      if (selectedOption === 'dayOrMore') {
         data = {
            emp_id: empId,
            first_name: firstName,
            last_name: lastName,
            from_date: formValues.from_date,
            to_date: formValues.to_date,
            duration: duration,
            description: formValues.description,
         };
      } else if (selectedOption === 'lessThanDay') {
         data = {
            emp_id: empId,
            first_name: firstName,
            last_name: lastName,
            from_date: formValues.date,
            to_date: formValues.date,
            duration: durationDate,
            description: formValues.description,
         };
      }

      props.callRequest("POST", API_ADD_LEAVES, true, data)
         .then((res) => {
            toast.success(`${res.data.message}`, {
               position: toast.POSITION.TOP_CENTER,
               autoClose: 2000,
            });
            setFormValues(initialValues);
            handleModalClose();
            fetchCount();
            fetchRemaningCount();
            fetchLeaves();
         })
         .catch((e) => {
            setBtnEnable(false);
            toast.error(`${e.response.data.message}`, {
               position: toast.POSITION.TOP_CENTER,
               autoClose: 5000,
            });
         });
   };


   const handleApprove = (emp_id, id) => {
      props.callRequest('PUT', `${API_APPROVE_LEAVES}/${id}`, true, { status: 2 })
         .then((res) => {
            toast.success(`${res.data.message}`, {
               position: toast.POSITION.TOP_CENTER,
               autoClose: 2000,
            });
            fetchAllLeaves();
         })
         .catch((e) => {
            const errorMessage = e.response && e.response.data && e.response.data.message
               ? e.response.data.message
               : "An error occurred. Please try again.";
            toast.error(errorMessage, {
               position: toast.POSITION.TOP_CENTER,
               autoClose: 5000,
            });
         });
   };

   const handleReject = (emp_id, id) => {
      props.callRequest('PUT', `${API_REJECT_LEAVES}/${id}`, true, { status: 3 })
         .then((res) => {
            toast.success(`${res.data.message}`, {
               position: toast.POSITION.TOP_CENTER,
               autoClose: 2000,
            });
            fetchAllLeaves();
         })
         .catch((e) => {
            const errorMessage = e.response && e.response.data && e.response.data.message
               ? e.response.data.message
               : "An error occurred. Please try again.";
            toast.error(errorMessage, {
               position: toast.POSITION.TOP_CENTER,
               autoClose: 5000,
            });
         });
   };


   const columns = [
      ...(roleName === "ADMIN"
         ? [{
            name: <h5>Employee Name</h5>,
            selector: (row) => `${row.first_name} ${row.last_name}`,
            sortable: true,
         }]
         : []),
      {
         name: <h5>From Date</h5>,
         selector: (row) => props.getFormatedDate(row.from_date),
         sortable: true,
      },
      {
         name: <h5>To Date</h5>,
         selector: (row) => props.getFormatedDate(row.to_date),
         sortable: true,
      },
      {
         name: <h5>Duration</h5>,
         selector: (row) => `${row.duration} days`,
         sortable: true,
      },
      {
         name: <h5>Reason</h5>,
         selector: (row) => row.description,
         sortable: true,
      },
      {
         name: <h5>Status</h5>,
         selector: (row) => {
            const { text, color } = getStatusText(row.status);
            return <span style={{ color }}>{text}</span>;
         },
         sortable: true
      },
      ...

      (roleName === "ADMIN" ? [
         {
            name: <h5>Action</h5>,
            cell: (row) => (
               <div className="d-flex justify-content-between" style={{ minWidth: "150px" }}>
                  {row.status === 1 ? (
                     <>
                        <Button
                           variant="success"
                           size="sm"
                           className="mx-1"
                           onClick={() => handleApprove(row.emp_id, row.id)}
                        >
                           Approve
                        </Button>
                        <Button
                           variant="danger"
                           size="sm"
                           className="mx-1"
                           onClick={() => handleReject(row.emp_id, row.id)}
                        >
                           Reject
                        </Button>
                     </>
                  ) : (
                     <span>Status Updated</span>
                  )}
               </div>
            ),
            width: "200px",
         },
      ] : []),
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
         <ToastContainer />
         {roleName === "EMPLOYEE" ? (
            <>
               <div className='p-3 d-flex justify-content-around mt-3'>
                  <div className='px-3 pt-2 pb-3 border shadow-sm w-25'>
                     <div className='text-center pb-1'>
                        <h4>Holidays Taken</h4>
                     </div>
                     <hr />
                     <div className='d-flex justify-content-between'>
                        <h5>{countData?.data || 0} days</h5>
                     </div>
                  </div>
                  <div className='px-3 pt-2 pb-3 border shadow-sm w-25'>
                     <div className='text-center pb-1'>
                        <h4>Holidays Remaining</h4>
                     </div>
                     <hr />
                     <div className='d-flex justify-content-between'>
                        <h5>{remaningCountData?.data?.total_leaves} days</h5>
                     </div>
                  </div>
               </div>
               <div>
                  <Button
                     variant="primary"
                     onClick={handleShow}
                  >
                     Request Holiday
                  </Button>
                  <Modal
                     show={show}
                     onHide={handleModalClose}
                     animation={false}
                     centered
                     backdrop={false}
                  >
                     <Modal.Header closeButton>
                        <Modal.Title>Holiday</Modal.Title>
                     </Modal.Header>
                     <Modal.Body>
                        <Form>
                           <div className="mb-3">
                              <Form.Check
                                 inline
                                 label="A day or more"
                                 name="group1"
                                 type="radio"
                                 id="inline-radio-1"
                                 value="dayOrMore"
                                 onChange={handleRadioChange}
                              />
                              <Form.Check
                                 inline
                                 label="Less than a day"
                                 name="group1"
                                 type="radio"
                                 id="inline-radio-2"
                                 value="lessThanDay"
                                 onChange={handleRadioChange}
                              />
                           </div>
                           {selectedOption === 'dayOrMore' && (
                              <>
                                 <Form.Group controlId="from_date">
                                    <Form.Label>From Date</Form.Label>
                                    <Form.Control
                                       type="date"
                                       name='from_date'
                                       value={formValues.from_date || ""}
                                       onChange={handleChange}
                                       autoComplete='off'
                                       min={new Date().toISOString().split("T")[0]}
                                    />
                                    <small className="error">
                                       {formValues.from_date === "" && formErrors.from_date}
                                    </small>
                                 </Form.Group>
                                 <Form.Group controlId="to_date">
                                    <Form.Label>To Date</Form.Label>
                                    <Form.Control
                                       type="date"
                                       name='to_date'
                                       value={formValues.to_date || ""}
                                       onChange={handleChange}
                                       min={new Date().toISOString().split("T")[0]}
                                    />
                                    <small className="error">
                                       {formValues.to_date === "" && formErrors.to_date}
                                    </small>
                                 </Form.Group>
                                 <Form.Group controlId="duration">
                                    <Form.Label>Duration</Form.Label>
                                    <Form.Control
                                       type="text"
                                       value={duration}
                                       disabled
                                    />
                                 </Form.Group>
                                 <Form.Group controlId="description">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                       as="textarea"
                                       rows={3}
                                       name='description'
                                       value={formValues.description || ""}
                                       onChange={handleChange}
                                       placeholder="Enter description"
                                    />
                                    <small className="error">
                                       {formValues.description === "" && formErrors.description}
                                    </small>
                                 </Form.Group>
                              </>
                           )}
                           {selectedOption === 'lessThanDay' && (
                              <>
                                 <Form.Group controlId="date">
                                    <Form.Label>Date</Form.Label>
                                    <Form.Control
                                       type="date"
                                       name='date'
                                       value={formValues.date || ""}
                                       onChange={handleChange}
                                       min={new Date().toISOString().split("T")[0]}
                                    />
                                    <small className="error">
                                       {formValues.date === "" && formErrors.date}
                                    </small>
                                 </Form.Group>
                                 <Form.Group controlId="duration">
                                    <Form.Label>Duration</Form.Label>
                                    <Form.Control
                                       type="text"
                                       value={durationDate}
                                       disabled
                                    />
                                 </Form.Group>
                                 <Form.Group controlId="description">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                       as="textarea"
                                       rows={3}
                                       name='description'
                                       value={formValues.description || ""}
                                       onChange={handleChange}
                                       placeholder="Enter description"
                                    />
                                    <small className="error">
                                       {formValues.description === "" && formErrors.description}
                                    </small>
                                 </Form.Group>
                              </>
                           )}
                        </Form>
                     </Modal.Body>
                     <Modal.Footer>
                        <Button
                           variant="primary"
                           onClick={handleSubmit}
                           disabled={!selectedOption}
                        >
                           Save
                        </Button>
                     </Modal.Footer>
                  </Modal>
               </div>
               <br />
               <div className="card">
                  <div className="card-header">
                     <h5>Leaves</h5>
                  </div>
                  <div className="card-body">
                     <DataTable
                        columns={columns}
                        data={DataTableSettings.filterItems(
                           fetchData,
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
         ) : (
            <div className="card">
               <ToastContainer />
               <div className="card-header">
                  <h5>Leaves</h5>
               </div>
               <div className="card-body">
                  <DataTable
                     columns={columns}
                     data={allLeavesData}
                     pagination
                     paginationPerPage={DataTableSettings.paginationPerPage}
                     paginationRowsPerPageOptions={DataTableSettings.paginationRowsPerPageOptions}
                     subHeader
                     fixedHeaderScrollHeight="400px"
                     subHeaderComponent={subHeaderComponentMemo}
                     persistTableHead
                  />
               </div>
            </div>
         )}
      </>

   );
};

export default ListLeave;
