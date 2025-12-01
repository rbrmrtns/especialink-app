import { View, Text, TextInput, TouchableOpacity, ScrollView, StatusBar, PixelRatio, ImageBackground, Image } from 'react-native'
import React, { useEffect, useState, useContext } from 'react';
import Animated, { FlipInEasyX } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { MagnifyingGlassIcon } from 'react-native-heroicons/outline'
import { Dropdown } from '../components/Dropdown';
import { AreaDeAtuacaoCard } from '../components/AreaDeAtuacaoCard';
import UsuarioCard from '../components/UsuarioCard'
import { UsuarioCardCompleto } from '../components/UsuarioCardCompleto'
import { db } from '../config/firebaseConfig';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore'
import { AuthContext } from '../context/AuthContext';
import { buscarEspecialistasPorEstado } from '../utils/buscarEspecialistasPorEstado';
import { obterCoordenadasMapbox} from '../utils/geocoding';
import { getDistanceFromLatLonInKm } from '../utils/getDistanceFromLatLonInKm';
// import { signOut } from 'firebase/auth'
// import { auth } from '../config/firebaseConfig'

export default function Busca() {
  const { loading, userProfile } = useContext(AuthContext);
    
  if (loading || !userProfile) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color="#ffbf00" />
      </View>
    );
  }

  const fontScale = PixelRatio.getFontScale();
  const getFontSize = size => size / fontScale;

  const [listaEspecialistas, setListaEspecialistas] = useState([]);
  const [listaCidades, setListaCidades] = useState([]);
  const [listaCondicoes, setListaCondicoes] = useState([]);
  const [listaConvenios, setListaConvenios] = useState([]);

  const [areaDeAtuacao, setAreaDeAtuacao] = useState('psicologa');
  const [nome, setNome] = useState('');
  const [cidade, setCidade] = useState(null);
  const [preco, setPreco] = useState(null);
  const [condicao, setCondicao] = useState(null);
  const [convenio, setConvenio] = useState(null);

  useEffect(() => {
    const carregarDadosIniciais = async () => {
      if (!userProfile) return;

      try {
        const condicoesRef = collection(db, "condicoes");
        const conveniosRef = collection(db, "convenios");
        
        const [condicoesSnap, conveniosSnap] = await Promise.all([
            getDocs(condicoesRef),
            getDocs(conveniosRef)
        ]);

        setListaCondicoes(condicoesSnap.docs.map(d => ({ label: d.data().nome, value: d.data().nome })));
        setListaConvenios(conveniosSnap.docs.map(d => ({ label: d.data().nome, value: d.data().nome })));

        let ufUsuario = '';
        let coordsPaciente = null;

        if (userProfile.tipo_usuario === 'paciente') {
             const docRef = doc(db, "usuarios", userProfile.id, "privado", "endereco");
             const docSnap = await getDoc(docRef);
             if (docSnap.exists()) {
                 ufUsuario = docSnap.data().uf;

                 coordsPaciente = await obterCoordenadasMapbox(docSnap.data());
             }
        } else {
             Alert.alert(
                "Acesso Restrito", 
                "Esta funcionalidade de busca filtrada é exclusiva para pacientes.",
                [
                  { 
                      text: "Voltar", 
                      onPress: () => navigation.goBack()
                  }
                ]
             );
             return;
        }

        if (ufUsuario) {
            const resultado = await buscarEspecialistasPorEstado(ufUsuario);
            
            const { dadosEspecialistas, coordsEspecialistas } = resultado;
            
            const especialistasComDistancia = dadosEspecialistas.map((especialista, index) => {
                const coordsEspec = coordsEspecialistas[index];
                let distancia = null;

                if (coordsPaciente && coordsEspec) {
                    distancia = getDistanceFromLatLonInKm(
                        coordsPaciente.latitude, coordsPaciente.longitude,
                        coordsEspec.latitude, coordsEspec.longitude
                    );
                }

                return {
                    ...especialista,
                    distancia_km: distancia
                };
            });
            
            setListaEspecialistas(especialistasComDistancia);

            const cidadesUnicas = new Set();
            especialistasComDistancia.forEach(esp => {
                if (esp.consultorio && esp.consultorio.cidade) {
                    cidadesUnicas.add(esp.consultorio.cidade);
                }
            });
            
            const cidadesFormatadas = Array.from(cidadesUnicas).map(cidadeNome => ({
                label: cidadeNome,
                value: cidadeNome
            }));
            
            setListaCidades(cidadesFormatadas);

        }

      } catch (error) {
        console.error("Erro ao carregar dados da busca:", error);
      }
    };

    carregarDadosIniciais();
  }, [userProfile]);

  const especialistasFiltrados = listaEspecialistas.filter(esp => {
      if (esp.area !== areaDeAtuacao) return false;

      if (nome) {
          const termoBusca = nome.toLowerCase().trim();
          const nomeEspecialista = esp.nome.toLowerCase();

          if (termoBusca.includes(' ')) {
              if (!nomeEspecialista.includes(termoBusca)) return false;
          } else {
              const partesDoNome = nomeEspecialista.split(' ');
              const temMatchInicial = partesDoNome.some(parte => parte.startsWith(termoBusca));
              
              if (!temMatchInicial) return false;
          }
      }

      if (cidade && esp.consultorio?.cidade !== cidade) return false;

      if (convenio && (!esp.convenios || !esp.convenios.includes(convenio))) return false;

      if (condicao && (!esp.especialidades || !esp.especialidades.includes(condicao))) return false;

      if (preco) {
          const valor = parseFloat(esp.preco_consulta);

          if (preco === '100') {
              if (valor > 100) return false;
          } else if (preco === '600') {
              if (valor < 600) return false;
          } else if (preco.includes(',')) {
              const [min, max] = preco.split(',').map(Number);
              if (valor < min || valor > max) return false;
          }
      }

      return true;
  });

  const placeholderCidade = {
    label: 'Selecione uma cidade',
    value: null,
  };

  const listaFaixasDePreco = [
    { label: 'Até R$100', value: '100' },
    { label: 'Entre R$100 e R$250', value: '100,250' },
    { label: 'Entre R$250 e R$400', value: '250,400' },
    { label: 'Entre R$400 e R$600', value: '400,600' },
    { label: 'Mais de R$600', value: '600' }
  ];

  const placeholderFaixaDePreco = {
    label: 'Selecione um valor de consulta',
    value: null,
  };

  const placeholderCondicao = {
    label: 'Selecione uma condição mental',
    value: null,
  };

  const placeholderConvenio = {
    label: 'Selecione um convênio',
    value: null,
  };

  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  
  const abrirModal = (usuario) => {
    setUsuarioSelecionado(usuario);
  };
  const fecharModal = () => {
    setUsuarioSelecionado(null);
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
          items={listaConvenios}
          placeholder={placeholderConvenio}
          value={convenio}
        />
      </View>

      <View className="mb-28">
        {especialistasFiltrados.length > 0 ? (
            especialistasFiltrados.map(especialista => (
              <UsuarioCard 
                  key={especialista.id}
                  dadosPerfil={especialista}
                  onVerMaisPress={() => abrirModal(especialista)}
              />
            ))
          ) : (
            <Text className="text-center text-gray-500 mt-5 font-montRegular">
              Nenhum especialista encontrado com esses filtros.
            </Text>
          )}
      </View>
    
    </View>

    <UsuarioCardCompleto 
      modalVisible={usuarioSelecionado !== null} 
      onCloseModal={fecharModal}
      dadosPerfil={usuarioSelecionado} 
    />

  </ScrollView>
  )
}