import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Button, FlatList, StyleSheet, View } from 'react-native';
import { IconButton, Text, TouchableRipple } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(false);
  const [codes, setCodes] = useState<{ data: string; count: number; id: string }[]>([]);
  const scannedRef = useRef(false);
  const router = useRouter();

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (scannedRef.current) return;
    scannedRef.current = true;

    setCodes(prev => {
      const existingIndex = prev.findIndex(item => item.data === data);
      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          count: updated[existingIndex].count + 1
        };
        return updated;
      } else {
        return [...prev, { data, id: String(prev.length), count: 1 }];
      }
    });
    setScanning(false);
  };

  const startScan = () => {
    scannedRef.current = false;
    setScanning(true);
  };

  const removeScanedCode = (id: string) => {
    setCodes(prev => prev.filter(code => code.id !== id));
  };

  const routeToDetail = (id: string) => {
    const code = codes.find(code => code.id === id);
    if (code) {
      router.push({
        pathname: '/detail',
        params: { data: code.data, count: code.count }
      })
    }
  }

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
            <Button title='Naskenujte čárový kód' onPress={startScan} />
          ) : (
            <>
              <CameraView
                style={styles.camera}
                onBarcodeScanned={handleBarCodeScanned}
              />
              <Text style={styles.scanningText}>Namiřte fotoaparát na čárový kód...</Text>
              <Button title="Zrušit" onPress={() => setScanning(false)} />
            </>
          )}
        </View>
        <FlatList
          data={codes}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableRipple style={styles.listItem} onPress={() => routeToDetail(item.id)}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                  {/* <Text>Typ: {item.type}</Text> */}
                  <Text>Data: {item.data}</Text>
                </View>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                  <Text>Pocet: {item.count}</Text>
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
