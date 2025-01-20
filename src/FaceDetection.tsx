import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Button, Alert, Image, Dimensions } from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import FaceDetection from '@react-native-ml-kit/face-detection';
import { Camera as CameraPermission } from 'react-native-vision-camera';
import RNFS from 'react-native-fs';

const { width } = Dimensions.get('window');

const FaceDetectionScreen = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const camera = useRef<Camera>(null);
  const device = useCameraDevice('front');

  useEffect(() => {
    const checkPermission = async () => {
      const cameraStatus = await CameraPermission.requestCameraPermission();
      if (cameraStatus === 'denied') {
        Alert.alert(
          'Permission Denied',
          'Camera permission is denied. Please allow access to the camera in settings.'
        );
      }
      setHasPermission(cameraStatus === 'granted');
    };

    if (hasPermission === null) {
      checkPermission();
    }
  }, [hasPermission]);

  const takePhoto = async () => {
    try {
      if (camera.current) {
        const photo = await camera.current.takePhoto();
        console.log('photo', photo);
        const filePath = `file://${photo.path}`;
        setCapturedImage(filePath);

        // Ensure file path exists
        const fileExists = await RNFS.exists(filePath);
        if (!fileExists) {
          Alert.alert('Error', 'Captured file does not exist.');
          return;
        }

        // Detect faces in the captured image
        const results = await FaceDetection.detect(filePath, { landmarkMode: 'all' });
        if (results && results.length > 0) {
          Alert.alert('Face Detected', `Detected ${results.length} face(s) in the image.`);
        } else {
          Alert.alert('No Faces Detected', 'No faces were detected in the image.');
        }
      } else {
        Alert.alert('Error', 'Camera not ready.');
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Could not take photo.');
    }
  };

  if (device == null) {
    return (
      <View style={styles.centered}>
        <Text>Loading camera...</Text>
      </View>
    );
  }

  if (hasPermission === null) {
    return (
      <View style={styles.centered}>
        <Text>Requesting Camera Permission...</Text>
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View style={styles.centered}>
        <Text style={styles.permissionText}>Camera permission is required!</Text>
        <Button
          title="Request Permission Again"
          onPress={async () => {
            const cameraStatus = await CameraPermission.requestCameraPermission();
            if (cameraStatus === 'granted') {
              setHasPermission(true);
            } else {
              Alert.alert('Permission Denied', 'Camera permission is required to use this feature.');
            }
          }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!capturedImage ? (
        <View style={styles.cameraContainer}>
          <Camera
            style={styles.camera}
            device={device}
            isActive={true}
            ref={camera}
            photo={true}
          />
        </View>
      ) : (
        <Image source={{ uri: capturedImage }} style={styles.capturedImage} />
      )}
      <View style={styles.buttonContainer}>
        <Button
          title={capturedImage ? 'Retake Photo' : 'Take Photo'}
          onPress={() => (capturedImage ? setCapturedImage(null) : takePhoto())}
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
  },
  cameraContainer: {
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: width * 0.35,
    overflow: 'hidden',
    backgroundColor: 'black',
  },
  camera: {
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
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
  permissionText: {
    fontSize: 18,
    color: '#FF0000',
  },
});

export default FaceDetectionScreen;
