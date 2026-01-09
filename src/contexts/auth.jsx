import { useMutation } from '@tanstack/react-query';
import { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { api } from '@/lib/axios';

export const AuthContext = createContext({
  user: null,
  login: () => {},
  signup: () => {},
});

export const useAuthContext = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState();

  const signupMutation = useMutation({
    mutationKey: ['signup'],
    mutationFn: async (variables) => {
      const response = await api.post('/users', {
        first_name: variables.firstName,
        last_name: variables.lastName,
        email: variables.email,
        password: variables.password,
      });

      return response.data;
    },
  });

  const loginMutation = useMutation({
    mutationKey: ['login'],
    mutationFn: async (variables) => {
      const response = await api.post('users/login', {
        email: variables.email,
        password: variables.password,
      });
      return response.data;
    },
  });

  useEffect(() => {
    const init = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        if (accessToken && !refreshToken) return;
        const response = await api.get('/users/me', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        console.error(error);
      }
    };
    init();
  }, []);

  const signup = (data) => {
    signupMutation.mutate(data, {
      onSuccess: (createUser) => {
        const accessToken = createUser.tokens.accessToken;
        const refreshToken = createUser.tokens.refreshToken;

        setUser(createUser);

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        toast.success('Conta criada com sucesso!');
      },
      onError: () => {
        toast.error('Erro ao criar conta. Tente novamente.');
      },
    });
  };

  const login = (data) => {
    loginMutation.mutate(data, {
      onSuccess: (loggedUser) => {
        const accessToken = loggedUser.tokens.accessToken;
        const refreshToken = loggedUser.tokens.refreshToken;

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        setUser(loggedUser);
        toast.success('Login realizado com sucesso!');
      },
      onError: (error) => {
        console.error(error);
      },
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
