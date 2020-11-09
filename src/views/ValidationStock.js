import React from 'react';
import { View, Dimensions, ImageBackground, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function ValidationStock(props) {
    const { navigation } = props;
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
                <TouchableOpacity onPress={() => navigation.navigate("summary")}>
                    <Text>validation du stock WIP</Text>
                </TouchableOpacity>
            </View>

        </ImageBackground>
    )
}
