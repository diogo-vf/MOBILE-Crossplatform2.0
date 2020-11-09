import React, { useEffect } from 'react';
import axios from 'axios'
import { View, Dimensions, TextInput, ImageBackground, Text, StyleSheet, Image } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { ip, port } from '../../app.json';

export default function ValidationStock(props) {
    const { navigation } = props;
    const [index, setIndex] = React.useState(0)
    const [products, setProducts] = React.useState([])
    const [product, setProduct] = React.useState(null)
    const [quantity, setQuantity] = React.useState(0)

    useEffect(() => {
        async function fetchData() {
            await getProducts()
        }
        fetchData()
    }, [null])
    async function getProducts() {
        var res = await axios.get('/products')
        setProducts(res.data.data)
        setProduct(res.data.data.filter(({ id }) => id == products[index]))
        console.log(product)
        return await res.data.data
    }
    function nextProduct(value) {
        var currentIndex = index
        if (value > products.length - 1)
            setIndex(0)
        else if (value < 0)
            setIndex(products.length - 1)
        else
            setIndex(value)
        setProduct(products.filter(({ id }) => id == products[index]))            
        // setQuantity(products.filter(({ id }) => id == products[index]).stock) 
    }
    function updateQuantity(quantity){
        console.log(quantity)
        if(isNaN(quantity) || quantity<0)
        {
            setQuantity(products[index].stock)
            return
        }

        setQuantity(quantity) 
        nextProduct(index+1) 
        setQuantity(0)  
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
            <ScrollView>
                <TouchableOpacity onPress={() => navigation.navigate("summary")}>
                    <Text>validation du stock WIP</Text>
                </TouchableOpacity>
                {product && (
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <Text style={styles.title}>Validation du stock</Text>
                        <Image style={styles.picture} source={{ uri: `http://${ip}:${port}/storage/pictures/${products[index].picture}` }} />
                        <View style={{ flex: 1, flexDirection: "row" }}>
                            <TouchableOpacity onPress={() => nextProduct(index - 1)} style={styles.button}>
                                <Text>&lt;</Text>
                            </TouchableOpacity>
                            <Text style={{ color: "white" }}>{products[index].name}</Text>
                            <TouchableOpacity onPress={() => nextProduct(index + 1)} style={styles.button}>
                                <Text>&gt;</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" , flexDirection: "row", width: "100%" }}>
                            <Text style={{ color: "white" }}>Stock</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholderTextColor="rgb(180, 180, 180)"
                                keyboardType="numeric"
                                value={quantity}
                                onChange={setQuantity}

                            />
                            <Text style={{ color: "white" }}>{products[index].unit}</Text>
                            <TouchableOpacity onPress={() => updateQuantity(quantity)} style={styles.button}>
                                <Text>valider</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </ScrollView>

        </ImageBackground>
    )
}


const styles = StyleSheet.create({
    title: {
        fontSize: 30,
        color: "white",
        textDecorationLine: "underline",
        fontStyle: 'italic',
        textTransform: "capitalize",
    },
    picture: {
        borderColor: "rgba(0, 0, 0, 0.2)", //TODO to remove later
        backgroundColor: "white",
        borderWidth: 1,
        width: 200,
        height: 200,
        resizeMode: 'contain',
        overflow: "hidden"
    },
    button: {
        fontSize: 50,
        backgroundColor: "grey",
        borderRadius: 100,
        borderColor: "black",
        borderWidth: 1,
        paddingBottom: 4,
        width: 50,
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        fontWeight: "bold"
    },
    textInput: {
        textAlign: "center",
        // position: "relative",
        // left: 5,
        // borderRadius: 100,
        padding: 0,
        marginRight: 10,
        marginLeft: 10,
        // marginRight: 50,
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        color: 'white',
        width: "10%",
    },
});
