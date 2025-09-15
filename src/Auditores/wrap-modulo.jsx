import React, { useEffect } from 'react';
import useAuth from 'hooks/useAuth.js';
import useSQL from 'hooks/useSQL.js';

const WrapModulo = ({ children, nombreModulo }) => {
  const { user } = useAuth();
  const { executeFetch } = useSQL();

  useEffect(() => {
    // 1. Lógica al montar el componente (cuando se abre el módulo)
    const registrarInicio = async () => {
      if (!user) return;

      const params = {
        sucursal: `'${user.sucursal}'`,
        usuario: `'${user.id_persona}'`,
        modulo: `'${nombreModulo}'`,
        evento: `'Inicio'`
        //-- otras variables que necesites, como la fecha y hora
      };
      await executeFetch('Registra_Acceso_Modulo', params);
    };

    // 2. Lógica al desmontar el componente (cuando se cierra el módulo)
    const registrarFin = async () => {
      if (!user) return;

      const params = {
        usuario: `'${user.id_persona}'`,
        modulo: `'${nombreModulo}'`,
        evento: `'Fin'`
        //-- otras variables que necesites
      };
      await executeFetch('Registra_Acceso_Modulo', params);
    };

    registrarInicio();

    // 3. La función de limpieza que se ejecuta al desmontar
    return () => {
      registrarFin();
    };
  }, [nombreModulo, user, executeFetch]);

  return (
    <>
      {children}
    </>
  );
};

export default WrapModulo;