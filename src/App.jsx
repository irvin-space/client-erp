import React, { useState } from 'react';
import ChatWindow from './components/comun/ChatWindow';

// Importa los componentes de Mantis/MUI que estés usando
import { Box, Fab } from '@mui/material';
import { Chat as ChatIcon } from '@mui/icons-material';

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
// Esta es la ÚNICA definición de App
export default function App() {
  // 1. EL ESTADO Y LOS HANDLERS SE MUDAN AQUÍ DENTRO
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  // 2. AHORA, TU RETURN PUEDE ACCEDER A ELLOS
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

            {/* Botón flotante y Ventana de Chat
              Los dejaste en la posición perfecta:
              - DENTRO de ThemeCustomization (para que tomen el tema de Mantis)
              - DENTRO de MyProvider (para acceder a ese contexto si lo necesitan)
              - FUERA de RouterProvider (para que sean globales y no cambien con las rutas)
            */}
            <Fab
              color="primary"
              aria-label="Abrir chat"
              onClick={toggleChat} // Ahora 'toggleChat' existe en este contexto
              sx={{
                position: 'fixed',
                bottom: 32,
                right: 32,
                zIndex: 1300
              }}
            >
              <ChatIcon />
            </Fab>

            <ChatWindow
              isOpen={isChatOpen} // 'isChatOpen' también existe
              onClose={() => setIsChatOpen(false)}
            />
          </MyProvider>
        </ThemeCustomization>
      </ThemeModeProvider>
    </>
  );
}