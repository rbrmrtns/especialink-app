import { View, Text, TextInput, TouchableOpacity, ScrollView, StatusBar, PixelRatio, ImageBackground, Image } from 'react-native'
import React, { useEffect, useState } from 'react';
import Animated, { FlipInEasyX } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { MagnifyingGlassIcon } from 'react-native-heroicons/outline'
import { Dropdown } from '../components/Dropdown';
// import { useNavigation } from '@react-navigation/native'
import { AreaDeAtuacaoCard } from '../components/AreaDeAtuacaoCard';
import UsuarioCard from '../components/UsuarioCard'
import {UsuarioCardCompleto} from '../components/UsuarioCardCompleto'
// import { signOut } from 'firebase/auth'
// import { auth } from '../config/firebaseConfig'

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

  const [modalVisivel, setModalVisivel] = useState(false);
  
  const abrirModal = () => setModalVisivel(true);
  const fecharModal = () => setModalVisivel(false);

  const [areaDeAtuacao, setAreaDeAtuacao] = useState('psicologa');
  const [nome, setNome] = useState('');
  const [cidade, setCidade] = useState('');
  const [preco, setPreco] = useState('');
  const [condicao, setCondicao] = useState('');
  const [convenio, setConvenio] = useState('');

  const listaCidades = [
  { "label": "São José do Norte", "value": "São José do Norte" },
  { "label": "Porto Alegre", "value": "Porto Alegre" },
  { "label": "Caxias do Sul", "value": "Caxias do Sul" },
  { "label": "Pelotas", "value": "Pelotas" },
  { "label": "Santa Maria", "value": "Santa Maria" },
  { "label": "Canoas", "value": "Canoas" },
  { "label": "Novo Hamburgo", "value": "Novo Hamburgo" },
  { "label": "São Leopoldo", "value": "São Leopoldo" },
  { "label": "Rio Grande", "value": "Rio Grande" },
  { "label": "Passo Fundo", "value": "Passo Fundo" },
  { "label": "Gramado", "value": "Gramado" },
  { "label": "Canela", "value": "Canela" },
  { "label": "Uruguaiana", "value": "Uruguaiana" },
  { "label": "Bagé", "value": "Bagé" },
  { "label": "Santa Cruz do Sul", "value": "Santa Cruz do Sul" },
  { "label": "Bento Gonçalves", "value": "Bento Gonçalves" },
  { "label": "Lajeado", "value": "Lajeado" },
  { "label": "Erechim", "value": "Erechim" },
  { "label": "Guaíba", "value": "Guaíba" },
  { "label": "Viamão", "value": "Viamão" },
  { "label": "Gravataí", "value": "Gravataí" },
  { "label": "Cachoeirinha", "value": "Cachoeirinha" },
  { "label": "Sapucaia do Sul", "value": "Sapucaia do Sul" },
  { "label": "Santo Ângelo", "value": "Santo Ângelo" },
  { "label": "Ijuí", "value": "Ijuí" },
  { "label": "Torres", "value": "Torres" },
  { "label": "Alegrete", "value": "Alegrete" }
];

  const placeholderCidade = {
    label: 'Selecione uma cidade',
    value: null,
  };

  const listaFaixasDePreco = [
    { label: 'Até R$100', value: '-100' },
    { label: 'Entre R$100 e R$250', value: '100+,250-' },
    { label: 'Entre R$250 e R$400', value: '250+,400-' },
    { label: 'Entre R$400 e R$600', value: '400+,600-' },
    { label: 'Mais de R$600', value: '600+' }
  ];

  const placeholderFaixaDePreco = {
    label: 'Selecione um valor de consulta',
    value: null,
  };

  const listaCondicoes = [
    { label: 'TEA', value: 1 },
    { label: 'TDAH', value: 2 },
    { label: 'Depressão', value: 3 },
    { label: 'Ansiedade', value: 4 },
    { label: 'Deficiência Intelectual', value: 5 },
    { label: 'Distúrbios do Sono', value: 6 }
  ];

  const placeholderCondicao = {
    label: 'Selecione uma condição mental',
    value: null,
  };

  const listaDeConvenios = [
    { label: 'Amil', value: 1 },
    { label: 'Bradesco Saúde', value: 2 },
    { label: 'Unimed', value: 3 }
  ];

  const placeholderConvenio = {
    label: 'Selecione um convênio',
    value: null,
  };

  const handleDropdownChange = (selectedValue) => {
    if (selectedValue !== null && selectedValue !== undefined) {
      onValueChange(selectedValue);
    }
  };

  return (
    <ScrollView>
      <StatusBar/>
    <View className="flex-[1] bg-white min-h-screen">

      {/* INTRO */}
      <ImageBackground source={require('../assets/images/bg4.png')} resizeMode="cover" imageStyle= {{opacity:0.7}}>

        <View className="mt-20 mb-10">

          <View className="-mt-3 mb-0">
            <Text className="mb-1 text-center" style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 25 }}>Busca de Profissionais</Text>
          </View>
   
        </View>

        <LinearGradient
          colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 1)']} 
          className="absolute bottom-0 left-0 right-0 h-24"
        />

      </ImageBackground>

      <View className="mt-3 mb-3 px-7">
        
        <View className="flex-row justify-center">
          
          <TouchableOpacity className={`border ${areaDeAtuacao === 'psicologa' ? 'border-dark-orange bg-dark-orange' : 'border-gray-200 bg-white'} rounded-full px-3 py-1 ml-1`} onPress={() => setAreaDeAtuacao('psicologa')}>
            <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 14 }} className={`text-${areaDeAtuacao === 'psicologa' ? 'white' : 'gray-400'} text-center`}>Psicologia</Text>
          </TouchableOpacity>

          <TouchableOpacity className={`border ${areaDeAtuacao === 'psiquiatra' ? 'border-dark-orange bg-dark-orange' : 'border-gray-200 bg-white'} rounded-full px-3 py-1 ml-2`} onPress={() => setAreaDeAtuacao('psiquiatra')}>
            <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 14 }} className={`text-${areaDeAtuacao === 'psiquiatra' ? 'white' : 'gray-400'} text-center`}>Psiquiatria</Text>
          </TouchableOpacity>

          <TouchableOpacity className={`border ${areaDeAtuacao === 'psicopedagoga' ? 'border-dark-orange bg-dark-orange' : 'border-gray-200 bg-white'} rounded-full px-3 py-1 ml-2`} onPress={() => setAreaDeAtuacao('psicopedagoga')}>
            <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 14 }} className={`text-${areaDeAtuacao === 'psicopedagoga' ? 'white' : 'gray-400'} text-center`}>Psicopedagogia</Text>
          </TouchableOpacity>
        </View>
        
        <View className="flex-row justify-center mt-2">
          <TouchableOpacity className={`border ${areaDeAtuacao === 'fonoaudiologa' ? 'border-dark-orange bg-dark-orange' : 'border-gray-200 bg-white'} rounded-full px-3 py-1 ml-2`} onPress={() => setAreaDeAtuacao('fonoaudiologa')}>
            <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 14 }} className={`text-${areaDeAtuacao === 'fonoaudiologa' ? 'white' : 'gray-400'} text-center`}>Fonoaudiologia</Text>
          </TouchableOpacity>

          <TouchableOpacity className={`border ${areaDeAtuacao === 'terapeuta_ocupacional' ? 'border-dark-orange bg-dark-orange' : 'border-gray-200 bg-white'} rounded-full px-3 py-1 ml-2`} onPress={() => setAreaDeAtuacao('terapeuta_ocupacional')}>
            <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 14 }} className={`text-${areaDeAtuacao === 'terapeuta_ocupacional' ? 'white' : 'gray-400'} text-center`}>Terapia Ocupacional</Text>
          </TouchableOpacity>
        </View>

      </View>

      <AreaDeAtuacaoCard 
        areaDeAtuacao={areaDeAtuacao}
      />

      <View className="shadow-sm bg-white rounded-xl w-[80%] mb-3 flex-row mx-auto py-1 px-4 items-center">
        <MagnifyingGlassIcon size={20} color="grey" />
        <TextInput placeholder="Pesquise pelo nome do especialista" 
                   value={nome} 
                   onChangeText={text => setNome(text)} 
                   className="ml-2 flex-1" 
                   placeholderTextColor="gray" 
                   textAlignVertical="center" />
      </View>

      <View className="mb-3 items-center">
        <Dropdown
          className="w-[80%] border border-gray-200 rounded-full py-1 px-1 shadow-sm bg-white"
          onValueChange={setCidade}
          items={listaCidades}
          placeholder={placeholderCidade}
          value={cidade}
        />
      </View>

      <View className="mb-3 items-center">
        <Dropdown
          className="w-[80%] border border-gray-200 rounded-full py-1 px-1 shadow-sm bg-white"
          onValueChange={setPreco}
          items={listaFaixasDePreco}
          placeholder={placeholderFaixaDePreco}
          value={preco}
        />
      </View>

      <View className="mb-3 items-center">
        <Dropdown
          className="w-[80%] border border-gray-200 rounded-full py-1 px-1 shadow-sm bg-white"
          onValueChange={setCondicao}
          items={listaCondicoes}
          placeholder={placeholderCondicao}
          value={condicao}
        />
      </View>

      <View className="mb-3 items-center">
        <Dropdown
          className="w-[80%] border border-gray-200 rounded-full py-1 px-1 shadow-sm bg-white"
          onValueChange={setConvenio}
          items={listaDeConvenios}
          placeholder={placeholderConvenio}
          value={convenio}
        />
      </View>

      <View className="mb-28">
        <UsuarioCard 
          onVerMaisPress={abrirModal}
        />
        <UsuarioCard 
          onVerMaisPress={abrirModal}
        />
      </View>
    
    </View>

    <UsuarioCardCompleto 
      modalVisible={modalVisivel}
      onCloseModal={fecharModal}
    />

  </ScrollView>
  )
}