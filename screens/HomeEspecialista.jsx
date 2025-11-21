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

  const [pacientes, setPacientes] = useState([]);

  useEffect(() => {
    const buscarPacientesVinculados = async () => {
      if (!userProfile) return [];

      try {
        const contatosRef = collection(db, "usuarios", userProfile.id, "contatos");
        const contatosSnap = await getDocs(contatosRef);

        if (contatosSnap.empty) {
          console.log("Nenhum paciente vinculado encontrado.");
          return [];
        }

        const promises = contatosSnap.docs.map(async (contatoDoc) => {
          const idDoPaciente = contatoDoc.id;
          const userRef = doc(db, "usuarios", idDoPaciente);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            return {
              id: userSnap.id,
              ...userSnap.data()
            };
          }
          return null;
        });

        const resultados = await Promise.all(promises);

        const pacientesReais = resultados.filter(item => item !== null);
        
        setPacientes(pacientesReais);

      } catch (error) {
        console.error("Erro ao buscar pacientes vinculados:", error);
        return [];
      }
    };

    buscarPacientesVinculados();
  }, [userProfile]);

  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);

  const abrirModal = (usuario) => {
    setUsuarioSelecionado(usuario);
  };
  const fecharModal = () => {
    setUsuarioSelecionado(null);
  };

return (
    <View className="flex-1 bg-white">
      <StatusBar translucent backgroundColor="transparent"/>

        <View className="flex-[0.4] relative"> 
          
          <ImageBackground source={require('../assets/images/bg1.png')} resizeMode="cover" className="flex-1 w-full justify-center items-center" imageStyle= {{opacity:0.5}}>
          
              <View className="absolute top-0 bottom-0 left-0 right-0 justify-center items-center">
                <Image className="w-48 h-20" source={require('../assets/logo.png')} />
              </View>

              <View className="absolute top-12 right-5 bg-white/70 px-4 py-2 rounded-xl shadow-sm">
                <Text className="text-sm font-montRegular text-gray-600">
                  Olá,
                </Text>
                <Text className="text-lg font-montSemibold color-dark-orange -mt-1">
                  {userProfile?.nome ? `${userProfile.nome.split(' ')[0]}!` : 'Visitante!'}
                </Text>
              </View>

          </ImageBackground>

        </View>

        <View className="flex-[0.6] bg-white rounded-t-[35px] -mt-8 pt-6 px-4">

          <Text 
            className="text-lg text-gray-800 text-center mx-5 mb-4" 
            style={{ fontFamily: 'Montserrat_400Regular'}}
          >
            Agenda uma consulta com um possível paciente pressionando "Agendar"
          </Text>

          <ScrollView className="flex-1">
            {pacientes.length > 0 ? (
              pacientes.map(paciente => (
                <UsuarioCard 
                  key={paciente.id} 
                  dadosPerfil={paciente}
                  onVerMaisPress={() => abrirModal(paciente)} 
                />
              ))
            ) : (
              <Text className="text-center mt-10 text-gray-500 font-montRegular">
                Nenhum paciente ainda entrou em contato com você pelo nosso app.
              </Text>
            )}
          </ScrollView>
          
        </View>

      <UsuarioCardCompleto 
        modalVisible={usuarioSelecionado !== null} 
        onCloseModal={fecharModal}
        dadosPerfil={usuarioSelecionado} 
      />
    </View>
  );
}
