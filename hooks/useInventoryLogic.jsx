import { useRef, useState, useCallback } from "react";
import { Animated, Alert } from "react-native";
import { getProducts, addProduct, updateProductCount } from "@/utils/products";

export function useInventoryLogic(inventoryId, setProducts) {
    const [scanning, setScanning] = useState(false);
    const [idProduct, setIdProduct] = useState("");
    const [count, setCount] = useState("");
    const [saved, setSaved] = useState(false);
    const [lastSaved, setLastSaved] = useState({ id: "", count: "" });

    const scannedRef = useRef(false);
    const scaleAnimated = useRef(new Animated.Value(1)).current;

    const isDirty = idProduct !== lastSaved.id || count !== lastSaved.count;

    const resetInputs = useCallback(() => {
        setIdProduct("");
        setCount("");
        setLastSaved({ id: "", count: "" });
        scannedRef.current = false;
        setScanning(false);
    }, []);

    const saveManual = async () => {
        const idNum = Number(idProduct);
        const countNum = Number(count || "1");

        if (!Number.isFinite(idNum) || idNum <= 0 || !Number.isFinite(countNum) || countNum <= 0) {
            Alert.alert("Chyba", "Zadejte platné ID a počet větší než 0.");
            return false;
        }

        try {
            // Animate save button
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

            const updatedProducts = await updateProductCount(inventoryId, idNum, countNum)
                .then(() => {
                    setLastSaved({ id: String(idNum), count: String(countNum) });
                    return getProducts(inventoryId);
                });

            setProducts(updatedProducts);

            // Auto-hide success message
            setTimeout(() => {
                setSaved(false);
            }, 2500);

            return true;
        } catch (error) {
            console.error("Chyba při přidávání produktu:", error);
            alert(error.message);
            return false;
        }
    };

    const handleBarCodeScanned = async ({ data }) => {
        if (scannedRef.current) return;
        scannedRef.current = true;

        try {
            const scannedId = Number(data);
            if (!Number.isFinite(scannedId) || scannedId <= 0) {
                throw new Error("Nesprávný formát čárového kódu.");
            }

            // Update input field with scanned ID
            setIdProduct(String(scannedId));

            // Add/increment product and get updated list
            const updatedProducts = await addProduct(inventoryId, scannedId);
            setProducts(updatedProducts);

            // Find current count of scanned product and update count input
            const found = Array.isArray(updatedProducts)
                ? updatedProducts.find(p => String(p.id) === String(scannedId))
                : null;
            const currentCount = found?.count ?? 1;
            setCount(String(currentCount));

            // Save last values as "saved"
            setLastSaved({ id: String(scannedId), count: String(currentCount) });
        } catch (error) {
            console.error("Chyba při přidávání produktu:", error);
            alert(error.message);
        } finally {
            setScanning(false);
        }
    };

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
                    { text: "Zrušit", style: "cancel" },
                ]
            );
            return;
        }

        scannedRef.current = false;
        setScanning(true);
    };

    return {
        scanning,
        idProduct,
        count,
        saved,
        isDirty,
        scaleAnimated,
        setScanning,
        setIdProduct,
        setCount,
        setSaved,
        saveManual,
        handleBarCodeScanned,
        startScan,
        resetInputs
    };
}