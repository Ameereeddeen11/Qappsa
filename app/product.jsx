import { useState, useContext, useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { RefreshControl, ScrollView, StyleSheet } from "react-native";
import { Button, TextInput, Card, Title, Divider, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { GlobalContext } from "@/context/GlobalProvider";
import { updateProductCount, deleteProduct, getProductByID } from "../utils/products";

export default function DetailPage() {
  const { id, date } = useLocalSearchParams();
  const router = useRouter();
  const [countDynamic, setCountDynamic] = useState(0);
  const { refreshing, setRefreshing } = useContext(GlobalContext);

  useEffect(() => {
    setRefreshing(true);
    getProductByID(date, id).then((data) => {
      setCountDynamic(data.count);
      setRefreshing(false);
    });
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    getProductByID(date, id).then((data) => {
      setRefreshing(false);
      setCountDynamic(data.count);
    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Card style={styles.card} mode="elevated">
          <Card.Content>
            <Title style={styles.title}>Detaily produktu</Title>
            <Divider style={{ marginVertical: 10 }} />
            
            <TextInput
              label="ID produktu"
              mode="outlined"
              value={id}
              disabled
              style={styles.input}
            />

            <TextInput
              label="Počet kusů"
              mode="outlined"
              keyboardType="numeric"
              value={countDynamic.toString()}
              onChangeText={setCountDynamic}
              style={styles.input}
            />

            <Button
              mode="contained"
              onPress={() => {
                updateProductCount(date, id, countDynamic)
                  .then(onRefresh)
                  .catch((error) => {
                    console.error("Chyba při aktualizaci počtu produktu:", error);
                    alert(error.message);
                  });
              }}
              style={styles.saveButton}
              icon="content-save"
            >
              Uložit změny
            </Button>

            <Button
              mode="contained"
              buttonColor="#d32f2f"
              textColor="white"
              onPress={() =>
                deleteProduct({ date, productId: id })
                  .then(() => {
                    console.log("Produkt smazán");
                    router.back();
                  })
                  .catch((error) => {
                    console.error("Chyba při mazání produktu:", error);
                    alert(error.message);
                  })
              }
              style={styles.deleteButton}
              icon="delete"
            >
              Smazat produkt
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
  },
  card: {
    width: "100%",
    padding: 10,
    borderRadius: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    marginVertical: 8,
  },
  saveButton: {
    marginTop: 16,
    borderRadius: 8,
  },
  deleteButton: {
    marginTop: 10,
    borderRadius: 8,
  },
});
