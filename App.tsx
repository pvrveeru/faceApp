// import React, { useEffect, useState, useRef } from 'react';
// import { View, StyleSheet, Text, Button, Alert, Image, Dimensions } from 'react-native';
// import { Camera, useCameraDevice } from 'react-native-vision-camera';
// import FaceDetection from '@react-native-ml-kit/face-detection';

// const { width } = Dimensions.get('window');

// const App = () => {
//   const [hasPermission, setHasPermission] = useState(false);
//   const [capturedImage, setCapturedImage] = useState<string | null>(null);
//   const cameraRef = useRef(null);
//   const device = useCameraDevice('front');

//   useEffect(() => {
//     const requestPermissions = async () => {
//       const cameraStatus = await Camera.requestCameraPermission();
//       setHasPermission(cameraStatus === 'granted');
//     };
//     requestPermissions();
//   }, []);

//   const takePhoto = async () => {
//     try {
//       if (cameraRef.current) {
//         const photo = await cameraRef.current.takePhoto({
//           qualityPrioritization: 'balanced',
//         });
//         setCapturedImage(photo.path);
//         //Alert.alert('Photo taken', `Path: ${photo.path}`);
//       } else {
//         Alert.alert('Error', 'Camera not ready.');
//       }
//     } catch (error) {
//       console.error('Error taking photo:', error);
//       Alert.alert('Error', 'Could not take photo.');
//     }
//   };

//   if (!hasPermission) {
//     return (
//       <View style={styles.centered}>
//         <Text>No camera permission!</Text>
//       </View>
//     );
//   }

//   if (device == null) {
//     return (
//       <View style={styles.centered}>
//         <Text>Loading camera...</Text>
//       </View>
//     );
//   }

//   const detectFaces = async () => {
//     if (capturedImage) {
//       try {
//         // Convert file path to a valid content URI
//         const contentUri = `file://${capturedImage}`;
//         const results = await FaceDetection.detect(contentUri, { landmarkMode: 'all' });

//         if (results && results.length > 0) {
//           // Show an alert if faces are detected
//           Alert.alert(
//             'Face Detected',
//             `Detected ${results.length} face(s) in the image.`,
//             [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
//           );
//           //console.log('Face detection results:', results);
//         } else {
//           Alert.alert(
//             'No Faces Detected',
//             'No faces were detected in the image.',
//             [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
//           );
//         }
//       } catch (error) {
//         //console.error('Error detecting faces:', error);
//         Alert.alert(
//           'Error',
//           'An error occurred while detecting faces. Please try again.',
//           [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
//         );
//       }
//     } else {
//       //console.error('No image captured for face detection');
//       // Alert.alert(
//       //   'No Image',
//       //   'No image has been captured for face detection.',
//       //   [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
//       // );
//     }
//   };

//   console.log('detectfaces', detectFaces());
//   console.log('capturedImage', capturedImage);
//   return (
//     <View style={styles.container}>
//       {!capturedImage ? (
//         <>
//           <View style={styles.cameraContainer}>
//             <Camera
//               style={styles.camera}
//               device={device}
//               isActive={true}
//               ref={cameraRef}
//               photo={true} // Ensure this prop is passed correctly
//             />
//           </View>
//         </>
//       ) : (
//         <Image source={{ uri: `file://${capturedImage}` }} style={styles.capturedImage} />
//       )}
//       <View style={styles.buttonContainer}>
//         <Button
//           title={capturedImage ? 'Retake Photo' : 'Take Photo'}
//           onPress={() => {
//             if (capturedImage) {
//               setCapturedImage(null);
//             } else {
//               takePhoto();
//             }
//           }}
//         />
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   cameraContainer: {
//     width: width * 0.7,
//     height: width * 0.7,
//     borderRadius: width * 0.35,
//     overflow: 'hidden',
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'black',
//   },
//   camera: {
//     width: '100%',
//     height: '100%',
//   },
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     position: 'relative',
//     backgroundColor: '#000',
//   },
//   buttonContainer: {
//     position: 'absolute',
//     bottom: 20,
//     alignSelf: 'center',
//     zIndex: 100,
//   },
//   centered: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   capturedImage: {
//     width: '100%',
//     height: '100%',
//     resizeMode: 'contain',
//   },
//   overlay: {
//     ...StyleSheet.absoluteFillObject,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   overlayTop: {
//     backgroundColor: 'rgba(0, 0, 0, 0.9)',
//     width: '100%',
//     flex: 1,
//   },
//   overlayMiddle: {
//     flexDirection: 'row',
//     height: width * 0.95,
//   },
//   overlayBottom: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.9)',
//     width: '100%',
//   },
//   sideOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.9)',
//   },
//   innerCircle: {
//     width: width * 0.75,
//     height: width * 0.95,
//     borderRadius: (width * 0.75) / 2,
//     borderWidth: 2,
//     borderColor: 'white', // Optional border color
//   },
// });

// export default App;

import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Camera } from 'react-native-vision-camera';
import FaceDetectionScreen from './src/FaceDetection';
import TextRecognitionScreen from './src/TextRecognitionScreen';

const App = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<'face' | 'text' | null>(null);

  useEffect(() => {
    const requestPermissions = async () => {
      const cameraStatus = await Camera.requestCameraPermission();
      if (cameraStatus === 'denied') {
        Alert.alert('Permission Required', 'Camera permission is required to use this feature.');
      }
      setHasPermission(cameraStatus === 'granted');
    };
    requestPermissions();
  }, []);

  if (!hasPermission) {
    return (
      <View style={styles.centered}>
        <Text style={styles.permissionText}>No camera permission!</Text>
      </View>
    );
  }

  if (selectedFeature === 'face') {
    return <FaceDetectionScreen />;
  }

  if (selectedFeature === 'text') {
    return <TextRecognitionScreen />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Smart Vision</Text>
      <Text style={styles.subtitle}>Select a feature to get started:</Text>
      
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#4CAF50' }]}
        onPress={() => setSelectedFeature('face')}
      >
        <Text style={styles.buttonText}>Face Detection</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#2196F3' }]}
        onPress={() => setSelectedFeature('text')}
      >
        <Text style={styles.buttonText}>Text Recognition</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  button: {
    width: '80%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: '600',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionText: {
    fontSize: 18,
    color: '#FF0000',
  },
});

export default App;


