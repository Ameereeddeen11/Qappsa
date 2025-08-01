import { BarcodeScanningResult, CameraView, useCameraPermissions } from 'expo-camera';
import { useEffect, useState } from 'react';
import { Button, Dimensions, StyleSheet, Text, View } from 'react-native';

export default function BarcodeScannerPage() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedData, setScannedData] = useState<string[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  const handleBarCodeScanned = (result: BarcodeScanningResult[]) => {
    if (!isScanning) return;
    if (result.length > 0) {
      const value = result[0].rawValue ?? '';
      if (value && !scannedData.includes(value)) {
        setScannedData((prev) => [...prev, value]);
      }
      setIsScanning(false); // vypni skenování po jednom skenu
    }
  };

  useEffect(() => {
    if (!permission || !permission.granted) {
      requestPermission();
    }
  }, []);

  if (!permission) {
    return <Text>Načítání oprávnění ke kameře...</Text>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text>Nemáš oprávnění ke kameře.</Text>
        <Button title="Povolit přístup" onPress={requestPermission} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          onBarcodeScanned={handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['qr', 'ean13', 'ean8', 'code128', 'code39', 'code93'],
          }}
        />
      </View>

      <View style={styles.listContainer}>
        <Button title="Naskenovat" onPress={() => setIsScanning(true)} />
        <Text>{scannedData}</Text>
        {/* <FlatList
          data={scannedData}
          keyExtractor={(item, index) => `${item}-${index}`}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text>{item}</Text>
            </View>
          )}
          ListEmptyComponent={<Text>Žádná data naskenována.</Text>}
        /> */}
      </View>
    </View>
  );
}

const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cameraContainer: {
    height: screenHeight / 2,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
    padding: 12,
  },
  item: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#eee',
    borderRadius: 8,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
