import {DataTable, Divider, IconButton, Menu} from 'react-native-paper';
import {Alert, StyleSheet} from "react-native";

export function CustomDataTable({product, visible, onSetVisible, onShowModal, onRemoveProduct}) {
    const handleRemove = (item) => {
        Alert.alert("Neuložené změny", "Vstupní pole byla změněna. Chcete změny uložit nebo zahodit před skenováním?", [{
            text: "Smazat", style: "destructive", onPress: async () => {
                onRemoveProduct(item);
                onSetVisible(null);
            },
        }, {
            text: "Cancel",
        }]);
    };

    return (
        <DataTable>
            {product.map((item) => (
                <DataTable.Row key={item.id} styles={styles.tableRow}>
                    <DataTable.Cell numeric style={styles.tableHeader} >{item.id}</DataTable.Cell>
                    <DataTable.Cell numeric>{item.count || 0}</DataTable.Cell>
                    <DataTable.Cell numeric>
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
                                onPress={() => {
                                    onShowModal(item.id)
                                    onSetVisible(null);
                                }}
                            />
                            <Divider/>
                            <Menu.Item
                                title="Smazat produkt"
                                leadingIcon="delete"
                                onPress={() => handleRemove(item.id)}
                            />
                        </Menu>
                    </DataTable.Cell>
                </DataTable.Row>
            ))}
        </DataTable>
    );
}

const styles = StyleSheet.create({
    tableHeader: {
        justifyContent: "flex-start"
    },
    tableRow: {
        paddingVertical: 30
    },
    menu: {
        marginTop: 0
    },
});