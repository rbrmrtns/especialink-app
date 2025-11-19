import React from 'react';
import { View, Text, Image, TouchableOpacity, Linking } from 'react-native';
import { GeradorImagemPerfil } from './GeradorImagemPerfil';

const ConsultaCard = ({ dadosConsulta, onDelete }) => {

  return (
    <View className="bg-white rounded-lg shadow-lg p-4 my-4 mx-2">
      
      <View className="flex-row justify-between items-start mb-4">
        
        <View className="flex-row items-center">
          <GeradorImagemPerfil
            nomeUsuario={dadosConsulta.nomePaciente}
            corFundo={dadosConsulta.corImgPerfilPaciente}
            tamanho={50}
            borderRadius={25} 
          />
          <View className="ml-4">
            <Text className="text-lg font-montExtrabold color-dark-orange">{dadosConsulta.nomePaciente}</Text>
          </View>
        </View>

        <View className="items-center">
          {/* 3. Textos maiores (text-base -> text-lg) */}
          <Text className="text-base font-montRegular color-dark-orange uppercase">Horário</Text>
          <Text className="text-xl font-montMedium text-gray-800">{dadosConsulta.diaConsulta}</Text>
          <Text className="text-lg font-montMedium text-gray-800">{dadosConsulta.horarioConsulta}</Text>
        </View>

      </View>

      <View className="flex-row justify-between items-end">
        
        <View className="flex-1 mr-4">
          <Text className="text-lg font-montExtrabold color-dark-orange mb-2">
            Anotações
          </Text>
          <Text className="text-sm font-montRegular text-gray-600">
            {dadosConsulta.anotacoes}
          </Text>
        </View>

        <View>
          <TouchableOpacity 
            onPress={onDelete} 
            className="py-2 px-5 bg-orange rounded-full">
            <Text 
              style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 14 }} 
              className="font-bold text-center text-white">
              Limpar
            </Text>
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
};

export default ConsultaCard;