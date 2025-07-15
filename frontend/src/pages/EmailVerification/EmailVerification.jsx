/* eslint-disable no-unused-vars */
"use client";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Stack,
  useMediaQuery,
  useTheme,
  Alert,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import LogoSync from "../../components/LogoSync";
import { getColorTokens } from "../../theme/theme";
import {
  resendVerificationCode,
  verificationUserByEmail,
} from "../../services/teacher";

const EmailVerification = () => {
  const color = getColorTokens(useTheme().palette.mode);
  const location = useLocation();
  const navigate = useNavigate();
  const teach = location.state?.teacherObject;
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const handleSubmit = async (code) => {
    setErrorMsg("");
    setEmail(teach?.teacherEmail);
    setError(false);
    setLoading(true);

    try {
      const verificationUser = await verificationUserByEmail(email, code);
      if (verificationUser?.status === 200) {
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      setError(true);
      setLoading(false);
      setErrorMsg(error?.response?.data?.message);
    }
  };

  const handleResend = async () => {
    setErrorMsg("");
    setResendCooldown(true);
    setLoading(true);
    console.log("resnd handler", teach?.teacherEmail);
    try {
      const resendCode = await resendVerificationCode(teach?.teacherEmail);
    } catch (error) {
      setErrorMsg(error?.response?.data?.message);
    }
    setResendMessage("Resending code...");
    // Simulate API call
    setTimeout(() => {
      // Here you’d call your actual API
      setResendMessage("A new code has been sent to your email.");
      setTimeout(() => {
        setResendMessage("");
        setLoading(false);
      }, 5000);
      setResendCooldown(false);
    }, 2000);
  };

  return (
    <Box width="100%" height="100%" overflow="hidden">
      <Container
        maxWidth="sm"
        sx={{
          mt: 12,
        }}
      >
        <Box
          sx={{
            p: isSmall ? 2 : 4,
            borderRadius: 3,
            boxShadow: 3,
            bgcolor: color.gradient[100],
            textAlign: "center",
          }}
        >
          {/* Logo */}
          <Box display="flex" justifyContent="center" mb={2}>
            <LogoSync />
          </Box>

          {/* Title & Email Info */}
          <Typography variant="h4" gutterBottom>
            Email Verification
          </Typography>
          <Typography variant="h4" mb={2}>
            A verification code has been sent to{" "}
            <strong>{teach?.teacherEmail}</strong>
          </Typography>

          {/* Input Field */}
          <Box>
            <Typography variant="h5" mb={1}>
              Enter the 6-digit verification code
            </Typography>
            <TextField
              disabled={loading}
              error={error}
              helperText={error ? "Please enter a valid 6-digit code" : ""}
              fullWidth
              size="medium"
              name="emailCode"
              variant="outlined"
              label="Code"
              value={code}
              inputProps={{
                maxLength: 6,
                style: { letterSpacing: 4, textAlign: "center" },
              }}
              onChange={(e) => {
                setCode(e.target.value);
                setError(false);
              }}
            />
          </Box>

          {/* Buttons */}
          <Stack direction="column" spacing={2} mt={3}>
            <Button
              sx={{
                backgroundColor: color.ArtyClick[100],
              }}
              variant="contained"
              fullWidth
              onClick={() => handleSubmit(code)}
              disabled={loading}
            >
              <Typography variant="h6" color={color.text[100]}>
                Verify
              </Typography>
            </Button>
            <Button
              variant="text"
              fullWidth
              onClick={handleResend}
              disabled={resendCooldown}
            >
              {resendCooldown ? (
                <Typography variant="h6" color={color.text[100]}>
                  Please wait... {setTimeout((e) => {}, 15000)}
                </Typography>
              ) : (
                <Typography variant="h6" color={color.text[100]}>
                  Resend Code
                </Typography>
              )}
            </Button>
          </Stack>

          {/* Resend Message */}
          {resendMessage && (
            <Alert severity="info" sx={{ mt: 2 }}>
              {resendMessage}
            </Alert>
          )}

          {errorMsg && (
            <Typography variant="h6" color="error">
              {errorMsg}
            </Typography>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default EmailVerification;
