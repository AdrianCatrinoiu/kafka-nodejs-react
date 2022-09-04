import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { selectCurrentToken } from "./authSlice";

const RequireAuth = (props) => {
  const token = useSelector(selectCurrentToken);
  const location = useLocation();
  return token ? (
    props.children
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default RequireAuth;
