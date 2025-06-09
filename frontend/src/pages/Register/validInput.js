export const validInput = (form) => {
  const err = {};

  console.log("form data Inside Validation: ", form);

  if (!form.teacherFullName) {
    err.nameError = "Full name is required";
  }
  if (!form.teacherEmail) {
    err.emailError = "Email is required";
  }
  if (!form.teacherUsername) {
    err.usernameError = "Username is required";
  }
  if (!form.teacherId) {
    err.idError = "UserId is required";
  }
  if (!form.teacherPassword) {
    err.passError = "Password is required";
  }
  if (!form.teacherContactInfo) {
    err.contactError = "Contact number is required";
  }
  console.log("form errors: ", err);

  return err;
};
