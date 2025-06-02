const validateStudentForm = (form) => {
  if (
    !form.fullName ||
    !form.dateOfBirth ||
    !form.enrollmentNo ||
    !form.rollNo ||
    !form.email ||
    !form.contactInfo ||
    !form.fatherName ||
    !form.category ||
    !form.studentType ||
    !form.admissionYear ||
    !form.fullAdd?.city ||
    !form.fullAdd?.state ||
    !form.fullAdd?.country ||
    !form.fullAdd?.postalCode
  ) {
    return "All fields are required.";
  }
  // Email format check
  if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.email)) {
    return "Invalid email format.";
  }
  // Admission year check
  if (
    isNaN(form.admissionYear) ||
    form.admissionYear < 1900 ||
    form.admissionYear > new Date().getFullYear() + 1
  ) {
    return "Invalid admission year.";
  }
  // Date of birth check
  if (isNaN(Date.parse(form.dateOfBirth))) {
    return "Invalid date of birth.";
  }
  return "";
};

export default validateStudentForm;
