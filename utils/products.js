import AsyncStorage from "@react-native-async-storage/async-storage";
import {getInventories} from "./inventory";

const STORAGE_KEY = "inventories";

export const getProducts = async (date) => {
    if (!date) return [];
    try {
        const inventories = await getInventories();
        const products = inventories[date];
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

export const getProductByID = async (date, id) => {
    if (!date && !id) return [];
    try {
        const inventories = await getInventories();
        const allProducts = inventories[date];
        const product = allProducts.find(item => item.id === id);
        return product;
    } catch (err) {
        console.error("getOneProduct", err);
        return [];
    }
};

export const addProduct = async (date, productId) => {
    if (!date) throw new Error("Date is required");
    try {
        const inventories = await getInventories();

        if (!inventories[date] || !Array.isArray(inventories[date])) {
            inventories[date] = [];
        }

        const products = inventories[date];
        const idStr = String(productId);

        // Check if product already exists
        const existing = products.find((p) => String(p.id) === idStr);
        if (existing) {
            existing.count = (Number(existing.count) || 0) + 1;
        } else {
            products.push({id: idStr, count: 1});
        }

        inventories[date] = products;
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(inventories));
        return inventories[date];

    } catch (err) {
        console.error("addProduct error", err);
        throw err;
    }
};

export const updateProductCount = async (date, productId, newCount) => {
    if (!date) throw new Error("Date is required");
    try {
        const inventories = await getInventories();
        if (!inventories[date] || !Array.isArray(inventories[date])) {
            throw new Error(`Inventura pro datum ${date} neexistuje.`);
        }

        const idStr = String(productId);
        const idx = inventories[date].findIndex((p) => String(p.id) === idStr);
        if (idx === -1) {
            await addProduct(date, productId);
            return inventories[date];
        }

        inventories[date][idx].count = Number(newCount);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(inventories));
        return inventories[date];
    } catch (err) {
        console.error("updateProductCount error", err);
        throw err;
    }
};

export const deleteProduct = async (date, productId) => {
    if (!date) throw new Error("Date is required");
    try {
        const inventories = await getInventories();
        if (!inventories[date] || !Array.isArray(inventories[date])) return [];

        const idStr = String(productId);
        inventories[date] = inventories[date].filter((p) => String(p.id) !== idStr);

        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(inventories));
        return inventories[date];
    } catch (err) {
        console.error("deleteProduct error", err);
        throw err;
    }
};
