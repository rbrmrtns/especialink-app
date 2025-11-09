import React from 'react';
import { View, Text, Image, TouchableOpacity, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

// Dados de exemplo (para facilitar)
const profileData = {
  tipoUsuario: 'especialista',
  name: 'Rosana Ferreira',
  role: 'Psicóloga',
  crp: 'CRP 06/139956',
  location: 'São Paulo',
  price: 'R$ 260',
  duration: '50 a 60 min',
  daysOfWork: 'Seg, Qua, Sex',
  workHours: '08h à 17h',
  specialties: [
    'Ansiedade', 'Compulsões', 'Depressão',
    'Desenvolvimento de Competências Profissionais',
    'Desenvolvimento Pessoal', 'Desenvolvimento Profissional'
  ],
  bio: 'A psicóloga Rosana Tamyres Ferreira é pós-graduada pelo Instituto Israelita de Ensino e Pesquisa. Sua experiência em liderança, gestão de projetos e gestão de pessoas têm sido de grande importância em seus atendimentos na área clínica...',
  avatarUrl: require('../assets/images/area_de_atuacao/psicologia.png'),
  whatsappNumber: '5553992000670',
};

const UsuarioCard = () => {

  const handleWhatsAppPress = () => {
    Linking.openURL(`whatsapp://send?phone=${profileData.whatsappNumber}&text=Olá, Rosana!`); // text dinamico
  };

  return (
    <View className="bg-white rounded-lg shadow-lg p-4 m-4">
      <View className="flex-row justify-between items-start">
        
        <View className="flex-row items-center">
          <Image
            source={ profileData.avatarUrl }
            className="w-20 h-20 rounded-full"
          />
          <View className="ml-4"> 
            <Text className="text-xl font-montExtrabold color-dark-pink">{profileData.name}</Text>
            {profileData.tipoUsuario == 'especialista' && (
            <>
            <Text className="text-base font-montMedium text-gray-700">{profileData.role}</Text>
            <Text className="text-base font-montExtrabold color-dark-pink">{profileData.crp}</Text>
            </>
            )}
            <Text className="text-sm font-montRegular text-gray-700">{profileData.location}</Text>
          </View>
        </View>

        <TouchableOpacity 
          className="flex-row items-center"
          onPress={handleWhatsAppPress}
        >
          <Icon name="whatsapp" size={16} color="#25D366" />
          <Text className="text-lg text-green-600 font-montRegular ml-2 uppercase">
            Contato
          </Text>
        </TouchableOpacity>
      </View>

      <View className="mt-4">
        
        {profileData.tipoUsuario == 'especialista' && (
          <>
        <Text className="text-lg font-montExtrabold color-dark-pink mb-2">
            Consulta
          </Text>
        <View className="flex-row justify-between items-start pb-4 mb-4 border-b border-gray-200">
          
          <View>
            <Text className="text-sm font-montRegular color-pink uppercase">Duração</Text>
            <Text className="text-sm font-montMedium text-gray-800">{profileData.duration}</Text>
          </View>
          
          <View className="items-center">
            <Text className="text-sm font-montRegular color-pink uppercase">Preço</Text>
            <Text className="text-2xl font-montExtrabold font-bold text-gray-800">{profileData.price}</Text>
          </View>

          <View className="items-end">
            <Text className="text-sm font-montRegular color-pink uppercase">Atendimento</Text>
            <Text className="text-sm font-montMedium text-gray-800">{profileData.daysOfWork}</Text>
            <Text className="text-sm font-montMedium text-gray-800">{profileData.workHours}</Text>
          </View>
        </View>
        </>
        )}
        
        <View>
          <Text className="text-lg font-montExtrabold color-dark-pink mb-2">
            {profileData.tipoUsuario == 'especialista' ? 'Especialidades' : 'Condições de Saúde Mental'}
          </Text>
          <View className="flex-row flex-wrap gap-2 justify-center">
            {profileData.specialties.slice(0, 3).map((spec) => (
              <View key={spec} className="bg-white border border-gray-400 rounded-full px-3 py-1">
                <Text className="text-xs font-montLight text-gray-700">{spec}</Text>
              </View>
            ))}
            {profileData.tipoUsuario == 'especialista' && (
            <>
            <TouchableOpacity className="mt-2 ml-1">
              <Text className="text-base font-montRegular color-pink">{profileData.tipoUsuario == 'especialista' ? 'Ver todas as especialidades' : 'Ver todas as condições de saúde mental'}</Text>
            </TouchableOpacity>
            </>
            )}
          </View>
        </View>
      </View>

      {profileData.tipoUsuario == 'especialista' && (
        <>
      <View className="mt-4 pt-4 border-t border-gray-200">
        <Text className="text-lg font-montExtrabold color-dark-pink mb-2">
          Vida Profissional
        </Text>
        <Text className="text-sm font-montRegular text-gray-600" numberOfLines={2}>
          {profileData.bio}
        </Text>
      </View>
        </>
        )}

      <View className="mt-4 pt-4 items-center">
        <TouchableOpacity>
          <Text className="text-base color-pink font-montSemibold">
            Ver perfil completo
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default UsuarioCard;