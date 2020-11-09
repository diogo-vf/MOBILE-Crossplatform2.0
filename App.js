import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios'

import { AuthContext } from './src/components/Context';
import { Alert } from 'react-native';
import { isEmpty } from './src/components/Helpers';


import Router from './src/router';
export default function App() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [userToken, setUserToken] = React.useState(null);
  const [user, setUser] = React.useState(null)
  const [basket, setBasket] = React.useState([]);
  React.useEffect(() => {
    async function fetchData()
    {
      let basket = JSON.parse(await AsyncStorage.getItem('@basket'))
      if(basket == null){
        basket = []
      }
      setBasket(basket)     
    }
    fetchData()
  }, [])

  const authContext = React.useMemo(() => {
    return {
      isLoading,
      setIsLoading,
      userToken,
      basket,
      user,
      addToBasket: async (product) => {
        let basket = JSON.parse(await AsyncStorage.getItem('@basket'))
        if (basket === null)
        basket = []
        
        if (basket.length != 0 && basket.find(({ id }) => id == product.id)){
          Alert.alert("Market 😶", `le produit '${product.name}' est déjà présent dans votre panier`);
          return;
        }
        product.quantity = "1"
        basket.push(product)
        await AsyncStorage.setItem('@basket', JSON.stringify(basket))   
        setBasket(basket)     
      },
      updateBasketProduct: async (product) => {
        let basket = JSON.parse(await AsyncStorage.getItem('@basket'))
        basket.find(({ id }) => id == product.id).quantity = product.quantity
        console.log(basket.find(({ id }) => id == product.id))
        await AsyncStorage.setItem('@basket', JSON.stringify(basket))  
        setBasket(basket)
      },
      removeOnBasket: async (product) => {
        let basket = JSON.parse(await AsyncStorage.getItem('@basket'))
        
        basket = basket.filter(({id}) => id != product.id)
        
        await AsyncStorage.setItem('@basket', JSON.stringify(basket))   
        setBasket(basket)     
        Alert.alert("Market 😲", `Le produit ${product.name} a été retiré`);
      },
      removeBasket: async () => {
        
        await AsyncStorage.setItem('@basket', JSON.stringify([]))   
        setBasket([])     
      },
      signIn: async (token) => {
        try {
          setIsLoading(true)
          var res = await axios.get(`/me`, { headers: { Authorization: `Bearer ${token}` } })
          setUserToken(token)
          setUser(res.data.data) //pq y a data dans le retour, inutile...
          AsyncStorage.setItem('user_token', token)
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        }
        catch (e) {
          AsyncStorage.removeItem('user_token')
          Alert.alert("😵 Erreur de connexion", "Une erreur est survenue lors de la connexion!\nMerci de vérifier votre token ou que vous ayez bien une connexion internet...")
        }
        finally {
          setIsLoading(false)
        }
      },
      signOut: () => {
        setUserToken(null),
          AsyncStorage.removeItem('user_token')
      },
      signUp: async (user) => {
        try {
          setIsLoading(true)
          var res = await axios.post(`/user/apply`, { firstname: user.firstname, lastname: user.lastname, phonenumber: user.phonenumber })
          setUserToken(null)
          Alert.alert("👍 Inscription complétée", "Vous recevrez votre token par message,\ncela peut prendre plusieurs jours, merci de bien vouloir patienter...")
        }
        catch (e) {
          console.log(e.message)
          Alert.alert("😓 Erreur d'inscription", "Une erreur est survenue lors de l'inscription\nVeuillez reéssayer plus tard s'il vous plaît...")
        }
        finally {
          setIsLoading(false)
        }
      },
    }
  });

  return (
    <AuthContext.Provider value={authContext}>
      <Router />
    </AuthContext.Provider>
  );
}

