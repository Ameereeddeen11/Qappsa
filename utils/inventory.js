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

export const addInventory = async (date) => {
  try {
    const inventories = await getInventories();

    if (inventories[date]) {
    }

    inventories[date] = [];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(inventories));
    return inventories;
  } catch (error) {
    console.error("Chyba při přidávání inventury:", error);
    throw error;
  }
};

export const getInventoryByDate = async (date) => {
  const inventories = await getInventories();
  return inventories[date] || null;
};

export const updateInventoryDate = async (oldDate, newDate) => {
  try {
    const inventories = await getInventories();

    if (!inventories[oldDate]) {
      throw new Error(`Inventura pro datum ${oldDate} neexistuje.`);
    }
    if (inventories[newDate]) {
      throw new Error(`Inventura pro datum ${newDate} už existuje.`);
    }

    inventories[newDate] = inventories[oldDate];
    delete inventories[oldDate];

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(inventories));
    return inventories;
  } catch (error) {
    console.error("Chyba při úpravě inventury:", error);
    throw error;
  }
};

export const deleteInventory = async (date) => {
  try {
    const inventories = await getInventories();

    if (!inventories[date]) {
      throw new Error(`Inventura pro datum ${date} neexistuje.`);
    }

    delete inventories[date];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(inventories));
    return inventories;
  } catch (error) {
    console.error("Chyba při mazání inventury:", error);
    throw error;
  }
};
