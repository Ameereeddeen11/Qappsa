import {CameraView, useCameraPermissions} from "expo-camera";
import {useRouter, useGlobalSearchParams, Stack} from "expo-router";
import {useEffect, useRef, useState, useContext, useCallback} from "react";
import {Animated, StyleSheet, View, ScrollView, Alert} from "react-native";
import {
    IconButton,
    Text,
    Button,
    TextInput,
    Divider,
    TouchableRipple,
    Menu, Snackbar, Portal, Modal,
} from "react-native-paper";
import {getProducts, addProduct, deleteProduct, updateProductCount} from "@/utils/products";
import {deleteInventory} from "@/utils/inventory";
import {GlobalContext} from "@/context/GlobalProvider";
import {RefreshControl} from "react-native";
import {exportToCSV, formatDataForExport} from "@/utils/export";
import {MenuComponent, ProductMenuComponent} from "@/components/Menu";
import {ModalCard} from "@/components/ModalCard";
import {useFocusEffect} from "@react-navigation/native";

export default function InventoryScreen() {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanning, setScanning] = useState(false);
    const [products, setProducts] = useState([]);
    const scannedRef = useRef(false);
    const router = useRouter();
    const {refreshing, setRefreshing} = useContext(GlobalContext);
    const {id, date} = useGlobalSearchParams();
    const [visible, setVisible] = useState(null);
    const [saved, setSaved] = useState(false);
    const scaleAnimated = useRef(new Animated.Value(1)).current;

    const onToggleSnackBar = () => setSaved(!saved);

    const onDissmissSnackBar = () => setSaved(false);

    // Use strings for TextInputs to avoid toString() on undefined/null
    const [idProduct, setIdProduct] = useState("");
    const [count, setCount] = useState("");
    const [openedForEdit, setOpenedForEdit] = useState('');

    // Track last saved values to detect unsaved changes
    const [lastSaved, setLastSaved] = useState({id: "", count: ""});
    const isDirty = idProduct !== lastSaved.id || count !== lastSaved.count;

    const [modal, setModal] = useState(false);
    const showModal = (id) => {
        setModal(true);
        setOpenedForEdit(id);
    };
    const hideModal = () => {
        setModal(false);
        setOpenedForEdit('');
    };

    const fetchProducts = async () => {
        const data = await getProducts(id);
        setProducts(data);
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchProducts().then(() => setRefreshing(false));
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    useFocusEffect(
        useCallback(() => {
            setIdProduct("");
            setCount("");
            setLastSaved({id: "", count: ""});
            scannedRef.current = false;
            setScanning(false);
            return () => {};
        }, [id])
    );

    const saveManual = async () => {
        const idNum = Number(idProduct);
        const countNum = Number(count || "1");
        if (!Number.isFinite(idNum) || idNum <= 0 || !Number.isFinite(countNum) || countNum <= 0) {
            alert("Zadejte platné ID a počet větší než 0.");
            return false;
        }
        try {
            Animated.sequence([
                Animated.timing(scaleAnimated, {
                    toValue: 0.9,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnimated, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
            setSaved(true);

            const updatedProducts = await updateProductCount(id, idNum, countNum).then(() => {
                setLastSaved({id: String(idNum), count: String(countNum)});
                onToggleSnackBar()
                return getProducts(id);
            });
            setProducts(updatedProducts);
            setTimeout(() => {
                setSaved(false)
            }, 2500)
            return true;
        } catch (error) {
            console.error("Chyba při přidávání produktu:", error);
            alert(error.message);
            return false;
        }
    };

    const handleBarCodeScanned = async ({data}) => {
        if (scannedRef.current) return;
        scannedRef.current = true;
        try {
            const scannedId = Number(data);
            if (!Number.isFinite(scannedId) || scannedId <= 0) {
                throw new Error("Nesprávný formát čárového kódu.");
            }

            // Zobraz ID v poli
            setIdProduct(String(scannedId));

            // Přidej/incrementuj produkt a získej aktualizovaný seznam
            const updatedProducts = await addProduct(id, scannedId);
            setProducts(updatedProducts);

            // Najdi aktuální count naskenovaného produktu a propsat do TextInput "Počet kusů"
            const found = Array.isArray(updatedProducts)
                ? updatedProducts.find(p => String(p.id) === String(scannedId))
                : null;
            const currentCount = found?.count ?? 1;
            setCount(String(currentCount));

            // Ulož poslední hodnoty jako "saved"
            setLastSaved({id: String(scannedId), count: String(currentCount)});
        } catch (error) {
            console.error("Chyba při přidávání produktu:", error);
            alert(error.message);
        } finally {
            setScanning(false);
        }
    };

    // Start scan but block if there are unsaved changes
    const startScan = () => {
        if (isDirty) {
            Alert.alert(
                "Neuložené změny",
                "Vstupní pole byla změněna. Chcete změny uložit nebo zahodit před skenováním?",
                [
                    {
                        text: "Uložit",
                        onPress: async () => {
                            const ok = await saveManual();
                            if (ok) {
                                scannedRef.current = false;
                                setScanning(true);
                            }
                        },
                    },
                    {
                        text: "Zahodit",
                        style: "destructive",
                        onPress: () => {
                            // Revert inputs to last saved values
                            setIdProduct(lastSaved.id);
                            setCount(lastSaved.count);
                            scannedRef.current = false;
                            setScanning(true);
                        },
                    },
                    {text: "Zrušit", style: "cancel"},
                ]
            );
            return;
        }

        scannedRef.current = false;
        setScanning(true);
    };

    const removeScannedCode = async (productId) => {
        try {
            const updatedProducts = await deleteProduct(id, productId);
            setProducts(updatedProducts);
        } catch (error) {
            console.error("Chyba při mazání produktu:", error);
        }
    };

    if (!permission) {
        return (
            <View style={styles.centered}>
                <Text>Loading camera permission...</Text>
            </View>
        );
    }

    if (!permission.granted) {
        return (
            <View style={styles.centered}>
                <Text style={styles.message}>
                    We need your permission to show the camera
                </Text>
                <Button mode="contained" onPress={requestPermission}>
                    Grant Permission
                </Button>
            </View>
        );
    }

    return (
        <>
            <Stack.Screen
                name="inventory"
                options={{
                    title: date,
                    headerShown: true,
                    headerRight: () => (
                        <MenuComponent
                            date={date}
                            visible={visible}
                            setVisible={setVisible}
                            deleteAction={() => {
                                void deleteInventory(id).then(() => {
                                    router.back();
                                    setVisible(null);
                                })
                            }}
                        />
                    ),
                }}
            />
            <ScrollView
                contentContainerStyle={styles.container}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
            >
                <Portal>
                    <Modal visible={modal} onDismiss={hideModal}>
                        <ModalCard
                            id={openedForEdit}
                            setOpenedForEdit={setOpenedForEdit}
                            date={id}
                            countDynamic={count}
                            setCountDynamic={setCount}
                            onRefresh={onRefresh}
                            hideModel={hideModal}
                        />
                    </Modal>
                </Portal>
                {scanning ? (
                    <View style={styles.cameraOverlay}>
                        <CameraView
                            style={styles.camera}
                            onBarcodeScanned={handleBarCodeScanned}
                        />
                        <Text style={styles.scanningText}>
                            Namiřte fotoaparát na čárový kód...
                        </Text>
                        <Button
                            mode="outlined"
                            style={{marginTop: 12}}
                            onPress={() => setScanning(false)}
                        >
                            Zrušit
                        </Button>
                    </View>
                ) : (
                    <IconButton
                        icon="magnify-scan"
                        mode="contained"
                        size={250}
                        onPress={startScan}
                        disabled={false}
                        style={{borderRadius: 25, alignSelf: "center", marginTop: -20}}
                    />
                )}
                <View style={styles.input.inputView}>
                    <TextInput
                        label="ID produktu"
                        mode="outlined"
                        keyboardType="numeric"
                        value={idProduct}
                        onChangeText={setIdProduct}
                        style={styles.input.input}
                    />
                    <TextInput
                        label="Počet kusů"
                        mode="outlined"
                        keyboardType="numeric"
                        value={count}
                        onChangeText={setCount}
                        style={styles.input.input}
                    />
                    <Animated.View style={[{transform: [{scale: scaleAnimated}]}, styles.input.saveButton]}>
                        <IconButton
                            icon={saved ? "check" : "content-save-outline"}
                            iconColor={saved ? "green" : "white"}
                            size={30}
                            mode="contained"
                            onPress={() => {
                                void saveManual();
                            }}
                            style={{borderRadius: 8}}
                        />
                    </Animated.View>
                </View>
                {products.length === 0 && (
                    <Text style={{textAlign: "center", marginTop: 20}}>
                        Žádné produkty
                    </Text>
                )}
                {products.map((item) => (
                    <View key={item.id}>
                        <Divider/>
                        <TouchableRipple
                            style={styles.card}
                            onPress={() => showModal(item.id)}
                        >
                            <>
                                <Text style={{fontSize: 18}}>{item.id}</Text>
                                <Text style={{fontSize: 16}}>Počet: {item.count || 0}</Text>
                                <Menu
                                    style={{marginTop: -50}}
                                    visible={visible === item.id}
                                    onDismiss={() => setVisible(null)}
                                    anchor={
                                        <IconButton
                                            icon="dots-vertical"
                                            size={24}
                                            onPress={() => setVisible(item.id)}
                                        />
                                    }
                                >
                                    <Menu.Item
                                        title="Editovat produkt"
                                        leadingIcon="file-edit"
                                        onPress={() => {
                                            setIdProduct(item.id);
                                            setCount(item.count);
                                            setOpenedForEdit(item.id);
                                            setModal(true);
                                            setVisible(null);
                                        }}
                                    />
                                    <Divider/>
                                    <Menu.Item
                                        title="Smazat produkt"
                                        leadingIcon="delete"
                                        onPress={() => {
                                            removeScannedCode(item.id);
                                            setVisible(null);
                                        }}
                                    />
                                </Menu>
                            </>
                        </TouchableRipple>
                    </View>
                ))}
            </ScrollView>
            <Snackbar
                visible={saved}
                onDismiss={onDissmissSnackBar}
            >
                Produkt byl úspěšně uložen
            </Snackbar>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 20
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    scanningText: {
        marginTop: 10,
        textAlign: "center",
    },
    card: {
        height: 70,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    input: {
        inputView: {
            flexDirection: "row",
            justifyContent: "space-between",
            marginVertical: 15,
        },
        input: {
            width: "40%",
        },
        saveButton: {
            width: "15%",
            alignItems: "center",
        },
    },
    cameraOverlay: {
        alignItems: "center",
        paddingBottom: 20,
    },
    camera: {
        width: "75%",
        aspectRatio: 1,
    },
    message: {
        textAlign: "center",
        marginBottom: 10,
    },
});