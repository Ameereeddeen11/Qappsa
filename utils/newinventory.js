import AsyncStorage from "@react-native-async-storage/async-storage";

const INVENTORIES_KEY = "allInventoriesKeys";

// 📌 CREATE – vytvoření nové inventury
export const createInventory = async (id, nameInventory) => {
    try {
        // 1. přidáme id inventury do seznamu všech inventur
        const keysJSON = await AsyncStorage.getItem(INVENTORIES_KEY);
        let keys = keysJSON ? JSON.parse(keysJSON) : [];

        if (!keys.includes(id)) {
            keys.push(id);
            await AsyncStorage.setItem(INVENTORIES_KEY, JSON.stringify(keys));
        }

        // 2. samotná inventura
        const newInventory = {
            id,
            nameInventory,
            products: {} // prázdné na začátku
        };

        await AsyncStorage.setItem(String(id), JSON.stringify(newInventory));
        return newInventory;
    } catch (error) {
        console.error("❌ Chyba při vytváření inventury:", error);
    }
};

// 📌 READ – načtení jedné inventury
export const getInventory = async (id) => {
    try {
        const inventoryJSON = await AsyncStorage.getItem(String(id));
        return inventoryJSON ? JSON.parse(inventoryJSON) : null;
    } catch (error) {
        console.error("❌ Chyba při načítání inventury:", error);
    }
};

// 📌 READ ALL – načtení všech inventur
export const getAllInventories = async () => {
    try {
        const keysJSON = await AsyncStorage.getItem(INVENTORIES_KEY);
        const keys = keysJSON ? JSON.parse(keysJSON) : [];
        const inventories = [];

        for (let id of keys) {
            const inv = await getInventory(id);
            if (inv) inventories.push(inv);
        }

        return inventories;
    } catch (error) {
        console.error("❌ Chyba při načítání všech inventur:", error);
    }
};

// 📌 UPDATE – úprava inventury (např. přidání produktu)
export const updateInventory = async (id, updatedData) => {
    try {
        const inventory = await getInventory(id);
        if (!inventory) return null;

        const newInventory = { ...inventory, ...updatedData };
        await AsyncStorage.setItem(String(id), JSON.stringify(newInventory));
        return newInventory;
    } catch (error) {
        console.error("❌ Chyba při úpravě inventury:", error);
    }
};

// 📌 DELETE – smazání inventury
export const deleteInventory = async (id) => {
    try {
        await AsyncStorage.removeItem(String(id));

        const keysJSON = await AsyncStorage.getItem(INVENTORIES_KEY);
        let keys = keysJSON ? JSON.parse(keysJSON) : [];

        keys = keys.filter((key) => key !== id);
        await AsyncStorage.setItem(INVENTORIES_KEY, JSON.stringify(keys));
    } catch (error) {
        console.error("❌ Chyba při mazání inventury:", error);
    }
};
