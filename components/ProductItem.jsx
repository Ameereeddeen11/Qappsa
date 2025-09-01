import {Alert, StyleSheet, View} from "react-native";
import {
    Text,
    Divider,
    TouchableRipple,
    Menu,
    IconButton
} from "react-native-paper";

export function ProductItem({
                                item,
                                visible,
                                onSetVisible,
                                onShowModal,
                                onEditProduct,
                                onRemoveProduct
                            }) {
    const handleEdit = () => {
        onEditProduct(item);
    };

    const handleRemove = () => {
        Alert.alert(
            "Neuložené změny",
            "Vstupní pole byla změněna. Chcete změny uložit nebo zahodit před skenováním?",
            [
                {
                    text: "Smazat",
                    style: "destructive",
                    onPress: async () => {
                        onRemoveProduct(item.id);
                        onSetVisible(null);
                    },
                },
                {
                    text: "Cancel",
                }
            ]
        );
    };

    return (
        <View key={item.id}>
            <Divider/>
            <TouchableRipple
                style={styles.card}
                onPress={() => onShowModal(item.id)}
            >
                <>
                    <Text style={styles.productId}>{item.id}</Text>
                    <Text style={styles.productCount}>
                        Počet: {item.count || 0}
                    </Text>
                    <Menu
                        style={styles.menu}
                        visible={visible === item.id}
                        onDismiss={() => onSetVisible(null)}
                        anchor={
                            <IconButton
                                icon="dots-vertical"
                                size={24}
                                onPress={() => onSetVisible(item.id)}
                            />
                        }
                    >
                        <Menu.Item
                            title="Editovat produkt"
                            leadingIcon="file-edit"
                            onPress={handleEdit}
                        />
                        <Divider/>
                        <Menu.Item
                            title="Smazat produkt"
                            leadingIcon="delete"
                            onPress={handleRemove}
                        />
                    </Menu>
                </>
            </TouchableRipple>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        height: 70,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    productId: {
        fontSize: 18,
    },
    productCount: {
        fontSize: 16,
    },
    menu: {
        marginTop: 0,
    },
});