import {StyleSheet, View, Animated} from "react-native";
import {TextInput, IconButton} from "react-native-paper";

export function ManualInput({
                                idProduct,
                                count,
                                saved,
                                scaleAnimated,
                                onIdChange,
                                onCountChange,
                                onSave
                            }) {
    return (
        <View style={styles.inputView}>
            <TextInput
                label="ID produktu"
                mode="outlined"
                keyboardType="numeric"
                value={idProduct}
                onChangeText={onIdChange}
                style={styles.input}
            />
            <TextInput
                label="Počet kusů"
                mode="outlined"
                keyboardType="numeric"
                value={count}
                onChangeText={onCountChange}
                style={styles.input}
            />
            <Animated.View style={[
                {transform: [{scale: scaleAnimated}]},
                styles.saveButton
            ]}>
                <IconButton
                    icon={saved ? "check" : "content-save-outline"}
                    iconColor={saved ? "green" : "white"}
                    size={30}
                    mode="contained"
                    onPress={onSave}
                    style={styles.saveButtonIcon}
                />
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    inputView: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 15,
    },
    input: {
        width: "40%",
    },
    saveButton: {
        width: "15%",
        alignItems: "center",
    },
    saveButtonIcon: {
        borderRadius: 8,
    },
});