import {useRouter, useGlobalSearchParams} from "expo-router";
import {useEffect, useState, useContext, useCallback} from "react";
import {View, FlatList, KeyboardAvoidingView, Platform, Keyboard, RefreshControl} from "react-native";
import {Text, Portal, Modal, Appbar} from "react-native-paper";
import {getProducts, deleteProduct} from "@/utils/products";
import {deleteInventory} from "@/utils/inventory";
import {GlobalContext} from "@/context/GlobalProvider";
import {MenuComponent} from "@/components/Menu";
import {ModalCard} from "@/components/ModalCard";
import {useFocusEffect} from "@react-navigation/native";
import {SafeAreaView} from "react-native-safe-area-context";
import {CameraScanner} from "@/components/CameraScanner";
import {ManualInput} from "@/components/ManualInput";
import {ProductList} from "@/components/ProductList";
import {SaveSnackbar} from "@/components/SaveSnackbar";
import {useInventoryLogic} from "@/hooks/useInventoryLogic";
import {useCameraPermission} from "@/hooks/useCameraPermission";
import {styles} from "@/styles/inventoryStyles";

export default function Inventory() {
    const router = useRouter();
    const {refreshing, setRefreshing} = useContext(GlobalContext);
    const {id, date} = useGlobalSearchParams();

    const [products, setProducts] = useState([]);
    const [visible, setVisible] = useState(null);
    const [modal, setModal] = useState(false);
    const [openedForEdit, setOpenedForEdit] = useState('');

    // Custom hooks
    const {permission} = useCameraPermission();
    const {
        scanning,
        idProduct,
        count,
        saved,
        scaleAnimated,
        setScanning,
        setIdProduct,
        setCount,
        setSaved,
        saveManual,
        handleBarCodeScanned,
        startScan,
        resetInputs
    } = useInventoryLogic(id, setProducts);

    const showModal = (productId) => {
        setModal(true);
        setOpenedForEdit(productId);
    };

    const hideModal = () => {
        setModal(false);
        setOpenedForEdit('');
        setCount('');
        setSaved(false);
    };

    const fetchProducts = async () => {
        const data = await getProducts(id);
        setProducts(data);
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchProducts().then(() => setRefreshing(false));
    };

    const removeScannedCode = async (productId) => {
        try {
            const updatedProducts = await deleteProduct(id, productId);
            setProducts(updatedProducts);
        } catch (error) {
            console.error("Chyba při mazání produktu:", error);
        }
    };

    const handleDeleteInventory = () => {
        deleteInventory(id).then(() => {
            router.back();
            setVisible(null);
        });
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    useFocusEffect(
        useCallback(() => {
            resetInputs();
            return () => {};
        }, [resetInputs])
    );

    const productsSorted = [...products].sort((a, b) => Number(b.id) - Number(a.id));

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
            </View>
        );
    }

    return (
        <>
            <Appbar.Header mode={"small"}>
                <Appbar.BackAction onPress={() => router.push({pathname: "/"})}/>
                <Appbar.Content title={date}/>
                <MenuComponent
                    date={id}
                    visible={visible}
                    setVisible={setVisible}
                    deleteAction={handleDeleteInventory}
                />
            </Appbar.Header>
            <SafeAreaView style={styles.container}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={{height: "100%"}}
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
                                setModal={setModal}
                            />
                        </Modal>
                    </Portal>

                    <CameraScanner
                        scanning={scanning}
                        onBarCodeScanned={handleBarCodeScanned}
                        onCancelScan={() => setScanning(false)}
                        onStartScan={startScan}
                    />

                    <ManualInput
                        idProduct={idProduct.toString()}
                        count={count}
                        saved={saved}
                        scaleAnimated={scaleAnimated}
                        onIdChange={setIdProduct}
                        onCountChange={setCount}
                        onSave={() => {
                            saveManual();
                            Keyboard.dismiss();
                        }}
                    />
                    <FlatList
                        data={productsSorted}
                        keyExtractor={item => item.id?.toString()}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>} 
                        // inverted={true}
                        renderItem={({item}) => (
                            <ProductList
                                products={[item]}
                                visible={visible}
                                onSetVisible={setVisible}
                                onShowModal={showModal}
                                onEditProduct={(item) => {
                                    setIdProduct(item.id);
                                    setCount(item.count);
                                    setOpenedForEdit(item.id);
                                    setModal(true);
                                    setVisible(null);
                                }}
                                onRemoveProduct={removeScannedCode}
                            />
                        )}
                        contentContainerStyle={{paddingBottom: "30%"}}
                        ListEmptyComponent={<Text style={styles.message}>Žádné produkty</Text>}
                        ListFooterComponent={
                            <SaveSnackbar
                                visible={saved}
                                onDismiss={() => setSaved(false)}
                            />
                        }
                    />
                </KeyboardAvoidingView>
            </SafeAreaView>
        </>
    );
}