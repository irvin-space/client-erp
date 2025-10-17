import { RouterProvider } from 'react-router-dom';

import { ThemeModeProvider } from './contexts/ThemeModeContext.jsx'; 

//Provider
import {  MyProvider } from './context';

// project imports
import router from './routes';
import ThemeCustomization from './themes';

import Locales from './components/Locales';
import RTLLayout from './components/RTLLayout';
import ScrollTop from './components/ScrollTop';
import Snackbar from './components/@extended/Snackbar';
import Notistack from './components/third-party/Notistack';

// auth-provider
import { JWTProvider as AuthProvider } from './contexts/JWTContext';

// ==============================|| APP - THEME, ROUTER, LOCAL ||============================== //

export default function App() {
  return (
    <>
      {/* 1. EL PROVEEDOR LIGERO DEL MODO ENVUELVE TODO, YA QUE ES LA INFORMACIÓN MÁS BÁSICA */}
      <ThemeModeProvider> 
        {/* 2. ThemeCustomization CONSUME el modo y APLICA el MUI ThemeProvider a todo lo de abajo */}
        <ThemeCustomization>
          {/* 3. MyProvider (con useConfig) y AuthProvider están AHORA dentro del ThemeProvider de MUI */}
          <MyProvider>
            <RTLLayout>
              <Locales>
                <ScrollTop>
                  <AuthProvider>
                    <>
                      <Notistack>
                        <RouterProvider router={router} />
                        <Snackbar />
                      </Notistack>
                    </>
                  </AuthProvider>
                </ScrollTop>
              </Locales>
            </RTLLayout>
          </MyProvider>
        </ThemeCustomization>
      </ThemeModeProvider>
    </>
  );
}
