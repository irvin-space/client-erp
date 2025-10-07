import * as React from 'react';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineOppositeContent,
  timelineItemClasses
} from '@mui/lab';
import { Box, Typography, Paper } from '@mui/material';

// Ant Design Icons
import {
  DollarOutlined,
  WalletOutlined,
  FileTextOutlined,
  ProfileOutlined,
  LinkOutlined,
  ExportOutlined,
  FileProtectOutlined,
  FileExcelOutlined,
  CreditCardOutlined
  
} from '@ant-design/icons';

// DotIcon Component (unchanged, perfect!)
const DotIcon = ({ children, color = 'primary.main', size = 16, iconColor }) => (
  <Box
    sx={{
      width: size,
      height: size,
      bgcolor: color,
      borderRadius: '50%',
      boxShadow: 2,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      '& > *': {
        fontSize: size * 0.6,
        color: iconColor || 'white' // use custom icon color if provided
      }
    }}
  >
    {children}
  </Box>
);

// Semantic Color Mapping by Title
const getEventStyle = (titulo, { folio, fecha, comentarios }) => {
  const isComplete = folio != null && folio !== '';

  // Normalize: split by '|' and trim each segment
  const titleParts = titulo.split('|').map((t) => t.trim());

  // Check if ANY part is "Aplicación de Anticipos a Facturas"
  const isAplicacionAnticipo = titleParts.some((t) => t === 'Aplicación de Anticipos a Facturas');

  // Determine icon based on main logic (can now include special case)
  let icon;
  if (isAplicacionAnticipo) {
    icon = <LinkOutlined />;
  } else {
    switch (titulo) {
      case 'Anticipo de cliente':
        icon = <WalletOutlined />;
        break;
      case 'Ficha de depósito':
        icon = <DollarOutlined />;
        break;
      case 'Creación de póliza de la ficha':
      case 'Creación de póliza de factura':
        icon = <FileProtectOutlined />;
        break;
      case 'Exportación de póliza de la ficha':
      case 'Exportación de póliza de factura':
        icon = <ExportOutlined />;
        break;
      case 'Documento de Cliente':
        icon = <ProfileOutlined />;
        break;
      case 'Pago de Cliente':
        icon = <CreditCardOutlined />;
        break;
      case 'Factura de cliente':
        icon = <FileTextOutlined />;
        break;
      default:
        icon = <FileExcelOutlined />;
    }
  }

  if (!isComplete) {
    return {
      dotColor: '#7D8FA4',
      icon,
      isDisabled: true
    };
  }

  if (isAplicacionAnticipo) {
    return { dotColor: '#6E40C9', icon, isDisabled: false };
  }

  switch (titulo) {
    case 'Anticipo de cliente':
      return { dotColor: '#00A854', icon, isDisabled: false };
    case 'Ficha de depósito':
      return { dotColor: '#277018ff', icon, isDisabled: false };
      
    case 'Factura de cliente':
      return { dotColor: '#2d82b3ff', icon, isDisabled: false };

    case 'Creación de póliza de la ficha':
    case 'Creación de póliza de factura':
      return { dotColor: '#d600c4ff', icon, isDisabled: false };

    case 'Exportación de póliza de la ficha':
    case 'Exportación de póliza de factura':
      return { dotColor: '#b90d94ff', icon, isDisabled: false };

    case 'Documento de Cliente':
      return { dotColor: '#00345D', icon, isDisabled: false };

    case 'Pago de Cliente':
      return { dotColor: '#3a8dc4ff', icon, isDisabled: false };

    default:
      return { dotColor: '#8b8c8dd8', icon, isDisabled: true };
  }
};

