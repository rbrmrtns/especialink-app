import React from 'react';
import { View, Text, Image, TouchableOpacity, Linking } from 'react-native';
// Não precisamos mais do 'styled' do nativewind
import Icon from 'react-native-vector-icons/FontAwesome';

// Dados de exemplo (para facilitar)
const profileData = {
  name: 'Rosana Ferreira',
  role: 'Psicóloga',
  crp: 'CRP 06/139956',
  location: 'São Paulo',
  price: 'R$ 260',
  firstConsult: '(R$ 150 a 1ª consulta)',
  duration: '50 a 60 min',
  specialties: [
    'Ansiedade', 'Compulsões', 'Depressão',
    'Desenvolvimento de Competências Profissionais',
    'Desenvolvimento Pessoal', 'Desenvolvimento Profissional'
  ],
  bio: 'A psicóloga Rosana Tamyres Ferreira é pós-graduada pelo Instituto Israelita de Ensino e Pesquisa. Sua experiência em liderança, gestão de projetos e gestão de pessoas têm sido de grande importância em seus atendimentos na área clínica...',
  avatarUrl: require('../assets/images/area_de_atuacao/psicologo.png'),
  whatsappNumber: '5553992000670',
};

const UsuarioCard = () => {

  const handleWhatsAppPress = () => {
    // Abre o link do WhatsApp
    Linking.openURL(`whatsapp://send?phone=${profileData.whatsappNumber}&text=Olá, Rosana!`);
  };

  return (
    <View className="bg-white rounded-lg shadow-lg p-4 m-4">
      <TouchableOpacity 
        className="flex-row items-center justify-end mb-3"
        onPress={handleWhatsAppPress}
      >
        <Icon name="whatsapp" size={16} color="#25D366" />
        <Text className="text-green-600 font-semibold ml-2">
          Entre em contato
        </Text>
      </TouchableOpacity>

      {/* === SEÇÃO 2: HEADER === */}
      <View className="flex-row items-center">
        <Image
          source={ profileData.avatarUrl }
          className="w-20 h-20 rounded-full"
        />
        <View className="flex-1 ml-4">
          <Text className="text-xl font-bold text-orange-600">{profileData.name}</Text>
          <Text className="text-base text-gray-700">{profileData.role}</Text>
          <Text className="text-sm font-bold text-gray-900 mt-1">{profileData.crp}</Text>
          <Text className="text-sm text-gray-600">{profileData.location}</Text>
        </View>
      </View>

      {/* === SEÇÃO 3: CORPO (Preço e Tags) === */}
      <View className="flex-row mt-4">
        {/* Coluna da Esquerda: Preço */}
        <View className="pr-2">
          <Text className="text-2xl font-bold text-gray-800">{profileData.price}</Text>
          <Text className="text-sm text-red-600">{profileData.firstConsult}</Text>
          <Text className="text-xs text-gray-500 mt-2">Duração da sessão:</Text>
          <Text className="text-sm text-gray-700 font-medium">{profileData.duration}</Text>
        </View>
        
        {/* Coluna da Direita: Tags */}
        <View className="flex-1 ml-4">
          <View className="flex-row flex-wrap gap-2">
            {profileData.specialties.map((spec) => (
              <View key={spec} className="bg-white border border-gray-400 rounded-full px-3 py-1">
                <Text className="text-xs text-gray-700">{spec}</Text>
              </View>
            ))}
            <TouchableOpacity className="mt-2 ml-1">
              <Text className="text-sm text-blue-600">Ver mais 6 especialidade(s)</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* === SEÇÃO 4: RODAPÉ (Bio e Link) === */}
      <View className="mt-4 pt-4 border-t border-gray-200">
        <Text className="text-base font-bold text-gray-800 mb-2">
          Formação e Cursos
        </Text>
        <Text className="text-sm text-gray-600" numberOfLines={3}>
          {profileData.bio}
        </Text>
      </View>

      {/* Botão de Ver Perfil (Mantido da original) */}
      <View className="mt-4 pt-4 items-center">
        <TouchableOpacity>
          <Text className="text-base text-orange-600 font-semibold">
            Ver Perfil Completo
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default UsuarioCard;