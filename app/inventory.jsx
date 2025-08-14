import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter, useGlobalSearchParams, Stack } from "expo-router";
import { useEffect, useRef, useState, useContext } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { IconButton, Text, TouchableRipple, Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { getProducts, addProduct, deleteProduct } from "../utils/products";
import { GlobalContext } from "@/context/GlobalProvider";
import { RefreshControl } from "react-native";
import { getInventories } from "@/utils/inventory";

export default function InventoryScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(false);
  const [products, setProducts] = useState([]);
  const scannedRef = useRef(false);
  const router = useRouter();
  const { refreshing, setRefreshing } = useContext(GlobalContext);

  const { date } = useGlobalSearchParams();

  const onRefresh = () => {
    const fetchProducts = async () => {
      const data = await getProducts(date);
      setProducts(data);
    };
    fetchProducts();
  }

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getProducts(date);
      setProducts(data);
    };
    fetchProducts();
  }, [date]);

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
    if (scanning) {
      setScanning(false);
    } else {
      router.push({
        pathname: "/product",
        params: { id: item.id, date: date },
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
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={{ flex: 1 }}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: date ? `Inventura: ${date}` : "Inventury"
        }}
      />
        <View style={styles.cameraContainer}>
          {!scanning ? (
            <IconButton
              icon="magnify-scan"
              mode="contained"
              size={250}
              onPress={startScan}
              style={{ borderRadius: 25 }}
            />
          ) : (
            <>
              <CameraView
                style={styles.camera}
                onBarcodeScanned={handleBarCodeScanned}
              />
              <Text style={styles.scanningText}>
                Namiřte fotoaparát na čárový kód...
              </Text>
              <Button title="Zrušit" onPress={() => setScanning(false)} />
            </>
          )}
        </View>
        <FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          data={products}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <TouchableRipple
              style={styles.listItem}
              onPress={() => handlePress({ item })}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ flex: 1, justifyContent: "center" }}>
                  <Text>ID: {item.id}</Text>
                </View>
                <View style={{ flex: 1, justifyContent: "center" }}>
                  <Text>Počet: {item.count}</Text>
                </View>
                <IconButton
                  icon="delete-empty"
                  size={20}
                  iconColor="red"
                  onPress={() => removeScannedCode(item.id)}
                />
              </View>
            </TouchableRipple>
          )}
        />
        <IconButton
          icon="file-export"
          size={70}
          // onPress={() => router.push({ pathname: "/products", params: { date } })}
          style={styles.createInventoryButtton}
        />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  scanningText: {
    marginTop: 10,
    textAlign: "center",
  },
  listItem: {
    padding: 10,
    borderTopWidth: 0.2,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  createInventoryButtton: {
    position: "absolute",
    padding: 5,
    bottom: 50,
    right: "45%",
  },
  cameraContainer: {
    height: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  camera: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 8,
    overflow: "hidden",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
});
