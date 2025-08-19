import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

import useMediaQuery from '@mui/material/useMediaQuery';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';

// project imports
import Drawer from './Drawer';
import Header from './Header';
import Footer from './Footer';
import Loader from 'components/Loader';
import Breadcrumbs from 'components/@extended/Breadcrumbs';

import Stack from '@mui/material/Stack';

//Space background image
import spaceBg from 'assets/images/backgrounds/spaceBg.jpg';

import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';

// ==============================|| MAIN LAYOUT ||============================== //

export default function DashboardLayout() {
  const { menuMasterLoading } = useGetMenuMaster();
  const downXL = useMediaQuery((theme) => theme.breakpoints.down('xl'));

  const [isVisible, setIsVisible] = useState(false);

  // set media wise responsive drawer
  useEffect(() => {
    handlerDrawerOpen(!downXL);
  }, [downXL]);

  if (menuMasterLoading) return <Loader />;

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <Header />
      <Drawer />

      {isVisible ? (
        <Box
          component="main"
          sx={{
            width: 'calc(100% - 260px)',
            flexGrow: 1,
            p: { xs: 2, sm: 3 },
            // backgroundImage: 'url("https://picsum.photos/1400/900")',
            backgroundColor: 'white'
            // backgroundSize: 'cover',
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
      ) : (
        <Box
          component="main"
          // sx={{ width: 'calc(100% - 260px)', flexGrow: 1, p: { xs: 2, sm: 3 }, backgroundImage: `url(${spaceBg})`
          sx={{ width: 'calc(100% - 260px)', flexGrow: 1, backgroundColor: '#d0d6daff', backgroundSize: 'cover' }}
        >
          {/* <Toolbar sx={{ mt: 'inherit' }} />
          <Box
            sx={{
              ...{ px: { xs: 0, sm: 2 } },
              position: 'relative',
              minHeight: 'calc(100vh - 110px)',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Box
              sx={{
                flexGrow: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            > */}
              
                <img
                  onClick={() => {
                    setIsVisible(!isVisible);
                  }}
                  style={{ objectFit: "cover", width: '100%', height: '99vh', filter:"blur(8px)" }}
                  src={`${spaceBg}`}
                  alt="space wallpaper image"
                />
              
            {/* </Box> */}
            {/* <Footer /> */}
          {/* </Box> */}
        </Box>
      )}
    </Box>
  );
}
