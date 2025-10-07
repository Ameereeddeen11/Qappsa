import * as XLSX from "xlsx";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

export const formatDataForExport = (products, inventoryName) => {
    if (!Array.isArray(products) || products.length === 0) {
        return [];
    }

    const exportName = String(inventoryName).trim() || 'Neznámá inventura';

    return products.map(item => ({
        'Produkt ID': String(item.id),
        'Počet (ks)': item.count,
        'Název Inventury': exportName,
    }));
};

export const exportToCSV = async (data, filename) => {
    try {
        // Zde se nic nemění, funkce funguje s polem objektů, které vytvoří formatDataForExport
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workbook, worksheet, filename);

        const csv = XLSX.utils.sheet_to_csv(worksheet);
        const fileUri = `${FileSystem.documentDirectory}${filename}.csv`;

        await FileSystem.writeAsStringAsync(fileUri, csv, {
            encoding: FileSystem.EncodingType.UTF8,
        });

        await Sharing.shareAsync(fileUri, {
            dialogTitle: `Sdílet ${filename}.csv`,
            mimeType: "text/csv",
        });
    } catch (error) {
        console.error("Chyba při exportu do CSV:", error);
        throw new Error("Export dat se nezdařil.");
    }
};