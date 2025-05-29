/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import {
  Box,
  useTheme,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Typography,
  Button,
  MenuItem,
} from "@mui/material";
import { getColorTokens } from "../../theme/theme";
import { studentRegister } from "../../services/student";
import CancelIcon from "@mui/icons-material/Cancel";

const RegisterStudent = ({ openRegister, closeRegister, helper, err }) => {
  const theme = useTheme();
  const colors = getColorTokens(theme.palette.mode);
  const [registerData, setregisterData] = useState({});

  const categories = [
    {
      label: "GEN",
      value: "GEN",
    },
    {
      label: "OBC",
      value: "OBC",
    },
    {
      label: "SC",
      value: "SC",
    },
    {
      label: "ST",
      value: "ST",
    },
    {
      label: "OTHER",
      value: "OTHER",
    },
  ];
  const studentTypes = [
    {
      label: "Regular",
      value: "Regular",
    },
    {
      label: "Private",
      value: "Private",
    },
    {
      label: "International",
      value: "International",
    },
  ];

  const handleRegisterStudent = async (registerData) => {
    console.log("this is from handle register in register:", registerData);

    try {
      const response = await studentRegister(registerData);
      if (!response) return;
      console.log("Register", response);
      closeRegister();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box
      sx={{
        "& .MuiTextField-input:focus": {
          color: colors.grey[100],
        },
      }}
    >
      <Dialog
        scroll="paper"
        maxWidth="lg"
        open={openRegister}
        onClose={closeRegister}
        slotProps={{
          paper: {
            sx: {
              width: {
                xs: "80vw", // small devices
                sm: "40vw", // tablets
                md: "40vw", // medium and up
              },
              height: {
                xs: "80vh",
                sm: "70vh",
                md: "60vh",
              },
              p: 2,
            },
          },
        }}
      >
        {/* heading and close button */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Typography variant="h5">Register New Student</Typography>
          <IconButton
            onClick={() => {
              closeRegister();
            }}
          >
            <CancelIcon />
          </IconButton>
        </Box>
        <DialogContent>
          <Box
            display="flex"
            flexDirection="column"
            gap="12px"
            sx={{
              flex: 1,
            }}
          >
            <TextField
              size="medium"
              label="Full Name"
              required
              variant="outlined"
              helperText={helper}
              error={err}
              name="fullName"
              onChange={(e) =>
                setregisterData({
                  ...registerData,
                  [e.target.name]: e.target.value,
                })
              }
            />
            <TextField
              size="medium"
              label="Date of birth"
              type="date"
              required
              variant="outlined"
              helperText={helper}
              error={err}
              InputLabelProps={{
                shrink: true, // still valid and needed
              }}
              name="dateOfBirth"
              onChange={(e) =>
                setregisterData({
                  ...registerData,
                  [e.target.name]: e.target.value,
                })
              }
            />
            <TextField
              size="medium"
              label="Enrollment No."
              required
              variant="outlined"
              helperText={helper}
              error={err}
              name="enrollmentNo"
              onChange={(e) =>
                setregisterData({
                  ...registerData,
                  [e.target.name]: e.target.value,
                })
              }
            />
            <TextField
              size="medium"
              label="Roll No."
              required
              variant="outlined"
              helperText={helper}
              error={err}
              name="rollNo"
              onChange={(e) =>
                setregisterData({
                  ...registerData,
                  [e.target.name]: e.target.value,
                })
              }
            />
            <TextField
              size="medium"
              type="email"
              label="Email ID"
              required
              variant="outlined"
              helperText={helper}
              error={err}
              name="email"
              onChange={(e) =>
                setregisterData({
                  ...registerData,
                  [e.target.name]: e.target.value,
                })
              }
            />
            <TextField
              size="medium"
              label="Contact"
              required
              variant="outlined"
              helperText={helper}
              error={err}
              name="contactInfo"
              onChange={(e) =>
                setregisterData({
                  ...registerData,
                  [e.target.name]: e.target.value,
                })
              }
            />
            <TextField
              size="medium"
              label="Father's Name"
              required
              variant="outlined"
              helperText={helper}
              error={err}
              name="fatherName"
              onChange={(e) =>
                setregisterData({
                  ...registerData,
                  [e.target.name]: e.target.value,
                })
              }
            />
            <TextField
              size="medium"
              label="City"
              required
              variant="outlined"
              helperText={helper}
              error={err}
              name="city"
              onChange={(e) =>
                setregisterData({
                  ...registerData,
                  fullAdd: {
                    ...registerData.fullAdd,
                    [e.target.name]: e.target.value,
                  },
                })
              }
            />
            <TextField
              size="medium"
              label="State"
              required
              variant="outlined"
              helperText={helper}
              error={err}
              name="state"
              onChange={(e) =>
                setregisterData({
                  ...registerData,
                  fullAdd: {
                    ...registerData.fullAdd,
                    [e.target.name]: e.target.value,
                  },
                })
              }
            />
            <TextField
              size="medium"
              label="Country"
              required
              variant="outlined"
              helperText={helper}
              error={err}
              name="country"
              onChange={(e) =>
                setregisterData({
                  ...registerData,
                  fullAdd: {
                    ...registerData.fullAdd,
                    [e.target.name]: e.target.value || "India",
                  },
                })
              }
            />
            <TextField
              size="medium"
              label="Category"
              required
              select
              variant="outlined"
              helperText={helper}
              error={err}
              name="category"
              onChange={(e) =>
                setregisterData({
                  ...registerData,
                  [e.target.name]: e.target.value,
                })
              }
            >
              {categories.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              size="medium"
              label="Student Type"
              required
              select
              variant="outlined"
              helperText={helper}
              error={err}
              name="studentType"
              onChange={(e) =>
                setregisterData({
                  ...registerData,
                  [e.target.name]: e.target.value,
                })
              }
            >
              {studentTypes.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              size="medium"
              label="Admission Year"
              required
              variant="outlined"
              helperText={helper}
              error={err}
              name="admissionYear"
              onChange={(e) =>
                setregisterData({
                  ...registerData,
                  [e.target.name]: e.target.value,
                })
              }
            />
            <TextField
              size="medium"
              label="Postal Code"
              variant="outlined"
              name="postalCode"
              onChange={(e) =>
                setregisterData({
                  ...registerData,
                  fullAdd: {
                    ...registerData.fullAdd,
                    postalCode: e.target.value,
                  },
                })
              }
            />
          </Box>
        </DialogContent>
        <Box display="flex" justifyContent="center">
          <DialogActions>
            <Button
              onClick={() => handleRegisterStudent(registerData)}
              sx={{
                color: colors.grey[800],
                background: colors.grey[400],
              }}
            >
              <Typography>Register</Typography>
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};

export default RegisterStudent;
