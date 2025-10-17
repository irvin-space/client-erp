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

// ant design
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
        color: iconColor || 'white'
      }
    }}
  >
    {children}
  </Box>
);

// Mapeo de colores por titulo
const getEventStyle = (titulo, { folio }) => {
  const isComplete = folio != null && folio !== '';

  // Normalizar y cortar
  const titleParts = titulo.split('|').map((t) => t.trim());

  // Revisar si alguna parte es igual a Aplicacion de Anticipos a Facturas
  const isAplicacionAnticipo = titleParts.some((t) => t === 'Aplicación de Anticipos a Facturas');

  // Determinar el icono
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
      case 'Pago de Cliente':
        icon = <CreditCardOutlined />;
        break;
      case 'Nota de Crédito':
        icon = <CreditCardOutlined />;
        break;
      case 'Conciliación de Anticipo':
        icon = <FileTextOutlined />;
        break;
      default:
        icon = <FileExcelOutlined />;
    }
  }

  if (!isComplete) {
    return {
      dotColor: '#a4acb61a',
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

    case 'Nota de Crédito':
      return { dotColor: '#7d3ac4ff', icon, isDisabled: false };

    case 'Conciliación de Anticipo':
      return { dotColor: '#11908cff', icon, isDisabled: false };

    default:
      return { dotColor: '#8c8d8b86', icon, isDisabled: true };
  }
};

const LineaDelTiempo2 = ({ events }) => {
  return (
    <Box sx={{ py: 4, px: 0, maxWidth: 900, mx: 'auto', backgroundColor: { xs: '', sm: '' } }}>
      <Timeline
        sx={{
          backgroundColor: '',
          [`& .${timelineItemClasses.root}:before`]: {
            flex: 0,
            padding: 0
          }
        }}
      >
        {events.map((event, index) => {
          const { dotColor, icon, isDisabled } = getEventStyle(event.titulo, event);
          const isEven = index % 2 === 0;

          // Color de icono deshabilitado
          const iconColor = isDisabled ? '#c0c0c08c' : 'white';

          // Color de texto deshabilitado
          const textColor = isDisabled ? '#c0c0c08c' : 'white';

          return (
            <TimelineItem key={index}>
              {isEven ? (
                <>
                  {/* Fecha izquierda */}
                  <TimelineOppositeContent
                    sx={{
                      display: 'flex',
                      textAlign: 'right',
                      mr: { xs: 0, md: 2 },
                      justifyContent: 'end',
                      alignItems: 'flex-start',
                      pt: 1,
                      backgroundColor: ''
                    }}
                    color="text.secondary"
                    variant="body1"
                  >
                    {event.folio && event.fecha ? new Date(event.fecha).toLocaleDateString('es-MX') : '–'}
                  </TimelineOppositeContent>

                  <TimelineSeparator sx={{ display: { xs: 'none', sm: 'flex' } }}>
                    <DotIcon color={dotColor} size={80} iconColor={iconColor}>
                      {icon}
                    </DotIcon>
                    {index !== events.length - 1 && <TimelineConnector sx={{ bgcolor: 'grey.300' }} />}
                  </TimelineSeparator>

                  {/* Contenido a la derecha */}
                  <TimelineContent sx={{ ml: { xs: 0, md: 2 } }}>
                    <Paper
                      elevation={2}
                      sx={{
                        p: 3,
                        borderRadius: 2,
                        textAlign: { xs: 'end', sm: 'start' },
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
                        textAlign: { xs: 'end', sm: 'start' },
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

                  <TimelineSeparator sx={{ display: { xs: 'none', sm: 'flex' } }}>
                    <DotIcon color={dotColor} size={60} iconColor={iconColor}>
                      {icon}
                    </DotIcon>
                    {index !== events.length - 1 && <TimelineConnector sx={{ bgcolor: 'grey.300' }} />}
                  </TimelineSeparator>

                  <TimelineOppositeContent
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-start',
                      ml: { xs: 0, md: 2 },
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
