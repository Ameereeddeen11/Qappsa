import { useCameraPermissions } from 'expo-camera';
import { Link, Stack } from 'expo-router';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function Home() {
    const [cameraPermission, requestCameraPermission] = useCameraPermissions();

    const isPermissionGranted = cameraPermission?.granted;

    return (
        <SafeAreaView>
            <Stack.Screen options={{ title: "Overview", headerShown: false }} />
            <Text style={styles.text}>Qappsa</Text>
            <View style={{gap: 20}}>
                <Pressable onPress={requestCameraPermission}>
                    <Text style={styles.text}>Request Permissions</Text>
                </Pressable>
                <Link href={"/scanner"} asChild>
                    <Pressable disabled={!isPermissionGranted}>
                        <Text style={styles.link}>Go to Camera</Text>
                    </Pressable>
                </Link>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    text: {
        fontSize: 20,
        color: '#333',
    },
    link: {
        fontSize: 18,
        color: '#007AFF',
        textDecorationLine: 'underline',
    },
});