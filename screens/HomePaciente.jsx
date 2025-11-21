import { ActivityIndicator, View, Text, SafeAreaView, TouchableOpacity, Image, ImageBackground, ScrollView, RefreshControl, StatusBar } from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import UsuarioCard from '../components/UsuarioCard';
import { UsuarioCardCompleto } from '../components/UsuarioCardCompleto';
import Mapbox from '@rnmapbox/maps';
import { useNavigation } from '@react-navigation/native';
// import { useFocusEffect } from '@react-navigation/native';
import { doc, collection, getDoc, query, where, getDocs, setDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebaseConfig';
import { AuthContext } from '../context/AuthContext';
import { buscarEspecialistasPorEstado } from '../components/buscarEspecialistasPorEstado';
import { obterCoordenadasMapbox } from '../utils/geocoding';
import { medicaoCompatibilidade } from '../utils/medicaoCompatibilidade';

export default function Home() {
  const navigation = useNavigation();

  const { loading, userProfile } = useContext(AuthContext);
  
  if (loading || !userProfile) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color="#ffbf00" />
      </View>
    );
  }

  const [coordenadasUser, setCoordenadasUser] = useState('');

  const [pacoteEspecialistas, setPacoteEspecialistas] = useState({ 
      dadosEspecialistas: [], 
      coordsEspecialistas: [] 
  });

  const [listaOrdenada, setListaOrdenada] = useState([]);

  useEffect(() => {
    const carregarDadosIniciais = async () => {
      if (userProfile) {
        try {
          const docRef = doc(db, "usuarios", userProfile.id, "privado", "endereco");
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const coords = await obterCoordenadasMapbox(docSnap.data());

            if (coords) {
              setCoordenadasUser(coords);
            }

            const ufUser = docSnap.data().uf;

            const pacote = await buscarEspecialistasPorEstado(ufUser);
            setPacoteEspecialistas(pacote);

          } else {
            console.log("Nenhum endereço cadastrado.");
          }
        } catch (error) {
          console.error("Erro no fluxo:", error);
        }
      }
    };

    carregarDadosIniciais();
  }, [userProfile]);

  useEffect(() => {
    if (userProfile && pacoteEspecialistas.dadosEspecialistas.length > 0 && coordenadasUser) {
      console.log("Iniciando medição de compatibilidade...");
      
      const ordemPorCompatibilidade = medicaoCompatibilidade(userProfile, coordenadasUser, pacoteEspecialistas);
      
      setListaOrdenada(ordemPorCompatibilidade);
    }
  }, [userProfile, pacoteEspecialistas, coordenadasUser]);

  const [isScrollEnabled, setScrollEnabled] = useState(true);

  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);

  const abrirModal = (usuario) => {
    setUsuarioSelecionado(usuario);
  };
  const fecharModal = () => {
    setUsuarioSelecionado(null);
  };

return (
    <ScrollView scrollEnabled={isScrollEnabled}>
      <StatusBar/>
      <View className="flex-[1] white">
        <View className="h-96"> 
          
          {coordenadasUser && (
          <Mapbox.MapView
            style={{flex: 1}}
            styleURL={Mapbox.StyleURL.Street}
            onTouchStart={() => setScrollEnabled(false)}
            onTouchEnd={() => setScrollEnabled(true)}
          >
            <Mapbox.Camera
              zoomLevel={14}
              centerCoordinate={[parseFloat(coordenadasUser.longitude), parseFloat(coordenadasUser.latitude)]}
              animationMode={'flyTo'}
              animationDuration={0}
            />
              <Mapbox.PointAnnotation
                key={userProfile.id}
                id={userProfile.id}
                coordinate={[parseFloat(coordenadasUser.longitude), parseFloat(coordenadasUser.latitude)]}
              >
                <Mapbox.Callout title='Você' contentStyle={{ borderRadius: 8, padding: 8 }} />
              </Mapbox.PointAnnotation>
            {listaOrdenada.map(especialista => (
              <Mapbox.PointAnnotation
                key={especialista.id}
                id={especialista.id}
                coordinate={[parseFloat(especialista.coords.longitude), parseFloat(especialista.coords.latitude)]}
              >
                <Mapbox.Callout title={`Consultório de ${especialista.nome}`} contentStyle={{ borderRadius: 8, padding: 8 }} />
              </Mapbox.PointAnnotation>
            ))}
          </Mapbox.MapView>
          )}

          <View className="absolute top-0 left-0 right-0 p-4 pt-12"> 
            
            <View className="flex-row justify-between items-start">
              
              <View>
                <Image className="w-16 h-6" 
                       source={require('../assets/logo.png')} />
              </View>

              <View className="items-end bg-white/70 rounded-md p-2">
                <Text 
                  className="text-xl text-gray-800" 
                  style={{ fontFamily: 'Montserrat_600SemiBold'}}
                >
                  Olá {userProfile.nome.split(' ')[0]}
                </Text>
              </View>
            
            </View>
          </View>

        </View>

        <View className="bg-white rounded-t-[35px] py-5 -mt-5 min-h-screen">

          <Text 
            className="text-lg text-gray-800 text-center mx-5 mb-4" 
            style={{ fontFamily: 'Montserrat_400Regular'}}
          >
            Entre em contato com o melhor especialista para você pressionando "Contato"
          </Text>

          <View className="mb-28">
            {listaOrdenada.length > 0 ? (
              listaOrdenada.map((especialista) => (
              <UsuarioCard 
                key={especialista.id}
                dadosPerfil={especialista}
                onVerMaisPress={() => abrirModal(especialista)} 
              />
            ))
          ) : (
              <Text className="text-center mt-10 text-gray-500 font-montRegular mx-5">
                Ainda não existem especialistas compatíveis com você na plataforma.
              </Text>
            )}
          </View>
          
        </View>

      </View>

      <UsuarioCardCompleto 
        modalVisible={usuarioSelecionado !== null} 
        onCloseModal={fecharModal}
        dadosPerfil={usuarioSelecionado} 
      />
    </ScrollView>
  );
}
