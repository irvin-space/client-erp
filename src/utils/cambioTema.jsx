import React from 'react';
import { IconButton } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import useConfig from 'hooks/useConfig';

export default function ThemeSwitcher() {
  const { mode, onChangeMode } = useConfig();

  const toggleMode = () => {
    onChangeMode(mode === 'light' ? 'dark' : 'light');
  };

  return (
    <IconButton onClick={toggleMode} color="inherit">
      {mode === 'light' ? <Brightness4 /> : <Brightness7 />}
    </IconButton>
  );
}
