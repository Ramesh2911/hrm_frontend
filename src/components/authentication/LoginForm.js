import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, InputGroup, Button } from "react-bootstrap";
import {
  API_AUTHENTICATE,
  API_FORGOT_PASSWORD
}
  from "../../config/Api";
import {
  ToastContainer,
  toast
}
  from "react-toastify";

function LoginForm(props) {
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState({
    user_name: "",
    user_password: "",
  });
  const [forgotPasswordFormValues, setForgotPasswordFormValues] = useState({
    user_name: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [passwordFormErrors, setPasswordFormErrors] = useState({});
  const [forgotPassword, setForgotPassword] = useState(false);
  const [btnEnable, setBtnEnable] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleForgotPasswordChange = (e) => {
    const { name, value } = e.target;
    setForgotPasswordFormValues({ ...forgotPasswordFormValues, [name]: value });
  };

  const validateLogin = () => {
    const { user_name, user_password } = formValues;
    const errors = {};
    let isValid = true;

    if (user_name === "") {
      isValid = false;
      errors.user_name = "Username is required";
    }

    if (user_password === "") {
      isValid = false;
      errors.user_password = "Password is required";
    }

    setFormErrors(errors);
    return isValid;
  };

  const validateForgotPassword = () => {
    const { user_name, password } = forgotPasswordFormValues;
    const errors = {};
    let isValid = true;

    if (user_name === "") {
      isValid = false;
      errors.user_name = "User name is required";
    }
    if (password === "") {
      isValid = false;
      errors.password = "Password is required";
    }
    setPasswordFormErrors(errors);
    return isValid;
  };

  const handleForgotPasswordSubmit = (e) => {
    e.preventDefault();
    if (!validateForgotPassword()) {
      return false;
    }
    setBtnEnable(true);

    props
      .callRequest("PUT", API_FORGOT_PASSWORD, true, forgotPasswordFormValues)
      .then((res) => {
        toast.success(`${res.data.message}`, {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 5000,
        });
        setTimeout(() => {
          setForgotPassword(false);
          setBtnEnable(false);
        }, 4000);
        setForgotPasswordFormValues("");
      })
      .catch((e) => {
        console.log(e);
        setBtnEnable(false);
        toast.error(
          e.response && e.response.data && e.response.data.error
            ? `${e.response.data.error}`
            : 'An error occurred',
          {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 5000,
          }
        );
      });
  };

  // const handleLogInSubmit = (e) => {
  //   e.preventDefault();

  //   if (!validateLogin()) {
  //     return false;
  //   }

  //   setBtnEnable(true);

  //   props
  //     .callRequest("POST", API_AUTHENTICATE, false, formValues)
  //     .then((res) => {
  //       try {
  //         if (res.data.loginStatus) {
  //           localStorage.setItem("loginStatus", res.data.loginStatus);
  //           localStorage.setItem("token", String(res.data.userData.token));
  //           localStorage.setItem("token_expired_on", res.data.userData.token_expired_on);
  //           localStorage.setItem("id", res.data.userData.id);
  //           localStorage.setItem("username", res.data.userData.username);
  //           localStorage.setItem("role_name", res.data.userData.role_name);
  //           localStorage.setItem("role_id", res.data.userData.role_id);

  //           if (res.data.userData.role_name === "EMPLOYEE") {
  //             localStorage.setItem("emp_id", res.data.userData.emp_id);
  //             localStorage.setItem("first_name", res.data.userData.first_name);
  //             localStorage.setItem("last_name", res.data.userData.last_name);
  //             localStorage.setItem("is_default_pwd", res.data.userData.is_default_pwd);

  //             if (res.data.userData.is_default_pwd === 0) {
  //               navigate("/change-password");
  //             } else {
  //               navigate("/dashboard");
  //             }
  //           } else if (res.data.userData.role_name === "ADMIN") {
  //             navigate("/dashboard");
  //           }
  //         } else {
  //           setBtnEnable(false);
  //           toast.error(`${res.data.Error}`, {
  //             position: toast.POSITION.TOP_CENTER,
  //             autoClose: 5000,
  //           });
  //         }
  //       } catch (error) {
  //         console.error("Error setting data in localStorage:", error);
  //       }
  //     })
  //     .catch((e) => {
  //       setBtnEnable(false);
  //       toast.error(`${e.response?.data?.Error || "Login failed, please try again"}`, {
  //         position: toast.POSITION.TOP_CENTER,
  //         autoClose: 5000,
  //       });
  //     });
  // };

  const handleLogInSubmit = (e) => {
    e.preventDefault();

    if (!validateLogin()) {
      return false;
    }

    setBtnEnable(true);

    props
      .callRequest("POST", API_AUTHENTICATE, false, formValues)
      .then((res) => {
        try {
          if (res.data.loginStatus) {
            localStorage.setItem("loginStatus", res.data.loginStatus);
            localStorage.setItem("token", String(res.data.userData.token));
            localStorage.setItem("token_expired_on", res.data.userData.token_expired_on);
            localStorage.setItem("id", res.data.userData.id);
            localStorage.setItem("username", res.data.userData.username);
            localStorage.setItem("role_name", res.data.userData.role_name);
            localStorage.setItem("role_id", res.data.userData.role_id);

            if (res.data.userData.role_name === "EMPLOYEE") {
              localStorage.setItem("emp_id", res.data.userData.emp_id);
              localStorage.setItem("first_name", res.data.userData.first_name);
              localStorage.setItem("last_name", res.data.userData.last_name);
              localStorage.setItem("is_default_pwd", res.data.userData.is_default_pwd);

              if (res.data.userData.is_default_pwd === 0) {
                navigate("/change-password");
              } else {
                navigate("/dashboard");
              }
            } else if (res.data.userData.role_name === "ADMIN") {
              navigate("/dashboard");
            }
          } else {
            // Check for specific status error messages from backend
            setBtnEnable(false);

            const errorMessage = res.data.Error || "Invalid login attempt. Please try again.";

            toast.error(errorMessage, {
              position: toast.POSITION.TOP_CENTER,
              autoClose: 5000,
            });

            // Additional logging for debugging
            console.error("Login error:", errorMessage);
          }
        } catch (error) {
          console.error("Error processing login response:", error);
        }
      })
      .catch((e) => {
        setBtnEnable(false);

        const errorMessage = e.response?.data?.Error || "Login failed, please try again.";
        toast.error(errorMessage, {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 5000,
        });

        console.error("Error in login request:", errorMessage);
      });
  };

  return (
    <>
      <Form onSubmit={handleLogInSubmit}>
        <ToastContainer />
        {!forgotPassword ? (
          <div>
            <InputGroup>
              <InputGroup.Text>
                <i className="las la-envelope"></i>
              </InputGroup.Text>
              <Form.Control
                type="text"
                name="user_name"
                placeholder="User Name"
                autoComplete="off"
                value={formValues.user_name}
                onChange={handleChange}
              />
            </InputGroup>
            <small className="error">
              {formValues.user_name === "" && formErrors.user_name}
            </small>
            <InputGroup className="my-2">
              <InputGroup.Text>
                <i className="las la-lock"></i>
              </InputGroup.Text>
              <Form.Control
                type="password"
                name="user_password"
                placeholder="Password"
                autoComplete="off"
                value={formValues.user_password}
                onChange={handleChange}
              />
            </InputGroup>
            <small className="error">
              {formValues.user_password === "" && formErrors.user_password}
            </small>
          </div>
        ) : (
          <div>
            <InputGroup>
              <InputGroup.Text>
                <i className="las la-envelope"></i>
              </InputGroup.Text>
              <Form.Control
                type="text"
                name="user_name"
                placeholder="Enter your user name"
                autoComplete="off"
                value={forgotPasswordFormValues.user_name}
                onChange={handleForgotPasswordChange}
              />
            </InputGroup>
            <small className="error">
              {forgotPasswordFormValues.user_name === ""
                && passwordFormErrors.user_name}
            </small>
            <InputGroup className="my-2">
              <InputGroup.Text>
                <i className="las la-lock"></i>
              </InputGroup.Text>
              <Form.Control
                type="password"
                name="password"
                placeholder=" Enter new Password"
                autoComplete="off"
                value={forgotPasswordFormValues.password}
                onChange={handleForgotPasswordChange}
              />
            </InputGroup>
            <small className="error">
              {forgotPasswordFormValues.password === "" && passwordFormErrors.password}
            </small>
          </div>
        )}
        {forgotPassword ? null : (
          <div className="mt-2 text-start">
            <span
              style={{ cursor: "pointer" }}
              className="text-info"
              onClick={() => setForgotPassword(true)}
            >
              Forgot password?
            </span>
          </div>
        )}

        {!forgotPassword ? (
          <div className="mt-2 text-end">
            <Button
              //disabled={btnEnable ? true : false}
              type="submit"
              className="btn btn-primary mt-2"
            >
              Submit
            </Button>
          </div>
        ) : (
          <div className="">
            <div className="mt-2 text-start">
              <span
                style={{ cursor: "pointer" }}
                className="text-info"
                onClick={() => setForgotPassword(false)}
              >
                Back to logIn
              </span>
            </div>

            <Button
              type="submit"
              className="btn btn-primary mt-2"
              style={{ float: "right" }}
              disabled={btnEnable ? true : false}
              onClick={(e) => handleForgotPasswordSubmit(e)}
            >
              Submit
            </Button>
          </div>
        )}
      </Form>
    </>
  );
}

export default LoginForm;
