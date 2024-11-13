const { REACT_APP_API_DOMAIN, REACT_APP_API_WEB_DOMAIN } = process.env;

export const API_DOMAIN = REACT_APP_API_DOMAIN + "/auth";
export const API_WEB_DOMAIN = REACT_APP_API_WEB_DOMAIN + "/uploads";

//login
export const API_AUTHENTICATE = API_DOMAIN + "/authenticate";
export const API_CHANGE_PASSWORD = API_DOMAIN + "/change-password";
export const API_FORGOT_PASSWORD = API_DOMAIN + "/forgot-password";

//Dashboard
export const API_EMPLOYEE_STATUS = API_DOMAIN + "/employee-status";
export const API_PROJECTS_COUNT = API_DOMAIN + "/projects-count";
export const API_DEPARTMENT_COUNT = API_DOMAIN + "/departments-count";
export const API_DESIGNATION_COUNT = API_DOMAIN + "/designation-count";
export const API_FETCH_EMPLOYEE = API_DOMAIN + "/fetch-employee";

//Emp
export const API_ADD_EMPLOYEE = API_DOMAIN + "/add-employee";
export const API_LIST_EMPLOYEES = API_DOMAIN + "/employees";
export const API_EMPLOYEES_VIEW = API_DOMAIN + "/employee/view";
export const API_UPDATE_EMPLOYEE = API_DOMAIN + "/update-employee";

//Project
export const API_ADD_PROJECT = API_DOMAIN + "/add-project";
export const API_LIST_PROJECTS = API_DOMAIN + "/projects";
export const API_UPDATE_PROJECT = API_DOMAIN + "/update-project";

//Department
export const API_ADD_DEPARTMENT = API_DOMAIN + "/add-department";
export const API_LIST_DEPARTMENT = API_DOMAIN + "/departments";
export const API_UPDATE_DEPARTMENT = API_DOMAIN + "/update-department";

//Designation
export const API_ADD_DESIGNATION = API_DOMAIN + "/add-designation";
export const API_LIST_DESIGNATION = API_DOMAIN + "/designation";
export const API_UPDATE_DESIGNATION = API_DOMAIN + "/update-designation";

//Attendance
export const API_ADD_ATTENDANCE = API_DOMAIN + "/add-attendance";
export const API_LIST_ATTENDANCE = API_DOMAIN + "/attendance";
export const API_UPDATE_ATTENDANCE = API_DOMAIN + "/update-attendance";
export const API_FILTER_ATTENDANCE = API_DOMAIN + "/filter-attendance";
export const API_FETCH_ATTENDANCE = API_DOMAIN + "/fetch-attendance";

//Leaves
export const API_ADD_LEAVES = API_DOMAIN + "/add-leaves";
export const API_LEAVES_COUNT = API_DOMAIN + "/leaves-count";
export const API_REMANING_LEAVES_COUNT = API_DOMAIN + "/remaining-leaves-count";
export const API_LIST_LEAVES = API_DOMAIN + "/list-leaves";
export const API_ALL_LEAVES = API_DOMAIN + "/all-leaves";
export const API_APPROVE_LEAVES = API_DOMAIN + "/approve-leave";
export const API_REJECT_LEAVES = API_DOMAIN + "/reject-leave";

//Document
export const API_UPLOAD_DOCUMENTS = API_DOMAIN + "/upload-document";
export const API_FETCH_DOCUMENTS = API_DOMAIN + "/fetch-documents";

//Pay-slips
export const API_ADD_PAY_SLIPS = API_DOMAIN + "/add/pay_slips";
export const API_FETCH_PAY_SLIPS = API_DOMAIN + "/fetch-pay-slips";
export const API_UPDATE_PAY_SLIPS = API_DOMAIN + "/update/pay_slips";

//p60
export const API_ADD_P60 = API_DOMAIN + "/add/p60";
export const API_FETCH_P60 = API_DOMAIN + "/fetch-p60";
export const API_UPDATE_P60 = API_DOMAIN + "/update/p60";

//Notification
export const API_GET_NOTIFICATIONS = API_DOMAIN + "/get-notifications";