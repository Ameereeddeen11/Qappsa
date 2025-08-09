import { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DetailPage() {
    let { count, data } = useLocalSearchParams();
    const [ id, setID ] = useState();
    const [ countDynamic, setCountDynamic ] = useState(count);
    const [ sale, setSale ] = useState();

    return (
        <SafeAreaView>
            <ScrollView contentContainerStyle={styles.container}>
                <TextInput
                    label="ID"
                    mode="outlined"
                    value={data as string}
                    disabled={true}
                    style={{ width: '90%', marginBottom: 20 }}
                />
                <TextInput
                    label="Počet"
                    mode="outlined"
                    value={countDynamic as string}
                    onChangeText={text => setCountDynamic(text)}
                    style={{ width: '90%', marginBottom: 20 }}
                />
                <Button
                    mode="contained"
                    onPress={() => console.log('Uložit')}
                    style={{ width: '90%', marginTop: 20 }}
                >
                    Ulozit
                </Button>
                <Button
                    mode="contained"
                    onPress={() => console.log('Generovat CSV soubor')}
                    style={{ width: '90%', marginTop: 20 }}
                >
                    Generovat CSV soubor
                </Button>
                <Button
                    mode="contained"
                    textColor="white"
                    buttonColor="red"
                    onPress={() => console.log('Smazat')}
                    style={{ width: '90%', marginTop: 20 }}
                >
                    Smazat
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