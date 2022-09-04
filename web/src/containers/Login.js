import React, { Fragment, useEffect, useState } from "react";
import { Typography } from "@material-ui/core";
import LoginForm from "../components/LoginForm";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "../features/auth/authApiSlice";
import { setCredentials } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import WithAuth from "../features/auth/WithAuth";

export default function Login() {
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [saveStatus, setSaveStatus] = useState("");
  const [saveError, setSaveError] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    if (isLoading) {
      setSaveStatus("pending");
    }
  }, [isLoading]);

  const onLogin = async (user) => {
    try {
      const userData = await login({
        email: user.email,
        password: user.password,
      }).unwrap();
      dispatch(setCredentials({ ...userData, user }));

      setEmail("");
      setPassword("");
      setSaveStatus("");
      navigate("/");
    } catch (err) {
      if (!err?.response) {
        setSaveError("No Server Response");
      } else if (err.response?.status === 400) {
        setSaveError("Missing email or password");
      } else if (err.response?.status === 401) {
        setSaveError("Unauthorized");
      } else {
        setSaveError("Login failed");
      }
    }
  };

  return (
    <WithAuth>
      <Fragment>
        <Typography variant="h1">Login</Typography>
        <LoginForm
          email={email}
          password={password}
          onLogin={onLogin}
          saveStatus={saveStatus}
          saveError={saveError}
        />
      </Fragment>
    </WithAuth>
  );
}
