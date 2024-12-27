import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Text, Button, Alert, Image } from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';

const App = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const cameraRef = useRef(null);

  const device = useCameraDevice('front');

  useEffect(() => {
    const requestPermissions = async () => {
      const cameraStatus = await Camera.requestCameraPermission();
      setHasPermission(cameraStatus === 'granted');
    };
    requestPermissions();
  }, []);

  const takePhoto = async () => {
    try {
      if (cameraRef.current) {
        const photo = await cameraRef.current.takePhoto({
          qualityPrioritization: 'balanced',
        });
        setCapturedImage(photo.path);
        Alert.alert('Photo taken', `Path: ${photo.path}`);
      } else {
        Alert.alert('Error', 'Camera not ready.');
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Could not take photo.');
    }
  };

  if (!hasPermission) {
    return (
      <View style={styles.centered}>
        <Text>No camera permission!</Text>
      </View>
    );
  }

  if (device == null) {
    return (
      <View style={styles.centered}>
        <Text>Loading camera...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!capturedImage ? (
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={true}
          ref={cameraRef}
          photo={true} // Ensure this prop is passed correctly
        />
      ) : (
        <Image source={{ uri: `file://${capturedImage}` }} style={styles.capturedImage} />
      )}
      <View style={styles.buttonContainer}>
        <Button
          title={capturedImage ? 'Retake Photo' : 'Take Photo'}
          onPress={() => {
            if (capturedImage) {
              setCapturedImage(null);
            } else {
              takePhoto();
            }
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    zIndex: 100,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  capturedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

export default App;
