import React, { createContext, useEffect, useState } from 'react';
import { USERNAME, PASSWORD } from '../constants/constants';
import { saveToSecureStore } from '../utils/utils';

export const AuthContext = createContext();

export default ({ children }) => {
  const [userId, setUserId] = useState();
  const [authToken, setAuthToken] = useState();

  const authenticate = async (username, password) => {
    // Save username and password to app
    saveToSecureStore(USERNAME, username);
    saveToSecureStore(PASSWORD, password);

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

      setUserId(result.user.id);
      setAuthToken(result.accessToken);

      return result.mobileLoginToken;
    } catch (error) {
      console.error(error);
    }
  };

  const defaultContext = {
    userId,
    authToken,
    authenticate,
  };

  return (
    <AuthContext.Provider value={defaultContext}>
      {children}
    </AuthContext.Provider>
  );
};
