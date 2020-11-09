import React, { useState } from 'react';
import axios from 'axios'
import { FlatList, View, ScrollView, ImageBackground, StyleSheet, Dimensions, Text, Image, TouchableOpacity, Alert, RefreshControl } from 'react-native';


export default function ValidationStock({ route, navigation }) {
    const { products } = route.params;
    const [error, setError] = useState(null)

    async function sendToAPI() {
        var list = []
        var msg = "Les quantités ont été enregistrées"
        products.forEach(({ id, stock }) => {
            list = [...list, { "id": id, "quantity": stock+1 }]
        });
        console.log({ "quantities" : list })
        try{
           await axios.post("/products/stock", { "quantities": list })

        } catch(e) {
            console.error()
            msg = "Une erreur s'est produite"
        }
        setError(msg)
    }


    return (
        <ImageBackground
            source={require('../pictures/Moutains.jpg')}
            style={{
                flex: 1,
                width: null,
                height: Dimensions.get('window').height,
            }}
        >
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
                    <Text>Recommencer</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => sendToAPI()}>
                    <Text>Enregistrer</Text>
                </TouchableOpacity>
                <FlatList
                    data={products}
                    keyExtractor={(product) => product.id.toString()}
                    ListEmptyComponent={
                        <View style={{ flex: 1, }}>
                            <Text style={styles.error}>Un problème est survenu, veuillez revenir en arrière et tester à nouveau</Text>
                            <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
                                <Text>Revenir en arrière</Text>
                            </TouchableOpacity>
                        </View>
                    }
                    renderItem={({ item }) => (
                        <Text style={{ color: "white" }}>{item.name}: {item.stock} {item.unit}</Text>
                    )}
                />
                {error && (
                    <Text style={styles.msg}> {error} </Text> 
                )}
            </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    error: {
        color: 'white',
        fontSize: 20,
        textAlign: 'center',
        marginTop: '50%',
        textShadowColor: '#000',
        textShadowOffset: { width: 3, height: 3 },
        textShadowRadius: 7,
    },
    button: {
        fontSize: 20,
        backgroundColor: "grey",
        borderRadius: 100,
        borderColor: "black",
        borderWidth: 1,
        paddingBottom: 4,
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        margin: 10,
        padding: 5
    },
    msg: {
        padding: 10,
        backgroundColor: "lightgrey",

    }
});