import { useLocalSearchParams } from "expo-router";
import { StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DetailPage() {
    const { count, data } = useLocalSearchParams();

    return (
        <SafeAreaView style={styles.container}>
            <Text>Detail Page</Text>
            <Text>Data: {count} {data} </Text>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
})