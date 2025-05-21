import { Routes, Route, Navigate } from "react-router-dom";
import { FC, lazy, Suspense } from "react";
import { Backdrop } from "@mui/material";

import { DashboardLayout, Loading } from "@/components";
import AuthGuard from "./AuthGuard";
import dir from "./dir";

const ServiceAdmission = lazy(() => import("@/Pages/ServiceAdmission"));
const CarsManagement = lazy(() => import("@/Pages/CarsManagement"));
const Dashboard = lazy(() => import("@/Pages/Dashboard"));
const Vehicle = lazy(() => import("@/Pages/Vehicle"));
const Login = lazy(() => import("@/Pages/Login"));

const ViewSelector: FC = () => {
  return (
    <Suspense
      fallback={
        <Backdrop
          sx={(theme) => ({
            color: "#fff",
            zIndex: theme.zIndex.drawer + 1,
          })}
          open
        >
          <Loading />
        </Backdrop>
      }
    >
      <Routes>
        <Route path={dir.login} element={<Login />} />
        <Route
          element={
            <AuthGuard>
              <DashboardLayout />
            </AuthGuard>
          }
        >
          <Route path="/" element={<Navigate to={dir.dashboard} replace />} />
          <Route path={dir.serviceAdmission} element={<ServiceAdmission />} />
          <Route path={dir.carsManagement} element={<CarsManagement />} />
          <Route path={dir.dashboard} element={<Dashboard />} />
          <Route path={dir.vehicles} element={<Vehicle />} />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Route>
      </Routes>
    </Suspense>
  );
};
export default ViewSelector;
