import React, { useState, useRef } from 'react';
import { View, StyleSheet, Text, Button, Alert, Image, Dimensions } from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import TextRecognition from '@react-native-ml-kit/text-recognition';

const { width } = Dimensions.get('window');

const TextRecognitionScreen = () => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const cameraRef = useRef(null);
  const device = useCameraDevice('back');

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

  const recognizeText = async () => {
    if (capturedImage) {
      try {
        const contentUri = `file://${capturedImage}`;
        const result = await TextRecognition.recognize(contentUri);

        if (result && result.text) {
          Alert.alert('Text Recognized', `Detected text: ${result.text}`);
        } else {
          Alert.alert('No Text Detected', 'No text was detected in the image.');
        }
      } catch (error) {
        Alert.alert('Error', 'An error occurred while recognizing text.');
      }
    } else {
      Alert.alert('No Image', 'No image has been captured for text recognition.');
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
        {capturedImage && <Button title="Recognize Text" onPress={recognizeText} />}
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

export default TextRecognitionScreen;
