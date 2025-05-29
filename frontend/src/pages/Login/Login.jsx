/* eslint-disable no-unused-vars */
import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Box, InputBase, Typography, Button, useTheme } from "@mui/material";
import { getColorTokens } from "../../theme/theme.js";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext.jsx"; // your auth context

const schema = z.object({
  username: z.string().nonempty("Username is required"),
  email: z.string().email("Invalid email").nonempty("Email is required"),
  password: z.string(),
});

const Login = () => {
  const theme = useTheme();
  const colors = getColorTokens(theme.palette.mode);
  const { login } = useContext(AuthContext); // context to save user/token
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await axios.post("/api/auth/login", data);

      // backend sends back JWT token in res.data.token
      const token = res.data.token;

      // Save token locally (for example, localStorage)
      localStorage.setItem("token", token);

      // Update auth state (could also decode token for user info)
      login({ token });

      // Redirect to dashboard after login success
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{ bgcolor: colors.black[800] }} // Use your theme's background
    >
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          p: 4,
          bgcolor: colors.black[700], // Card background
          borderRadius: 2,
          width: "100%",
          maxWidth: 400,
          boxShadow: 3,
        }}
      >
        <Typography variant="h4" textAlign="center" color={colors.red[400]}>
          Login
        </Typography>

        {/* Username */}
        <Box>
          <Typography color={colors.white[100]}>Username</Typography>
          <InputBase
            fullWidth
            {...register("username")}
            sx={{
              bgcolor: colors.grey[800],
              borderRadius: 1,
              px: 2,
              py: 1,
              color: colors.white[100],
            }}
          />
          {errors.username && (
            <Typography color={colors.red[400]} fontSize="0.875rem">
              {errors.username.message}
            </Typography>
          )}
        </Box>

        {/* Email */}
        <Box>
          <Typography color={colors.white[100]}>Email</Typography>
          <InputBase
            fullWidth
            type="email"
            {...register("email")}
            sx={{
              bgcolor: colors.grey[800],
              borderRadius: 1,
              px: 2,
              py: 1,
              color: colors.white[100],
            }}
          />
          {errors.email && (
            <Typography color={colors.red[400]} fontSize="0.875rem">
              {errors.email.message}
            </Typography>
          )}
        </Box>

        {/* Password */}
        <Box>
          <Typography color={colors.white[100]}>Password</Typography>
          <InputBase
            fullWidth
            type="password"
            {...register("password")}
            sx={{
              bgcolor: colors.grey[800],
              borderRadius: 1,
              px: 2,
              py: 1,
              color: colors.white[100],
            }}
          />
          {errors.password && (
            <Typography color={colors.red[400]} fontSize="0.875rem">
              {errors.password.message}
            </Typography>
          )}
        </Box>

        <Button
          type="submit"
          variant="contained"
          sx={{
            mt: 2,
            bgcolor: colors.red[500],
            color: colors.white[100],
            "&:hover": { bgcolor: colors.red[700] },
          }}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </Button>
      </Box>
    </Box>
  );
};

export default Login;
