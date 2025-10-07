import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "inventories";

export const getInventories = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
        return jsonValue != null ? JSON.parse(jsonValue) : {};
    } catch (error) {
        console.error("Chyba při načítání inventur:", error);
        return {};
    }
};

// Pomocná funkce pro zajištění unikátního názvu
const ensureUniqueName = (inventories, baseName) => {
    // Pokud název neexistuje, použijeme rovnou
    const names = Object.values(inventories).map((inv) => inv?.name).filter(Boolean);
    if (!names.includes(baseName)) return baseName;

    // Hledáme další volné pořadí
    let i = 2;
    let candidate = `${baseName} (${i})`;
    while (names.includes(candidate)) {
        i += 1;
        candidate = `${baseName} (${i})`;
    }
    return candidate;
};

export const addInventory = async (date) => {
  try {
    const inventories = await getInventories();

    const id = Date.now()
    inventories[id] = { id: id, name: date, products: [] };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(inventories));
    return { inventories, id: id, name: date };
  } catch (error) {
    console.error("Chyba při přidávání inventury:", error);
    throw error;
  }
};

export const getInventoryByDate = async (id) => {
    // Pozn.: zachováváme původní název funkce kvůli kompatibilitě,
    // nyní ale očekává ID inventury (klíč uložený jako Date.now()).
    const inventories = await getInventories();
    return inventories[id] || null;
};

export const updateInventoryDate = async (id, newName) => {
    // Pozn.: nyní tato funkce NEMĚNÍ klíč/ID inventury, ale pouze její název.
    try {
        const inventories = await getInventories();

        if (!inventories[id]) {
            throw new Error(`Inventura s ID ${id} neexistuje.`);
        }

        const current = inventories[id];
        const baseName = (newName && String(newName).trim()) || current.name;
        const uniqueName = ensureUniqueName(
            // Při kontrole unikátnosti vyloučíme právě editovanou inventuru
            Object.fromEntries(Object.entries(inventories).filter(([k]) => String(k) !== String(id))),
            baseName
        );

        inventories[id] = {
            ...current,
            name: uniqueName
        };

        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(inventories));
        return inventories;
    } catch (error) {
        console.error("Chyba při úpravě inventury:", error);
        throw error;
    }
};

export const deleteInventory = async (id) => {
    try {
        const inventories = await getInventories();

        if (!inventories[id]) {
            throw new Error(`Inventura s ID ${id} neexistuje.`);
        }

        delete inventories[id];
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(inventories));
        return inventories;
    } catch (error) {
        console.error("Chyba při mazání inventury:", error);
        throw error;
    }
};
