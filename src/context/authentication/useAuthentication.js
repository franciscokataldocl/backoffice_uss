// useAuthentication.js
import { useContext, useEffect } from 'react';
import AuthContext from './AuthContext';

const useAuthentication = () => {
  const { checkAuthentication } = useContext(AuthContext);

  useEffect(() => {
    const handleRouteChange = async () => {
      await checkAuthentication();
    };

    handleRouteChange();

    // Limpiar el efecto al desmontar el componente
    return () => {
      // Si es necesario, limpiar algo aquí
    };
  }, [checkAuthentication]);

  return null;
};

export default useAuthentication;
