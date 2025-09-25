import { Link as RouterLink } from 'react-router-dom';

// material-ui
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';

// project imports
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
import Dot from 'components/@extended/Dot';

// assets
import TwitterCircleFilled from '@ant-design/icons/TwitterCircleFilled';
import ClockCircleFilled from '@ant-design/icons/ClockCircleFilled';
import BugFilled from '@ant-design/icons/BugFilled';
import MobileFilled from '@ant-design/icons/MobileFilled';
import WarningFilled from '@ant-design/icons/WarningFilled';

// ==============================|| Linea del tiempo ||============================== //

export default function LineaDelTiempo() {
  return (
    <Box>
      <Grid
        container
        spacing={4.75}
        alignItems="center"
        sx={{
          position: 'relative',
          '&>*': { position: 'relative', zIndex: '5' },
          '&:after': {
            content: '""',
            position: 'absolute',
            top: -20,
            left: 16,
            width: '1px',
            height: '100%',
            bgcolor: 'divider',
            zIndex: '1'
          }
        }}
      >
        <Grid size={12}>
          <Grid container spacing={2}>
            <Grid>
              {/* <Avatar type="filled" color="primary" size="sm" sx={{ top: 10 }}>
                <TwitterCircleFilled />
              </Avatar> */}
              <Dot size="14px" />
            </Grid>
            <Grid size="grow">
              <Grid container spacing={0}>
                <Grid size={12}>
                  <Typography variant="caption" color="secondary">
                    08/08/2025 14:27:04
                  </Typography>
                </Grid>
                <Grid size={12}>
                  <Typography variant="h5">Generación de Documento</Typography>
                </Grid>
                <Grid size={12}>
                  <Typography variant="body" color="secondary">
                    Documento: 279766
                  </Typography>
                </Grid>
                <Grid size={12}>
                  <Typography variant="body" color="secondary">
                    Previo al depósito (2 minutos antes)
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid size={12}>
          <Grid container spacing={2}>
            <Grid>
              {/* <Avatar type="filled" color="primary" size="sm" sx={{ top: 10 }}>
                <ClockCircleFilled />
              </Avatar> */}
              <Dot size="14px" />
            </Grid>
            <Grid size="grow">
              <Grid container spacing={0}>
                <Grid size={12}>
                  <Typography variant="caption" color="secondary">
                    08/08/2025 14:29:31
                  </Typography>
                </Grid>
                <Grid size={12}>
                  <Typography variant="h5">Depósito Confirmado</Typography>
                </Grid>
                <Grid size={12}>
                  <Typography variant="body1" color="secondary">
                    Importe: $370,896 MXN
                  </Typography>
                </Grid>
                <Grid size={12}>
                  <Typography variant="body1" color="secondary">
                    Ficha: 167957
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid size={12}>
          <Grid container spacing={2}>
            <Grid>
              {/* <Avatar type="filled" color="primary" size="sm" sx={{ top: 10 }}>
                <BugFilled />
              </Avatar> */}
              <Dot size="14px" />
            </Grid>
            <Grid size="grow">
              <Grid container spacing={0}>
                <Grid size={12}>
                  <Typography variant="caption" color="secondary">
                    08/08/2025 14:29:31
                  </Typography>
                </Grid>
                <Grid size={12}>
                  <Typography variant="h5">Aplicación a Facturas</Typography>
                  <Grid size={12}>
                    <Typography variant="body1" color="secondary">
                      48 facturas aplicadas simultáneamente
                    </Typography>
                  </Grid>
                  <Grid size={12}>
                    <Typography variant="body1" color="secondary">
                      Monto unitario: $7,727 MXN
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid size={12}>
          <Grid container spacing={2}>
            <Grid>
              {/* <Avatar type="filled" color="primary" size="sm" sx={{ top: 10 }}>
                <WarningFilled />
              </Avatar> */}
              <Dot size="14px" />
            </Grid>
            <Grid size="grow">
              <Grid container spacing={0}>
                <Grid size={12}>
                  <Typography variant="caption" color="secondary">
                    
11/08/2025 08:16:27
                  </Typography>
                </Grid>
                <Grid size={12}>
                  <Typography variant="h5">Exportación a CONTPAQ</Typography>
                </Grid>
                <Grid size={12}>
                  <Typography variant="body1" color="secondary">
                    Póliza: 567406
                  </Typography>
                </Grid>
                <Grid size={12}>
                  <Typography variant="body1" color="secondary">
                    3 días después del depósito
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
