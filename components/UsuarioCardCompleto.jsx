import React from 'react';
import { View, Text, Image, Modal, Pressable, SafeAreaView } from 'react-native';
import { GeradorImagemPerfil } from './GeradorImagemPerfil';

const Conteudo = ({ dadosPerfil }) => {
  if (!dadosPerfil) return null;

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
    ? dadosPerfil.dias_trabalho.map(nmro => diasSemana[nmro]).join(', ') 
    : 'Sob consulta';

  const horasTrabalho = dadosPerfil.expediente_inicio && dadosPerfil.expediente_fim ? 
  `${dadosPerfil.expediente_inicio.slice(0, 2)}h às ${dadosPerfil.expediente_fim.slice(0, 2)}h` : 'Sob consulta';

  const condicoes = dadosPerfil.tipo_usuario === 'especialista' ? dadosPerfil.especialidades : dadosPerfil.condicoes_mentais;

  const temDadosConsulta = dadosPerfil.preco_consulta || dadosPerfil.duracao_consulta || dadosPerfil.dias_trabalho?.length > 0;

  const temCondicoes = condicoes && condicoes.length > 0;
  
  const temConvenios = dadosPerfil.convenios && dadosPerfil.convenios.length > 0;

  return (
    <>
    <View className="flex-row items-center">
      <GeradorImagemPerfil
        nomeUsuario={dadosPerfil.nome}
        corFundo={dadosPerfil.cor_img_perfil}
      />
      <View className="ml-4"> 
        <Text className="text-xl font-montExtrabold color-dark-orange">{dadosPerfil.nome}</Text>
        {dadosPerfil.tipo_usuario == 'especialista' && (
        <>
        <Text className="text-base font-montMedium text-gray-700">{nomesAreas[dadosPerfil.area]}</Text>
        <Text className="text-base font-montExtrabold color-dark-orange">{crpFinal}</Text>
        </>
        )}
        <Text className="text-sm font-montRegular text-gray-700">{dadosPerfil.cidade}</Text>
      </View>
    </View>

    <View className="mt-4">

    {dadosPerfil.tipo_usuario == 'especialista' && temDadosConsulta && (
      <>
    <Text className="text-lg font-montExtrabold color-dark-orange mb-2">
        Consulta
      </Text>
    <View className="flex-row justify-between items-start pb-4 mb-4 border-b border-gray-200">
      
      <View>
        <Text className="text-sm font-montRegular color-orange uppercase">Duração</Text>
        <Text className="text-base font-montMedium text-gray-800">
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

    {temCondicoes && (
      <>
    <View>
      <Text className="text-lg font-montExtrabold color-dark-orange mb-2">
        {dadosPerfil.tipo_usuario == 'especialista' ? 'Especialidades' : 'Condições de Saúde Mental'}
      </Text>
      <View className="flex-row flex-wrap gap-2 justify-center">
        {condicoes && condicoes.map((conds) => (
          <View key={conds} className="bg-white border border-gray-400 rounded-full px-3 py-1">
            <Text className="text-xs font-montLight text-gray-700">{conds}</Text>
          </View>
        ))}
      </View>
    </View>
      </>
    )}
    </View>

    {dadosPerfil.tipo_usuario == 'especialista' && temConvenios && (
      <>
      <View className="mt-4 pt-4 border-t border-gray-200">
        <Text className="text-lg font-montExtrabold color-dark-orange mb-2">
          Convênio(s)
        </Text>
        <View className="flex-row flex-wrap gap-2 justify-center">
          {dadosPerfil.convenios.map((convs) => (
            <View key={convs} className="bg-white border border-gray-400 rounded-full px-3 py-1">
              <Text className="text-xs font-montLight text-gray-700">{convs}</Text>
            </View>
          ))}
        </View>
      </View>
      </>
  )}

  {dadosPerfil.tipo_usuario == 'especialista' && dadosPerfil.descricao && (
  <>
  <View className="mt-4 pt-4 border-t border-gray-200">
    <Text className="text-lg font-montExtrabold color-dark-orange mb-2">
      Descrição
    </Text>
    <Text className="text-sm font-montRegular text-gray-600">
      {dadosPerfil.descricao}
    </Text>
  </View>
  </>
  )}

  </>
  )
}

export const UsuarioCardCompleto = ({ 
  variant = 'modal',
  modalVisible = false,
  onCloseModal = () => {},
  dadosPerfil
}) => {
  switch (variant) {
    
    case 'embedded':
      return (
        <View className="p-4">
          <Conteudo dadosPerfil={dadosPerfil} />
        </View>
      );

    case 'modal':
    default:
      return (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={onCloseModal}
        >
          <Pressable 
            className="flex-1 justify-center items-center bg-black/50"
            onPress={onCloseModal}
          >
            <SafeAreaView>
              <Pressable className="bg-white rounded-lg shadow-lg p-4 m-4 w-[90vw]">
                <Conteudo dadosPerfil={dadosPerfil} />
              </Pressable>
            </SafeAreaView>
          </Pressable>
        </Modal>
      );
  }
};