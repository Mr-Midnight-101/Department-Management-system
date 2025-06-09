/* eslint-disable no-unused-vars */
import {
  Alert,
  Box,
  Button,
  Dialog,
  TextField,
  Typography,
  useTheme,
  Backdrop,
  DialogContent,
} from "@mui/material";
import { getColorTokens } from "../../theme/theme";
import LogoSync from "../../components/LogoSync";
import { useState } from "react";
import { validInput } from "./validInput";
import { registerTeacher } from "../../services/teacher";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const colors = getColorTokens(useTheme().palette.mode);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [registerError, setRegisterError] = useState({});
  const [validationError, setValidationError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [file, setFile] = useState(null);
  const [resgiterLoading, setRegisterLoading] = useState(false);
  const [isError, setError] = useState(false);
  const [isSuccess, setSuccess] = useState(false);

  const handleRegister = async (formData, file) => {
    setRegisterLoading(true);
    setRegisterError({});
    setValidationError("");
    setSuccessMsg("");

    const validresponse = validInput(formData);
    if (Object.keys(validresponse).length > 0) {
      setRegisterLoading(false);
      setRegisterError(validresponse);
      setError(true);
      return;
    }

    try {
      const response = await registerTeacher(formData, file);
      if (response?.status == 201) {
        setSuccess(true);
        setSuccessMsg(response?.data?.message);
        setFormData({});
        setFile(null);
        setRegisterLoading(false);
        setTimeout(() => {
          navigate("/login");
        }, 5000);
        return;
      }
    } catch (error) {
      if (error?.status == 500) {
        setValidationError("Registration failed, please try again.");
      }
      setValidationError(
        error?.response?.data?.message || "Registration failed"
      );
      setRegisterLoading(false);
      setError(true);
    }
  };

  return (
    <Box
      overflow="hidden"
      m={0}
      p={0}
      width="100%"
      height="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      gap={2}
    >
      {/* Logo */}
      <Box>
        <LogoSync />
      </Box>

      {isSuccess && (
        <Backdrop
          sx={{
            color: "#fff",
            zIndex: "999",
          }}
          open={isSuccess}
        >
          <Alert variant="filled" severity="success">
            {successMsg}
            {"\n Redirecting to login.."}
          </Alert>
        </Backdrop>
      )}
      {/* register container */}
      <Box
        m={0}
        p={0}
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        gap={1}
      >
        {/* Heading */}
        <Box>
          <Typography variant="h2" fontWeight="400" color="text">
            Register Teacher
          </Typography>
        </Box>
        {validationError && (
          <Box>
            <Typography color="error" variant="h6">
              {validationError}
            </Typography>
          </Box>
        )}
        {successMsg && (
          <Box>
            <Typography color="success" variant="h6">
              {successMsg}
            </Typography>
          </Box>
        )}
        <Box
          //   bgcolor={colors.green[100]}
          width={{
            xs: "200px",
            sm: "400px",
          }}
          maxHeight="800px"
          sx={{
            display: "flex",

            justifyContent: "center",
            alignItems: "center",
            gap: 2,
            flexDirection: "column",
          }}
          component="form"
          encType="multipart/form-data"
        >
          <TextField
            error={!!registerError.nameError}
            // helperText={registerError.nameError}
            fullWidth
            size="small"
            name="teacherFullName"
            variant="outlined"
            label="Full name"
            value={formData?.teacherFullName || ""}
            onChange={(e) => {
              setFormData({
                ...formData,
                [e.target.name]: e.target.value,
              });
            }}
          />
          <TextField
            error={!!registerError.emailError}
            // helperText={registerError.emailError}
            fullWidth
            size="small"
            name="teacherEmail"
            variant="outlined"
            label="Email"
            value={formData?.teacherEmail || ""}
            onChange={(e) => {
              setFormData({
                ...formData,
                [e.target.name]: e.target.value,
              });
            }}
          />
          <TextField
            fullWidth
            error={!!registerError.usernameError}
            // helperText={registerError.usernameError}
            size="small"
            name="teacherUsername"
            variant="outlined"
            label="Username"
            value={formData?.teacherUsername || ""}
            onChange={(e) => {
              setFormData({
                ...formData,
                [e.target.name]: e.target.value,
              });
            }}
          />
          <TextField
            error={!!registerError.passError}
            // helperText={registerError.passError}
            fullWidth
            size="small"
            name="teacherPassword"
            variant="outlined"
            label="Password"
            value={formData?.teacherPassword || ""}
            onChange={(e) => {
              setFormData({
                ...formData,
                [e.target.name]: e.target.value,
              });
            }}
          />
          <TextField
            fullWidth
            error={!!registerError.idError}
            // helperText={registerError.idError}
            name="teacherId"
            size="small"
            variant="outlined"
            label="Teacher ID"
            value={formData?.teacherId || ""}
            onChange={(e) => {
              setFormData({
                ...formData,
                [e.target.name]: e.target.value,
              });
            }}
          />
          <TextField
            fullWidth
            error={!!registerError.contactError}
            // helperText={registerError.contactError}
            size="small"
            name="teacherContactInfo"
            variant="outlined"
            label="Contact no."
            value={formData?.teacherContactInfo || ""}
            onChange={(e) => {
              console.log(e);

              setFormData({
                ...formData,
                [e.target.name]: e.target.value,
              });
            }}
          />
          <Box
            width="100%"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            border="1px solid rgba(255,255,255,0.3)"
            padding="6px 8px"
            borderRadius="4px"
          >
            <Typography
              fontSize="13.5px"
              fontWeight="400"
              sx={{
                m: "0 2px",
                color: colors.grey[700],
              }}
            >
              {" "}
              Profile photo
            </Typography>
            <TextField
              slotProps={{
                input: { disableUnderline: true },
              }}
              variant="standard"
              required
              sx={{
                m: "0 2px",
                p: 0,
                width: {
                  xs: "90px",
                  sm: "208px",
                },
              }}
              type="file"
              size="small"
              name="teacherAvatar"
              value={formData?.teacherAvatar}
              onChange={(e) => {
                setFile(e.target.files[0]);
              }}
            />
          </Box>
        </Box>
      </Box>
      <Box>
        <Button
          sx={{
            background: colors.gradient[100],
          }}
          onClick={() => {
            handleRegister(formData, file);
          }}
          disabled={resgiterLoading}
        >
          <Typography
            sx={{ p: "2px 12px", color: colors.text[100] }}
            variant="h5"
          >
            {resgiterLoading ? "Registering..." : "Register"}
          </Typography>
        </Button>
      </Box>
    </Box>
  );
};

export default Register;
