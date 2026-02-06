import React from "react";
import AccessDenied from "./AccessDenied";
import useCurrentUser from "../hooks/useCurrentUser";

function RequireRole({ allowed, children }) {
  const user = useCurrentUser();
  const role = String(user?.role || "").toLowerCase();

  if (!allowed.includes(role)) {
    return <AccessDenied />;
  }

  return children;
}

export default RequireRole;
