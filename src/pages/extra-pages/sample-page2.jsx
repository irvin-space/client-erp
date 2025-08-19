import React from 'react';

//ant/design icons
import { DollarOutlined, DollarCircleFilled } from '@ant-design/icons';

//MUI
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

//Componentes del proyecto
import MainCard from 'components/MainCard';
import ReportCard from 'components/cards/estadisticas/ReportCard';
import EcommerceMetrix from 'components/cards/estadisticas/EcommerceMetrix';
import HoverSocialCard from 'components/cards/estadisticas/HoverSocialCard';

import ApexPieChart from 'sections/charts/apexchart/ApexPieChart.jsx';

const SamplePage2 = () => {
  return (
    <MainCard title="Auditoría de Trazabilidad - Depósito # 167957">
      <Typography variant="h3">ABC</Typography>

      <Grid container spacing={2}>
        <Grid size={4}>
          <ReportCard primary="$370,896 MXN" secondary="Importe total depositado" color="secondary.main" iconPrimary={DollarOutlined} />
        </Grid>
        <Grid size={4}>
          <ReportCard primary="$370,896 MXN" secondary="Importe total depositado" color="secondary.main" iconPrimary={DollarOutlined} />
        </Grid>
        <Grid size={4}>
          <ReportCard primary="$370,896 MXN" secondary="Importe total depositado" color="secondary.main" iconPrimary={DollarOutlined} />
        </Grid>
      </Grid>

      <br />

      <Grid container spacing={2}>
        <Grid size={4}>
          <EcommerceMetrix
            primary="Importe total depositado"
            secondary="$370,896 MXN"
            //   content="$50,032 Last Month"
            color="primary.main"
            iconPrimary={DollarCircleFilled}
          />
        </Grid>
        <Grid size={4}>
            <EcommerceMetrix
            primary="Importe total depositado"
            secondary="$370,896 MXN"
            //   content="$50,032 Last Month"
            color="warning.main"
            iconPrimary={DollarCircleFilled}
          />
        </Grid>
        <Grid size={4}>
            <EcommerceMetrix
            primary="Importe total depositado"
            secondary="$370,896 MXN"
            //   content="$50,032 Last Month"
            color="success.main"
            iconPrimary={DollarCircleFilled}
          />
        </Grid>
      </Grid>

      <br />

      <Grid container spacing={2}>
        <Grid size={4}>
          <HoverSocialCard primary="Importe total depositado" secondary="$370,896 MXN" iconPrimary={DollarOutlined} color="primary.main" />
        </Grid>
        <Grid size={4}>
            <HoverSocialCard primary="Importe total depositado" secondary="$370,896 MXN" iconPrimary={DollarOutlined} color="info.light" />
        </Grid>
        <Grid size={4}>
            <HoverSocialCard primary="Importe total depositado" secondary="$370,896 MXN" iconPrimary={DollarOutlined} color="success.main" />
        </Grid>
      </Grid>

      <br />
      <Grid container spacing={2}>
        <Grid size={4}>
          <ApexPieChart />
        </Grid>
        {/* <Grid size={4}>
          <ApexPieChart />
        </Grid>
        <Grid size={4}>
          <ApexPieChart />
        </Grid> */}
      </Grid>


    </MainCard>
  );
};

export default SamplePage2;
