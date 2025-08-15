import PropTypes from 'prop-types';
import React from 'react';
import { useContext } from 'react';
// import { MyContext } from '../../context';
import { MyContext } from '../../../context';

import { useNavigate } from 'react-router-dom';

import { useEffect } from 'react';

import { Link as RouterLink } from 'react-router-dom';

// material-ui
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third-party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import IconButton from 'components/@extended/IconButton';
import AnimateButton from 'components/@extended/AnimateButton';

// assets
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';

// ============================|| JWT - LOGIN ||============================ //

export default function AuthLogin({ isDemo = false }) {
  const navigate = useNavigate();

  const { data, setData } = useContext(MyContext);

  useEffect(() => {
    console.log('valor', data);
  }, [data]);

  const [checked, setChecked] = React.useState(false);

  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <>
      <Formik
        initialValues={{
          email: '',
          password: ''
        }}
        validationSchema={Yup.object().shape({
          // email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          password: Yup.string()
            .required('Password is required')
            .test('no-leading-trailing-whitespace', 'Password cannot start or end with spaces', (value) => value === value.trim())
            .max(10, 'Password must be less than 10 characters')
        })}
        onSubmit={async (values, { setSubmitting, setErrors }) => {
          try {
            // const response = await fetch('http://localhost:3001/user/login', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify({
            //     email: values.email,
            //     password: values.password
            //   })
            // });
            // console.log('Esperando respuesta');
            // const data = await response.json();
            // console.log('Despues de respuesta');
            // console.log(JSON.parse(data.resultado).recordset[0]);
            // console.log('recordset 1');
            // console.log(typeof JSON.parse(data.resultado).recordsets[1][0]);
            // console.log(JSON.parse(data.resultado).recordsets[1][0]);
            // console.log(JSON.parse(Object.values(JSON.parse(data.resultado).recordsets[1][0])[0]).Menu);
            // setData({
            //   ...data,
            //   ...JSON.parse(data.resultado).recordset[0],
            //   menu: JSON.parse(Object.values(JSON.parse(data.resultado).recordsets[1][0])[0]).Menu
            // });

            // navigate('/user-page');

            if (response.ok && data.success) {
              console.log('✅ Login successful!', data);
              // Optional: save token
              // localStorage.setItem('token', data.token);
              // Redirect: navigate('/dashboard');
            } else {
              setErrors({ submit: data.message || 'Login failed' });
            }
          } catch (error) {
            setErrors({ submit: 'Unable to connect to server. Is it running?' });
            console.error('🚨 Login error:', error);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ errors, handleBlur, handleChange, touched, values, isSubmitting, handleSubmit }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid size={12}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel sx={{ color: 'white' }} htmlFor="email-login">
                    Usuario
                  </InputLabel>
                  <OutlinedInput
                    sx={{ backgroundColor: 'white' }}
                    id="email-login"
                    type="email"
                    value={values.email}
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Usuario"
                    fullWidth
                    error={Boolean(touched.email && errors.email)}
                  />
                </Stack>
                {touched.email && errors.email && (
                  <FormHelperText error id="standard-weight-helper-text-email-login">
                    {errors.email}
                  </FormHelperText>
                )}
              </Grid>
              <Grid size={12}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel sx={{ color: 'white' }} htmlFor="password-login">
                    Contraseña
                  </InputLabel>
                  <OutlinedInput
                    sx={{ backgroundColor: 'white' }}
                    fullWidth
                    error={Boolean(touched.password && errors.password)}
                    id="-password-login"
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
                  />
                </Stack>
                {touched.password && errors.password && (
                  <FormHelperText error id="standard-weight-helper-text-password-login">
                    {errors.password}
                  </FormHelperText>
                )}
              </Grid>
              <Grid sx={{ mt: -1 }} size={12}>
                <Stack direction="row" sx={{ gap: 2, alignItems: 'baseline', justifyContent: 'space-between' }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={checked}
                        onChange={(event) => setChecked(event.target.checked)}
                        name="checked"
                        color="primary"
                        size="small"
                      />
                    }
                    label={<Typography variant="h6">Mantenerme conectado</Typography>}
                  />
                  <Link sx={{ color: 'white' }} variant="h6" component={RouterLink} to="#" color="text.primary">
                    Recuperar contraseña
                  </Link>
                </Stack>
              </Grid>
              <Grid size={12}>
                <AnimateButton>
                  <Button type="submit" fullWidth size="large" variant="contained" color="primary">
                    Login
                    {/* {isSubmitting ? 'Logging in...' : 'Login'} */}
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
}

AuthLogin.propTypes = { isDemo: PropTypes.bool };
