import * as Yup from "yup";

const email = Yup.string()
  .trim()
  .email("Enter a valid email address")
  .required("Email address is required");

export const SignInSchema = Yup.object({
  email,
  password: Yup.string().required("Password is required"),
  keepLoggedIn: Yup.boolean(),
});

export const EmailSignInSchema = Yup.object({
  email,
  acceptTerms: Yup.boolean().oneOf(
    [true],
    "Please accept the Terms & Conditions and Privacy Policy"
  ),
});

export const SignUpSchema = Yup.object({
  fullName: Yup.string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .required("Full name is required"),
  email,
  // react-phone-input-2 returns digits only, including the country code.
  phone: Yup.string()
    .matches(/^\d{10,15}$/, "Enter a valid phone number")
    .required("Phone number is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

export const RoleSchema = Yup.object({
  companyName: Yup.string().trim().required("Company name is required"),
  designation: Yup.string().trim().required("Designation is required"),
});

export const ForgotPasswordSchema = Yup.object({
  email,
});
