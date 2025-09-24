// material-ui
import { useTheme } from '@mui/material/styles';

import { BarChart } from '@mui/x-charts/BarChart';

const data = [7727, 10, 370896];
const xLabels = ['Monto Por Factura', 'Número de Facturas', 'Total Distribuido'];

// ==============================|| MONTHLY BAR CHART ||============================== //

export default function GraficoDeBarras() {
  const theme = useTheme();
  const axisFonstyle = { fontSize: 10, fill: theme.palette.text.secondary };

  return (
    <BarChart
      hideLegend
      height={380}
      series={[{ data, label: 'Valores' }]}
      //   series={[
      //     { data: [7727], label: xLabels[0], color: '#1976d2' }, // Blue
      //     { data: [10], label: xLabels[1], color: '#d32f2f' }, // Red
      //     { data: [370896], label: xLabels[2], color: '#388e3c' } // Green
      //   ]}
      //   series={[
      //     {
      //       data: data,
      //       label: 'ABC',
      //       barColors: ['#1976d2', '#d32f2f', '#388e3c']
      //       //   color: theme.palette.primary.main,
      //     }
      //   ]}
      //     series={[
      //     { data: [7727, null, null], label: xLabels[0], color: '#1976d2' }, // Blue
      //     { data: [null, 10, null], label: xLabels[1], color: '#d32f2f' },   // Red
      //     { data: [null, null, 370896], label: xLabels[2], color: '#388e3c' } // Green
      //   ]}

      xAxis={[{ data: xLabels, scaleType: 'band', disableLine: true, disableTicks: true, tickLabelStyle: axisFonstyle }]}
      //   yAxis={[{ position: 'none' }]}
      yAxis={[
        {
          min: 0,
          max: 500000,
          tickMinStep: 100000,
          labelStyle: axisFonstyle,
          tickLabelStyle: axisFonstyle
        }
      ]}
      slotProps={{ bar: { rx: 5, ry: 5 } }}
      axisHighlight={{ x: 'none' }}
      margin={{ left: 20, right: 20 }}
      colors={[theme.palette.primary.main]}
      //   sx={{ '& .MuiBarElement-root:hover': { opacity: 0.6 } }}
      sx={{
        '& .MuiBarElement-root': {
          opacity: 1
        },
        '& .MuiBarElement-root:nth-of-type(1)': {
          fill: '#d32f2f' //red Blue
        },
        '& .MuiBarElement-root:nth-of-type(2)': {
          fill: '#d32f2f' // red
        },
        '& .MuiBarElement-root:nth-of-type(3)': {
          fill: 'primary.main' // primary.main
        },
        '& .MuiBarElement-root:hover': {
          opacity: 0.6
        }
      }}
    />
  );
}
