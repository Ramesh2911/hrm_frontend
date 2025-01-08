import React, { useState } from 'react';
import { Form, InputGroup, Button, Card } from 'react-bootstrap';
import {
   API_RESET_PASSWORD
}
   from '../../config/Api';
import {
   ToastContainer,
   toast
}
   from "react-toastify";
import { useNavigate, useParams } from 'react-router-dom';

const ResetPassword = (props) => {
   const navigate = useNavigate();
   const { token } = useParams();

   const [formValues, setFormValues] = useState({
      password: "",
   });

   const [formErrors, setFormErrors] = useState({});

   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormValues({ ...formValues, [name]: value });
   };

   const validateForm = () => {
      const { password } = formValues;
      const errors = {};
      let isValid = true;

      if (password === "") {
         isValid = false;
         errors.password = "Password is required";
      }

      setFormErrors(errors);
      return isValid;
   };

   const handleSubmit = (e) => {
      e.preventDefault();

      if (!validateForm()) {
         return false;
      }

      const payload = {
         token: token,
         password: formValues.password,
      };

      props
         .callRequest("POST", API_RESET_PASSWORD, true, payload)
         .then((res) => {
            toast.success(`${res.data.message}`, {
               position: toast.POSITION.TOP_CENTER,
               autoClose: 2000,
            });
            setTimeout(() => {
               navigate("/");
            }, 2000);
         })
         .catch((e) => {
            toast.error(`${e.response.data.message}`, {
               position: toast.POSITION.TOP_CENTER,
               autoClose: 5000,
            });
         });

   };

   return (
      <>
         <ToastContainer />

         <Card style={{
            width: '20rem',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            marginTop: 0
         }}>
            <Card.Body>
               <Card.Title>Reset Your Password</Card.Title>
               <InputGroup className="my-2">
                  <InputGroup.Text>
                     <i className="las la-lock"></i>
                  </InputGroup.Text>
                  <Form.Control
                     type="password"
                     name="password"
                     value={formValues.password}
                     onChange={handleChange}
                     placeholder=" Enter New Password"
                     autoComplete="off"
                  />
               </InputGroup>
               <small className="error">
                  {formValues.password === ""
                     && formErrors.password}
               </small>
               <div className="d-flex justify-content-end">
                  <Button
                     variant="primary"
                     onClick={(e) => handleSubmit(e)}
                  >
                     Submit
                  </Button>
               </div>
            </Card.Body>
         </Card>
      </>
   );
};

export default ResetPassword;