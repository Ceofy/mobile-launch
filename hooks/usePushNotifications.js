import { useState, useEffect, useRef, useContext } from 'react';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

import Constants from 'expo-constants';
import { Platform } from 'react-native';

import { AuthContext } from '../contexts/auth';

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

    // Get push notification permissions
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      setPermissionStatus(existingStatus);

      if (permissionStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        setPermissionStatus(status);
        if (status !== 'granted') {
          return;
        }
      }

      token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig.extra.eas.projectId,
      });
    } else {
      alert('Must be using a physical device for Push notifications');
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
    console.log(expoPushToken);
  }, [expoPushToken]);

  useEffect(() => {
    console.log(permissionStatus);
  }, []);

  useEffect(() => {
    // Need userId and auth to communicate with server
    if (userId && authToken) {
      // Define endpoint and headers
      const endpoint =
        process.env.EXPO_PUBLIC_API_HOST +
        process.env.EXPO_PUBLIC_NOTIF_ENDPOINT;

      const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      };

      if (permissionStatus !== 'granted') {
        console.log('permission not granted, checking if record exists');
        // Remove push token from db
        // Check if record exists at all
        fetch(endpoint + '?user_id=' + userId, {
          method: 'GET',
          headers,
        })
          .then(response => response.json())
          .then(result => {
            const data = result.data;
            if (data.length > 0) {
              for (const entry of data) {
                console.log('deleting existing record');
                fetch(endpoint + entry.id, {
                  method: 'DELETE',
                  headers,
                });
              }
            }
            if (result.id) {
            }
          });
      } else if (expoPushToken) {
        // Add push token to db, if it's not already there
        // Check if record exists already
        console.log('getting expo token to see if it needs updating');
        fetch(endpoint + '?user_id=' + userId, {
          method: 'GET',
          headers,
        })
          .then(response => response.json())
          .then(result => {
            const data = result.data;
            if (data.length > 0) {
              // Patch if push notification token isn't the same
              if (data[0].pushNotificationToken !== expoPushToken.data) {
                console.log('patching with new token');
                fetch(endpoint + data[0].id, {
                  method: 'PATCH',
                  headers,
                  body: JSON.stringify({
                    pushNotificationToken: expoPushToken.data,
                  }),
                });
              }
            } else {
              // Create new record with token
              console.log('creating new token record');
              fetch(endpoint, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                  user_id: userId,
                  pushNotificationToken: expoPushToken.data,
                }),
              }).catch(error => console.error(JSON.stringify(error)));
            }
          })
          .catch(error => console.error(JSON.stringify(error)));
      }
    }
  }, [expoPushToken, userId, authToken]);

  return {
    notification,
  };
};
