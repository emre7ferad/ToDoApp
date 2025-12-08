import * as yup from 'yup';

const passwordRules = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

export const basicSchema = yup.object().shape({
  email: yup.string().email("Enter a valid email").required(),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(passwordRules, {message: "Password must contain at least one uppercase, one lowercase, and one number"})
    .required(),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), undefined], 'Passwords don\'t   match')
    .required('Confirm Password is required'),
});

export const signInSchema = yup.object().shape({
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .required("Password is required"),
});

export const taskSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  descrition: yup.string(),
  due_date: yup.string(),
  priority: yup.string().required("Priority is required"),
  status: yup.string(),
  goal_id: yup.string().required("Linked Goal is required"),
})