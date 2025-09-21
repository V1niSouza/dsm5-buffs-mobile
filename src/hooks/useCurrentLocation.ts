import React, { useEffect, useState } from 'react';
import { Platform, PermissionsAndroid, Alert } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

export const useCurrentLocation = () => {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  async function requestLocationPermission() {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Permissão de Localização",
            message: "O app precisa acessar sua localização.",
            buttonNeutral: "Perguntar depois",
            buttonNegative: "Cancelar",
            buttonPositive: "OK"
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  }

  useEffect(() => {
    let watchId: number;

    const getLocation = async () => {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        Alert.alert('Permissão negada', 'Não é possível pegar sua localização.');
        return;
      }

      watchId = Geolocation.watchPosition(
        pos => setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
        err => console.log('Erro ao pegar localização:', err),
        { enableHighAccuracy: true, distanceFilter: 1, interval: 5000, fastestInterval: 2000 }
      );
    };

    getLocation();

    return () => {
      if (watchId !== undefined) Geolocation.clearWatch(watchId);
    };
  }, []);

  return location;
};
