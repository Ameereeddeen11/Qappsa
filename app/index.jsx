import {useCameraPermissions} from "expo-camera";
import {router} from "expo-router";
import {useCallback, useState} from "react";
import {StyleSheet, View, RefreshControl, Dimensions, FlatList} from "react-native";
import {
    Button,
    Text,
    Divider,
    TouchableRipple,
    Appbar
} from "react-native-paper";
import {SafeAreaView} from "react-native-safe-area-context";
import {
    getInventories,
    addInventory,
    deleteInventory
} from "../utils/inventory";
import {MenuComponent} from "@/components/Menu";
import {useFocusEffect} from "@react-navigation/native";

const deviceHeight = Dimensions.get('window').height;

export default function HomeScreen() {
    const [permission, requestPermission] = useCameraPermissions();
    const [inventories, setInventories] = useState([]);
    const [visible, setVisible] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

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

    const fetchData = async () => {
        try {
            const data = await getInventories();
            setInventories(data);
        } catch (error) {
            console.log(error);
        }
    }

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [])
    );

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
                <Button mode="contained" onPress={requestPermission} style={{marginHorizontal: 20}}>
                    Grant Permission
                </Button>
            </SafeAreaView>
        );
    }

    const inventoriesSorted = Array.isArray(inventories)
        ? [...inventories].sort((a, b) => Number(b.id) - Number(a.id))
        : Object.values(inventories).sort((a, b) => Number(b.id) - Number(a.id));

    return (
        <>
            <Appbar.Header mode={"small"}>
                <Appbar.Content title="Inventury"/>
                <Appbar.Action icon="plus" onPress={handleAddInventory}/>
            </Appbar.Header>
            <FlatList
                data={inventoriesSorted}
                keyExtractor={item => item.id?.toString()}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={fetchData}
                    />
                }
                renderItem={({item}) => (
                    <View key={item.id}>
                        <Divider/>
                        <TouchableRipple
                            style={styles.card}
                            onPress={() =>
                                router.navigate({pathname: "/inventory", params: {id: item.id, date: item.name}})
                            }
                        >
                            <>
                                <Text variant="titleMedium">{item?.name}</Text>
                                <Text variant="titleMedium">{item?.products?.length || 0}</Text>
                                <MenuComponent
                                    date={item.id}
                                    visible={visible}
                                    setVisible={setVisible}
                                    deleteAction={() => {
                                        void deleteInventory(item.id).then(() => {
                                            setVisible(null);
                                            getInventories().then(setInventories);
                                        })
                                    }}
                                />
                            </>
                        </TouchableRipple>
                    </View>
                )}
                ListEmptyComponent={<Text style={{textAlign: "center", paddingBottom: deviceHeight / 2}}>Žádné inventury</Text>}
                contentContainerStyle={{height: "100%"}}
            />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
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
        paddingHorizontal: 15,
    },
    cameraOverlay: {
        alignItems: "center",
        paddingBottom: 20,
    },
});
