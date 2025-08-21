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
 
import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';
 
// ==============================|| MAIN LAYOUT ||============================== //
 
export default function DashboardLayout() {
  const { menuMasterLoading } = useGetMenuMaster();
  const downXL = useMediaQuery((theme) => theme.breakpoints.down('xl'));
 
  const [isVisible, setIsVisible] = useState(true);
 
  // set media wise responsive drawer
  useEffect(() => {
    handlerDrawerOpen(!downXL);
  }, [downXL]);
 
  if (menuMasterLoading) return <Loader />;
 
  return (
    <Box
      component="main"
      sx={{
        width: 'calc(100%)',
        flexGrow: 1,
        p: { xs: 2, sm: 3 },
        backgroundImage: `url(${spaceBg})`,
        backgroundColor: 'white',
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
    </Box>
  );
}