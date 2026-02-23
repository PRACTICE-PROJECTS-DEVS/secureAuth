export const setToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', token);
  }
};

export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
};

export const removeToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user_id');
    localStorage.removeItem('auth_email');
  }
};

export const setUserId = (id: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_user_id', id);
  }
};

export const getUserId = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_user_id');
  }
  return null;
};

export const setUserEmail = (email: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_email', email);
  }
};

export const getUserEmail = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_email');
  }
  return null;
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};
