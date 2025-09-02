import React from 'react';
// material-ui
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

// project imports
import MainCard from 'components/MainCard';

//Mycomopnents test
import Reportcard from 'components/cards/estadisticas/Reportcard.jsx';
import ApexPieChart from 'sections/charts/apexchart/ApexPieChart';
import Box from '@mui/material/Box';
import { DollarOutlined, DollarCircleFilled, NumberOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { height } from '@mui/system';
import Chip from '@mui/material/Chip';

// ==============================|| SAMPLE PAGE ||============================== //

export default function SamplePage() {
  return (
    <Grid container spacing={2}>
      <Grid size={4}>
        <MainCard
          sx={{
            '&:hover': { backgroundColor: 'primary.main', boxShadow: 15 },
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'column'
          }}
          title="Resumen del deposito"
        >
          <Box sx={{ '&:hover': { backgroundColor: 'green' } }}>
            <Reportcard primary="$370,896 MXN" secondary="Importe total depositado" color="secondary.main" iconPrimary={DollarOutlined} />
          </Box>
          <Reportcard primary="48" secondary="Importe total depositado" color="secondary.main" iconPrimary={NumberOutlined} />
          <Reportcard
            primary="$7,727 MXN"
            secondary="Importe total depositado"
            color="secondary.main"
            iconPrimary={UnorderedListOutlined}
          />
          <Box sx={{ marginTop: '20px' }}>
            <Chip variant="combined" color="error" icon={DollarOutlined} label={`Patrón uniforme`} sx={{ ml: 1.25, pl: 1 }} size="small" />
            <Chip variant="combined" color="warning" icon={DollarOutlined} label={`Mismo monto`} sx={{ ml: 1.25, pl: 1 }} size="small" />
          </Box>
        </MainCard>
      </Grid>
      <Grid size={4}>
        <MainCard title="Resument del deposito">
          <ApexPieChart />
          <Box sx={{ marginTop: '20px' }}>
            <Chip
              variant="combined"
              color="primary"
              icon={DollarOutlined}
              label={`100% distribuido`}
              sx={{ ml: 1.25, pl: 1 }}
              size="small"
            />
            <Chip
              variant="combined"
              color="warning"
              icon={DollarOutlined}
              label={`48 aplicaciones identicas`}
              sx={{ ml: 1.25, pl: 1 }}
              size="small"
            />
          </Box>
        </MainCard>
      </Grid>
      <Grid size={4}>
        <MainCard
          sx={{
            '&:hover': { backgroundColor: 'white', boxShadow: 15 },
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'column'
          }}
          title="Resumen del deposito"
        >
          <Box sx={{ '&:hover': { backgroundColor: 'green' } }}>
            <Reportcard primary="279766" secondary="Documento cliente" color="secondary.main" iconPrimary={DollarOutlined} />
          </Box>
          <Reportcard primary="2144331" secondary="Póliza ContPaq" color="secondary.main" iconPrimary={NumberOutlined} />
          <Reportcard
            primary="$7,727 MXN"
            secondary="Importe total depositado"
            color="secondary.main"
            iconPrimary={UnorderedListOutlined}
          />
        </MainCard>
      </Grid>
    </Grid>
  );
}
