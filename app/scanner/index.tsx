import { Stack, useLocalSearchParams } from "expo-router";
import { SafeAreaView, StyleSheet, Text } from "react-native";

export default function Home() {
    const { scannedData } = useLocalSearchParams();
  return (
    <SafeAreaView style={StyleSheet.absoluteFillObject}>
      <Stack.Screen
        options={{ title: "QR Code Scanner", headerShown: false }}
      />
      <Text style={styles.buttonStyle}>
        {scannedData ? `Scanned Data: ${scannedData}` : "No data scanned yet"}
      </Text>
      {/* {Platform.OS === "android" && <StatusBar hidden />}
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={({ data }) => {
          console.log("Scanned data: ", data);
        }}
      />
      <Overlay /> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    buttonStyle: {
      color: "#0E7AFE",
      fontSize: 20,
      textAlign: "center",
    },
  });