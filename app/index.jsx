import { useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { IconButton, Button, Text, TouchableRipple } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  getInventories,
  addInventory,
  deleteInventory,
} from "../utils/inventory";
import { ScrollView } from "react-native";

export default function HomeScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [inventories, setInventories] = useState([]);
  const router = useRouter();

  const handleAddInventory = () => {
    const date = new Date().toISOString().split("T")[0];
    addInventory(date)
      .then((inventories) => {
        setInventories(inventories);
        router.push({ pathname: "/inventory", params: { date } });
      })
      .catch((error) => {
        console.error("Chyba při přidávání inventury:", error);
        alert(error.message);
      });
  };

  useEffect(() => {
    const fetchInventories = async () => {
      const data = await getInventories();
      setInventories(data);
    };
    fetchInventories();
  });

  if (!permission) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission}>grant permission</Button>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{ marginTop: 20 }}>
        {Object.keys(inventories).length === 0 ? (
          <Text style={{textAlign: "center"}}>Žádné inventury</Text>
        ) : (
          Object.entries(inventories).map(([date, products]) => (
            <TouchableRipple
              style={styles.listItem}
              onPress={() =>
                router.push({ pathname: "/inventory", params: { date } })
              }
              key={date}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ flex: 1, justifyContent: "center" }}>
                  <Text>{date}</Text>
                </View>
                <View style={{ flex: 1, justifyContent: "center" }}>
                  <Text>Pocet: {products.length}</Text>
                </View>
                <>
                  <IconButton
                    icon="delete-empty"
                    size={20}
                    iconColor="red"
                    onPress={() =>
                      deleteInventory(date).then(() => {
                        setInventories((prev) => {
                          const newInventories = { ...prev };
                          delete newInventories[date];
                          return newInventories;
                        });
                      })
                    }
                  />
                </>
              </View>
            </TouchableRipple>
          ))
        )}
      </ScrollView>
      <Button
        mode="contained"
        style={styles.createInventoryButtton}
        onPress={handleAddInventory}
      >
        Přidat inventuru
      </Button>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  listItem: {
    padding: 10,
    borderTopWidth: 0.2,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  createInventoryButtton: {
    position: "absolute",
    padding: 5,
    bottom: 50,
    left: 30,
    right: 30,
  }
});
