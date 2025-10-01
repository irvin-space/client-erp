import PropTypes from 'prop-types';
import { useMemo } from 'react';

// material-ui
import { createTheme, StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// project imports
import useConfig from 'hooks/useConfig'; // <-- Mantenemos el hook de CONFIGURACIÓN
import useThemeMode from '../contexts/ThemeModeContext.jsx'; // <-- IMPORTAMOS el hook de MODO (ligero)
import Palette from './palette';
import Typography from './typography';
import CustomShadows from './shadows';
import componentsOverride from './overrides';

// ==============================|| DEFAULT THEME - MAIN ||============================== //

export default function ThemeCustomization({ children }) {
  
  // 1. OBTENER CONFIGURACIÓN PESADA (DIRECCIÓN, FUENTES, COLORES PREDETERMINADOS)
  // ESTO SOLO CAUSARÁ RE-RENDERIZADO SI CAMBIAN ESTAS OTRAS PROPS
  const { themeDirection, presetColor, fontFamily } = useConfig(); 
  
  // 2. OBTENER EL MODO (LIGHT/DARK) DEL CONTEXTO LIGERO Y AISLADO
  // ESTO CAUSARÁ RE-RENDERIZADO SOLO CUANDO CAMBIE EL MODO
  const { mode } = useThemeMode(); 

  // Ahora Palette solo depende del MODO y el COLOR PREDETERMINADO
  const theme = useMemo(() => Palette(mode, presetColor), [mode, presetColor]); 

  const themeTypography = useMemo(() => Typography(fontFamily), [fontFamily]);

  const themeCustomShadows = useMemo(() => CustomShadows(theme), [theme]);

  const themeOptions = useMemo(
    () => ({
      breakpoints: {
        values: {
          xs: 0,
          sm: 768,
          md: 1024,
          lg: 1266,
          xl: 1440
        }
      },
      direction: themeDirection,
      mixins: {
        toolbar: {
          minHeight: 60,
          paddingTop: 8,
          paddingBottom: 8
        }
      },
      palette: theme.palette,
      customShadows: themeCustomShadows,
      typography: themeTypography
    }),
    [themeDirection, theme, themeTypography, themeCustomShadows] // themeDirection ahora viene de useConfig
  );

  const themes = createTheme(themeOptions);
  themes.components = componentsOverride(themes);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={themes}>
        <CssBaseline enableColorScheme />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

ThemeCustomization.propTypes = { children: PropTypes.node };
