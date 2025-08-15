import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';

// Material UI
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
  Link as MuiLink
} from '@mui/material';

// Project components
import IconButton from 'components/@extended/IconButton';
import AnimateButton from 'components/@extended/AnimateButton';

// Icons
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';

// Auth Hook
import useAuth from 'hooks/useAuth';
import { Link as RouterLink } from 'react-router-dom';

// ============================|| JWT - LOGIN ||============================ //

const AuthLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ Use the real login from JWTContext

  const [checked, setChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <Formik
      initialValues={{
        email: '',
        password: ''
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string().required('Usuario es requerido'),
        password: Yup.string() // still required, even if not used yet
          .required('Contraseña es requerida')
          .max(10, 'Máximo 10 caracteres')
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          // ✅ This will call /api/account/login → proxied to /user/login
          await login(values.email, values.password);

          // ✅ Login succeeded — go to your page
          navigate('/user-page', { replace: true });

          setStatus({ success: true });
          setSubmitting(false);
        } catch (err) {
          // ❌ Login failed — show error
          setStatus({ success: false });
          setErrors({ submit: err.message || 'Login failed' });
          setSubmitting(false);
        }
      }}
    >
      {({ errors, touched, values, handleSubmit, isSubmitting, handleChange, handleBlur }) => (
        <form noValidate onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Email/Usuario Field */}
            <Grid size={12}>
              <Stack sx={{ gap: 1 }}>
                <InputLabel sx={{ color: 'white' }} htmlFor="email-login">
                  Usuario
                </InputLabel>
                <OutlinedInput
                  sx={{ backgroundColor: 'white' }}
                  fullWidth
                  id="email-login"
                  type="text"
                  value={values.email}
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Ingrese su usuario"
                  error={Boolean(touched.email && errors.email)}
                />
              </Stack>
              {touched.email && errors.email && (
                <FormHelperText error>{errors.email}</FormHelperText>
              )}
            </Grid>

            {/* Password Field */}
            <Grid size={12}>
              <Stack sx={{ gap: 1 }}>
                <InputLabel sx={{ color: 'white' }} htmlFor="password-login">
                  Contraseña
                </InputLabel>
                <OutlinedInput
                  sx={{ backgroundColor: 'white' }}
                  fullWidth
                  id="password-login"
                  type={showPassword ? 'text' : 'password'}
                  value={values.password}
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        color="secondary"
                      >
                        {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                      </IconButton>
                    </InputAdornment>
                  }
                  placeholder="Contraseña aquí"
                  error={Boolean(touched.password && errors.password)}
                />
              </Stack>
              {touched.password && errors.password && (
                <FormHelperText error>{errors.password}</FormHelperText>
              )}
            </Grid>

            {/* Remember me + Forgot */}
            <Grid size={12}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mt: -1 }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checked}
                      onChange={(e) => setChecked(e.target.checked)}
                      name="checked"
                      color="primary"
                      size="small"
                    />
                  }
                  label={<Typography variant="h6">Mantenerme conectado</Typography>}
                />
                <MuiLink
                  component={RouterLink}
                  to="#"
                  color="white"
                  variant="h6"
                >
                  Recuperar contraseña
                </MuiLink>
              </Stack>
            </Grid>

            {/* Submit Button */}
            <Grid size={12}>
              <AnimateButton>
                <Button
                  disableElevation
                  disabled={isSubmitting}
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  {isSubmitting ? 'Iniciando...' : 'Login'}
                </Button>
              </AnimateButton>
            </Grid>

            {/* Error Message */}
            {errors.submit && (
              <Grid size={12}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Grid>
            )}
          </Grid>
        </form>
      )}
    </Formik>
  );
};

export default AuthLogin;