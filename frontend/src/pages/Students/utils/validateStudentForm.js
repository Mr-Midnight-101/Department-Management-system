const validateStudentForm = (form) => {
  const errors = {};
  if (
    !form.studentFullName ||
    !form.studentDateOfBirth ||
    !form.studentEnrollmentNumber ||
    !form.studentRollNumber ||
    !form.studentEmail ||
    !form.studentContactNumber ||
    !form.studentFatherName ||
    !form.studentCategory ||
    !form.studentType ||
    !form.studentAdmissionYear ||
    !form.studentAddress?.city ||
    !form.studentAddress?.state ||
    !form.studentAddress?.country ||
    !form.studentAddress?.postalCode
  ) {
    errors.allFields = "All fields are required.";
  }
  // Email format check
  if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.studentEmail)) {
    errors.emailError = "Invalid email format";
  }
  // Admission year check
  if (
    isNaN(form.studentAdmissionYear) ||
    form.studentAdmissionYear < 1900 ||
    form.studentAdmissionYear > new Date().getFullYear() + 1
  ) {
    errors.admissionYearError = "Invalid admission year";
  }
  // Date of birth check
  if (isNaN(Date.parse(form.studentDateOfBirth))) {
    errors.dobError = "Invalid date of birth";
  } else {
    const dob = new Date(form.studentDateOfBirth);
    const year = dob.getFullYear();
    const currentYear = new Date().getFullYear();
    if (year < 1980 || year > currentYear) {
      errors.dobError = `Date of birth must be between 1980 and ${currentYear}`;
    }
  }
  return errors;
};

export default validateStudentForm;
