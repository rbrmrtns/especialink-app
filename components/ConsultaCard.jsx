import React from 'react';
import { View, Text, Image, TouchableOpacity, Linking } from 'react-native';
import { GeradorImagemPerfil } from './GeradorImagemPerfil';

const consultationData = {
  name: 'Rosana Ferreira',
  consultationDay: '11/11',
  consultationTime: '11h às 11h50',
  duration: '50 min',
  notes: `Como foi a reunião de equipe? Conseguimos aplicar o RPD?\nTrazer o RPD para análise conjunta.\nComo está o sono?`,
  corUsuario: '#7affd5'
};

const ConsultaCard = () => {

  return (
    <View className="bg-white rounded-lg shadow-lg p-4 my-4 mx-2">
      
      <View className="flex-row justify-between items-start mb-4">
        
        <View className="flex-row items-center">
          <GeradorImagemPerfil
            nomeUsuario={consultationData.name}
            corFundo={consultationData.corUsuario}
            tamanho={50}
            borderRadius={25} 
          />
          <View className="ml-4">
            <Text className="text-lg font-montExtrabold color-dark-orange">{consultationData.name}</Text>
          </View>
        </View>

        {/* Top-Right: Horário */}
        {/* 3. Alinhamento centralizado (items-end -> items-center) */}
        <View className="items-center">
          {/* 3. Textos maiores (text-base -> text-lg) */}
          <Text className="text-base font-montRegular color-dark-orange uppercase">Horário</Text>
          <Text className="text-xl font-montMedium text-gray-800">{consultationData.consultationDay}</Text>
          <Text className="text-lg font-montMedium text-gray-800">{consultationData.consultationTime}</Text>
        </View>

      </View>

      {/* === LINHA INFERIOR (BL e BR) === */}
      <View className="flex-row justify-between items-end">
        
        {/* Bottom-Left: Anotações */}
        <View className="flex-1 mr-4">
          <Text className="text-lg font-montExtrabold color-dark-orange mb-2">
            Anotações
          </Text>
          <Text className="text-sm font-montRegular text-gray-600">
            {consultationData.notes}
          </Text>
        </View>

        {/* Bottom-Right: Botão Limpar */}
        <View>
          <TouchableOpacity 
            // onPress={handleSave} 
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