import { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DetailPage() {
    const { count, data } = useLocalSearchParams();
    const [ id, setID ] = useState();
    const [ sale, setSale ] = useState();

    return (
        <SafeAreaView>
            <ScrollView contentContainerStyle={styles.container}>
                <TextInput
                    label="Data"
                    mode="outlined"
                    value={data as string}
                    disabled={true}
                    style={{ width: '90%', marginBottom: 20 }}
                />
                <TextInput
                    label="Data"
                    mode="outlined"
                    value={count as string}
                    style={{ width: '90%', marginBottom: 20 }}
                    disabled={true}
                />
                <TextInput
                    label="Sleva"
                    mode="outlined"
                    value={sale}
                    style={{ width: '90%' }}
                />
                <Button
                    mode="contained"
                    onPress={() => console.log('Save pressed')}
                    style={{ width: '90%', marginTop: 20 }}
                >
                    Save
                </Button>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
})