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
                <View style={styles.cameraWrapper}>
                    <CameraView
                        style={styles.camera}
                        onBarcodeScanned={onBarCodeScanned}
                    />
                    <View style={styles.overlayContent} pointerEvents="box-none">
                        {/*<Text style={styles.scanningText}>*/}
                        {/*    Namiřte na čárový kód...*/}
                        {/*</Text>*/}
                        <IconButton
                            icon={"close"}
                            iconColor={"white"}
                            size={18}
                            onPress={onCancelScan}
                            style={{
                                position: "absolute",
                                top: -7,
                                right: -7,
                                borderRadius: 100,
                                zIndex: 2,
                            }}
                        />
                    </View>
                </View>
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
        // paddingBottom: 20,
    },
    cameraWrapper: {
        width: "70%",
        aspectRatio: 1,
        position: "relative",
        justifyContent: "center",
        alignItems: "center",
    },
    camera: {
        width: "100%",
        aspectRatio: 1,
    },
    overlayContent: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: "center",
        zIndex: 1,
        pointerEvents: "box-none",
    },
    scanningText: {
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        width: "100%",
        paddingBottom: 20
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