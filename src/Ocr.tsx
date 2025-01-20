import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Alert,
  TouchableOpacity,
  Image,
  Modal,
  PermissionsAndroid,
  ActivityIndicator,
  Platform,
  BackHandler,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import TextRecognition from '@react-native-ml-kit/text-recognition';
import { useNavigation } from '@react-navigation/native';

const Ocr = () => {
    const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const specificID = 'G2309814600282';
  const passportNum = '1895290';

  useEffect(() => {
    if (Platform.OS === 'android') {
      requestGalleryPermission();
      requestCameraPermission();
    }
  }, []);

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'We need access to your camera to take photos.',
          buttonPositive: 'OK',
        }
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.error('Permission Error:', err);
    }
  };

  const requestGalleryPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Gallery Permission',
          message: 'We need access to your gallery to select photos.',
          buttonPositive: 'OK',
        }
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Gallery permission denied');
      }
    } catch (err) {
      console.error('Permission Error:', err);
    }
  };

  const handleOCRValidation = async (uri: string) => {
    try {
      setLoading(true);
      const recognizedText = await TextRecognition.recognize(uri);
      console.log('OCR Result:', recognizedText);

      // Normalize text
      const normalizedText = recognizedText.text
        .toLowerCase()
        .split('\n')
        .map((line) => line.trim().replace(/\s+/g, ' '));

      // Check for both conditions
      const hasNationalIDCard = normalizedText.some((line) =>
        line.includes('national identity card')
      );

      const hasPassport = normalizedText.some((line) =>
        line.includes('citizen of mauritius')
      );

      const hasPassportNum = normalizedText.some((line) =>
        line.includes(passportNum.toLowerCase())
      );

      const hasSpecificID = normalizedText.some((line) =>
        line.includes(specificID.toLowerCase())
      );

      // Determine validity based on ID type
      let isValid = false;
      let message = '';

      if (hasPassport && hasPassportNum) {
        isValid = true;
        message = 'Passport detected';
      } else if (hasNationalIDCard && hasSpecificID) {
        isValid = true;
        message = 'Valid National Identity Card & ID Number detected';
      } else {
        message = 'Invalid ID detected';
      }

      // Show the appropriate message
      Alert.alert('Validation Result', message);
      setLoading(false);
      return isValid;
    } catch (error) {
      setLoading(false);
      console.error('OCR Error:', error);
      Alert.alert('Error', 'An error occurred while processing the image.');
      return false;
    }
  };

  type PickerOptions = {
    cameraType?: 'back' | 'front';
  };


  const handleImageSelection = async (pickerFunction: Function, options: PickerOptions = {}) => {
    try {
      const result = await pickerFunction({
        mediaType: 'photo',
        includeBase64: false,
        cameraType: options.cameraType || 'back',
      });
      if (result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setSelectedImage(uri);

        const isValid = await handleOCRValidation(uri);
        if (!isValid) {
          Alert.alert('Validation Failed', 'The selected ID is not valid.');
        }
      } else {
        Alert.alert('Error', 'No image selected.');
      }
    } catch (error) {
      console.error('Image Selection Error:', error);
      Alert.alert('Error', 'Failed to select an image.');
    }
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBackPress = () => {
    navigation.goBack();
    return true;
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => handleImageSelection(launchCamera, { cameraType: 'back' })}
            style={styles.button}>
            <Text style={styles.buttonText}>Capture NID/Passport</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleImageSelection(launchImageLibrary)}
            style={styles.button}>
            <Text style={styles.buttonText}>Upload NID/Passport</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.infoText}>Upload NID or Passport in JPG or PNG format.</Text>

        {loading ? (
          <Modal transparent={true} visible={loading} animationType="none">
            <View style={styles.modalBackground}>
              <View style={styles.activityIndicatorWrapper}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={styles.loadingText}>
                  Please wait while your details are being verified
                </Text>
              </View>
            </View>
          </Modal>
        ) : (
          selectedImage && <Image style={styles.imagePreview} source={{ uri: selectedImage }} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  innerContainer: { padding: 20, alignItems: 'center' },
  buttonContainer: { flexDirection: 'row', marginBottom: 20 },
  button: { padding: 15, backgroundColor: '#2196F3', margin: 10, borderRadius: 5 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  infoText: { fontSize: 16, marginVertical: 10 },
  imagePreview: { width: 200, height: 200, marginTop: 20 },
  modalBackground: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#00000040' },
  activityIndicatorWrapper: { padding: 20, backgroundColor: '#fff', borderRadius: 10 },
  loadingText: { marginTop: 10, fontSize: 16 },
});

export default Ocr;
