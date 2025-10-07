import {StyleSheet, View} from "react-native";
import {
    Text,
    Divider,
    TouchableRipple,
    Menu,
    IconButton
} from "react-native-paper";
import {ProductItem} from "./ProductItem";

export function ProductList({
                                products,
                                visible,
                                onSetVisible,
                                onShowModal,
                                onEditProduct,
                                onRemoveProduct
                            }) {
    if (products.length === 0) {
        return (
            <Text style={styles.emptyText}>
                Žádné produkty
            </Text>
        );
    }

    return (
        <>
            {products.map((item) => (
                <ProductItem
                    key={item.id}
                    item={item}
                    visible={visible}
                    onSetVisible={onSetVisible}
                    onShowModal={onShowModal}
                    onEditProduct={onEditProduct}
                    onRemoveProduct={onRemoveProduct}
                />
            ))}
        </>
    );
}

const styles = StyleSheet.create({
    emptyText: {
        textAlign: "center",
        marginTop: 20,
    },
});