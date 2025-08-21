import { Link } from 'react-router-dom';

import useMediaQuery from '@mui/material/useMediaQuery';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import { APP_DEFAULT_PATH } from 'config';

// assets
import error500 from 'assets/images/maintenance/Error500.png';

// ==============================|| ERROR 500 - MAIN ||============================== //

export default function Error500() {
  const downSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  return (
    <Grid container direction="column" alignItems="center" justifyContent="center" sx={{ minHeight: '100vh' }}>
      <Grid size={12}>
        <Stack sx={{ alignItems: 'center', justifyContent: 'center' }}>
          <Box sx={{ width: { xs: 350, sm: 396 }, my: 2 }}>
            <CardMedia component="img" src={error500} alt="mantis" />
          </Box>
          <Typography align="center" variant={downSM ? 'h2' : 'h1'}>
            Error en el servidor
          </Typography>
          <Typography color="text.secondary" variant="body2" align="center" sx={{ width: { xs: '73%', sm: '70%' }, mt: 1 }}>
            Server error 500. Nuestro maravilloso equipo de TI está corrigiendo el problema, intenta mas tarde.
          </Typography>
          <Button component={Link} to={APP_DEFAULT_PATH} variant="contained" sx={{ textTransform: 'none', mt: 4 }}>
            Regresar
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
}
