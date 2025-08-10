import { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { getProducts, updateProductCount, deleteProduct } from "../utils/products"

export default function DetailPage() {
  let { count, id, date } = useLocalSearchParams();
  const [countDynamic, setCountDynamic] = useState(count);

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={styles.container}>
        <TextInput
          label="ID"
          mode="outlined"
          value={id}
          disabled={true}
          style={{ width: "90%", marginBottom: 20 }}
        />
        <TextInput
          label="Počet"
          mode="outlined"
          value={countDynamic}
          onChangeText={(text) => setCountDynamic(text)}
          style={{ width: "90%", marginBottom: 20 }}
        />
        <Button
          mode="contained"
          onPress={() => {
            updateProductCount(date, data, countDynamic)
              .then(() => {
                console.log("Počet produktu aktualizován");
              })
              .catch((error) => {
                console.error("Chyba při aktualizaci počtu produktu:", error);
                alert(error.message);
              });
          }}
          style={{ width: "90%", marginTop: 20 }}
        >
          Ulozit
        </Button>
        <Button
          mode="contained"
          onPress={() => console.log("Generovat CSV soubor")}
          style={{ width: "90%", marginTop: 20 }}
        >
          Generovat CSV soubor
        </Button>
        <Button
          mode="contained"
          textColor="white"
          buttonColor="red"
          onPress={() => deleteProduct({ date: date, productId: id }).then(() => {
            console.log("Produkt smazán");
            refresh();
          }).catch((error) => {
            console.error("Chyba při mazání produktu:", error);
            alert(error.message);
          })}
          style={{ width: "90%", marginTop: 20 }}
        >
          Smazat
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});