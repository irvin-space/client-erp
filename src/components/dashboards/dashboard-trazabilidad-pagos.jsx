import React from 'react';

//MUI
import Divider  from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';

//Ant design
import {
  DollarCircleOutlined,
  DatabaseOutlined,
  DollarOutlined,
  FileTextOutlined,
  NumberOutlined,
  ProfileOutlined,
  UnorderedListOutlined
} from '@ant-design/icons';

//Componentes propios del proyecto
import MainCard from '../MainCard.jsx';
import ReportCard from '../cards/estadisticas/ReportCard.jsx';
import GraficoDePastel from '../cards/estadisticas/GraficoDePastel.jsx';
import GraficoDeBarras from '../cards/estadisticas/GraficoDeBarras.jsx';

//Componente
const DashboardTrazabilidadPagos = () => {
  return (
    <Box sx={{ backgroundColor: '' }}>
      <Typography variant="h2">Dashboard de Trazabilidad</Typography>
      <br />
      <Divider/>
      <br />
      {/* Reporte */}
      <Stack sx={{ backgroundColor: '' }} spacing={4}>
        {/* Encabezado */}
        <Box>
          <Typography variant="h3" align='center'>Trazabilidad de Depósito #167957</Typography>
          <Typography variant="h5" align='center'>Cliente: YOUR EXPERT SOLUTION YES | Fecha: 08/08/2025</Typography>
        </Box>
        {/* Cards */}
        <Box sx={{ backgroundColor: '', height: '52vh' }} component="section">
          <Grid sx={{ height: '100%' }} container spacing={2}>
            <Grid sx={{ height: '100%' }} size={4}>
              {/* Card 1 */}
              <MainCard sx={{ height: '100%', '&:hover': { backgroundColor: 'white', boxShadow: 15 } }} title="Resumen del Depósito">
                <Stack spacing={1}>
                  <ReportCard
                    primary="$370,896 MXN"
                    secondary="Importe total depositado"
                    color="secondary.main"
                    iconPrimary={DollarOutlined}
                  />
                  <ReportCard primary="48" secondary="Facturas relacionadas" color="secondary.main" iconPrimary={NumberOutlined} />
                  <ReportCard
                    primary="$7,727 MXN"
                    secondary="Importe total depositado"
                    color="secondary.main"
                    iconPrimary={UnorderedListOutlined}
                    bgColoR={'#2636eaff'} // Added prop
                  />
                </Stack>
              </MainCard>
            </Grid>
            <Grid style={{ height: '100%' }} size={4}>
              {/* Card 2 */}
              <MainCard sx={{ height: '100%', '&:hover': { backgroundColor: 'white', boxShadow: 15 } }} title="Distribución">
                <Stack spacing={1}>
                  <GraficoDePastel />
                </Stack>
              </MainCard>
            </Grid>
            <Grid size={4}>
              {/* Card 3 */}
              <MainCard sx={{ height: '100%', '&:hover': { backgroundColor: 'white', boxShadow: 15 } }} title="Documentos Clave">
                <Stack spacing={1}>
                  <ReportCard primary="279766" secondary="Documento cliente" color="secondary.main" iconPrimary={FileTextOutlined} />
                  <ReportCard primary="2144331" secondary="Póliza ContPaq" color="secondary.main" iconPrimary={ProfileOutlined} />
                  <ReportCard
                    primary="$7,727 MXN"
                    secondary="Folio CONTPAQ"
                    color="secondary.main"
                    iconPrimary={DatabaseOutlined}
                  />
                </Stack>
              </MainCard>
            </Grid>
          </Grid>
        </Box>
        {/* Analisis de consistencia */}
        <Box sx={{ backgroundColor: '' }} component="section">
          <Box>
            <Typography variant="h3">Análisis de Consistencia</Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid size={12}>
              <GraficoDeBarras />
            </Grid>
            <Grid size={8}>...</Grid>
          </Grid>
        </Box>
        {/* Documentos Relacionados */}
        <Box component="section">
          <Box>
            <Typography variant="h3">Documentos Relacionados</Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid size={4}>...</Grid>
            <Grid size={8}>...</Grid>
          </Grid>
        </Box>
        {/* Secuencia de Eventos */}
        <Box component="section">
          <Box>
            <Typography variant="h3">Secuencia de Eventos</Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid size={4}>...</Grid>
            <Grid size={8}>...</Grid>
          </Grid>
        </Box>
      </Stack>
    </Box>
  );
};

//Exportar componente
export default DashboardTrazabilidadPagos;
