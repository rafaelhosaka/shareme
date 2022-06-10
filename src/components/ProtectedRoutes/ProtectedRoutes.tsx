import { Navigate, Outlet, useLocation } from "react-router";
import { useUser } from "../../context/userContext";
import { useEffect } from "react";

interface ProtectedRoutesProps {
  allowedRoles: string[];
}

function ProtectedRoutes({ allowedRoles }: ProtectedRoutesProps) {
  const { user } = useUser();
  const location = useLocation();

  useEffect(() => {}, [user]);

  return user?.roles?.find((role) => allowedRoles?.includes(role)) ? (
    <Outlet />
  ) : user ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  );
}

export default ProtectedRoutes;
