import React from 'react';
import { View, Text, Image, TouchableOpacity, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/FontAwesome';
import { GeradorImagemPerfil } from './GeradorImagemPerfil';
import { db, auth } from './../config/firebaseConfig';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const UsuarioCard = ({ dadosPerfil, onVerMaisPress }) => {
  if (!dadosPerfil) return null;

  const navigation = useNavigation();

  const nomesAreas = {
    psicologa: 'Psicóloga',
    psiquiatra: 'Psiquiatra',
    psicopedagoga: 'Psicopedagoga',
    fonoaudiologa: 'Fonoaudióloga',
    terapeuta_ocupacional: 'Terapeuta Ocupacional'
  };

  const crpFinal = `${dadosPerfil.conselho} ${dadosPerfil.conselho_nmro}`;

  const precoFinal = dadosPerfil.preco_consulta ? `R$ ${dadosPerfil.preco_consulta}` : 'Sob consulta';
  const precoClasseTamanho = dadosPerfil.preco_consulta ? 'text-2xl' : 'text-base';

  const duracaoFinal = dadosPerfil.duracao_consulta ? `${dadosPerfil.duracao_consulta} min` : 'Sob consulta';

  const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const diasTrabalhoFinal = dadosPerfil.dias_trabalho && dadosPerfil.dias_trabalho.length > 0
    ? dadosPerfil.dias_trabalho.sort((a, b) => a - b).map(nmro => diasSemana[nmro]).join(', ') 
    : 'Sob consulta';

  const horasTrabalho = dadosPerfil.expediente_inicio && dadosPerfil.expediente_fim ? 
  `${dadosPerfil.expediente_inicio.slice(0, 2)}h às ${dadosPerfil.expediente_fim.slice(0, 2)}h` : 'Sob consulta';

  const temDadosConsulta = dadosPerfil.preco_consulta || dadosPerfil.duracao_consulta || dadosPerfil.dias_trabalho?.length > 0;

  const handleWhatsAppPress = async () => {
    const usuarioLogado = auth.currentUser;
    if (!usuarioLogado) {
      console.error("Usuário não identificado.");
      return;
    }

    const meuId = auth.currentUser.uid;

    let telefoneLimpo = dadosPerfil.telefone.replace(/\D/g, ''); 
    if (!telefoneLimpo.startsWith('55')) {
      telefoneLimpo = `55${telefoneLimpo}`;
    }

    const url = `whatsapp://send?phone=${telefoneLimpo}&text=Olá, ${dadosPerfil.nome}!\n\nCheguei a você pelo aplicativo EspeciaLink e tenho interesse em iniciar um processo terapêutico com você!`;

    try {
      const contatoRef = doc(db, 'usuarios', dadosPerfil.id, 'contatos', meuId);

      await setDoc(contatoRef, {
        data_hora: serverTimestamp()
      });

      console.log('Contato registrado com sucesso!');

      Linking.openURL(url);

    } catch (error) {
      console.error('Erro ao registrar contato. O WhatsApp não será aberto.', error);
      alert('Erro ao conectar. Verifique sua internet.');

    }
  };

  return (
    <View className="bg-white rounded-lg shadow-lg p-4 m-4 my-2">
      <View className="flex-row justify-between items-start">
        
        <View className="flex-row items-center flex-1 pr-2">
          <GeradorImagemPerfil
            nomeUsuario={dadosPerfil.nome}
            corFundo={dadosPerfil.cor_img_perfil}
          />
          <View className="ml-4 flex-1 flex-shrink"> 
            <Text className="text-xl font-montExtrabold color-dark-orange" numberOfLines={1} ellipsizeMode="tail">{dadosPerfil.nome}</Text>
            {dadosPerfil.tipo_usuario == 'especialista' && (
            <>
            <Text className="text-base font-montMedium text-gray-700">{nomesAreas[dadosPerfil.area]}</Text>
            <Text className="text-base font-montExtrabold color-dark-orange">{crpFinal}</Text>
            </>
            )}
            <Text className="text-sm font-montRegular text-gray-700">{dadosPerfil.cidade}</Text>
            {dadosPerfil.tipo_usuario == 'especialista' && (
            <>
            <Text className="text-base font-montExtrabold color-dark-orange">{`a aprox. ${parseFloat(dadosPerfil.distancia_km).toFixed(0)}km de você`}</Text>
            </>
            )}
          </View>
        </View>

        {(() => {
          if (dadosPerfil.tipo_usuario == 'especialista') {
            return <TouchableOpacity 
                    className="flex-row items-center ml-auto"
                    onPress={handleWhatsAppPress}
                    >
                      <Icon name="whatsapp" size={16} color="#25D366" />
                      <Text className="text-base text-green-600 font-montRegular ml-2 uppercase">
                        Contato
                      </Text>
                    </TouchableOpacity>;
          } else if (dadosPerfil.tipo_usuario == 'paciente') {
            return <TouchableOpacity 
                      className="flex-row items-center mt-3.5 ml-auto"
                      onPress={() => navigation.navigate('AgendamentoConsulta', { 
                        dadosPaciente: dadosPerfil
                      })}
                    >
                      <Icon name="calendar" size={16} color="#0040FF" />
                      <Text className="text-base color-blue font-montRegular ml-2 uppercase">
                        Agendar
                      </Text>
                    </TouchableOpacity>;
          }
        })()}
      </View>

      <View className="mt-4">
        
        {dadosPerfil.tipo_usuario == 'especialista' && temDadosConsulta && (
          <>
        <Text className="text-lg font-montExtrabold color-dark-orange mb-2">
            Consulta
          </Text>
        <View className="flex-row justify-between items-start pb-4 mb-4">
          
          <View>
            <Text className="text-sm font-montRegular color-orange uppercase">Duração</Text>
            <Text className="text-sm font-montMedium text-gray-800">
              <Text className="text-sm font-montRegular text-gray-800">Aprox. </Text>
              {duracaoFinal}
            </Text>
          </View>
          
          <View className="items-center">
            <Text className="text-sm font-montRegular color-orange uppercase">Preço</Text>
            <Text className={`${precoClasseTamanho} font-montExtrabold font-bold text-gray-800`}>{precoFinal}</Text>
          </View>

          <View className="items-end">
            <Text className="text-sm font-montRegular color-orange uppercase">Atendimento</Text>
            <Text className="text-sm font-montMedium text-gray-800">{diasTrabalhoFinal}</Text>
            <Text className="text-sm font-montMedium text-gray-800">{horasTrabalho}</Text>
          </View>
        </View>
        </>
        )}
        
      </View>

      <View className="items-center">
        <TouchableOpacity onPress={onVerMaisPress}>
          <Text className="text-base color-dark-orange font-montSemibold">
            {dadosPerfil.tipo_usuario == 'especialista' ? 'Ver mais informações do especialista' : 'Ver mais informações do paciente'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default UsuarioCard;