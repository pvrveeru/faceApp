import React, { useState, useRef } from 'react';
import { View, StyleSheet, Text, Button, Alert, Image, Dimensions } from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import FaceDetection from '@react-native-ml-kit/face-detection';

const { width } = Dimensions.get('window');

const FaceDetectionScreen = () => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const cameraRef = useRef(null);
  const device = useCameraDevice('front');

  const takePhoto = async () => {
    try {
      if (cameraRef.current) {
        const photo = await cameraRef.current.takePhoto({
          qualityPrioritization: 'balanced',
        });
        setCapturedImage(photo.path);
      } else {
        Alert.alert('Error', 'Camera not ready.');
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Could not take photo.');
    }
  };

  const detectFaces = async () => {
    if (capturedImage) {
      try {
        const contentUri = `file://${capturedImage}`;
        const results = await FaceDetection.detect(contentUri, { landmarkMode: 'all' });

        if (results && results.length > 0) {
          Alert.alert('Face Detected', `Detected ${results.length} face(s) in the image.`);
        } else {
          Alert.alert('No Faces Detected', 'No faces were detected in the image.');
        }
      } catch (error) {
        Alert.alert('Error', 'An error occurred while detecting faces.');
      }
    } else {
      Alert.alert('No Image', 'No image has been captured for face detection.');
    }
  };

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
        <View style={styles.cameraContainer}>
          <Camera
            style={styles.camera}
            device={device}
            isActive={true}
            ref={cameraRef}
            photo={true}
          />
        </View>
      ) : (
        <Image source={{ uri: `file://${capturedImage}` }} style={styles.capturedImage} />
      )}
      <View style={styles.buttonContainer}>
        <Button
          title={capturedImage ? 'Retake Photo' : 'Take Photo'}
          onPress={() => (capturedImage ? setCapturedImage(null) : takePhoto())}
        />
        {capturedImage && <Button title="Detect Faces" onPress={detectFaces} />}
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
});

export default FaceDetectionScreen;
