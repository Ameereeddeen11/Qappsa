import {Snackbar} from "react-native-paper";

export function SaveSnackbar({visible, onDismiss}) {
    return (
        <Snackbar
            visible={visible}
            onDismiss={onDismiss}
        >
            Produkt byl úspěšně uložen
        </Snackbar>
    );
}