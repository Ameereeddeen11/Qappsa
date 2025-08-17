import { View, StyleSheet } from "react-native";
import { TextInput, IconButton } from "react-native-paper";
import { addProduct } from "../utils/products";

export const InputSection = (idProduct, setIdProduct, count, setCount, date, onRefresh) => {
    return (
        <View style={styles.input.inputView}>
          <TextInput
            label="ID produktu"
            mode="outlined"
            keyboardType="numeric"
            value={idProduct.toString()}
            onChangeText={setIdProduct}
            style={styles.input.input}
          />
          <TextInput
            label="Počet kusů"
            mode="outlined"
            keyboardType="numeric"
            value={count.toString()}
            onChangeText={setCount}
            style={styles.input.input}
          />
          <IconButton
            icon="plus"
            size={30}
            mode="contained"
            onPress={() => {
              if (idProduct && count) {
                addProduct(date, idProduct, count)
                  .then(() => {
                    setIdProduct("");
                    setCount(0);
                    onRefresh();
                  })
                  .catch((error) => {
                    console.error("Chyba při přidávání produktu:", error);
                    alert(error.message);
                  });
              }
            }}
            style={styles.input.saveButton}
          />
        </View>
    )
}

const styles = StyleSheet.create({
    input: {
        inputView: {
            flexDirection: "row", 
            justifyContent: "space-between",
        },
        input: {
            alignSelf: "center",
            marginVertical: 8,
            width: "40%",
        },
        saveButton: {
            width: "12%",
            borderRadius: 8,
            alignSelf: "center",
        }
    }
});