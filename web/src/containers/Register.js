import React, { Fragment, useEffect, useState } from "react";
import { Typography } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { useRegisterMutation } from "../features/auth/authApiSlice";

import WithAuth from "../features/auth/WithAuth";
import { useNavigate } from "react-router-dom";
import { setCredentials } from "../features/auth/authSlice";
import RegisterForm from "../components/RegisterForm";

export default function Register() {
  const dispatch = useDispatch();
  const [register, { isLoading }] = useRegisterMutation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [registerStatus, setRegisterStatus] = useState("");
  const [registerError, setRegisterError] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    if (isLoading) {
      setRegisterStatus("pending");
    }
  }, [isLoading]);

  const onRegister = async (user) => {
    try {
      const userData = await register({
        name: user.name,
        email: user.email,
        password: user.password,
      }).unwrap();
      dispatch(setCredentials({ ...userData, user }));

      setName("");
      setEmail("");
      setPassword("");
      setRegisterStatus("");
      navigate("/");
    } catch (err) {
      if (!err?.response) {
        setRegisterError("No Server Response");
      } else if (err.response?.status === 400) {
        setRegisterError("Missing name,email or password");
      } else if (err.response?.status === 401) {
        setRegisterError("Unauthorized");
      } else {
        setRegisterError("Login failed");
      }
    }
  };

  return (
    <WithAuth>
      <Fragment>
        <Typography variant="h1">Register</Typography>
        <RegisterForm
          name={name}
          email={email}
          password={password}
          onRegister={onRegister}
          registerStatus={registerStatus}
          registerError={registerError}
        />
      </Fragment>
    </WithAuth>
  );
}
