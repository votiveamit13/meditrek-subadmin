import React from "react";
import { TextField, Button,  Typography, Paper, Grid } from "@mui/material";
import { Formik } from "formik";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { APP_PREFIX_PATH, Base_Url } from "../../config";

const OTPVerify = () => {
  const navigate = useNavigate();

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}
    >
      <Grid item xs={11} sm={8} md={4}>
        <Paper
          elevation={6}
          sx={{
            padding: 4,
            borderRadius: 3,
            textAlign: "center",
            background: "#ffffff",
          }}
        >
          <Typography variant="h4" mb={2} fontWeight="bold" color="primary">
            Verify OTP
          </Typography>
          <Typography variant="body1" mb={3} color="textSecondary">
            Enter the OTP sent to your email
          </Typography>

          <Formik
            initialValues={{ otp: "" }}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                const email = sessionStorage.getItem("email");

                const response = await axios.post(`${Base_Url}verify_login_otp`, {
                  email,
                  otp: values.otp,
                });

                if (response.data.success) {
                  sessionStorage.setItem("token", response.data.token);
                  navigate(APP_PREFIX_PATH + "/dashboard");
                } else {
                  alert("Invalid OTP");
                }
              } catch (error) {
                alert("Server Error");
              }

              setSubmitting(false);
            }}
          >
            {({ handleChange, handleSubmit, isSubmitting }) => (
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="OTP"
                  name="otp"
                  onChange={handleChange}
                  variant="outlined"
                  margin="normal"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={isSubmitting}
                  sx={{
                    mt: 2,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: "none",
                  }}
                >
                  Verify OTP
                </Button>
              </form>
            )}
          </Formik>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default OTPVerify;