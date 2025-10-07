import {IconButton, Icon, Menu} from "react-native-paper";
import {useRouter} from "expo-router";
import {Divider} from "react-native-paper";
import {exportToCSV, formatDataForExport} from "@/utils/export";
import {deleteInventory, getInventoryByDate} from "@/utils/inventory";

export const MenuComponent = ({date, visible, setVisible, deleteAction}) => {
    return (
        <Menu
            visible={visible === date}
            onDismiss={() => setVisible(null)}
            anchor={
                <IconButton
                    icon="dots-vertical"
                    size={24}
                    onPress={() => setVisible(date)}
                />
            }
        >
            <Menu.Item
                title="Exportovat inventuru"
                leadingIcon="file-export"
                onPress={() => {
                    getInventoryByDate(date).then((data) => {
                        formatDataForExport(data);
                        exportToCSV(data, date);
                    });
                    setVisible(null);
                }}
            />
            <Menu.Item
                title="Editovat inventuru"
                leadingIcon="file-edit"
                onPress={() => {
                    console.log("Editovat inventuru");
                    setVisible(null);
                }}
            />
            <Divider/>
            <Menu.Item
                title="Smazat inventuru"
                leadingIcon="delete"
                onPress={() => deleteAction()}
            />
        </Menu>
    );
};

export const ProductMenuComponent = ({visible, setVisible, id, count, removeScannedCode, setIdProduct, setCount, setOpenedForEdit, setModal}) => {
    return (
        <Menu
            style={{marginTop: -50}}
            visible={visible === id}
            onDismiss={() => setVisible(null)}
            anchor={
                <IconButton
                    icon="dots-vertical"
                    size={24}
                    onPress={() => setVisible(id)}
                />
            }
        >
            <Menu.Item
                title="Editovat produkt"
                leadingIcon="file-edit"
                onPress={() => {
                    setIdProduct(id);
                    setCount(count);
                    setOpenedForEdit(id);
                    setModal(true);
                    setVisible(null);
                }}
            />
            <Divider/>
            <Menu.Item
                title="Smazat produkt"
                leadingIcon="delete"
                onPress={() => {
                    removeScannedCode(id);
                    setVisible(null);
                }}
            />
        </Menu>
    )
}

export const SecondaryMenuComponent = ({visible, setVisible, date, menuItems}) => {

    return (
        <Menu
            visible={visible === date}
            onDismiss={() => setVisible(null)}
            anchor={
                <IconButton
                    icon="dots-vertical"
                    size={24}
                    onPress={() => setVisible(date)}
                />
            }
        >
            {menuItems.map((item) => (
                <Menu.Item
                    key={item.title}
                    title={item.title}
                    onPress={item.onPress}
                />
            ))}
        </Menu>
    )
}
