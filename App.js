import { Text, View, StyleSheet, Button, Linking, TouchableOpacity } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import React, { useState, useEffect } from 'react';

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [text, setText] = useState('Scan a QR code')

  // Request Camera Permission
  const CameraPermissionRequest = () => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })()
  }

  useEffect(() => {
    CameraPermissionRequest();
  }, []);

  // Scan the barcode
  const useBarCodeScanner = ({ type, data }) => {
    setScanned(true);
    setText(data)
    console.log('Type: ' + type + '\nData: ' + data)
  };

  // Check camera permissions
  if (hasPermission === null) {
    return(
      <View style={styles.container}>
        <Text>Requesting camera permission</Text>
      </View>
    ) 
  }

  if (hasPermission === false) {
    return(
      <View style={styles.container}>
        <Text>No access to camera</Text>
        <Button title={'Allow Camera'} onPress={() => CameraPermissionRequest()} />
      </View>
    ) 
  }

  // Open the link
  const clickableLink = () => {
    Linking.openURL(text).catch(err => console.error("Couldn't load page", err));
  }

  // Return the View
  return (
    <View style={styles.container}>
      <Text style={styles.header}>QR & Barcode Scanner</Text>
      <View style={styles.box}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : useBarCodeScanner}
          style={{ height: 350, width: 350 }} />
      </View>
      <Text style={styles.text} onPress={() => clickableLink()}>{text}</Text>
      {scanned && <TouchableOpacity onPress={() => setScanned(false)}><Text style={styles.button}>Scan Again</Text></TouchableOpacity>}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 30,
    margin: 30,
    fontWeight: 'bold',
    color: '#52616B'
  },
  container: {
    flex: 1,
    backgroundColor: '#C9D6DF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 350,
    width: 350,
    overflow: 'hidden',
    borderRadius: 30,
  },
  text: {
    fontSize: 18,
    margin: 20,
    fontWeight: 'bold',
    color: '#52616B'
  },
  button: {
    backgroundColor: "#52616B",
    color: "#FFF",
    fontSize: 18,
    fontWeight: 'bold',
    padding: 13,
    borderRadius: 10,
  }
});