import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Alert, useWindowDimensions } from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import { useLocalSearchParams } from "expo-router";

export default function MapScreen() {
  const { height } = useWindowDimensions();
  const myRef = useRef<any>();

  const params = useLocalSearchParams();

  const destination = (params.destination as string) || "";
  const startingLocation = (params.startingLocation as string) || "";
  // const destination = "Coorg, Karnataka, India";
  // const startingLocation = "Hyderabad, Telangana, India";

  const [userLocation, setUserLocation] = useState<any>(null);
  const [startCoords, setStartCoords] = useState<any>(null);
  const [destCoords, setDestCoords] = useState<any>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location permission denied");
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setUserLocation(loc.coords);

      if (startingLocation) {
        const geoStart = await Location.geocodeAsync(startingLocation);
        if (geoStart.length > 0) {
          setStartCoords(geoStart[0]);
        }
      }

      if (destination) {
        const geoDest = await Location.geocodeAsync(destination);
        if (geoDest.length > 0) {
          setDestCoords(geoDest[0]);
        }
      }
    })();
  }, []);

  useEffect(() => {
    if (startCoords && destCoords && myRef.current) {
      myRef.current.fitToCoordinates(
        [startCoords, destCoords],
        {
          edgePadding: {
            top: 100,
            right: 50,
            bottom: 100,
            left: 50,
          },
          animated: true,
        }
      );
    }
  }, [startCoords, destCoords]);

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={myRef}
        style={StyleSheet.absoluteFill}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        showsMyLocationButton
        mapPadding={{ top: height - 50, right: 10, bottom: 0, left: 20 }}
        initialRegion={{
          latitude: 20.5937,
          longitude: 78.9629,
          latitudeDelta: 5,
          longitudeDelta: 5,
        }}
        onMapReady={() => {
          if (userLocation) {
            myRef.current?.animateToRegion(
              {
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              },
              1400
            );
          }
        }}
      >
        {/* 🟢 START LOCATION */}
        {startCoords && (
          <Marker
            coordinate={startCoords}
            title="Start"
            description={startingLocation}
            pinColor="green"
            onPress={() => {
              myRef.current?.animateToRegion(
                {
                  latitude: startCoords.latitude,
                  longitude: startCoords.longitude,
                  latitudeDelta: 0.05,
                  longitudeDelta: 0.05,
                },
                1200
              );
            }}
          />
        )}

        {/* 🔴 DESTINATION */}
        {destCoords && (
          <Marker
            coordinate={destCoords}
            title="Destination"
            description={destination}
            pinColor="red"
            onPress={() => {
              myRef.current?.animateToRegion(
                {
                  latitude: destCoords.latitude,
                  longitude: destCoords.longitude,
                  latitudeDelta: 0.05,
                  longitudeDelta: 0.05,
                },
                1200
              );
            }}
          />
        )}
        {/* 🟦 ROUTE LINE */}
        {startCoords && destCoords && (
          <Polyline
            coordinates={[
              startCoords,
              destCoords
            ]}
            strokeWidth={2}
            strokeColor="#042f2e"
            lineJoin="round"
            lineCap="round"
          />
        )}
      </MapView>
    </View>
  );
}