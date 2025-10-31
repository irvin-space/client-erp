import PropTypes from 'prop-types';
// material-ui
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'components/MainCard';

// ==============================|| REPORT CARD ||============================== //

export default function ReportCard({ primary, secondary, iconPrimary, color, etiquetaHtml = 'h4' }) {
  const IconPrimary = iconPrimary;
  const primaryIcon = iconPrimary ? <IconPrimary fontSize="large" /> : null;

  return (
    <MainCard>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid sx={primary.length > 20 ? {width:'80%'}: ''}>
          <Stack sx={{ gap: 0.5 }}>
            <Typography sx={{ lineHeight: 1.2 }} variant={etiquetaHtml}>
              {primary}
            </Typography>
            {/* <Typography variant={etiquetaHtml}>{primary.length > 20 ?  }</Typography> */}
            <Typography variant="body1" color="secondary">
              {secondary}
            </Typography>
          </Stack>
        </Grid>
        <Grid >
          <Typography variant="h2" sx={{ color }}>
            {primaryIcon}
          </Typography>
        </Grid>
      </Grid>
    </MainCard>
  );
}

ReportCard.propTypes = { primary: PropTypes.any, secondary: PropTypes.any, iconPrimary: PropTypes.any, color: PropTypes.any };
