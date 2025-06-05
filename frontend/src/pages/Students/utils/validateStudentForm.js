const validateStudentForm = (form) => {
  console.log("validation form: ", form);
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
  //Full Name
  if (!form.studentFullName?.trim()) {
    errors.nameError = "Full name is required.";
    console.log("name error:", errors.nameError);
  }

  // Date of Birth
  if (!form.studentDateOfBirth) {
    errors.dobError = "Date of birth is required.";
    console.log("dob error is required:", errors.dobError);
  } else {
    const dob = new Date(form.studentDateOfBirth);
    const year = dob.getFullYear();
    const currentYear = new Date().getFullYear();
    if (isNaN(dob)) {
      errors.dobError = "Invalid date of birth.";
      console.log("dob error invalid date:", errors.dobError);
    } else if (year < 1980 || year > currentYear) {
      errors.dobError = `Date of birth must be between 1980 and ${currentYear}.`;
      console.log("dob error between:", errors.dobError);
    }
  }

  // Enrollment Number
  if (!form.studentEnrollmentNumber?.trim()) {
    errors.enrollError = "Enrollment number is required.";
    console.log("enroll error:", errors.enrollError);
  }

  // Roll Number
  if (!form.studentRollNumber?.trim()) {
    errors.rollError = "Roll number is required.";
    console.log("roll error:", errors.rollError);
  }

  // Email
  if (!form.studentEmail?.trim()) {
    errors.emailError = "Email is required.";
  } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.studentEmail)) {
    errors.emailError = "Invalid email format.";
    console.log("email error:", errors.emailError);
  }

  // Contact Number
  if (!form.studentContactNumber?.trim()) {
    errors.contactError = "Contact number is required.";
    console.log("contact error:", errors.contactError);
  }

  // Father's Name
  if (!form.studentFatherName?.trim()) {
    errors.fnameError = "Father's name is required.";
    console.log("fname error:", errors.fnameError);
  }

  // Category
  if (!form.studentCategory?.trim()) {
    errors.categoryErro = "Category is required.";
    console.log("category error:", errors.categoryErro);
  }

  // Student Type
  if (!form.studentType?.trim()) {
    errors.studentTypeError = "Student type is required.";
    console.log("type error:", errors.studentTypeError);
  }

  // Admission Year
  if (!form.studentAdmissionYear) {
    errors.admissionYearError = "Admission year is required.";
    console.log("add year error:", errors.admissionYearError);
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
    console.log("city error:", errors.cityError);
  }
  if (!address.state?.trim()) {
    errors.stateError = "State is required.";
    console.log("state error:", errors.stateError);
  }
  if (!address.country?.trim()) {
    errors.countryError = "Country is required.";
    console.log("country error:", errors.countryError);
  }
  if (!address.postalCode?.trim()) {
    errors.postalCodeError = "Postal code is required.";
    console.log("postal error:", errors.postalCodeError);
  }

  console.log("validation funtion overtime to return", errors);
  return errors;
};

export default validateStudentForm;
