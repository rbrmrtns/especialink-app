// import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ImageBackground, PixelRatio, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import { ArrowLeftIcon } from 'react-native-heroicons/outline';
import { DateTimePicker } from '../components/DateTimePicker';
import { GeradorImagemPerfil } from '../components/GeradorImagemPerfil';
import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function AgendamentoConsulta() {
  // const navigation = useNavigation();

  const fontScale = PixelRatio.getFontScale();
  const getFontSize = size => size / fontScale;

  const [loading, setLoading] = useState(true);

  const [emailPaciente, setEmailPaciente] = useState('');
  const [corPaciente, setCorPaciente] = useState('');
  const [nomePaciente, setNomePaciente] = useState('');

  const [agendamento, setAgendamento] = useState(new Date());
  const [anotacoes, setAnotacoes] = useState('');

  // useEffect(() => {
  //       const fetchData = async () => {
  //           try {
  //               const response = await axios.get(`${API_URL}/users/dadosForm`);
                
  //               setCondicoes(response.data.condicoes);
  //               setConvenios(response.data.convenios);

  //           } catch (error) {
  //               console.error("Erro ao buscar dados do servidor:", error);
  //           } finally {
  //               setLoading(false);
  //           }
  //       };

  //       fetchData();
  //   }, []);

  // if (loading) {
  //   return <ActivityIndicator size="large" color="#FFA500" style={{ flex: 1 }} />;
  // }

// const handleSignup = async () => {
//   const camposObrigatoriosComuns = {
//       email, nome, senha, telefone, logradouro, numeroEndereco, bairro, cidade, UF, CEP
//   };
//   const testesObrigatorios = { pontTesteA, pontTesteB, pontTesteC, pontTesteD };

//   let camposObrigatorios = { ...camposObrigatoriosComuns };
//   if (tipoUsuario === 'especialista') {
//       camposObrigatorios = {
//           ...camposObrigatorios,
//           tipo, conselho, conselhoNmro
//       };
//   }

//   let camposFaltando = false;
//   for (const [key, value] of Object.entries(camposObrigatorios)) {
//       if (value === '' || (Array.isArray(value) && value.length === 0)) {
//           console.log(`Campo faltando: ${key}`);
//           camposFaltando = true;
//           break;
//       }
//   }

//   if (!camposFaltando) {
//       for (const [key, value] of Object.entries(testesObrigatorios)) {
//           if (!Array.isArray(value) || value.some(item => item === null)) {
//               console.log(`Teste incompleto: ${key}`);
//               camposFaltando = true;
//               break;
//           }
//       }
//   }

//   if (camposFaltando) {
//       Alert.alert('Campos Obrigatórios', 'Por favor, preencha todos os campos obrigatórios e responda a todos os testes antes de cadastrar.');
//       return;
//   }

//   const selecoes = {
//     condicoes: condicoesSelecionadas,
//   };

//   const cadastroData = {
//       dadosPessoais: { tipoUsuario, email, nome, senha, telefone, responsavel: tipoUsuario === 'paciente' ? responsavel : undefined },
//       endereco: { logradouro, numero: numeroEndereco, bairro, cidade, uf: UF, cep: CEP },
//       testes: { testeA: pontTesteA, testeB: pontTesteB, testeC: pontTesteC, testeD: pontTesteD },
//       selecoes: selecoes
//   };

//   if (tipoUsuario === 'especialista') {
//       const horaInicioFormatada = formatDateToTimeString(expedienteInicio);
//       const horaFimFormatada = formatDateToTimeString(expedienteFim);

//       if (horaInicioFormatada === null || horaFimFormatada === null) {
//           Alert.alert("Erro de Formato", "Horário de expediente inválido.");
//           return; 
//       }

//       cadastroData.dadosEspecialista = {
//           especialidade, conselho, numeroConselho: conselhoNmro, descricao,
//           precoConsulta, duracaoConsulta,
//           diasDeTrabalho, expedienteInicio: horaInicioFormatada, expedienteFim: horaFimFormatada,
//       };

//       cadastroData.selecoes.convenios = conveniosSelecionados;
//   }

//   try {
//     const response = await axios.post(`${API_URL}/users/cadastrar`, cadastroData);
//     Alert.alert('Sucesso!', 'Cadastro realizado com sucesso!');
//   } catch (error) {
//     console.error('Erro ao cadastrar:', error);
//     Alert.alert('Erro', 'Ocorreu um erro ao realizar o cadastro. Tente novamente.');
//   }
// };
              

  return (
    <ScrollView className="flex-1 bg-white">
    <View>

      <ImageBackground source={require('./../assets/images/bg3.png')} resizeMode="cover" imageStyle= {{opacity:0.3}}>

        <TouchableOpacity 
          // onPress={() => navigation.goBack()} 
          className="absolute top-16 left-5 z-10 p-2 bg-white/20 rounded-full"
        >
          <ArrowLeftIcon size={24} color="black" />
        </TouchableOpacity>

        <View className="pt-28 pb-24">
          <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(24) }} className="text-center mt-8 shadow-md">
            Agende a consulta
          </Text>
        </View>

      </ImageBackground>

      <View className="p-8 bg-white rounded-t-3xl shadow-xl -mt-6 pb-24">

        <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(14) }} className="mb-3 text-center">
          Você está agendando uma consulta com o(a) paciente:
        </Text>

        <View className="mb-10 flex-row items-center justify-center">
          <GeradorImagemPerfil
            nomeUsuario='Rosana Freitas'
            corFundo='#7affd5'
          />
          <Text className="text-xl font-montExtrabold color-dark-orange ml-4">Rosana Freitas</Text>
        </View>

        <View className="mb-10">
          <DateTimePicker
            label="Data e Hora da Consulta"
            value={agendamento}
            onChange={setAgendamento}
          />
        </View>

        <View>
          <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(16)}}
          className="mb-3">Anotações</Text>
          <TextInput
            className="border border-gray-200 rounded-xl shadow-sm py-3 px-6 h-48 bg-white"
            placeholder="Anote qualquer coisa que deseja lembrar para a consulta"
            multiline
            value={anotacoes}
            onChangeText={setAnotacoes}
            style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(14)}}
          />
        </View>

        <View className="mt-10 flex items-center">
          <TouchableOpacity 
            // onPress={handleSave} 
            className="py-4 bg-orange rounded-full w-40">
            <Text 
              style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(24) }} 
              className="font-bold text-center text-white">
              Agendar
            </Text>
          </TouchableOpacity>
        </View>

      </View>

  </View>
  </ScrollView>
  )
}