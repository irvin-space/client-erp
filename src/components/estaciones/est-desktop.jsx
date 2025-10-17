import React from 'react';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
 
import useMediaQuery from '@mui/material/useMediaQuery';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
 
// project imports
import Drawer from '../../layout/Dashboard/Drawer';
import Header from '../../layout/Dashboard/Header';
import Footer from '../../layout/Dashboard/Footer';
import Loader from '../Loader';
import Breadcrumbs from '../@extended/Breadcrumbs';
 
import Stack from '@mui/material/Stack';
 
//Space background image
import spaceBg from 'assets/images/backgrounds/spaceBg.jpg';

import HuevosPascua from 'components/servicios/huevo-pascua.jsx';
 
import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';
 
// ==============================|| MAIN LAYOUT ||============================== //
 
export default function DashboardLayout() {
  const { menuMasterLoading } = useGetMenuMaster();
  const downXL = useMediaQuery((theme) => theme.breakpoints.down('xl'));
 
  const [isVisible, setIsVisible] = useState(true);
  const [mensajeVisible, setMensajeVisible] = useState(false);
   const [openHuevoPascua, setOpenHuevoPascua] = useState(false); // Seguimiento del estado del modal de historia de tramites
 
  useEffect(() => {
    handlerDrawerOpen(!downXL);
  }, [downXL]);

  // 2. NUEVO useEffect para el Easter Egg (¡Añádelo!)
  useEffect(() => {
      const handleKeyDown = (event) => {
      // La condición que ya tienes
      if (event.key === "F2" && event.code === 'F2') { 
          event.preventDefault(); 
          
          setOpenHuevoPascua(true); // Abre el modal
          
          // Temporizador para cerrar
          const timer = setTimeout(() => {
              setOpenHuevoPascua(false);
          }, 9000); 

          // Limpieza del timer si se presiona F2 varias veces antes de que expire
          return () => clearTimeout(timer); 
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // La función de limpieza
    return () => {
        document.removeEventListener('keydown', handleKeyDown);
    };
}, []); // 👈 Dependencia vacía para que solo se monte una vez.

useEffect(() => {
    if (openHuevoPascua) {
        document.body.classList.add('invertir-raton');
    } else {
        document.body.classList.remove('invertir-raton');
    }
    
    // Función de limpieza al desmontar: asegura que la clase se quite si el componente muere
    return () => {
        document.body.classList.remove('invertir-raton');
    };
}, [openHuevoPascua]); // Depende del estado del modal
 
if (menuMasterLoading) return <Loader />;

  const handleOpenHuevoPascua = () => {
    setOpenHuevoPascua(true);
  };

  const handleCloseHuevoPascua = () => {
    setOpenHuevoPascua(false);
  };
 
  return (
    <Box
      component="main"
      sx={{
        width: 'calc(100%)',
        flexGrow: 1,
        p: { xs: 2, sm: 3 },
        backgroundImage: `url(${spaceBg})`,
        //backgroundColor: 'white',
        backgroundSize: 'cover',       // 👈 este cambio
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center'
      }}
    >
      <Toolbar sx={{ mt: 'inherit' }} />
      <Box
        sx={{
          ...{ px: { xs: 0, sm: 2 } },
          position: 'relative',
          minHeight: 'calc(100vh - 110px)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* <Breadcrumbs /> */}
        <Outlet />
        {/* <Footer /> */}
      </Box>

        {openHuevoPascua && (
          <HuevosPascua 
              open={openHuevoPascua} 
              onClose={handleCloseHuevoPascua} 
              // Si necesitas una clase para el modal para la inversión CSS
              className="modal-huevo-pascua"
          />
        )}
    </Box>

    
  );
}