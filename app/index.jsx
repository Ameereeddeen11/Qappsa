import { useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  IconButton,
  Button,
  Text,
  Card,
  Title,
  Paragraph,
  FAB,
} from "react-native-paper";
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
  }, []);

  if (!permission) {
    return (
      <View style={styles.centered}>
        <Text>Loading camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button mode="contained" onPress={requestPermission}>
          Grant Permission
        </Button>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{ marginTop: 20 }} contentContainerStyle={{ paddingBottom: 100 }}>
        {Object.keys(inventories).length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            Žádné inventury
          </Text>
        ) : (
          Object.entries(inventories).map(([date, products]) => (
            <Card
              key={date}
              style={styles.card}
              onPress={() =>
                router.push({ pathname: "/inventory", params: { date } })
              }
            >
              <Card.Content style={styles.cardContent}>
                <View style={{ flex: 1 }}>
                  <Title>{date}</Title>
                  <Paragraph>Počet produktů: {products.length}</Paragraph>
                </View>
                <IconButton
                  icon="delete-outline"
                  size={24}
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
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>

      <FAB
        icon="plus"
        label="Přidat inventuru"
        style={styles.fab}
        onPress={handleAddInventory}
      />
    </SafeAreaView>
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
  message: {
    textAlign: "center",
    marginBottom: 10,
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
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
  },
});
