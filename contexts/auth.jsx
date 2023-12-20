import React, { createContext, useState } from 'react';
import { USERNAME, PASSWORD } from '../constants/constants';
import { saveToSecureStore } from '../utils/utils';

export const AuthContext = createContext();

export default ({ children }) => {
  const [userId, setUserId] = useState();
  const [authToken, setAuthToken] = useState();
  const [authError, setAuthError] = useState();

  const authenticate = async (username, password) => {
    // Get temporary launch token from app
    try {
      const response = await fetch(
        process.env.EXPO_PUBLIC_API_HOST +
          process.env.EXPO_PUBLIC_AUTH_ENDPOINT,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username,
            password,
            strategy: 'local',
            getMobileLoginToken: true,
          }),
        }
      );

      result = await response.json();

      if (result.user) {
        setUserId(result.user.id);
        setAuthToken(result.accessToken);

        // Save username and password to app
        saveToSecureStore(USERNAME, username);
        saveToSecureStore(PASSWORD, password);

        setAuthError();
        return result.mobileLoginToken;
      }

      // Handle error
      setAuthError(result.message);
    } catch (error) {
      console.error(error);
    }
  };

  const defaultContext = {
    userId,
    authToken,
    authError,
    authenticate,
  };

  return (
    <AuthContext.Provider value={defaultContext}>
      {children}
    </AuthContext.Provider>
  );
};
