import {useCameraPermissions} from "expo-camera";
import {Stack, useRouter} from "expo-router";
import {useEffect, useState} from "react";
import {StyleSheet, View, RefreshControl, ScrollView} from "react-native";
import {
    IconButton,
    Button,
    Text,
    Divider,
    TouchableRipple,
    Menu
} from "react-native-paper";
import {SafeAreaView} from "react-native-safe-area-context";
import {
    getInventories,
    addInventory,
    deleteInventory
} from "../utils/inventory";

export default function HomeScreen() {
    const [permission, requestPermission] = useCameraPermissions();
    const [inventories, setInventories] = useState([]);
    const [visible, setVisible] = useState(null);
    const router = useRouter();

    const handleAddInventory = () => {
        const date = new Date().toISOString().split("T")[0];
        addInventory(date)
            .then((inventories) => {
                setInventories(inventories);
                router.push({pathname: "/inventory", params: {date}});
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
                    Object.entries(inventories).map(([date, products]) => (
                        <View key={date}>
                            {/* <Divider /> */}
                            <TouchableRipple
                                style={styles.card}
                                onPress={() =>
                                    router.push({pathname: "/inventory", params: {date}})
                                }
                            >
                                <>
                                    <Text variant="titleMedium">{date}</Text>
                                    <Text variant="titleMedium">{products.length}</Text>
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
                                            onPress={() =>
                                                router.push({
                                                    pathname: "/inventory",
                                                    params: {date},
                                                })
                                            }
                                        />
                                        <Menu.Item
                                            title="Editovat inventuru"
                                            leadingIcon="file-edit"
                                            onPress={() =>
                                                router.push({
                                                    pathname: "/inventory",
                                                    params: {date},
                                                })
                                            }
                                        />
                                        <Menu.Item
                                            title="Přidat produkt"
                                            leadingIcon="plus"
                                            onPress={() =>
                                                router.push({
                                                    pathname: "/inventory",
                                                    params: {date},
                                                })
                                            }
                                        />
                                        <Divider/>
                                        <Menu.Item
                                            title="Smazat inventuru"
                                            leadingIcon="delete"
                                            onPress={() => {
                                                deleteInventory(date)
                                                    .then(() => {
                                                        setInventories((prev) => {
                                                            const newInventories = {...prev};
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
                                </>
                            </TouchableRipple>
                        </View>
                    ))

                    // Object.entries(inventories).map(([date, products]) => (
                    //   <View key={date}>
                    //     <Divider/>
                    //     <TouchableRipple style={styles.card} onPress={() => handlePress({ item })}>
                    //       <>
                    //         <Text style={{ fontSize: 18 }}>
                    //           {date}
                    //         </Text>
                    //         <Text style={{ fontSize: 16 }}>
                    //           Počet: {products || 0}
                    //         </Text>
                    //         <Menu
                    //           style={{ marginTop: -50 }}
                    //           visible={visible === date}
                    //           onDismiss={() => setVisible(null)}
                    //           anchor={
                    //             <IconButton
                    //               icon="dots-vertical"
                    //               size={24}
                    //               onPress={() => setVisible(item.id)}
                    //             />
                    //           }
                    //         >
                    //           <Menu.Item
                    //             title="Detail produktu"
                    //             leadingIcon="file-edit"
                    //             onPress={() => {}}
                    //           />
                    //           <Divider />
                    //           <Menu.Item
                    //             title="Smazat produkt"
                    //             leadingIcon="delete"
                    //             onPress={() => {
                    //               removeScannedCode(item.id);
                    //               setVisible(null);
                    //             }}
                    //           />
                    //         </Menu>
                    //       </>
                    //     </TouchableRipple>
                    //   </View>
                    // ))
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