const LineaDelTiempo2 = ({ events }) => {
  return (
    <Box sx={{ py: 4, px: 0, maxWidth: 900, mx: 'auto' }}>
      <Timeline
        sx={{
          [`& .${timelineItemClasses.root}:before`]: {
            flex: 0,
            padding: 0
          }
        }}
      >
        {events.map((event, index) => {
          const { dotColor, icon, isDisabled } = getEventStyle(event.titulo, event);
          const isEven = index % 2 === 0;

          // Choose icon color: gray when disabled
          const iconColor = isDisabled ? '#C0C0C0' : 'white'; // soft silver-gray for disabled icon

          // Choose text color based on disabled state
          const textColor = isDisabled ? '#C0C0C0' : 'white';

          return (
            <TimelineItem key={index}>
              {isEven ? (
                <>
                  {/* Date on Left */}
                  <TimelineOppositeContent
                    sx={{
                      display: 'flex',
                      textAlign: 'right',
                      mr: 2,
                      justifyContent: 'end',
                      alignItems: 'flex-start',
                      pt: 1
                    }}
                    color="text.secondary"
                    variant="body1"
                  >
                    {event.folio && event.fecha ? new Date(event.fecha).toLocaleDateString('es-MX') : '–'}
                  </TimelineOppositeContent>

                  <TimelineSeparator>
                    <DotIcon color={dotColor} size={80} iconColor={iconColor}>
                      {icon}
                    </DotIcon>
                    {index !== events.length - 1 && <TimelineConnector sx={{ bgcolor: 'grey.300' }} />}
                  </TimelineSeparator>

                  {/* Content on Right */}
                  <TimelineContent sx={{ ml: 2 }}>
                    <Paper
                      elevation={2}
                      sx={{
                        p: 3,
                        borderRadius: 2,
                        bgcolor: dotColor,
                        color: textColor,
                        opacity: isDisabled ? 0.9 : 1,
                        boxShadow: isDisabled ? 1 : 3,
                        transition: 'all 0.2s ease',
                        '&:hover': !isDisabled
                          ? {
                              transform: 'translateY(-2px)',
                              boxShadow: 6
                            }
                          : {}
                      }}
                    >
                      <Typography variant="h6" component="h3" fontWeight="600">
                        {event.titulo}
                      </Typography>
                      <Typography variant="subtitle1" sx={{ color: textColor, opacity: 0.9 }}>
                        {event.folio || 'Sin folio'}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                        {event.comentarios || 'Sin comentarios'}
                      </Typography>
                    </Paper>
                  </TimelineContent>
                </>
              ) : (
                // Same pattern for odd items (content on left)
                <>
                  <TimelineContent sx={{ mr: 2 }}>
                    <Paper
                      elevation={2}
                      sx={{
                        p: 3,
                        borderRadius: 2,
                        bgcolor: dotColor,
                        color: textColor,
                        opacity: isDisabled ? 0.9 : 1,
                        boxShadow: isDisabled ? 1 : 3,
                        transition: 'all 0.2s ease',
                        '&:hover': !isDisabled
                          ? {
                              transform: 'translateY(-2px)',
                              boxShadow: 6
                            }
                          : {}
                      }}
                    >
                      <Typography variant="h6" component="h3" fontWeight="600">
                        {event.titulo}
                      </Typography>
                      <Typography variant="subtitle1" sx={{ color: textColor, opacity: 0.9 }}>
                        {event.folio || 'Sin folio'}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                        {event.comentarios || 'Sin comentarios'}
                      </Typography>
                    </Paper>
                  </TimelineContent>

                  <TimelineSeparator>
                    <DotIcon color={dotColor} size={60} iconColor={iconColor}>
                      {icon}
                    </DotIcon>
                    {index !== events.length - 1 && <TimelineConnector sx={{ bgcolor: 'grey.300' }} />}
                  </TimelineSeparator>

                  <TimelineOppositeContent
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-start',
                      ml: 2,
                      alignItems: 'flex-start',
                      pt: 1
                    }}
                    color="text.secondary"
                    variant="body1"
                  >
                    {event.folio && event.fecha ? new Date(event.fecha).toLocaleDateString('es-MX') : '–'}
                  </TimelineOppositeContent>
                </>
              )}
            </TimelineItem>
          );
        })}
      </Timeline>
    </Box>
  );
};

export default LineaDelTiempo2;
