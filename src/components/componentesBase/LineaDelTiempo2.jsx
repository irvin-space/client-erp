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

//Ant Design
import {
  DollarOutlined,
  FileExcelOutlined,
  SafetyCertificateOutlined,
  ExportOutlined,
  FileProtectOutlined,
  CreditCardOutlined,
  ProfileOutlined,
  WalletOutlined,
  LinkOutlined,
  FileTextOutlined
} from '@ant-design/icons';

// Dot-shaped indicator component that can contain Ant Design icons
const DotIcon = ({ children, color = 'primary.main', size = 16 }) => (
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
        fontSize: size * 0.6, // Scale child icon appropriately
        color: 'white'
      }
    }}
  >
    {children}
  </Box>
);

const LineaDelTiempo2 = ({ events }) => {
  const eventus = [
    {
      date: '1/enero/2025',
      title: 'Se genera factura del cliente',
      description: 'Lorem ipsum',
      icon: (
        <DotIcon color="primary.main" size={86}>
          {/* Example Ant Design icon - replace with your actual Ant Design icon */}
          <DollarOutlined />
        </DotIcon>
      ),
      color: 'primary.main'
    },
    {
      date: 'Mar 2022',
      title: 'Strategic Acquisition',
      description: 'Acquired FinTech InnovateX to enhance digital banking capabilities and expand market reach.',
      icon: (
        <DotIcon color="success.main" size={86}>
          <DollarOutlined />
        </DotIcon>
      ),
      color: 'success.main'
    },
    {
      date: 'Jul 2022',
      title: 'ESG Initiative Launch',
      description: 'Introduced sustainable investment portfolio options aligned with global climate goals.',
      icon: (
        <DotIcon color="secondary.main" size={86}>
          <DollarOutlined />
        </DotIcon>
      ),
      color: 'secondary.main'
    },
    {
      date: 'Nov 2022',
      title: 'Global Expansion',
      description: 'Launched operations in Singapore and Dubai, strengthening presence in Asia and Middle East.',
      icon: (
        <DotIcon color="warning.main" size={86}>
          <DollarOutlined />
        </DotIcon>
      ),
      color: 'warning.main'
    },
    {
      date: 'Feb 2023',
      title: 'Digital Platform Overhaul',
      description: 'Redesigned client portal with AI-powered analytics and real-time reporting tools.',
      icon: (
        <DotIcon color="info.main" size={86}>
          <DollarOutlined />
        </DotIcon>
      ),
      color: 'info.main'
    }
  ];
  console.log(events);
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
        {events.map((event, index) => (
          <TimelineItem key={index}>
            {/* Alternate placement of date and content */}
            {index % 2 === 0 ? (
              <>
                {/* Date on the left */}
                <TimelineOppositeContent
                  sx={{ display: 'flex', textAlign: 'right', mr: 2, justifyContent: 'end', backgroundColor: '', alignItems: 'top' }}
                  color="text.secondary"
                  variant="h5"
                >
                  {new Date(event.fecha).toLocaleDateString('es-MX')}
                </TimelineOppositeContent>
                <TimelineSeparator sx={{ backgroundColor: '' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {event.titulo == 'Anticipo de cliente' && (
                      <DotIcon color="#00A854" size={100}>
                        <WalletOutlined />
                      </DotIcon>
                    )}
                    {event.titulo == 'Ficha de depósito' && (
                      <DotIcon color="#00A854" size={100}>
                        <DollarOutlined />
                      </DotIcon>
                    )}
                    {event.titulo == 'Creación de póliza de la ficha' && (
                      <DotIcon color="#d6007dff" size={100}>
                        <FileProtectOutlined />
                      </DotIcon>
                    )}
                    {event.titulo == 'Exportación de póliza de la ficha' && (
                      <DotIcon color="#008C73" size={100}>
                        <ExportOutlined />
                      </DotIcon>
                    )}
                    {event.titulo == 'Documento de Cliente' && (
                      <DotIcon color="#00345D" size={100}>
                        <ProfileOutlined />
                      </DotIcon>
                    )}
                    {event.titulo == 'Factura de cliente' && (
                      <DotIcon color="#00A854" size={100}>
                        <FileTextOutlined />
                      </DotIcon>
                    )}
                    {event.titulo == 'Creación de póliza de factura' && (
                      <DotIcon color="#d6007dff" size={100}>
                        <FileProtectOutlined />
                      </DotIcon>
                    )}
                    {event.titulo == 'Aplicación de Anticipos a Facturas' && (
                      <DotIcon color="#6E40C9" size={100}>
                        <LinkOutlined />
                      </DotIcon>
                    )}
                    {event.titulo == 'Exportación de póliza de factura' && (
                      <DotIcon color="#008C73" size={100}>
                        <ExportOutlined />
                      </DotIcon>
                    )}
                  </Box>
                  {index !== events.length - 1 && <TimelineConnector sx={{ bgcolor: 'grey.300' }} />}
                </TimelineSeparator>
                {/* Content on the right */}
                <TimelineContent sx={{ flex: 1, ml: 2, mt: 0 }}>
                  <Paper
                    elevation={2}
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      bgcolor: 'primary.main',
                      boxShadow: 3,
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 6
                      }
                    }}
                  >
                    <Typography variant="h6" component="h3" fontWeight="600" color="white">
                      {event.titulo}
                    </Typography>
                    <Typography variant="h6" component="h3" fontWeight="600" color="text.secondary">
                      {event.folio}
                    </Typography>
                    <Typography variant="body2" color="white" sx={{ mt: 1 }}>
                      {event.comentarios}
                    </Typography>
                  </Paper>
                </TimelineContent>
              </>
            ) : (
              <>
                {/* Content on the right */}
                <TimelineContent sx={{ flex: 1, mr: 2, mt: 0 }}>
                  <Paper
                    elevation={2}
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      bgcolor: 'primary.main',
                      boxShadow: 3,
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 6
                      }
                    }}
                  >
                    <Typography variant="h6" component="h3" fontWeight="600" color="white">
                      {event.titulo}
                    </Typography>
                    <Typography variant="h6" component="h3" fontWeight="600" color="text.secondary">
                      {event.folio}
                    </Typography>
                    <Typography variant="body2" color="white" sx={{ mt: 1 }}>
                      {event.comentarios}
                    </Typography>
                  </Paper>
                </TimelineContent>
                <TimelineSeparator>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {event.titulo == 'Anticipo de cliente' && (
                      <DotIcon color="#00A854" size={100}>
                        <WalletOutlined />
                      </DotIcon>
                    )}
                    {event.titulo == 'Ficha de depósito' && (
                      <DotIcon color="#00A854" size={100}>
                        <DollarOutlined />
                      </DotIcon>
                    )}
                    {event.titulo == 'Creación de póliza de la ficha' && (
                      <DotIcon color="#d6007dff" size={100}>
                        <FileProtectOutlined />
                      </DotIcon>
                    )}
                    {event.titulo == 'Exportación de póliza de la ficha' && (
                      <DotIcon color="#008C73" size={100}>
                        <ExportOutlined />
                      </DotIcon>
                    )}
                    {event.titulo == 'Documento de Cliente' && (
                      <DotIcon color="#00345D" size={100}>
                        <ProfileOutlined />
                      </DotIcon>
                    )}
                    {event.titulo == 'Factura de cliente' && (
                      <DotIcon color="#00A854" size={100}>
                        <FileTextOutlined />
                      </DotIcon>
                    )}
                    {event.titulo == 'Creación de póliza de factura' && (
                      <DotIcon color="#d6007dff" size={100}>
                        <FileProtectOutlined />
                      </DotIcon>
                    )}
                    {event.titulo == 'Aplicación de Anticipos a Facturas' && (
                      <DotIcon color="#6E40C9" size={100}>
                        <LinkOutlined />
                      </DotIcon>
                    )}
                    {event.titulo == 'Exportación de póliza de factura' && (
                      <DotIcon color="#008C73" size={100}>
                        <ExportOutlined />
                      </DotIcon>
                    )}
                  </Box>
                  {index !== events.length - 1 && <TimelineConnector sx={{ bgcolor: 'grey.300' }} />}
                </TimelineSeparator>
                {/* Date on the right */}
                <TimelineOppositeContent
                  sx={{ display: 'flex', justifyContent: 'left', ml: 2, alignItems: 'top' }}
                  color="text.secondary"
                  variant="h5"
                >
                  {new Date(event.fecha).toLocaleDateString('es-MX')}
                </TimelineOppositeContent>
              </>
            )}
          </TimelineItem>
        ))}
      </Timeline>
    </Box>
  );
};

export default LineaDelTiempo2;