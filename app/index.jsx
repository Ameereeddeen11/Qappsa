import {useCameraPermissions} from "expo-camera";
import {Stack, useRouter} from "expo-router";
import {useEffect, useState} from "react";
import {StyleSheet, View, RefreshControl, ScrollView} from "react-native";
import {
    IconButton,
    Button,
    Text,
    Divider,
    TouchableRipple
} from "react-native-paper";
import {SafeAreaView} from "react-native-safe-area-context";
import {
    getInventories,
    addInventory,
    deleteInventory
} from "../utils/inventory";
import {MenuComponent} from "@/components/Menu";

export default function HomeScreen() {
    const [permission, requestPermission] = useCameraPermissions();
    const [inventories, setInventories] = useState([]);
    const [visible, setVisible] = useState(null);
    const router = useRouter();

    const handleAddInventory = () => {
        const date = new Date().toISOString().split("T")[0];
        addInventory(date)
            .then(({inventories, id, name}) => {
                setInventories(inventories);
                router.push({pathname: "/inventory", params: {id: id, date: name}});
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
        <>
            <Stack.Screen
                options={{
                    title: "Home",
                    headerRight: () => (
                        <IconButton icon="plus" size={24} onPress={handleAddInventory}/>
                    ),
                }}
            />
            <ScrollView
                contentContainerStyle={styles.container}
                refreshControl={
                    <RefreshControl
                        refreshing={false}
                        onRefresh={() => getInventories().then(setInventories)}
                    />
                }
            >
                {Object.keys(inventories).length === 0 ? (
                    <Text style={{textAlign: "center"}}>Žádné inventury</Text>
                ) : (
                    Object.entries(inventories).map(([id, inv]) => (
                        <View key={id}>
                            <TouchableRipple
                                style={styles.card}
                                onPress={() =>
                                    router.push({pathname: "/inventory", params: {id, date: inv.name}})
                                }
                            >
                                <>
                                    <Text variant="titleMedium">{inv?.name}</Text>
                                    <Text variant="titleMedium">{inv?.products?.length || 0}</Text>
                                    <MenuComponent
                                        date={id}
                                        visible={visible}
                                        setVisible={setVisible}
                                        deleteAction={() => {
                                            void deleteInventory(id).then(() => {
                                                setVisible(null);
                                                getInventories().then(setInventories);
                                            })
                                        }}
                                    />
                                </>
                            </TouchableRipple>
                        </View>
                    ))
                )}
                <Divider/>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 15
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
        height: 70,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    cameraOverlay: {
        alignItems: "center",
        paddingBottom: 20,
    },
});
