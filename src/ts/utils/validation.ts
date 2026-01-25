export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@(stud\.noroff\.no|noroff\.no)$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): boolean {
  return password.length >= 8;
}

export function validateConfirmPassword(
  password: string,
  confirmPassword: string,
): boolean {
  return password === confirmPassword;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

interface FormValidationResult {
  isValid: boolean;
  errors: FormErrors;
}

export function validateForm(
  email: string,
  password: string,
  confirmPassword?: string,
): FormValidationResult {
  const errors: FormErrors = {};

  if (!validateEmail(email)) {
    errors.email = "Please enter a valid Noroff email address";
  }

  if (!validatePassword(password)) {
    errors.password = "Password must be at least 8 characters";
  }

  if (
    confirmPassword !== undefined &&
    !validateConfirmPassword(password, confirmPassword)
  ) {
    errors.confirmPassword = "Passwords do not match";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
