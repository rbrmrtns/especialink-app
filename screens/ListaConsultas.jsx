import { View, Text, ScrollView, StatusBar, PixelRatio, ImageBackground, Image } from 'react-native'
import React, { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
// import { useNavigation } from '@react-navigation/native'
import ConsultaCard from '../components/ConsultaCard';
// import { signOut } from 'firebase/auth'
// import { auth } from '../config/firebase'

export default function Busca() {

  // const navigation = useNavigation()

  // const user = auth.currentUser;
  // const displayName = user?.displayName || 'Guest';

  //Function to log out
  // const handleLogout = async ()=> {
  //   await signOut(auth);
  //   navigation.navigate('Welcome')
  // }
  const fontScale = PixelRatio.getFontScale();
  const getFontSize = size => size / fontScale;

  return (
    <ScrollView>
      <StatusBar/>
    <View className="flex-[1] bg-white min-h-screen">

      {/* INTRO */}
      <ImageBackground source={require('../assets/images/bg4.png')} resizeMode="cover" imageStyle= {{opacity:0.7}}>

        <View className="mt-20 mb-10">

          <View className="-mt-3 mb-0">
            <Text className="mb-1 text-center" style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 25 }}>Consultas</Text>
          </View>
   
        </View>

        <LinearGradient
          colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 1)']} 
          className="absolute bottom-0 left-0 right-0 h-24"
        />

      </ImageBackground>

      <View className="mb-28">
        <ConsultaCard />

        <ConsultaCard />
      </View>
    
    </View>

  </ScrollView>
  )
}