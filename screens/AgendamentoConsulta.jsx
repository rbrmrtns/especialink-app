import React, { useState, useContext } from 'react';
import { ActivityIndicator, ImageBackground, PixelRatio, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ArrowLeftIcon } from 'react-native-heroicons/outline';
import { DateTimePicker } from '../components/DateTimePicker';
import { GeradorImagemPerfil } from '../components/GeradorImagemPerfil';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { db } from './../config/firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function AgendamentoConsulta({ route }) {
  const navigation = useNavigation();

  const { loading, userProfile } = useContext(AuthContext);
  
  if (loading || !userProfile) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color="#ffbf00" />
      </View>
    );
  };

  const { dadosPaciente } = route.params || {};

  const fontScale = PixelRatio.getFontScale();
  const getFontSize = size => size / fontScale;

  const [dataHora, setDataHora] = useState(new Date());
  const [anotacoes, setAnotacoes] = useState('');

  const handleSave = async () => {

    try {
      const docRef = await addDoc(collection(db, "consultas"), {
        paciente_id: dadosPaciente.id,
        paciente_nome: dadosPaciente.nome,
        paciente_cor_img_perfil: dadosPaciente.cor_img_perfil,
        especialista_id: userProfile.id,
        anotacoes: anotacoes,
        data_hora: dataHora,
        created_at: serverTimestamp()
      });

      console.log('Consulta registrada com sucesso!');

      navigation.navigate('Tabs', { screen: 'ListaConsultas' });

    } catch (error) {
      console.error('Erro ao registrar consulta.', error);
    }
  }
              

  return (
    <ScrollView className="flex-1 bg-white">
    <View>

      <ImageBackground source={require('./../assets/images/bg3.png')} resizeMode="cover" imageStyle= {{opacity:0.3}}>

        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          className="absolute top-16 left-5 z-10 p-2 bg-white/40 rounded-full"
        >
          <ArrowLeftIcon size={24} color="black" />
        </TouchableOpacity>

        <View className="pt-28 pb-24">
          <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(24) }} className="text-center mt-8 shadow-md">
            Agende a consulta
          </Text>
        </View>

      </ImageBackground>

      <View className="p-8 bg-white rounded-t-3xl shadow-xl -mt-6 pb-24">

        <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(14) }} className="mb-3 text-center">
          Você está agendando uma consulta com o(a) paciente:
        </Text>

        <View className="mb-10 flex-row items-center justify-center">
          <GeradorImagemPerfil
            nomeUsuario={dadosPaciente.nome}
            corFundo={dadosPaciente.cor_img_perfil}
          />
          <Text className="text-xl font-montExtrabold color-dark-orange ml-4">{dadosPaciente.nome}</Text>
        </View>

        <View className="mb-10">
          <DateTimePicker
            label="Data e Hora da Consulta"
            value={dataHora}
            onChange={setDataHora}
          />
        </View>

        <View>
          <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(16)}}
          className="mb-3">Anotações</Text>
          <TextInput
            className="border border-gray-200 rounded-xl shadow-sm py-3 px-6 h-48 bg-white"
            placeholder="Anote qualquer coisa que deseja lembrar para a consulta"
            multiline
            value={anotacoes}
            onChangeText={setAnotacoes}
            style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(14)}}
          />
        </View>

        <View className="mt-10 flex items-center">
          <TouchableOpacity 
            onPress={handleSave} 
            className="py-4 bg-orange rounded-full w-40">
            <Text 
              style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(24) }} 
              className="font-bold text-center text-white">
              Agendar
            </Text>
          </TouchableOpacity>
        </View>

      </View>

  </View>
  </ScrollView>
  )
}