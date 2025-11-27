import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import { useFormik } from 'formik';
import { basicSchema } from '../schemas';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabase-client';
import { useNavigate } from 'react-router-dom';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

export const SignUp = () => {
    const { signUpNewUser } = useAuth();
    const navigate = useNavigate();

    const { values, handleBlur, handleChange, handleSubmit, touched, errors, setErrors } = useFormik({
        initialValues: {
            email: "",
            password: "",
            confirmPassword: "",
        },
        validationSchema: basicSchema,
        onSubmit: async (values) => {
            try {
                const { data: emailExists, error: rpcError } = await supabase
                    .rpc('check_email_exists', { email_to_check: values.email});
                if (rpcError) console.error("RPC error:", rpcError);

                if (emailExists) {
                    setErrors({ email: "An account with this email already exists" });
                    return;
                }

                const { error } = await signUpNewUser(values.email, values.password);

                if (error) {
                    alert("Registration failed: " + error.message);
                } else {
                    alert("Your account has been created!");
                    navigate('/sign-in');
                }
            } catch (err) {
                console.error("An unexpected error occurred:", err);
            }
        },
    });


  return (
    <>
      <SignUpContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            Sign up
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <FormControl>
              <FormLabel>Email</FormLabel>
              <TextField
                type='email'
                fullWidth
                placeholder="your@email.com"
                name="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && Boolean(errors.email)}
              />
              {errors.email && touched.email && <Typography color="error" variant="body2">{errors.email}</Typography>}
            </FormControl>
            <FormControl>
              <FormLabel>Password</FormLabel>
              <TextField
                fullWidth
                name="password"
                placeholder="••••••"
                type="password"
                variant="outlined"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password && Boolean(errors.password)}
              />
            {errors.password && touched.password && <Typography color="error" variant="body2">{errors.password}</Typography>}
            </FormControl>
            <FormControl>
                <FormLabel>Confirm Password</FormLabel>
                <TextField
                    fullWidth
                    name="confirmPassword"
                    placeholder="••••••"
                    type="password"
                    variant="outlined"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                />
            </FormControl>
            {errors.confirmPassword && touched.confirmPassword && <Typography color="error" variant="body2">{errors.confirmPassword}</Typography>}
            <Button
              type="submit"
              fullWidth
              variant="contained"
            >
              Sign up
            </Button>
          </Box>
          <Divider>
            <Typography sx={{ color: 'text.secondary' }}>or</Typography>
          </Divider>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography sx={{ textAlign: 'center' }}>
              Already have an account?{' '}
              <Link
                href="/sign-in"
                variant="body2"
                sx={{ alignSelf: 'center' }}
              >
                Sign in
              </Link>
            </Typography>
          </Box>
        </Card>
      </SignUpContainer>
      </>
  );
}
