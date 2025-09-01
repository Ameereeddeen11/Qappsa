import AsyncStorage from "@react-native-async-storage/async-storage";
import {getInventories} from "./inventory";

const STORAGE_KEY = "inventories";

export const getProducts = async (inventoryId) => {
    if (!inventoryId) return [];
    try {
        const inventories = await getInventories();
        const inv = inventories[inventoryId];
        const products = inv?.products;
        if (!Array.isArray(products)) return [];
        return products.map((item) => ({
            id: item.id,
            count: item.count || 0,
        }));
    } catch (err) {
        console.error("getProducts error", err);
        return [];
    }
};

export const getProductByID = async (inventoryId, id) => {
    if (!inventoryId || !id) return null;
    try {
        const inventories = await getInventories();
        const inv = inventories[inventoryId];
        const allProducts = Array.isArray(inv?.products) ? inv.products : [];
        const idStr = String(id);
        const product = allProducts.find(item => String(item.id) === idStr) || null;
        return product;
    } catch (err) {
        console.error("getOneProduct", err);
        return null;
    }
};

export const addProduct = async (inventoryId, productId) => {
    if (!inventoryId) throw new Error("Inventory ID is required");
    try {
        const inventories = await getInventories();

        if (!inventories[inventoryId]) {
            throw new Error(`Inventura s ID ${inventoryId} neexistuje.`);
        }

        if (!Array.isArray(inventories[inventoryId].products)) {
            inventories[inventoryId].products = [];
        }

        const products = inventories[inventoryId].products;
        const idStr = String(productId);

        const existing = products.find((p) => String(p.id) === idStr);
        if (existing) {
            existing.count = (Number(existing.count) || 0) + 1;
        } else {
            products.push({ id: idStr, count: 1 });
        }

        inventories[inventoryId].products = products;
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(inventories));
        return inventories[inventoryId].products;
    } catch (err) {
        console.error("addProduct error", err);
        throw err;
    }
};

export const updateProductCount = async (inventoryId, productId, newCount) => {
    if (!inventoryId) throw new Error("Inventory ID is required");
    try {
        const inventories = await getInventories();

        if (!inventories[inventoryId]) {
            throw new Error(`Inventura pro ID ${inventoryId} neexistuje.`);
        }

        if (!Array.isArray(inventories[inventoryId].products)) {
            inventories[inventoryId].products = [];
        }

        const products = inventories[inventoryId].products;
        const idStr = String(productId);
        const idx = products.findIndex((p) => String(p.id) === idStr);

        if (idx === -1) {
            // pokud produkt neexistuje, vytvoříme jej s daným počtem
            products.push({ id: idStr, count: Number(newCount) });
        } else {
            products[idx].count = Number(newCount);
        }

        inventories[inventoryId].products = products;
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(inventories));
        return inventories[inventoryId].products;
    } catch (err) {
        console.error("updateProductCount error", err);
        throw err;
    }
};

export const deleteProduct = async (inventoryId, productId) => {
    if (!inventoryId) throw new Error("Inventory ID is required");
    try {
        const inventories = await getInventories();

        if (!inventories[inventoryId] || !Array.isArray(inventories[inventoryId].products)) {
            return [];
        }

        const idStr = String(productId);
        inventories[inventoryId].products = inventories[inventoryId].products.filter(
            (p) => String(p.id) !== idStr
        );

        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(inventories));
        return inventories[inventoryId].products;
    } catch (err) {
        console.error("deleteProduct error", err);
        throw err;
    }
};
