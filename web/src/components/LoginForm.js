import React from "react";
import { TextField, Button, Typography } from "@material-ui/core";
import * as Yup from "yup";
import { useFormik } from "formik";

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email(),
  password: Yup.string().required().min(8),
});

export default function LoginForm({
  email,
  password,
  onLogin,
  loginStatus,
  loginError,
}) {
  const formik = useFormik({
    initialValues: {
      email: email,
      password: password,
    },
    onSubmit: onLogin,
    validationSchema,
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <TextField
        label="Email"
        variant="filled"
        name="email"
        id="email"
        autoComplete="email"
        fullWidth
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.email}
        error={formik.errors.email && formik.touched.email}
        helperText={formik.errors.email}
      />
      <TextField
        label="Password"
        variant="filled"
        type="password"
        name="password"
        id="password"
        autoComplete="password"
        fullWidth
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.password}
        error={formik.errors.password && formik.touched.password}
        helperText={formik.errors.password}
      />
      <Typography display="block" gutterBottom variant="body2" color="error">
        {loginError && loginError}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        type="submit"
        fullWidth
        disabled={loginStatus === "pending"}
      >
        Login
      </Button>
    </form>
  );
}
