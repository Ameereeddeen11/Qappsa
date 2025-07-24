import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Platform, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function Home() {
  const router = useRouter();
  const [scannedData, setScannedData] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  const isPermissionGranted = Boolean(permission?.granted);

  useEffect(() => {
    if (!isPermissionGranted) {
      requestPermission();
    }
  }, [isPermissionGranted, requestPermission]);

  return (
    <SafeAreaView style={styles.container}>
      {isPermissionGranted ? (
        <>
          <CameraView
            style={{
              width: "100%",
              height: "50%",
            }}
            facing="back"
            onBarcodeScanned={({ data }) => {
              if (data && !scannedData) {
                setScannedData(true);
                router.push({
                  pathname: "/scanner",
                  params: { scannedData: data },
                });
              } else {
                setScannedData(false);
              }
            }}
          />
          {Platform.OS === "android" && <StatusBar hidden />}
        </>
      ) : (
        <View
          style={{
            alignItems: "center",
            gap: 20,
            width: "100%",
            height: "50%",
          }}
        >
          <Text style={styles.title}>Povolení kamery</Text>
          <Text>Přístup ke kameře byl zamítnut</Text>
          <Pressable
            onPress={requestPermission}
            style={{ padding: 10, backgroundColor: "#0E7AFE" }}
          >
            <Text style={{ color: "white" }}>Povolit přístup</Text>
          </Pressable>
        </View>
      )}
      <View style={{ gap: 20, width: "100%", alignItems: "center" }}>
        {/* <Pressable onPress={requestPermission}>
          <Text style={styles.buttonStyle}>Request Permissions</Text>
        </Pressable>
        <Link href={"/scanner"} asChild>
          <Pressable disabled={!isPermissionGranted}>
            <Text
              style={[
                styles.buttonStyle,
                { opacity: !isPermissionGranted ? 0.5 : 1 },
              ]}
            >
              Scan Code
            </Text>
          </Pressable>
        </Link> */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "black",
    justifyContent: "space-around",
    paddingVertical: 80,
  },
  title: {
    color: "white",
    fontSize: 40,
  },
  buttonStyle: {
    color: "#0E7AFE",
    fontSize: 20,
    textAlign: "center",
  },
});
