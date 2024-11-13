import { Row, Col } from "react-bootstrap";
import LoginForm from "../../components/authentication/LoginForm";

function LoginScreen(props) {
  return (
    <div className="auth-wrapper auth-v3">
      <div className="auth-content">
        <div className="card">
          <Row className="align-items-stretch text-center">
            <Col md={6} className="img-card-side">
              <img
                src="/assets/images/auth-side.jpg"
                alt="Login screen background"
                className="img-fluid"
              />
              <div className="img-card-side-content">
                {/* <img
                  src="/assets/images/logo.png"
                  alt="Logo dark"
                  className=""
                /> */}
              </div>
            </Col>
            <Col md={6}>
              <div className="card-body">
                <div className="text-center">
                  <h4 className="my-1 f-w-700">
                    <span className="text-primary">
                      HR Management System
                    </span>
                  </h4>
                  <p className="text-muted mb-1">
                    Please login into your account
                  </p>
                </div>
                <div className="">
                  <LoginForm {...props} />
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
}

export default LoginScreen;
