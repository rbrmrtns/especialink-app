import { View, Text, SafeAreaView, TouchableOpacity, TextInput, Image, ImageBackground } from 'react-native'
import Animated, { FadeIn, FadeInDown, FadeInUp, FadeOut } from 'react-native-reanimated';
import React, { useState } from 'react'
import { ArrowUpIcon, EnvelopeIcon, KeyIcon } from 'react-native-heroicons/outline'
import { LinearGradient } from 'expo-linear-gradient';
// import { useNavigation } from '@react-navigation/native'

const coresButton = ['#ffbf00', '#ff7900'];

export default function Login() {
  // const navigation = useNavigation();
  const [email, setEmail] = useState();
  const [senha, setSenha] = useState();
  const [error, setError] = useState('');

  // Function to save an user
  // const handleSubmit = async () => {
  //   if(email && password) { 
  //     try {
  //       await signInWithEmailAndPassword(auth, email, password);

  //       navigation.navigate('Home');
  //     } catch(err) {
  //       setError('Ongeldige gebruikersnaam of wachtwoord.');
  //     }

  //   }
  // }

  return (
    <View className="flex-1">
    {/* INTRO */}
    <ImageBackground source={require('../assets/images/welcome-bg-up.png')} resizeMode="cover" className="w-full h-full">

   {/* <SafeAreaView className="flex"> */}

     {/* Backbutton */}
     {/* <View className="flex-row justify-start">
         <TouchableOpacity 
            //  onPress={() => navigation.goBack()}
             className="bg-primary-dark p-2 rounded-tr-2xl rounded-bl-2xl ml-4">
             <ArrowUpIcon size="20" color="black"></ArrowUpIcon>
         </TouchableOpacity>
     </View> */}

   {/* </SafeAreaView> */}

   <View className="flex-1 bg-primary px-8 pt-4"> 
     {/* Logo */}
     <View className="flex items-center mb-10 pt-16">
       <Image className="w-48 h-20 ml-2" 
                       source={require('../assets/logo.png')} />
     </View>

     <View className="form space-y-2 px-5">
        
         {/* Email input */}
         <Animated.View entering={FadeInDown.delay(300).duration(3000).springify()}>
           {/* Text */}
           <Text style={{ fontFamily: 'Montserrat_600SemiBold'}}
              className="text-black font-semibold text-xl pb-2 text-sm">E-mail</Text>

           {/* Input */}
           <View className="flex-row items-center px-4 py-3 bg-white text-gray-700 rounded-md border border-gray-200 text-l font-medium mb-4">
             <EnvelopeIcon size={20} color="black" style={{ marginRight: 12 }} />
             <TextInput 
                 className="flex-1 text-sm"
                 placeholder='E-mail'
                 value={email}
                 onChangeText={value => setEmail(value)}
             >
             </TextInput>
           </View>

         </Animated.View>

         {/* Password input */}
         <Animated.View entering={FadeInDown.delay(400).duration(3000).springify()}>
           {/* Text */}
           <Text style={{ fontFamily: 'Montserrat_600SemiBold' }}
              className="text-black font-semibold text-xl text-sm pb-2">Senha</Text>


           {/* Input */}
           <View className="flex-row items-center px-4 py-2.5 bg-white text-gray-700 rounded-md border border-gray-200 text-l font-medium mb-10">
             <KeyIcon size={20} color="black" style={{ marginRight: 12 }} />
             <TextInput 
                 className="flex-1 text-sm"
                 secureTextEntry
                 placeholder='Senha'
                 value={senha}
                 onChangeText={value => setSenha(value)}
             >
             </TextInput>
           </View>

         </Animated.View>


         {error ? <Text className="text-center text-black-500 mb-6 -mt-6">{error}</Text> : null}

         <Animated.View entering={FadeInDown.delay(500).duration(3000).springify()}>
             <TouchableOpacity 
                onPress={() => console.log("Clicou!")} // Substitua pelo seu handleSubmit
                className="rounded-full mb-5 w-60 mx-auto overflow-hidden" // Adiciona overflow-hidden
              >
                <LinearGradient
                  colors={coresButton}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  className="py-3 items-center justify-center" 
                >
                  <Text style={{ fontFamily: 'Montserrat_600SemiBold' }}
                  className="text-white text-lg text-center"
                    >Entrar</Text>
              </LinearGradient>
             </TouchableOpacity>
         </Animated.View>

         {/* <Animated.View entering={FadeInDown.delay(600).duration(3000).springify()}>
           <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 20 }}
           className="text-center mb-5">Or</Text>
           <View className="flex-row justify-center space-x-8 mb-5"> */}

            {/* Google */}
            {/* <TouchableOpacity className="p-3 bg-gray-100 rounded-2xl">
                  <Image source={require('./../assets/icons/google.png')}
                    className="w-8 h-8" />
                </TouchableOpacity> */}

                {/* Facebook */}
                {/* <TouchableOpacity className="p-3 bg-gray-100 rounded-2xl">
                  <Image source={require('./../assets/icons/facebook.png')}
                    className="w-8 h-8" />
                </TouchableOpacity> */}

                {/* Apple */}
                {/* <TouchableOpacity className="p-3 bg-gray-100 rounded-2xl">
                  <Image source={require('./../assets/icons/apple.png')}
                    className="w-8 h-8" />
                </TouchableOpacity> */}
             
           {/* </View>
         </Animated.View> */}

         <Animated.View entering={FadeInDown.delay(700).duration(3000).springify()}>
            {/* Nog geen account */}
            <View className="flex-row justify-center">
             <TouchableOpacity className="mt-3 flex-wrap text-center"
            //  onPress={() => navigation.navigate('Register')}
              >
               <Text style={{ fontFamily: 'Montserrat_500Medium'}} 
               className="text-center text-sm">Não está cadastrado(a) no sistema?</Text>

               <Text style={{ fontFamily: 'Montserrat_600SemiBold' }} 
               className="text-center text-orange underline pt-1 text-sm">Cadastre-se aqui</Text>
             </TouchableOpacity>
             </View>
         </Animated.View>
     </View>

   </View>

   </ImageBackground>
 </View>
  )
}