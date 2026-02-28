import {useEffect, useState} from 'react';
import {AuthService} from '../AuthService';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(AuthService.isAuthenticated);

  const handleAuthChange = () => {
    setIsAuthenticated(AuthService.isAuthenticated);
  };

  useEffect(() => {
    // Listen to storage events which are fired when localStorage changes in other windows/tabs
    window.addEventListener('storage', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

  return { isAuthenticated };
};
