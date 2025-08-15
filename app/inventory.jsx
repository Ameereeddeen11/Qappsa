import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter, useGlobalSearchParams, Stack } from "expo-router";
import { useEffect, useRef, useState, useContext } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import {
  IconButton,
  Text,
  Button,
  Card,
  Title,
  Paragraph,
  FAB,
  Portal,
  PaperProvider
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { getProducts, addProduct, deleteProduct } from "../utils/products";
import { GlobalContext } from "@/context/GlobalProvider";
import { RefreshControl } from "react-native";
import { exportToCSV, formatDataForExport } from "@/utils/export";

export default function InventoryScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(false);
  const [products, setProducts] = useState([]);
  const [state, setState] = useState(false);
  const scannedRef = useRef(false);
  const router = useRouter();
  const { refreshing, setRefreshing } = useContext(GlobalContext);
  const { date } = useGlobalSearchParams();

  const onStateChange = ({ open }) => setState({ open });

  const { open } = state;

  const fetchProducts = async () => {
    const data = await getProducts(date);
    setProducts(data);
  };

  const onRefresh = () => {
    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleBarCodeScanned = async ({ data }) => {
    if (scannedRef.current) return;
    scannedRef.current = true;

    try {
      const updatedProducts = await addProduct(date, data);
      setProducts(updatedProducts);
    } catch (error) {
      console.error("Chyba při přidávání produktu:", error);
    }
    setScanning(false);
  };

  const handlePress = ({ item }) => {
    if (!scanning) {
      router.push({
        pathname: "/product",
        params: { id: item.id, date },
      });
    }
  };

  const startScan = () => {
    scannedRef.current = false;
    setScanning(true);
  };

  const removeScannedCode = async (productId) => {
    try {
      const updatedProducts = await deleteProduct(date, productId);
      setProducts(updatedProducts);
    } catch (error) {
      console.error("Chyba při mazání produktu:", error);
    }
  };

  if (!permission) {
    return (
      <View style={styles.centered}>
        <Text>Loading camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.centered}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button mode="contained" onPress={requestPermission}>
          Grant Permission
        </Button>
      </View>
    );
  }

  return (
    <PaperProvider>
      <Portal>
        <SafeAreaView style={styles.container}>
          <Stack.Screen
            options={{
              title: date ? `Inventura: ${date}` : "Inventury",
            }}
          />

          {/* Scanning overlay */}
          {scanning ? (
            <View style={styles.cameraOverlay}>
              <CameraView
                style={styles.camera}
                onBarcodeScanned={handleBarCodeScanned}
              />
              <Text style={styles.scanningText}>
                Namiřte fotoaparát na čárový kód...
              </Text>
              <Button
                mode="outlined"
                style={{ marginTop: 12 }}
                onPress={() => setScanning(false)}
              >
                Zrušit
              </Button>
            </View>
          ) : (
            <>
              <FlatList
                data={products}
                refreshControl={
                  <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                keyExtractor={(item) => String(item.id)}
                contentContainerStyle={{ paddingBottom: 100 }}
                ListEmptyComponent={
                  <Text style={{ textAlign: "center", marginTop: 20 }}>
                    Žádné produkty
                  </Text>
                }
                renderItem={({ item }) => (
                  <Card
                    style={styles.card}
                    onPress={() => handlePress({ item })}
                  >
                    <Card.Content style={styles.cardContent}>
                      <View style={{ flex: 1 }}>
                        <Title>Produkt ID: {item.id}</Title>
                        <Paragraph>Počet: {item.count}</Paragraph>
                      </View>
                      <IconButton
                        icon="delete-outline"
                        size={24}
                        iconColor="red"
                        onPress={() => removeScannedCode(item.id)}
                      />
                    </Card.Content>
                  </Card>
                )}
              />

              <FAB.Group
                open={open}
                visible
                icon={open ? "close" : "plus"}
                actions={[
                  { 
                    icon: 'barcode-scan', 
                    label: 'Naskenovat',
                    onPress: () => startScan()
                  },
                  {
                    icon: 'file-export',
                    label: 'Exportovat',
                    onPress: () => {
                      const formattedData = formatDataForExport(products);
                      exportToCSV(formattedData, `inventury_${date}`);
                    }
                  },
                ]}
                onStateChange={onStateChange}
                style={styles.fab}
              />
              {/* <FAB
                icon="barcode-scan"
                label="Přidat produkt"
                style={styles.fabScan}
                onPress={startScan}
              />
              <FAB
                icon="file-export"
                label="Exportovat"
                style={styles.fabExport}
                onPress={() => {
                  const formattedData = formatDataForExport(products);
                  exportToCSV(formattedData, `inventury_${date}`);
                }}
              /> */}
            </>
          )}
        </SafeAreaView>
      </Portal>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scanningText: {
    marginTop: 10,
    textAlign: "center",
  },
  card: {
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  fabScan: {
    position: "absolute",
    right: 20,
    bottom: 90,
  },
  fabExport: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#4CAF50",
  },
  cameraOverlay: {
    flex: 1,
    alignItems: "center",
    paddingTop: 20,
  },
  camera: {
    width: "90%",
    aspectRatio: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  message: {
    textAlign: "center",
    marginBottom: 10,
  },
});
