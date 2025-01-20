import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const HomeScreen = ({ navigation }: { navigation: any }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Smart Vision</Text>
      <Text style={styles.subtitle}>Select a feature to get started:</Text>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#4CAF50' }]}
        onPress={() => navigation.navigate('FaceDetection')}
      >
        <Text style={styles.buttonText}>Face Detection</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#2196F3' }]}
        onPress={() => navigation.navigate('LiveFaceDetection')}
      >
        <Text style={styles.buttonText}>LiveFaceDetection</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#2196F3' }]}
        onPress={() => navigation.navigate('Ocr')}
      >
        <Text style={styles.buttonText}>OCR</Text>
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
});

export default HomeScreen;
