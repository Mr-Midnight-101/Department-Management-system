const validateStudentForm = (form) => {
  console.log("validation form: ", form);
  const errors = {};
  //Full Name
  if (!form.studentFullName?.trim()) {
    errors.nameError = "Full name is required.";
  }
  //course
  if (!form.studentFullName?.trim()) {
    errors.courseError = "Course is required.";
  }

  // Date of Birth
  if (!form.studentDateOfBirth) {
    errors.dobError = "Date of birth is required.";
  } else {
    const dob = new Date(form.studentDateOfBirth);
    const year = dob.getFullYear();
    const currentYear = new Date().getFullYear();
    if (isNaN(dob)) {
      errors.dobError = "Invalid date of birth.";
    } else if (year < 1980 || year > currentYear) {
      errors.dobError = `Date of birth must be between 1980 and ${currentYear}.`;
    }
  }

  // Enrollment Number
  if (!form.studentEnrollmentNumber?.trim()) {
    errors.enrollError = "Enrollment number is required.";
  }

  // Roll Number
  if (!form.studentRollNumber?.trim()) {
    errors.rollError = "Roll number is required.";
  }

  // Email
  if (!form.studentEmail?.trim()) {
    errors.emailError = "Email is required.";
  } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.studentEmail)) {
    errors.emailError = "Invalid email format.";
  }

  // Contact Number
  if (!form.studentContactNumber?.trim()) {
    errors.contactError = "Contact number is required.";
  }

  // Father's Name
  if (!form.studentFatherName?.trim()) {
    errors.fnameError = "Father's name is required.";
  }

  // Category
  if (!form.studentCategory?.trim()) {
    errors.categoryErro = "Category is required.";
  }

  // Student Type
  if (!form.studentType?.trim()) {
    errors.studentTypeError = "Student type is required.";
  }

  // Admission Year
  if (!form.studentAdmissionYear) {
    errors.admissionYearError = "Admission year is required.";
  } else if (
    isNaN(form.studentAdmissionYear) ||
    form.admissionYear < 1900 ||
    form.admissionYear > new Date().getFullYear() + 1
  ) {
    errors.admissionYearError = "Invalid admission year.";
  }

  // Address fields
  const address = form.studentAddress || {};
  if (!address.city?.trim()) {
    errors.cityError = "City is required.";
  }
  if (!address.state?.trim()) {
    errors.stateError = "State is required.";
  }
  if (!address.country?.trim()) {
    errors.countryError = "Country is required.";
  }
  if (!address.postalCode?.trim()) {
    errors.postalCodeError = "Postal code is required.";
  }
  return errors;
};

export default validateStudentForm;
