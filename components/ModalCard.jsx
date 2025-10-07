import {useEffect} from "react";
import {StyleSheet} from "react-native";
import {Card, Title, Button, Divider, TextInput} from "react-native-paper";
import {updateProductCount, getProductByID} from "../utils/products";

export const ModalCard = ({id, setOpenedForEdit, date, countDynamic, setCountDynamic, onRefresh, setModal}) => {
    useEffect(() => {
        getProductByID(date, id).then((data) => {
            setOpenedForEdit(data.id);
            setCountDynamic(data.count);
        });
    }, []);

    return (
        <Card style={styles.card} mode="elevated">
            <Card.Content>
                <Title style={styles.title}>Detaily produktu</Title>
                <Divider style={{marginVertical: 10}}/>

                <TextInput
                    label="ID produktu"
                    mode="outlined"
                    value={id}
                    onChangeText={setOpenedForEdit}
                    disabled
                    style={styles.input}
                />

                <TextInput
                    label="Počet kusů"
                    mode="outlined"
                    keyboardType="numeric"
                    value={countDynamic.toString()}
                    onChangeText={setCountDynamic}
                    style={styles.input}
                />

                <Button
                    mode="contained"
                    onPress={() => {
                        updateProductCount(date, id, countDynamic)
                            .then(() => {
                                onRefresh();
                                setOpenedForEdit('');
                                setCountDynamic('');
                                setModal(false);
                            })
                            .catch((error) => {
                                console.error("Chyba při aktualizaci počtu produktu:", error);
                                alert(error.message);
                            });
                    }}
                    style={styles.saveButton}
                    icon="content-save"
                >
                    Uložit změny
                </Button>

                {/*<Button*/}
                {/*    mode="contained"*/}
                {/*    buttonColor="#d32f2f"*/}
                {/*    textColor="white"*/}
                {/*    onPress={() =>*/}
                {/*        deleteProduct({date, productId: id})*/}
                {/*            .then(() => {*/}
                {/*                console.log("Produkt smazán");*/}
                {/*                // router.back();*/}
                {/*            })*/}
                {/*            .catch((error) => {*/}
                {/*                console.error("Chyba při mazání produktu:", error);*/}
                {/*                alert(error.message);*/}
                {/*            })*/}
                {/*    }*/}
                {/*    style={styles.deleteButton}*/}
                {/*    icon="delete"*/}
                {/*>*/}
                {/*    Smazat produkt*/}
                {/*</Button>*/}
            </Card.Content>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        width: "95%",
        alignSelf: "center",
        padding: 10,
        borderRadius: 12,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        textAlign: "center",
    },
    input: {
        marginVertical: 8,
    },
    saveButton: {
        marginTop: 16,
        borderRadius: 8,
    },
    deleteButton: {
        marginTop: 10,
        borderRadius: 8,
    },
})