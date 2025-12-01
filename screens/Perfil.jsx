import { ActivityIndicator, Alert, View, Text, Pressable, ScrollView, StatusBar, ImageBackground, Image } from 'react-native'
import React, { useContext } from 'react'
import Animated, { FlipInEasyX } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native'
import { UsuarioCardCompleto } from '../components/UsuarioCardCompleto'
import { signOut } from 'firebase/auth'
import { AuthContext } from '../context/AuthContext';
import { auth } from '../config/firebaseConfig';

export default function Perfil() {
  const navigation = useNavigation()

  const { loading, userProfile } = useContext(AuthContext);

  if (loading || !userProfile) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color="#ffbf00" />
      </View>
    );
  }

  const realizarLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Erro ao sair:", error);
      Alert.alert("Erro", "Não foi possível sair da conta.");
    }
  };

  const confirmarSaida = () => {
    Alert.alert(
      "Atenção",
      "Deseja mesmo sair da sua conta?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Sair", onPress: realizarLogout, style: "destructive" }
      ],
      { cancelable: true }
    );
  };

  return (
    <ScrollView>
      <StatusBar/>
    <View className="flex-[1] bg-white min-h-screen">

      {/* INTRO */}
      <ImageBackground source={require('../assets/images/bg7.png')} resizeMode="cover" imageStyle= {{opacity:0.3}}>

        <View className="mt-20 mb-24">

          <View className="-mt-3 mb-0 px-10 flex-row justify-between">
            <Text className="mb-1" style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 25 }}>Perfil</Text>
            
            <Pressable 
            onPress={confirmarSaida}
            >
            <View className="flex-row mt-1.5">
              <Image className="w-4 h-4 mr-1"  style={{ tintColor: '#63254E' }}
                                  source={require('../assets/icons/exit.png')} />
              <Text style={{ fontFamily: 'Montserrat_600SemiBold' }}
              className="text-dark-orange">Sair</Text>
            </View>
            </Pressable>
          </View>
   
        </View>

        <LinearGradient
          colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 1)']} 
          className="absolute bottom-0 left-0 right-0 h-24"
        />

      </ImageBackground>

      <View className="-mt-20 z-10 mx-6">
        <Animated.View entering={FlipInEasyX.delay(0).duration(500).springify()}>
          <View className="bg-white rounded-xl shadow-xl border border-gray-200">
              {/* Card top */}

              <ImageBackground
                  source={require('../assets/images/home-bg2.png')}
                  resizeMode="cover" imageStyle= {{opacity:0.2, borderTopLeftRadius: 12, borderTopRightRadius: 12}} 
                >

                <View className="rounded-t-xl px-5">

                      <View className="pt-4 items-end">
                        <Image className="w-16 h-6 ml-2" 
                          source={require('../assets/logo.png')} />
                      </View>

                      {/* Account info */}
                      <View className="flex-row pt-2 pb-4">

                          {/* Account name + title */}
                          <View className="">
                              <Text style={{ fontFamily: 'Montserrat_600SemiBold'}}
                              className="text-lg">Ficha de</Text>
                              <Text style={{ fontFamily: 'Montserrat_500Medium_Italic'}}
                              className="text-lg -mt-1">{userProfile.nome}</Text>
                          </View>
                      </View>

                
                </View>

              </ImageBackground>

              {/* Card Bottom */}
              <UsuarioCardCompleto dadosPerfil={userProfile} variant="embedded" />

          </View>
        </Animated.View>
      </View>


      <View>
        {/* Button */}
        <Pressable className="bg-white border border-gray-100 mx-8 py-4 px-5 shadow-sm rounded-xl flex-row justify-between mt-5"
          onPress={()=> navigation.navigate('Edicao', { tipoEdicao: 'dados_pessoais'})}
        >
          
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

        {(() => {
          if (userProfile.tipo_usuario === 'especialista') {
            return <Pressable className="bg-white border border-gray-100 mx-8 py-4 px-5 shadow-sm rounded-xl flex-row justify-between mt-5"
                      onPress={()=> navigation.navigate('Edicao', { tipoEdicao: 'dados_profissionais'})}
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
                    </Pressable>;
          } else if (userProfile.tipo_usuario === 'paciente') {
            return <Pressable className="bg-white border border-gray-100 mx-8 py-4 px-5 shadow-sm rounded-xl flex-row justify-between mt-5"
                      onPress={()=> navigation.navigate('Edicao', { tipoEdicao: 'condicoes'})}
                    >
                      <View className="flex-row">
                        <Image className="w-8 h-8 mr-4" 
                                source={require('../assets/icons/brain.png')} />
                        <Text style={{ fontFamily: 'Montserrat_500Medium' }}
                        className="mt-1">
                          Alterar Condições Mentais
                        </Text>
                      </View>
                      <Image className="w-8 h-8" 
                                            source={require('../assets/icons/next.png')} />
                    </Pressable>;
          }
        })()}

        {/* Button */}
        <Pressable className="bg-white border border-gray-100 mx-8 py-4 px-5 shadow-sm rounded-xl flex-row justify-between mt-5"
          onPress={()=> navigation.navigate('Edicao', { tipoEdicao: 'refazer_teste'})}
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

      <View className="h-12" />

      <View className="flex justify-center items-center mt-10 mb-24">
        <Image className="w-24 h-10 mb-5" 
                              source={require('../assets/logo.png')} />

      </View>
    
    </View>

  </ScrollView>
  )
}