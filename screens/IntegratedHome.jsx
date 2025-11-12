import { View, Text, ScrollView, StatusBar, ActivityIndicator } from 'react-native';
// 1. Importe 'useState' e 'useEffect'
import React, { useState, useEffect } from 'react'; 
import UsuarioCard from '../components/UsuarioCard';
import { UsuarioCardCompleto } from '../components/UsuarioCardCompleto';
import axios from 'axios'; // (ou sua lib de fetch)

export default function Home() {

  // 2. Crie o novo estado para o usuário SELECIONADO
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  
  // 3. Crie estados para sua LISTA de usuários
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  // 4. Busque os dados da API (exemplo)
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        // (substitua pela sua URL real da API)
        const response = await axios.get('https://sua-api.com/especialistas');
        setUsuarios(response.data); 
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsuarios();
  }, []);

  // 5. Funções de controle do modal (agora recebem 'usuario')
  const abrirModal = (usuario) => {
    setUsuarioSelecionado(usuario); // Guarda o usuário no estado
  };
  const fecharModal = () => {
    setUsuarioSelecionado(null); // Limpa o estado
  };
  
  if (loading) {
    return <ActivityIndicator size="large" className="flex-1" />;
  }

  return (
    <ScrollView>
      <StatusBar/>
      <View className="flex-[1] white">

        {/* ... (Seu código do Mapa e Header) ... */}

        <View className="bg-white rounded-t-[35px] py-5 -mt-5">
          
          {/* ... (Seu texto "Selecione pacientes...") ... */}

          {/* 6. AQUI ESTÁ A MÁGICA: Mapeie o array de usuários */}
          <View className="mb-28">
            {usuarios.map((user) => (
              <UsuarioCard 
                key={user.id} // (Use um ID único da API)
                profileData={user} // Passe o 'user' para o card simples
                // Passe a função 'abrirModal' com o 'user' específico
                onVerMaisPress={() => abrirModal(user)} 
              />
            ))}
          </View>
          
        </View>

      </View>

      {/* 7. Renderize o Modal UMA VEZ FORA DO SCROLLVIEW */}
      <UsuarioCardCompleto 
        // O modal estará visível se 'usuarioSelecionado' NÃO for 'null'
        modalVisible={usuarioSelecionado !== null} 
        onCloseModal={fecharModal}
        // Passe o usuário que está no estado para o modal
        profileData={usuarioSelecionado} 
      />
    </ScrollView>
  );
}