/* eslint-disable no-unused-vars */
import { Box, Button, TextField, Typography, useTheme } from "@mui/material";
import { getColorTokens } from "../../theme/theme";
import { createContext, useContext, useState } from "react";
import { loginTeacher } from "../../services/teacher";
import LogoSync from "../../components/LogoSync";
import { useNavigate } from "react-router-dom";
import Front from "../Spline/Front";
import UserProvider, { UserContext } from "../UserContext/UserContext";

const Login = () => {
  const colors = getColorTokens(useTheme().palette.mode);
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [isAuthenticated, setAuthenticated] = useState("");
  const [isEmailLogin, setEmailLogin] = useState(false);
  const [isLoginError, setLoginError] = useState("");

  const { updateUser } = useContext(UserContext);

  const handlerLogin = async (loginData) => {
    setLoginError("");
    setAuthenticated("");
    let teacher;
    if (loginData?.teacherEmail && isEmailLogin) {
      teacher = {
        ...loginData,
        teacherUsername: null,
        teacherEmail: loginData?.teacherEmail,
        teacherPassword: loginData?.teacherPassword,
      };
    } else {
      teacher = {
        ...loginData,
        teacherEmail: null,
        teacherUsername: loginData?.teacherUsername,
        teacherPassword: loginData?.teacherPassword,
      };
    }
    console.log(teacher);

    try {
      const logged = await loginTeacher(teacher);
      // console.log("response", logged);
      if (logged?.status == 200) {
        setAuthenticated(logged?.data?.message);
        navigate("/");
        updateUser(logged.data.data);
      }
    } catch (error) {
      console.log(error);
      setLoginError(error.response?.data?.message || "Something went wrong!");
    }
  };

  const handleSignUp = () => {
    setTimeout(() => {
      navigate("/register");
    }, 1000);
  };

  return (
    <Box
      position="relative"
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="100%"
      height="100%"
    >
      {/* border-radius: 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(35px);
  border: 2px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 80px rgba(0, 0, 0, 0.25); */}
      <Box
        sx={{
          position: {
            xs: "absolute",
            md: "static",
          },
          background: {
            xs: "rgb(0, 0, 0, 0.1)",
            md: "transparent",
          },
          backdropFilter: {
            xs: "blur(4px)",
            md: "none",
          },
        }}
        overflow="hidden"
        display="flex"
        justifyContent="center"
        alignItems="center"
        width="100%"
        height="100%"
        flexDirection="column"
      >
        <Box mt={2}>
          <LogoSync />
        </Box>

        {isLoginError && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              // backgroundColor: "green",
              width: "80%",
              textAlign: "center",
            }}
          >
            <Typography color="error" variant="h5">
              {isLoginError}
            </Typography>
          </Box>
        )}
        {isAuthenticated && (
          <Box display="flex" justifyContent="center" alignItems="center">
            <Typography color="success" variant="h5">
              {isAuthenticated}
            </Typography>
          </Box>
        )}

        <Box
          maxWidth="480px"
          maxHeight="480px"
          p={{ xs: 2, lg: 4 }}
          gap={4}
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
        >
          <Box display="flex" justifyContent="center" alignItems="center">
            <Typography variant="h2" fontWeight="600">
              Login to your account
            </Typography>
          </Box>

          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            gap={4}
          >
            <Box
              display="flex"
              flexDirection="column"
              gap={2}
              width={{ xs: "240px", sm: "400px" }}
            >
              {isEmailLogin ? (
                <TextField
                  label="Email"
                  required
                  variant="outlined"
                  name="teacherEmail"
                  value={user.teacherEmail || ""}
                  onChange={(e) =>
                    setUser({ ...user, [e.target.name]: e.target.value })
                  }
                />
              ) : (
                <TextField
                  label="Username"
                  required
                  variant="outlined"
                  name="teacherUsername"
                  value={user.teacherUsername || ""}
                  onChange={(e) =>
                    setUser({ ...user, [e.target.name]: e.target.value })
                  }
                />
              )}

              <TextField
                label="Password"
                required
                variant="outlined"
                name="teacherPassword"
                value={user.teacherPassword || ""}
                onChange={(e) =>
                  setUser({ ...user, [e.target.name]: e.target.value })
                }
              />
            </Box>

            <Button
              sx={{
                background: colors.gradient[100],
                m: 0,
                p: 0,
                "&:hover": {},
                // background: "rgba(255, 255, 255, 0.03)",
                boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
                backdropFilter: "blur(0.2px)",
                borderRadius: "4px",
                border: "1px solid rgba(255, 255, 255, 0.15)",
              }}
              onClick={() => {
                handlerLogin(user);
              }}
            >
              <Typography
                sx={{ p: 1.1, width: "180px" }}
                variant="h5"
                color={colors.text[100]}
              >
                Login
              </Typography>
            </Button>
          </Box>

          <Box display="flex" justifyContent="center" alignItems="center">
            <Typography color="text" variant="h5">
              Don't have an account?
            </Typography>
            <Button onClick={handleSignUp}>
              <Typography color="pink" variant="h5">
                Sign up
              </Typography>
            </Button>
          </Box>

          <Box display="flex" justifyContent="center" alignItems="center">
            <Button
              onClick={() => {
                setEmailLogin((prev) => !prev);
                setUser({});
              }}
            >
              <Typography color="pink" variant="h5">
                {isEmailLogin ? "Login using username" : "Login using email"}
              </Typography>
            </Button>
          </Box>
        </Box>
      </Box>
      {/* <Box display="flex" width="100%" height="100%">
        <Front />
      </Box> */}
    </Box>
  );
};

export default Login;
