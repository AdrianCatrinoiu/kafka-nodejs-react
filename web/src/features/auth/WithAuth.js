import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { selectCurrentUser } from "./authSlice";

const WithAuth = (props) => {
  const user = useSelector(selectCurrentUser);
  const location = useLocation();

  return !user ? (
    props.children
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  );
};

export default WithAuth;
