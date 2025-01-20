import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Camera, useCameraDevice, useFrameProcessor } from 'react-native-vision-camera';
import { detectFaces } from '@react-native-ml-kit/face-detection';
import { Worklets } from 'react-native-worklets-core';

const CameraComponent = () => {
  const device = useCameraDevice('front');
  const cameraRef = useRef(null);
  const [faces, setFaces] = useState([]);

  const handleFacesDetection = Worklets.createRunInJsFn((detectedFaces) => {
    setFaces(detectedFaces);
  });

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';
    const detectedFaces = detectFaces(frame);
    handleFacesDetection(detectedFaces);
  }, [handleFacesDetection]);

  if (!device) {
    return <Text>No camera device found</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        device={device}
        isActive={true}
        frameProcessor={frameProcessor}
      />
      {faces.length > 0 && (
        <View style={styles.facesContainer}>
          {faces.map((face, index) => (
            <Text key={index} style={styles.faceText}>
              Face detected: {JSON.stringify(face)}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  facesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  faceText: {
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 5,
  },
});

export default CameraComponent;