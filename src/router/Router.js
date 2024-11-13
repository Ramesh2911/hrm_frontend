import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

import LoginScreen from "../screens/authentication/LoginScreen";

//Dashboard
import DashboardScreen from "../screens/DashboardScreen";

//ManageEmployee
import ListEmployeeScreen from "../screens/manageEmployee/ListEmployeeScreen";
import AddEmployeeScreen from "../screens/manageEmployee/AddEmployeeScreen";
import ViewEmployeeScreen from "../screens/manageEmployee/ViewEmployeeScreen";
import EditEmployeeScreen from "../screens/manageEmployee/EditEmployeeScreen";

//Project
import ListProjectScreen from "../screens/project/ListProjectScreen";


//Department
import ListDepartmentScreen from "../screens/department/ListDepartmentScreen";

//Designation
import ListDesignationScreen from "../screens/designation/ListDesignationScreen";

//Attendance
import AttendanceScreen from "../screens/attendance/AttendanceScreen";

import NotFoundScreen from "../screens/NotFoundScreen";
import Error403Screen from "../screens/Error403Screen";
import Error404Screen from "../screens/Error404Screen";
import ErrorScreen from "../screens/ErrorScreen";
import ListLeaveScreen from "../screens/leave/ListLeaveScreen";
import DocumentScreen from "../screens/document/DocumentScreen";
import ChangePasswordScreen from "../screens/authentication/ChangePasswordScreen";
import PaySlipsScreen from "../screens/paySlips/paySlipsScreen";
import P60Screen from "../screens/p60/p60Screen";



export default function Router(props) {

  const { isAuthenticated } = useAuth();

  return (
    <>
      <Routes>
        {!isAuthenticated ? (
          <>
            <Route exact path="/" element={<LoginScreen {...props} />} />
            <Route exact path="*" element={<Navigate to="/" replace />} />
          </>
        ) : (
          <>
            <Route exact path="/change-password" element={<ChangePasswordScreen {...props} />} />
            <Route path="/dashboard" element={<DashboardScreen {...props} />} />
            <Route path="/employees" element={<ListEmployeeScreen {...props} />} />
            <Route path="/employee/new" element={<AddEmployeeScreen {...props} />} />
            <Route path="/employee/view/:emp_id" element={<ViewEmployeeScreen {...props} />} />
            <Route path="/employee/edit/:emp_id" element={<EditEmployeeScreen {...props} />} />
            <Route path="/department" element={<ListDepartmentScreen {...props} />} />
            <Route path="/designation" element={<ListDesignationScreen {...props} />} />
            <Route path="/leaves" element={<ListLeaveScreen {...props} />} />
            <Route exact path="/attendance" element={<AttendanceScreen {...props} />} />
            <Route exact path="/project" element={<ListProjectScreen {...props} />} />
            <Route exact path="/document" element={<DocumentScreen {...props} />} />
            <Route exact path="/pay-slips" element={<PaySlipsScreen {...props} />} />
            <Route exact path="/p60" element={<P60Screen {...props} />} />
          </>
        )}
        <>
          <Route path="*" element={<NotFoundScreen />} />
          <Route path="/error-403" element={<Error403Screen />} />
          <Route path="/error-404" element={<Error404Screen />} />
          <Route path="/error" element={<ErrorScreen />} />
        </>
      </Routes>
    </>
  );
}
