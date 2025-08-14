import PropTypes from 'prop-types';
import React from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';

//Hook permite dar acceso a valores de un contexto proporcionado por el componente Provider
import { useContext } from 'react';
//Archivo contexto
import { MyContext } from '../../../context';
//Hook para navegacion
import { useNavigate } from 'react-router-dom';
//Hook para efectos secundarios al montar,acualizar o desmontar componentes
import { useEffect } from 'react';


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
import { preload } from 'swr';

// project imports
import IconButton from 'components/@extended/IconButton';
import AnimateButton from 'components/@extended/AnimateButton';

import useAuth from 'hooks/useAuth';

import { fetcher } from 'utils/axios';

// assets
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';

// ============================|| JWT - LOGIN ||============================ //

export default function AuthLogin({ isDemo = false }) {
  //Para navegar a otra url despues de iniciar sesion con credenciales correctas
  const navigate = useNavigate();

  //Contexto de informacion de login
  const { data, setData } = useContext(MyContext);

  //Cuando el componente se monta o cambia el valor de data, realiza un console.log para conocer el valor de data
  useEffect(() => {
    console.log('valor', data);
  }, [data]);















  const [checked, setChecked] = React.useState(false);

  const { login } = useAuth();

  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const [searchParams] = useSearchParams();
  const auth = searchParams.get('auth'); // get auth and set route based on that

  return (
    <>
      <Formik
        initialValues={{
          email: 'info@codedthemes.com',
          password: '123456',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          // email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          password: Yup.string()
            .required('Password is required')
            .test('no-leading-trailing-whitespace', 'Password cannot start or end with spaces', (value) => value === value.trim())
            .max(10, 'Password must be less than 10 characters')
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            //Hace una llamada al servidor para verificar que el usuario exista en la BD
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

            // navigate('/sample-page');

            // if (response.ok && data.success) {
            //   console.log('✅ Login successful!', data);
            //   // Optional: save token
            //   // localStorage.setItem('token', data.token);
            //   // Redirect: navigate('/dashboard');
            // } else {
            //   setErrors({ submit: data.message || 'Login failed' });
            // }

            const trimmedEmail = values.email.trim();
            await login(trimmedEmail, values.password);
            setStatus({ success: true });
            setSubmitting(false);
            preload('api/menu/dashboard', fetcher); // load menu on login success
          } catch (err) {
            console.error(err);
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid size={12}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel sx={{ color: 'white' }} htmlFor="email-login">
                    Usuario
                  </InputLabel>
                  {/* <InputLabel htmlFor="email-login">Email Address</InputLabel> */}
                  <OutlinedInput
                    sx={{ backgroundColor: 'white' }}
                    id="email-login"
                    type="email"
                    value={values.email}
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter email address"
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
                  {/* <InputLabel htmlFor="password-login">Password</InputLabel> */}
                  <InputLabel sx={{ color: 'white' }} htmlFor="password-login">
                    Password
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
                    // placeholder="Enter password"
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
                    // label={<Typography variant="h6">Keep me sign in</Typography>}
                    label={<Typography variant="h6">Mantenerme conectado</Typography>}
                  />
                  <Link
                    variant="h6"
                    component={RouterLink}
                    to={isDemo ? '/auth/forgot-password' : auth ? `/${auth}/forgot-password?auth=jwt` : '/forgot-password'}
                    // color="text.primary"
                    color="white"
                  >
                    {/* Forgot Password? */}
                    Recuperar contraseña
                  </Link>
                </Stack>
              </Grid>
              {errors.submit && (
                <Grid size={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}
              <Grid size={12}>
                <AnimateButton>
                  <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                    Login
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
