/* eslint-disable no-unused-vars */
export const subjectValidation = (form) => {
  const err = {};

  if (!form?.subjectCode) {
    err.codeError = "Subject code is required.";
  }
  if (!form?.subjectName) {
    err.nameError = "Subject name is required.";
  }
  if (!form?.subjectMaxMarksTheory || form.subjectMaxMarksTheory == null) {
    err.theoryError = "Maximum theory marks are required.";
  }
  if (
    !form?.subjectMaxMarksPractical ||
    form.subjectMaxMarksPractical == null
  ) {
    err.practicalError = "Maximum practical marks are required.";
  }
  if (!form?.subjectCreditPoints || form.subjectCreditPoints == null) {
    err.creditError = "Credit points are required.";
  }
  return err;
};
