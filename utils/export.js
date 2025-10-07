import * as XLSX from "xlsx";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

export const formatDataForExport = (data) => {
    if (data.length === 0) {
        return [];
    }
    return data.map(item => ({
        id: item.id,
        count: item.count,
        date: item.date || new Date().toISOString().split('T')[0],
    }));
};

export const exportToCSV = async (data, filename) => {
    try {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workbook, worksheet, filename);

        const csv = XLSX.utils.sheet_to_csv(worksheet);
        const fileUri = `${FileSystem.documentDirectory}${filename}.csv`;

        await FileSystem.writeAsStringAsync(fileUri, csv, {
            encoding: FileSystem.EncodingType.UTF8,
        });

        await Sharing.shareAsync(fileUri, {
            dialogTitle: `Share ${filename}.csv`,
            mimeType: "text/csv",
        });
    } catch (error) {
        console.error("Error exporting to CSV:", error);
        throw new Error("Failed to export data");
    }
};