import { ActivityIndicator, View, Text, ScrollView, StatusBar, PixelRatio, ImageBackground, Image, Alert } from 'react-native'
import React, { useEffect, useState, useContext } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import ConsultaCard from '../components/ConsultaCard';
import { collection, query, where, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { AuthContext } from '../context/AuthContext';

export default function ListaConsultas() {
  const { loading, userProfile } = useContext(AuthContext);
  
  if (loading || !userProfile) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color="#ffbf00" />
      </View>
    );
  };

  const fontScale = PixelRatio.getFontScale();
  const getFontSize = size => size / fontScale;

  const [consultas, setConsultas] = useState([]);

  useEffect(() => {
    const fetchConsultasEspecialista = async () => {

      try {
        const consultasRef = collection(db, "consultas");

        const q = query(
          consultasRef, 
          where("especialista_id", "==", userProfile.id),
          orderBy("created_at", "desc") 
        );

        const querySnapshot = await getDocs(q);

        const listaFormatada = querySnapshot.docs.map(doc => {
          const data = doc.data();
          
          const dataInicio = data.data_hora.toDate();

          const duracaoMinutos = userProfile.duracao_consulta; 

          const dataFim = new Date(dataInicio.getTime() + duracaoMinutos * 60000);

          const formatH = (date) => {
            const h = date.getHours().toString().padStart(2, '0');
            const m = date.getMinutes().toString().padStart(2, '0');
            return m === '00' ? `${h}h` : `${h}h${m}`;
          };

          const formatDia = (date) => {
            const d = date.getDate().toString().padStart(2, '0');
            const m = (date.getMonth() + 1).toString().padStart(2, '0');
            return `${d}/${m}`;
          };

          return {
              id: doc.id,
              nomePaciente: data.paciente_nome,
              corImgPerfilPaciente: data.paciente_cor_img_perfil,
              diaConsulta: formatDia(dataInicio),
              horarioConsulta: `${formatH(dataInicio)} às ${formatH(dataFim)}`,
              anotacoes: data.anotacoes || 'Sem anotações.'
          };
      });

        setConsultas(listaFormatada);

      } catch (error) {
        console.error("Erro ao buscar consultas:", error);
        
        if (error.message.includes("index")) {
            console.log("⚠️ VOCÊ PRECISA CRIAR UM ÍNDICE NO FIREBASE. OLHE O LINK ACIMA.");
        }
      }
    };

    fetchConsultasEspecialista();
  }, [userProfile]);

  const excluirConsulta = async (idConsulta) => {
    Alert.alert(
      "Limpar Consulta",
      "Tem certeza que deseja remover esta consulta do histórico?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Sim, limpar", 
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "consultas", idConsulta));
              
              setConsultas(listaAtual => listaAtual.filter(item => item.id !== idConsulta));
              
            } catch (error) {
              console.error("Erro ao excluir:", error);
              Alert.alert("Erro", "Não foi possível apagar a consulta.");
            }
          } 
        }
      ]
    );
  };

  return (
    <ScrollView>
      <StatusBar/>
    <View className="flex-[1] bg-white min-h-screen">

      {/* INTRO */}
      <ImageBackground source={require('../assets/images/bg4.png')} resizeMode="cover" imageStyle= {{opacity:0.7}}>

        <View className="mt-20 mb-10">

          <View className="-mt-3 mb-0">
            <Text className="mb-1 text-center" style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: 25 }}>Consultas</Text>
          </View>
   
        </View>

        <LinearGradient
          colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 1)']} 
          className="absolute bottom-0 left-0 right-0 h-24"
        />

      </ImageBackground>

      <View className="mb-28">
        {consultas.map((consulta) => (
          <ConsultaCard 
            key={consulta.id}
            dadosConsulta={consulta}
            onDelete={() => excluirConsulta(consulta.id)}
          />
        ))}
      </View>
    
    </View>

  </ScrollView>
  )
}