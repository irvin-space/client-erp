import { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

import { PieChart } from '@mui/x-charts';

// project imports
import MainCard from 'components/MainCard';
import Dot from 'components/@extended/Dot';

// assets
import MoreOutlined from '@ant-design/icons/MoreOutlined';
import MonedaFormatoMiles from '../../componentesBase/MonedaFormatoMiles';

// ==============================|| INVOICE - PIE CHART ||============================== //

export default function GraficoDePastel({ cantidad1, cantidad2 }) {
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const total = cantidad1 + cantidad2;
  const data = [
    { value: cantidad1, label: 'Total distribuido', color: theme.palette.secondary.main },
    { value: cantidad2, label: 'Importe total depositado', color: theme.palette.primary.main }
  ];

  //sx style
  const DotSize = { display: 'flex', alignItems: 'center', gap: 1 };
  const ExpenseSize = { fontSize: '1rem', lineHeight: '1.5rem', fontWeight: 500 };

  return (
    <Grid container alignItems="center" spacing={1}>
      <Grid size={12}>
        <PieChart
          hideLegend
          height={247}
          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
          slotProps={{
            legend: { hidden: false },
            tooltip: {
              formatter: (params) => {
                const percentage = ((params.value / total) * 100).toFixed(2);
                return `${params.label}: ${percentage}%`;
              }
            }
          }}
          series={[
            {
              data,
              innerRadius: 60,
              outerRadius: 100,
              type: 'pie',
              highlightScope: { highlight: 'item' },
              // valueFormatter: (value) => `${value.value}`
              valueFormatter: (params) => {
                const percentage = ((params.value / total) * 100).toFixed(2);
                return `${percentage}%`;
              }
            }
          ]}
        />
      </Grid>
      <Grid size={12}>
        <Grid container>
          <Grid></Grid>
          <Grid sx={DotSize} size="grow">
            <Dot color="primary" size={12} />
            <Typography variant="subtitle1" color="text.secondary">
              Importe total depositado
            </Typography>
          </Grid>
          <Grid sx={ExpenseSize}>{cantidad2 ? <MonedaFormatoMiles moneda={'MXN'} cantidad={cantidad2} etiquetaHTML={'h5'} /> : ''}</Grid>
        </Grid>
      </Grid>
      <Grid size={12}>
        <Grid container>
          <Grid></Grid>
          <Grid sx={DotSize} size="grow">
            <Dot color="secondary" size={12} />
            <Typography variant="subtitle1" color="text.secondary">
              Total distribuido
            </Typography>
          </Grid>
          <Grid sx={ExpenseSize}>{cantidad1 ? <MonedaFormatoMiles moneda={'MXN'} cantidad={cantidad1} etiquetaHTML={'h5'} /> : ''}</Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
