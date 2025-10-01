import React from 'react';
import { IconButton } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
//import useConfig from 'hooks/useConfig';
import useThemeMode from '../contexts/ThemeModeContext.jsx';

export default function ThemeSwitcher() {
  //const { mode, onChangeMode } = useConfig();
  const {mode, onChangeMode} = useThemeMode();

  const toggleMode = () => {
    onChangeMode(mode === 'light' ? 'dark' : 'light');
  };

  return (
    <IconButton onClick={toggleMode} color="inherit">
      {mode === 'light' ? <Brightness4 /> : <Brightness7 />}
    </IconButton>
  );
}
