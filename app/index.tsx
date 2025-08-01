import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import { Button, FlatList, StyleSheet, Text, View } from 'react-native';
import { IconButton, TouchableRipple } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(false);
  const [codes, setCodes] = useState<{ type: string; data: string; id: string }[]>([]);
  const scannedRef = useRef(false);

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    if (scannedRef.current) return;
    scannedRef.current = true;

    setCodes(prev => [...prev, { type, data, id: String(prev.length) }]);
    setScanning(false);
  };

  const startScan = () => {
    scannedRef.current = false;
    setScanning(true);
  };

  const removeScanedCode = (id: string) => {
    setCodes(prev => prev.filter(code => code.id !== id));
  };

  // const removeScanedCode = (id: string) => {
  //   setCodes(prev => prev.filter(code => code.id !== String(id)));
  // }

  if (!permission) {
    return ( 
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading camera permission...</Text>
      </View>
    )
  }

  if (!permission.granted) {
    return (
      <View style={{ flex: 1 }}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.cameraContainer}>
          {!scanning ? (
            <Button title='Scan bar code' onPress={startScan} />
          ) : (
            <>
              <CameraView
                style={styles.camera}
                onBarcodeScanned={handleBarCodeScanned}
              />
              <Text style={styles.scanningText}>Point the camera at a barcode...</Text>
              <Button title="Cancel" onPress={() => setScanning(false)} />
            </>
          )}
        </View>
        <FlatList
          data={codes}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableRipple style={styles.listItem} onPress={() => console.log(item)}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                  <Text>Type: {item.type}</Text>{'\n'}
                  <Text>Data: {item.data}</Text>
                </View>
                <>
                  <IconButton 
                    icon="delete-empty" 
                    size={20} 
                    iconColor='red'
                    onPress={() => removeScanedCode(item.id)}
                  />
                </>
              </View>
            </TouchableRipple>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20 
  },
  scanningText: { 
    marginTop: 10, 
    textAlign: 'center' 
  },
  listItem: {
    padding: 10,
    borderTopWidth: 0.2,
    borderBottomWidth: 1, 
    borderBottomColor: '#ccc' 
  },
  cameraContainer: {
    height: "50%",
    backgroundColor: "transparent",
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
});
