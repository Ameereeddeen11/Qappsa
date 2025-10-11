import {CameraView} from "expo-camera";
import {StyleSheet, View} from "react-native";
import {Text, Button, IconButton} from "react-native-paper";

export function CameraScanner({
                                  scanning, onBarCodeScanned,
                                  onCancelScan,
                                  onStartScan
                              }) {
    if (scanning) {
        return (
            <View style={styles.cameraOverlay}>
                <CameraView
                    style={styles.camera}
                    onBarcodeScanned={onBarCodeScanned}
                />
                <Text style={styles.scanningText}>
                    Namiřte fotoaparát na čárový kód...
                </Text>
                <Button
                    mode="outlined"
                    style={styles.cancelButton}
                    onPress={onCancelScan}
                >
                    Zrušit
                </Button>
            </View>
        );
    }

    return (
        <IconButton
            icon="barcode-scan"
            mode="contained"
            size={250}
            onPress={onStartScan}
            style={styles.scanButton}
        />
    );
}

const styles = StyleSheet.create({
    cameraOverlay: {
        alignItems: "center",
        paddingBottom: 20,
    },
    camera: {
        width: "75%",
        aspectRatio: 1,
    },
    scanningText: {
        marginTop: 10,
        textAlign: "center",
    },
    cancelButton: {
        marginTop: 12,
    },
    scanButton: {
        borderRadius: 25,
        alignSelf: "center",
        marginTop: -20,
    },
});