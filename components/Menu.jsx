import { Menu } from "react-native-paper";
import { IconButton, Divider } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { getInventories, deleteInventory } from "../utils/inventory";

const router = useRouter();

export const MenuComponent = ({
  date,
  visible,
  setVisible,
  setInventories,
}) => {
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
      />
      <Menu.Item
        title="Editovat inventuru"
        leadingIcon="file-edit"
        onPress={() =>
          router.push({
            pathname: "/inventory",
            params: { date },
          })
        }
      />
      <Menu.Item
        title="Přidat produkt"
        leadingIcon="plus"
        onPress={() =>
          router.push({
            pathname: "/inventory",
            params: { date },
          })
        }
      />
      <Divider />
      <Menu.Item
        title="Smazat inventuru"
        leadingIcon="delete"
        onPress={() => {
          deleteInventory(date)
            .then(() => {
              setInventories((prev) => {
                const newInventories = { ...prev };
                delete newInventories[date];
                return newInventories;
              });
            })
            .catch((error) => {
              console.error("Chyba při mazání inventury:", error);
              alert(error.message);
            });
          setVisible(null);
        }}
      />
    </Menu>
  );
};
