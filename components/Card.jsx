import { StyleSheet, View } from "react-native";
import { Card, IconButton } from "react-native-paper";
import { useRouter } from "expo-router";
import { deleteInventory } from "../utils/inventory";
import {
    Title,
    Paragraph} from "react-native-paper";

const router = useRouter();

export default function CustomCard({ children, onPress, onDelete }) {
    return (
        <Card
          style={styles.card}
          onPress={() => onPress && onPress()}
        >
            <Card.Content style={styles.cardContent}>
                <View style={{ flex: 1 }}>
                    {children}
                </View>
                <IconButton
                    icon="delete-outline"
                    size={24}
                    iconColor="red"
                    onPress={() => onDelete && onDelete()}
                />
            </Card.Content>
        </Card>
    )
}

export const InventoryCard = ({ date, products }) => {
    const onDelete = () => deleteInventory(date).then(() => {
        setInventories((prev) => {
          const newInventories = { ...prev };
          delete newInventories[date];
          return newInventories;
        });
      })
    return (
        <CustomCard onPress={router.push({ pathname: "/inventory", params: { date } })} onDelete={onDelete}>
            <Title>{date}</Title>
            <Paragraph>Počet produktů: {products.length}</Paragraph>
        </CustomCard>
    );
}
const styles = StyleSheet.create({
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
})