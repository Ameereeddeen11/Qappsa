// import * as XLSX from "xlsx";
// import * as FileSystem from "expo-file-system";
// import * as Sharing from "expo-sharing";
//
// export const formatDataForExport = (data) => {
//     // if (data.length === 0) {
//     //     return [];
//     // }
//     return data.map(item => ({
//         id: item.id,
//         count: item.count,
//         date: item.name || new Date().toISOString().split('T')[0],
//     }));
// };
//
// export const exportToCSV = async (data, filename) => {
//     try {
//         const worksheet = XLSX.utils.json_to_sheet(data);
//         const workbook = XLSX.utils.book_new();
//
//         XLSX.utils.book_append_sheet(workbook, worksheet, filename);
//
//         const csv = XLSX.utils.sheet_to_csv(worksheet);
//         const fileUri = `${FileSystem.documentDirectory}${filename}.csv`;
//
//         await FileSystem.writeAsStringAsync(fileUri, csv, {
//             encoding: FileSystem.EncodingType.UTF8,
//         });
//
//         await Sharing.shareAsync(fileUri, {
//             dialogTitle: `Share ${filename}.csv`,
//             mimeType: "text/csv",
//         });
//     } catch (error) {
//         console.error("Error exporting to CSV:", error);
//         throw new Error("Failed to export data");
//     }
// };

import * as XLSX from "xlsx";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

/**
 * Převede pole produktů z inventury do formátu vhodného pro export (CSV/XLSX).
 * @param {Array<Object>} products Pole objektů produktů (např. {id: 'SKU123', count: 10}).
 * @param {string} inventoryName Název inventury (datum nebo název zadaný uživatelem).
 * @returns {Array<Object>} Formátované pole s ID produktu, počtem a názvem inventury.
 */
export const formatDataForExport = (products, inventoryName) => {
    // 1. Zajištění, že máme platné produkty
    if (!Array.isArray(products) || products.length === 0) {
        return [];
    }

    // 2. Mapování produktů na exportní formát
    // Jako 'date' nyní použijeme skutečný název inventury, který je pro uživatele smysluplnější.
    const exportName = String(inventoryName).trim() || 'Neznámá inventura';

    return products.map(item => ({
        // Předpoklad: ID produktu (SKU) je ve vlastnosti 'id'
        'Produkt ID': String(item.id),
        'Počet (ks)': item.count,
        'Název Inventury': exportName,
        // Pokud byste chtěli i datum exportu
        // 'Datum exportu': new Date().toISOString().split('T')[0],
    }));
};

// ---

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