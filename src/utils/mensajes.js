import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import 'sweetalert2/dist/sweetalert2.min.css';
import '@sweetalert2/theme-material-ui/material-ui.css';

const MiSweetAlert = withReactContent(Swal);

export const mensajes = (metodo, titulo, mensaje) => {
  const icon = metodo === 'aviso' ? 'info' : metodo === 'error' ? 'error' : metodo === 'pregunta' ? 'question' : 'info';

  // Configuración de la clase para el z-index
  const customClass = {
    popup: 'sweet-alert-top' // Le asignamos una clase CSS
  };

  const configuracionDeAlerta =
    metodo == 'pregunta'
      ? {
          title: titulo,
          text: mensaje,
          icon: icon,
          showDenyButton: true,
          denyButtonText: `No`,
          denyButtonColor: '#8d8c8d',
          confirmButtonText: 'Si',
          confirmButtonColor: '#1776ff',
          customClass: customClass, // Agregamos la clase aquí
          target: 'body',   // 👈 aquí el truco
        }
      : {
          title: titulo,
          text: mensaje,
          icon: icon,
          confirmButtonText: 'Aceptar',
          customClass: customClass, // Agregamos la clase aquí
          target: 'body',   // 👈 también aquí
        };

  if (metodo == 'pregunta') {
    MiSweetAlert.fire(configuracionDeAlerta).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Saved!', '', 'success');
        console.log(result)
        console.log(result.isConfirmed)
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info');
      }
    });
  } else {
    MiSweetAlert.fire(configuracionDeAlerta);
  }
}; 