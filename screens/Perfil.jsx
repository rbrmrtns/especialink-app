import { View, Text, Pressable, ScrollView, StatusBar, ImageBackground, Image } from 'react-native'
import React from 'react'
import Animated, { FlipInEasyX } from 'react-native-reanimated';
// import { useNavigation } from '@react-navigation/native'
import UsuarioCard from '../components/UsuarioCard'
// import { signOut } from 'firebase/auth'
// import { auth } from '../config/firebase'

export default function Perfil() {

  // const navigation = useNavigation()

  // const user = auth.currentUser;
  // const displayName = user?.displayName || 'Guest';

  //Function to log out
  // const handleLogout = async ()=> {
  //   await signOut(auth);
  //   navigation.navigate('Welcome')
  // }

  return (
    <ScrollView>
      <StatusBar/>
    <View className="flex-[1] white">

      {/* INTRO */}
      <ImageBackground source={require('./../assets/images/bg7.png')} resizeMode="cover" imageStyle= {{opacity:0.3}}>

        <View className="mt-20 mb-24">

          <View className="-mt-3 mb-0 px-10 flex-row justify-between">
            <Text className="mb-1" style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 25 }}>Perfil</Text>
            
            <Pressable 
            // onPress={handleLogout}
            >
            <View className="flex-row mt-1.5">
              <Image className="w-4 h-4 mr-1"  style={{ tintColor: '#63254E' }}
                                  source={require('../assets/icons/exit.png')} />
              <Text style={{ fontFamily: 'Montserrat_600SemiBold' }}
              className="text-dark-pink">Sair</Text>
            </View>
            </Pressable>
          </View>

          <View>
            <Text></Text>
          </View>
   
        </View>

      </ImageBackground>

      <View className="bg-white outline outline-offset-6 h-full py-5 -mt-5 rounded-t-[35px] h-screen">

        <View className="-mt-28">  
          <Animated.View entering={FlipInEasyX.delay(0).duration(500).springify()}>
            <View className="m-8 bg-white rounded-xl shadow-xl mx-auto border border-gray-200">
                {/* Card top */}

                <ImageBackground
                    source={require('../assets/images/home-bg2.png')}
                    resizeMode="cover" imageStyle= {{opacity:0.2, borderTopLeftRadius: 12, borderTopRightRadius: 12}} 
                  >

                  <View className="flex-row rounded-t-xl px-5 justify-between">

                        {/* Account info */}
                        <View className="flex-row pt-8 pb-12">

                            {/* Account name + title */}
                            <View className="">
                                <Text style={{ fontFamily: 'Montserrat_600SemiBold'}}
                                className="text-base">Ficha de</Text>
                                <Text style={{ fontFamily: 'Montserrat_500Medium_Italic'}}
                                className="text-base -mt-1">Rosana</Text>
                            </View>
                        </View>

                        {/* Logo */}
                        <View className="pt-5">
                            <Image className="w-16 h-6 ml-2" 
                              source={require('../assets/logo.png')} />
                        </View>

                  
                  </View>

                </ImageBackground>

                {/* Card Bottom */}
                <UsuarioCard isEmbedded={true} />

            </View>
          </Animated.View>
        </View>

        <View>
          {/* Button */}
          <Pressable className="bg-white border border-gray-100 mx-8 py-4 px-5 shadow-sm rounded-xl flex-row items-center justify-between mt-5">
            
            <View className="flex-row">
              <Image className="w-8 h-8 mr-4" 
                                  source={require('../assets/icons/edit-personal-info.png')} />

              <Text style={{ fontFamily: 'Montserrat_500Medium' }}
              className="mt-1">
                Alterar Dados Pessoais
              </Text>
            </View>

            <Image className="w-8 h-8" 
                                  source={require('../assets/icons/next.png')} />

          </Pressable>

          {/* Button */}
          <Pressable className="bg-white border border-gray-100 mx-8 py-4 px-5 shadow-sm rounded-xl flex-row  justify-between mt-5"
          // onPress={()=> navigation.navigate('UserSkinType')}
          >

            <View className="flex-row">
              <Image className="w-8 h-8 mr-4" 
                                  source={require('../assets/icons/edit-professional-info.png')} />

              <Text style={{ fontFamily: 'Montserrat_500Medium' }}
              className="mt-1">
                Alterar Dados Profissionais
              </Text>
            </View>

            <Image className="w-8 h-8" 
                                  source={require('../assets/icons/next.png')} />

          </Pressable>

          {/* Button */}
          <Pressable className="bg-white border border-gray-100 mx-8 py-4 px-5 shadow-sm rounded-xl flex-row justify-between mt-5"
          // onPress={()=> navigation.navigate('CGLong')}
          >
            
            <View className="flex-row">
              <Image className="w-8 h-8 mr-4" 
                                  source={require('../assets/icons/retake-test.png')} />

              <Text style={{ fontFamily: 'Montserrat_500Medium' }}
              className="mt-1">
                Refazer Teste de Compatibilidade
              </Text>
            </View>

            <Image className="w-8 h-8" 
                                  source={require('../assets/icons/next.png')} />

          </Pressable>

          
        </View>

        <View className="flex justify-center items-center mt-10">
          <Image className="w-24 h-10 mb-1" 
                                source={require('../assets/logo.png')} />
  
        </View>
      
      </View>

    </View>
  </ScrollView>
  )
}