import React, { useState } from "react";
import {
  Button,
  Col,
  Form,
  FormControl,
  InputGroup,
  Row,
} from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_CHANGE_PASSWORD } from "../../config/Api";
import { useNavigate } from "react-router-dom";

const ChangePassword = (props) => {

  const userName = localStorage.getItem("username");
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loginStatus");
    localStorage.removeItem("token_expired_on");
    localStorage.removeItem("id");
    localStorage.removeItem("username");
    localStorage.removeItem("role_name");
    localStorage.removeItem("role_id");
    localStorage.removeItem("emp_id");
    localStorage.removeItem("first_name");
    localStorage.removeItem("last_name");
    localStorage.removeItem("is_default_pwd");

    navigate("/");
  };

  const initialValues = {
    old_password: "",
    new_password: "",
    confirm_password: "",
  };

  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [btnEnable, setBtnEnable] = useState(false);
  const [showPassword, setShowPassword] = useState({
    old_password: false,
    new_password: false,
    confirm_password: false,
  });

  const togglePasswordVisibility = (type) => {
    switch (type) {
      case "old_password":
        setShowPassword({
          ...showPassword,
          old_password: !showPassword.old_password,
        });
        break;
      case "new_password":
        setShowPassword({
          ...showPassword,
          new_password: !showPassword.new_password,
        });
        break;
      case "confirm_password":
        setShowPassword({
          ...showPassword,
          confirm_password: !showPassword.confirm_password,
        });
        break;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const validatePassword = () => {
    const { old_password, new_password, confirm_password } = formValues;
    const errors = {};
    let isValid = true;

    if (old_password === "") {
      isValid = false;
      errors.old_password = "Old password is required";
    }
    if (new_password === "") {
      isValid = false;
      errors.new_password = " New password is required";
    }
    if (confirm_password === "") {
      isValid = false;
      errors.confirm_password = "Confirm password is required";
    }
    if (new_password !== "" && confirm_password !== "") {
      if (new_password !== confirm_password) {
        isValid = false;
        errors.check_password_match =
          "New password and confirm password doesn't match";
      }
    }
    setFormErrors(errors);
    return isValid;
  };

  const handleChangePasswordSubmit = (e) => {
    e.preventDefault();

    if (!validatePassword()) {
      return false;
    }
    setBtnEnable(true);

    const formData = {
      username: userName,
      old_password: formValues.old_password,
      new_password: formValues.new_password,
      confirm_password: formValues.confirm_password,
    };

    props
      .callRequest("POST", API_CHANGE_PASSWORD, true, formData)
      .then((res) => {
        toast.success(`${res.data.message}`, {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 5000,
        });
        setTimeout(() => {
          logout();
        }, 5000);
      })
      .catch((e) => {
        console.log(e);
        toast.error(`${e.response.data.message}`, {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 5000,
        });
      });
  };

  return (
    <>
      <div className="card">
        <div className="card-body">
          <Form onSubmit={handleChangePasswordSubmit}>
            <ToastContainer />
            <Row className="mb-3">
              <Col lg={4}>
                <Form.Group controlId="old_password">
                  <Form.Label>Old Password</Form.Label>
                  <InputGroup>
                    <FormControl
                      type={showPassword.old_password ? "text" : "password"}
                      name="old_password"
                      value={formValues.old_password}
                      placeholder="Enter old password"
                      onChange={handleChange}
                    />
                    <InputGroup.Text
                      onClick={() => togglePasswordVisibility("old_password")}
                      style={{ cursor: "pointer" }}
                    >
                      <i
                        className={`las ${showPassword.old_password ? "la-eye-slash" : "la-eye"
                          }`}
                      />
                    </InputGroup.Text>
                  </InputGroup>

                  <small className="error">
                    {formValues.old_password === "" && formErrors.old_password}
                  </small>
                </Form.Group>
              </Col>
              <Col md={4}>
                {" "}
                <Form.Group controlId="new_password">
                  <Form.Label>New Password</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showPassword.new_password ? "text" : "password"}
                      name="new_password"
                      value={formValues.new_password}
                      placeholder="Enter new password"
                      onChange={handleChange}
                      autoComplete="off"
                    />
                    <InputGroup.Text
                      onClick={() => togglePasswordVisibility("new_password")}
                      style={{ cursor: "pointer" }}
                    >
                      <i
                        className={`las ${showPassword.new_password ? "la-eye-slash" : "la-eye"
                          }`}
                      />
                    </InputGroup.Text>
                  </InputGroup>

                  <small className="error">
                    {formValues.new_password === ""
                      ? formErrors.new_password
                      : formValues.new_password !== formValues.confirm_password
                        ? formErrors.check_password_match
                        : ""}
                  </small>
                </Form.Group>
              </Col>
              <Col md={4}>
                {" "}
                <Form.Group controlId="confirm_password">
                  <Form.Label>Confirm Password</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showPassword.confirm_password ? "text" : "password"}
                      name="confirm_password"
                      value={formValues.confirm_password}
                      placeholder="Enter confirm password"
                      onChange={handleChange}
                      autoComplete="off"
                    />
                    <InputGroup.Text
                      onClick={() =>
                        togglePasswordVisibility("confirm_password")
                      }
                      style={{ cursor: "pointer" }}
                    >
                      <i
                        className={`las ${showPassword.confirm_password
                          ? "la-eye-slash"
                          : "la-eye"
                          }`}
                      />
                    </InputGroup.Text>
                  </InputGroup>

                  <small className="error">
                    {formValues.confirm_password === ""
                      ? formErrors.confirm_password
                      : formValues.confirm_password !== formValues.new_password
                        ? formErrors.check_password_match
                        : ""}
                  </small>
                </Form.Group>
              </Col>
            </Row>
            <div className="mt-2 text-end">
              <Button
                disabled={btnEnable ? true : false}
                type="submit"
                className="btn btn-primary mt-2"
              >
                Submit
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;
