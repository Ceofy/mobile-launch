import { useState, useEffect, useRef, useContext } from 'react';
import * as Notifications from 'expo-notifications';

import Constants from 'expo-constants';
import { Platform } from 'react-native';

import { AuthContext } from 'MobileLaunch/contexts/auth';

export const usePushNotifications = () => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldShowAlert: true,
      shouldSetBadge: true,
    }),
  });

  const { userId, authToken } = useContext(AuthContext);

  const [expoPushToken, setExpoPushToken] = useState();
  const [notification, setNotification] = useState();
  const [permissionStatus, setPermissionStatus] = useState();

  const notificationListener = useRef();
  const responseListener = useRef();

  const registerForPushNotificationsAsync = async () => {
    let token;

    try {
      // Get push notification permissions
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      setPermissionStatus(existingStatus);

      if (permissionStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        setPermissionStatus(status);
      }

      // Get expo push notification token
      token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig.extra.eas.projectId,
      });
    } catch (error) {
      console.error(error);
    }

    // Configure additional android settings
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return token;
  };

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      setExpoPushToken(token);
    });

    notificationListener.current =
      Notifications.addNotificationReceivedListener(notification => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(response => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );

      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  useEffect(() => {
    if (authToken && userId && expoPushToken) {
      console.log(expoPushToken);
      // Define endpoint and headers
      const endpoint =
        process.env.EXPO_PUBLIC_API_HOST +
        process.env.EXPO_PUBLIC_NOTIF_ENDPOINT;

      const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      };

      // Find the record for this user-device in the database
      fetch(
        `${endpoint}?user_id=${userId}&pushNotificationToken=${expoPushToken}`,
        {
          headers,
        }
      )
        .then(response => response.json())
        .then(result => {
          const data = result.data;
          if (data && data.length === 0 && permissionStatus === 'granted') {
            // Create new record
            fetch(endpoint, {
              headers,
              method: 'POST',
              body: JSON.stringify({
                user_id: userId,
                pushNotificationToken: expoPushToken,
              }),
            });
          } else if (permissionStatus === 'granted') {
            for (const entry of data) {
              if (entry.unsubscribed === true) {
                // Subscribe
                fetch(endpoint + entry.id, {
                  headers,
                  method: 'PATCH',
                  body: JSON.stringify({
                    unsubscribed: false,
                  }),
                });
              }
            }
          } else {
            for (const entry of data) {
              if (entry.unsubscribed === false) {
                // Unsubscribe
                fetch(endpoint + entry.id, {
                  headers,
                  method: 'PATCH',
                  body: JSON.stringify({
                    unsubscribed: true,
                  }),
                });
              }
            }
          }
        });
    }
  }, [expoPushToken, userId, authToken]);

  return {
    notification,
  };
};
