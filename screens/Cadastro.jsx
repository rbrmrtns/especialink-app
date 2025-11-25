// import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ImageBackground, PixelRatio, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import { CustomCheckbox } from '../components/CustomCheckbox';
import { Dropdown } from '../components/Dropdown';
import { TimeRangePicker } from '../components/TimeRangerPicker';
import { CustomRadioGroup } from '../components/CustomRadioGroup';
import WeekdaySelector from '@wniemiec-component-reactnative/weekday-selector';
var randomColor = require('randomcolor');
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, collection, getDocs, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebaseConfig';
import { ArrowLeftIcon } from 'react-native-heroicons/outline';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

export default function Cadastro() {
  const navigation = useNavigation();

//Responsive font size
  const fontScale = PixelRatio.getFontScale();
  const getFontSize = size => size / fontScale;

  const [loading, setLoading] = useState(true);

  const [tipoUsuario, setTipoUsuario] = useState('paciente');

  const maskTelefone = (value) => {
    if (!value) return "";
    value = value.replace(/\D/g, '');
    value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
    value = value.replace(/(\d)(\d{4})$/, '$1-$2');
    return value.slice(0, 15);
  };

  const maskCEP = (value) => {
    if (!value) return "";
    value = value.replace(/\D/g, '');
    value = value.replace(/^(\d{5})(\d)/, '$1-$2');
    return value.slice(0, 9);
  };

  const [email, setEmail] = useState('');
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');
  const [telefone, setTelefone] = useState('');
  const [numeroEndereco, setNumeroEndereco] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [UF, setUF] = useState('');
  const [CEP, setCEP] = useState('');

  const [telefoneDisplay, setTelefoneDisplay] = useState('');
  const [CEPDisplay, setCEPDisplay] = useState('');

  const [loadingCEP, setLoadingCEP] = useState(false);

  const handleTelefoneChange = (text) => {
    const cleaned = text.replace(/\D/g, '');
    setTelefone(cleaned);
    const formatted = maskTelefone(cleaned);
    setTelefoneDisplay(formatted);
  };

  const handleCEPChange = async (text) => {
    const cleaned = text.replace(/\D/g, '');
    setCEP(cleaned);
    const formatted = maskCEP(cleaned);
    setCEPDisplay(formatted);

    if (cleaned.length === 8) {
      setLoadingCEP(true);
      
      try {
        const response = await axios.get(`https://viacep.com.br/ws/${cleaned}/json/`);
        const data = response.data;

        if (!data.erro) {
          if (data.logradouro) setLogradouro(data.logradouro);
          if (data.bairro) setBairro(data.bairro);
          if (data.localidade) setCidade(data.localidade);
          if (data.uf) setUF(data.uf);
        } else {
          alert("CEP não encontrado.");
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
        alert("Erro ao buscar CEP. Verifique sua conexão.");
      } finally {
        setLoadingCEP(false);
      }
    }
  };

  const listaDeUFs = [
    { label: 'Acre', value: 'AC' },
    { label: 'Alagoas', value: 'AL' },
    { label: 'Amapá', value: 'AP' },
    { label: 'Amazonas', value: 'AM' },
    { label: 'Bahia', value: 'BA' },
    { label: 'Ceará', value: 'CE' },
    { label: 'Distrito Federal', value: 'DF' },
    { label: 'Espírito Santo', value: 'ES' },
    { label: 'Goiás', value: 'GO' },
    { label: 'Maranhão', value: 'MA' },
    { label: 'Mato Grosso', value: 'MT' },
    { label: 'Mato Grosso do Sul', value: 'MS' },
    { label: 'Minas Gerais', value: 'MG' },
    { label: 'Pará', value: 'PA' },
    { label: 'Paraíba', value: 'PB' },
    { label: 'Paraná', value: 'PR' },
    { label: 'Pernambuco', value: 'PE' },
    { label: 'Piauí', value: 'PI' },
    { label: 'Rio de Janeiro', value: 'RJ' },
    { label: 'Rio Grande do Norte', value: 'RN' },
    { label: 'Rio Grande do Sul', value: 'RS' },
    { label: 'Rondônia', value: 'RO' },
    { label: 'Roraima', value: 'RR' },
    { label: 'Santa Catarina', value: 'SC' },
    { label: 'São Paulo', value: 'SP' },
    { label: 'Sergipe', value: 'SE' },
    { label: 'Tocantins', value: 'TO' }
  ];

  const placeholderEstado = {
    label: 'Selecione o estado em que reside',
    value: null,
  };

  const listaDeTipos = [
    { label: 'Psicólogo(a)', value: 'psicologa' },
    { label: 'Psiquiatra', value: 'psiquiatra' },
    { label: 'Psicopedagogo(a)', value: 'psicopedagoga' },
    { label: 'Fonoaudióloga', value: 'fonoaudiologa' },
    { label: 'Terapeuta Ocupacional', value: 'terapeuta_ocupacional' }
  ];

  const placeholderTipo = {
    label: 'Selecione a sua área de atuação',
    value: null,
  };

  function formatDateToTimeString(dateInput) {
    try {
      const date = new Date(dateInput); 
      if (isNaN(date)) { 
        throw new Error('Hora de expediente inválida');
      }
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    } catch (e) {
      console.error("Erro ao formatar hora:", e);
      return null; 
    }
  }

  const defaultStartTime = new Date();
  defaultStartTime.setHours(8, 0, 0);

  const defaultEndTime = new Date();
  defaultEndTime.setHours(17, 0, 0);

  const [responsavel, setResponsavel] = useState(false);

  const [tipo, setTipo] = useState('');
  const [conselho, setConselho] = useState('');
  const [conselhoNmro, setConselhoNmro] = useState('');
  const [descricao, setDescricao] = useState('');
  const [precoConsulta, setPrecoConsulta] = useState('');
  const [duracaoConsulta, setDuracaoConsulta] = useState('');
  const [diasDeTrabalho, setDiasDeTrabalho] = useState([]);
  const [expedienteInicio, setExpedienteInicio] = useState(defaultStartTime);
  const [expedienteFim, setExpedienteFim] = useState(defaultEndTime);

  const [precoDisplay, setPrecoDisplay] = useState('');
  const [duracaoDisplay, setDuracaoDisplay] = useState('');

  const handlePrecoChange = (text) => {
    const cleaned = text.replace(/\D/g, '');
    setPrecoConsulta(cleaned);
    if (cleaned === '') {
      setPrecoDisplay('');
    } else {
      setPrecoDisplay(`R$ ${cleaned}`);
    }
  };

  const handleDuracaoChange = (text) => {
    setDuracaoConsulta(text.replace(/\D/g, ''));
  };

  const [condicoes, setCondicoes] = useState([]);
  const [condicoesSelecionadas, setCondicoesSelecionadas] = useState([]);
  const [convenios, setConvenios] = useState([]);
  const [conveniosSelecionados, setConveniosSelecionados] = useState([]);

	const [pontTesteA, setPontTesteA] = useState(Array(5).fill(null));
	const [pontTesteB, setPontTesteB] = useState(Array(5).fill(null));
	const [pontTesteC, setPontTesteC] = useState(Array(3).fill(null));
	const [pontTesteD, setPontTesteD] = useState(Array(5).fill(null));

	const stepsByType = {
		paciente: 7,
		especialista: 9,
	};

  //MULTI-STEP-PROGRESS
  const [step, setStep] = useState(1);
  const totalSteps = stepsByType[tipoUsuario];
  const progress = (step / totalSteps) * 100;

  //Button to go to the next step
  const handleNext = () => {
    setStep((prevStep) => Math.min(prevStep + 1, totalSteps));
  };

  //Button to go back to the previous step
  const handlePrevious = () => {
    setStep((prevStep) => Math.max(prevStep - 1, 1));
  };

  //Progress step indicator
  const renderStepIndicator = (currentStep) => {
    const indicators = [];
    for (let i = 1; i <= totalSteps; i++) {
      indicators.push(
        <View key={i} className="flex-row items-center shadow-sm">
          <View
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
              i <= step ? 'border-orange bg-orange w-7 h-7' : 'border-white bg-white'
            }`}
          >
            <Text className={`font-bold ${i <= step ? 'text-white' : 'text-gray-200'}`}>
              {i}
            </Text>
          </View>
          {i < totalSteps && (
            <View
              className={`h-0.5 flex-1 ${
                i < step ? 'bg-orange' : 'bg-white'
              } mx-1`}
            />
          )}
        </View>
      );
    }
    return indicators;
  };

	const stepTitlesByType = {
		paciente: [
			"Dados pessoais",
			"Endereço",
      "Condições mentais",         
			"Teste de preferências - Etapa A",           
			"Teste de preferências - Etapa B",              
			"Teste de preferências - Etapa C",                  
			"Teste de preferências - Etapa D",     
		],
		especialista: [
			"Dados pessoais",   
			"Endereço",         
			"Especialização e conselho",      
			"Consultas e horário de trabalho",           
			"Especialidades e convênios",
			"Teste de preferências - Etapa A",    
			"Teste de preferências - Etapa B",       
			"Teste de preferências - Etapa C",            
			"Teste de preferências - Etapa D",                  
		]
	};

    // Dynamic titles of the steps
  const getStepText = (step, userType) => {
    const titles = stepTitlesByType[userType];

    return titles[step - 1] || "Título não encontrado";
  };

  //TAGS
  const [visibleSections, setVisibleSections] = useState({
    condicoes: true,
    convenios: false 
  });

  //Toggle section of tags
  const toggleSection = (section) => {
    setVisibleSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };  

  //Toggle function of the tags
  const toggleTag = (tagId, type) => {
    const setter = type === 'condicoes' ? setCondicoesSelecionadas : setConveniosSelecionados;
    setter(prevIds =>
      prevIds.includes(tagId) 
        ? prevIds.filter(id => id !== tagId) 
        : [...prevIds, tagId]
    );
  };

  //Render the tags
  const renderTags = (items, type) => {
    const selectedIds = type === 'condicoes' ? condicoesSelecionadas : conveniosSelecionados;
    
    return (
      <>
        {visibleSections[type] && (
          <View className="flex-row flex-wrap w-full">
            {items.map(item => {
              const isSelected = selectedIds.includes(item.nome);
              
              return (
                <Pressable
                  key={item.id}
                  className={`border border-gray-200 px-5 py-1.5 rounded-full mr-2 mb-3 bg-white ${isSelected ? `bg-white border-1 border-dark-orange` : ''}`}
                  onPress={() => toggleTag(item.nome, type)}
                >
                  <Text 
                    style={{ fontFamily: 'Montserrat_500Medium', fontSize: 12 }}
                    className={`text-center font-semibold ${isSelected ? 'text-dark-orange' : 'text-gray-600'}`}>
                    {item.nome}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}
      </>
    );
  };

  useEffect(() => {
      const fetchData = async () => {
          try {
              const condicoesRef = collection(db, "condicoes");
              const conveniosRef = collection(db, "convenios");

              const [condicoesSnapshot, conveniosSnapshot] = await Promise.all([
                  getDocs(condicoesRef),
                  getDocs(conveniosRef)
              ]);

            const listaCondicoes = condicoesSnapshot.docs.map(doc => ({
                id: doc.id,           
                nome: doc.data().nome 
            }));

            const listaConvenios = conveniosSnapshot.docs.map(doc => ({
                id: doc.id,
                nome: doc.data().nome
            }));

              setCondicoes(listaCondicoes);
              setConvenios(listaConvenios);

          } catch (error) {
              console.error("Erro ao buscar dados:", error);
          } finally {
              setLoading(false);
          }
      };

      fetchData();
  }, []);

  const radioOptions = [
  { value: -3, display: '3' },
  { value: -2, display: '2' },
  { value: -1, display: '1' },
  { value: 0, display: '0' },
  { value: 1, display: '1' },
  { value: 2, display: '2' },
  { value: 3, display: '3' }
];

  const handleMudancaResposta = (vetorRespostas, setterVetorRespostas, indexPergunta) => (novoValor) => {
    const novasRespostas = [...vetorRespostas];
    novasRespostas[indexPergunta] = novoValor;
    setterVetorRespostas(novasRespostas);
  };

  const handleWeekDay = (weekday, selected) => {
    if (selected) {
      if (weekday >= 0 && weekday <= 5) {
        setDiasDeTrabalho(diasAnteriores => 
          [...diasAnteriores, weekday + 1]
        );
      } else if (weekday === 6) {
        setDiasDeTrabalho(diasAnteriores => 
          [...diasAnteriores, 0]
        );
      } else {
        alert('Dia inválido!');
      }
    } else {
      if (weekday >= 0 && weekday <= 5) {
        setDiasDeTrabalho(diasAnteriores =>
          diasAnteriores.filter(dia => dia !== weekday + 1)
        );
      } else if (weekday === 6) {
        setDiasDeTrabalho(diasAnteriores =>
          diasAnteriores.filter(dia => dia !== 0)
        );
      } else {
        alert('Dia inválido!');
      }
    }
  };

const handleSignup = async () => {
  const camposObrigatoriosComuns = {
      email, nome, senha, telefone, logradouro, numeroEndereco, bairro, cidade, UF, CEP
  };
  const testesObrigatorios = { pontTesteA, pontTesteB, pontTesteC, pontTesteD };

  let camposObrigatorios = { ...camposObrigatoriosComuns };
  if (tipoUsuario === 'especialista') {
      camposObrigatorios = {
          ...camposObrigatorios,
          tipo, conselho, conselhoNmro
      };
  }

  let camposFaltando = false;
  for (const [key, value] of Object.entries(camposObrigatorios)) {
      if (value === '' || (Array.isArray(value) && value.length === 0)) {
          console.log(`Campo faltando: ${key}`);
          camposFaltando = true;
          break;
      }
  }

  if (!camposFaltando) {
      for (const [key, value] of Object.entries(testesObrigatorios)) {
          if (!Array.isArray(value) || value.some(item => item === null)) {
              console.log(`Teste incompleto: ${key}`);
              camposFaltando = true;
              break;
          }
      }
  }

  if (camposFaltando) {
      Alert.alert('Campos Obrigatórios', 'Por favor, preencha todos os campos obrigatórios e responda a todos os testes antes de cadastrar.');
      return;
  }

  const emailLimpo = email.trim();

  function somador(total, num) {
      return total + num;
  }

  let dadosUsuario = {
      email: emailLimpo,
      nome,
      telefone,
      cor_img_perfil: randomColor({ luminosity: 'light', hue: 'random', format: 'hex' }),
      ativo: true,
      cidade,
      tipo_usuario: tipoUsuario,
      pont_test_a: pontTesteA.map(valor => parseInt(valor, 10)).reduce(somador),
      pont_test_b: pontTesteB.map(valor => parseInt(valor, 10)).reduce(somador),
      pont_test_c: pontTesteC.map(valor => parseInt(valor, 10)).reduce(somador),
      pont_test_d: pontTesteD.map(valor => parseInt(valor, 10)).reduce(somador),
  };

  let enderecoPaciente = null;

  if (tipoUsuario === 'paciente') {
      dadosUsuario.is_responsavel = responsavel;
      dadosUsuario.condicoes_mentais = condicoesSelecionadas;

      enderecoPaciente = {
        logradouro: logradouro,
        numero: numeroEndereco,
        bairro: bairro,
        cidade: cidade,
        uf: UF,
        cep: CEP
      }
  }

  else if (tipoUsuario === 'especialista') {
      const horaInicioFormatada = formatDateToTimeString(expedienteInicio);
      const horaFimFormatada = formatDateToTimeString(expedienteFim);

      if (horaInicioFormatada === null || horaFimFormatada === null) {
          Alert.alert("Erro de Formato", "Horário de expediente inválido.");
          return; 
      }

      dadosUsuario.area = tipo;
      dadosUsuario.conselho = conselho;
      dadosUsuario.conselho_nmro = conselhoNmro;
      dadosUsuario.descricao = descricao;
      dadosUsuario.preco_consulta = parseFloat(precoConsulta);
      dadosUsuario.duracao_consulta = parseInt(duracaoConsulta);
      dadosUsuario.dias_trabalho = diasDeTrabalho;
      dadosUsuario.expediente_inicio = horaInicioFormatada;
      dadosUsuario.expediente_fim = horaFimFormatada;
      dadosUsuario.convenios = conveniosSelecionados;
      dadosUsuario.especialidades = condicoesSelecionadas; 
      dadosUsuario.consultorio = {
          logradouro: logradouro,
          numero: numeroEndereco,
          bairro: bairro,
          cidade: cidade,
          uf: UF,
          cep: CEP
      };
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, emailLimpo, senha);
    const user = userCredential.user;
    
    dadosUsuario.id = user.uid;

    await setDoc(doc(db, "usuarios", user.uid), dadosUsuario);

    if (tipoUsuario === 'paciente' && enderecoPaciente) {
        await setDoc(doc(db, "usuarios", user.uid, "privado", "endereco"), enderecoPaciente);
    }

    if (tipoUsuario === 'paciente') {
      Alert.alert('Cadasto Bem-sucedido!', 'Caso não tenha preenchido todos os dados agora, recomendamos fazer isso assim que possível, para que o app faça melhores indicações de especialistas para você.');
    } else if (tipoUsuario === 'especialista') {
      Alert.alert('Cadasto Bem-sucedido!', 'Caso não tenha preenchido todos os dados agora, recomendamos fazer isso assim que possível, para que o app te recomende para mais pacientes.');
    }

  } catch (error) {
    console.error('Erro ao cadastrar:', error);
    let mensagem = 'Ocorreu um erro ao realizar o cadastro.';
    if (error.code === 'auth/email-already-in-use') mensagem = 'Este e-mail já está cadastrado.';
    if (error.code === 'auth/weak-password') mensagem = 'A senha deve ter pelo menos 6 caracteres.';
    if (error.code === 'auth/invalid-email') mensagemErro = 'O formato do email é inválido.';
    Alert.alert('Erro', mensagem);
  }
};
              

  return (
    <ScrollView className="h-full bg-white">
    <View className="flex-1 h-min-screen">

      {/* Background Image */}
      <ImageBackground source={require('./../assets/images/bg3.png')} resizeMode="cover" imageStyle= {{opacity:0.3}}>

      <TouchableOpacity 
        onPress={() => navigation.goBack()} 
        className="absolute top-14 left-5 z-50 p-2 bg-white/40 rounded-full"
      >
        <ArrowLeftIcon size={24} color="black" />
      </TouchableOpacity>

      {/* Fixed top bar */}
      <View className="pt-12 pb-10">
  
        {/* Title */}
        <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(16)}}
        className="text-center mt-8 shadow-md">Cadastre-se no sistema</Text>

        {/* Title of the step */}
        <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(20) }}
        className="text-center mt-1 color-orange shadow-md">{getStepText(step, tipoUsuario)}</Text>

        {/* Progress Bar */}
        <View className="flex-row items-center justify-center my-5 w-10 mx-auto">
          {renderStepIndicator(step)}
        </View>

      </View>

      </ImageBackground>

      {/* Step 1 */}
       {step === 1 && (
          <View className="flex-1 p-8 bg-white rounded-t-3xl shadow-xl -mt-8">

              {/* Tipo Usuário */}
                <View className="mb-6">
                  <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(16)}} className="mb-2">
                    Tipo de Usuário
                    <Text style={{ fontFamily: 'Montserrat_800ExtraBold', fontSize: getFontSize(16)}} className="text-red-600"> *</Text>
                  </Text>

                  <View className="flex-row">
                    <TouchableOpacity
                      className={`mt-2 py-2 px-5 rounded-full shadow-sm mr-5 ${tipoUsuario === 'paciente' ? 'bg-orange' : 'bg-white'}`}
                      onPress={() => setTipoUsuario('paciente')}>

                      <Text style={{ fontFamily: 'Montserrat_500Medium', fontSize: getFontSize(14) }}
                      className={`${tipoUsuario === 'paciente' ? 'text-white' : 'text-black'}`}>Paciente</Text>

                    </TouchableOpacity>

                    <TouchableOpacity
                      className={`mt-2 py-2 px-5 rounded-full shadow-sm ${tipoUsuario === 'especialista' ? 'bg-orange' : 'bg-white'}`}
                      onPress={() => setTipoUsuario('especialista')}>

                      <Text style={{ fontFamily: 'Montserrat_500Medium', fontSize: getFontSize(14)}}
                      className={`${tipoUsuario === 'especialista' ? 'text-white' : 'text-black'}`}>Especialista</Text>
                    </TouchableOpacity>
                  </View>

                </View>

              {/* E-mail */}
                <View className="mb-6">
                <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(16)}} className= "mb-3">
                  E-mail
                  <Text style={{ fontFamily: 'Montserrat_800ExtraBold', fontSize: getFontSize(16)}} className="text-red-600"> *</Text>
                </Text>
                  <TextInput
                    className="border border-gray-200 rounded-full py-3 px-6 shadow-sm bg-white"
                    placeholder="Digite o seu e-mail"
                    value={email}
                    onChangeText={setEmail}
                    inputMode="email"
                    style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(14)}}
                  />
                </View>

              {/* Nome */}
                <View className="mb-6">
                <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(16)}} className= "mb-3">
                  Nome
                  <Text style={{ fontFamily: 'Montserrat_800ExtraBold', fontSize: getFontSize(16)}} className="text-red-600"> *</Text>
                </Text>
                  <TextInput
                    className="border border-gray-200 rounded-full py-3 px-6 shadow-sm bg-white"
                    placeholder="Digite o seu nome"
                    value={nome}
                    onChangeText={setNome}
                    style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(14)}}
                  />
                </View>

              {/* Senha */}
                <View className="mb-6">
                <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(16)}} className= "mb-3">
                  Senha
                  <Text style={{ fontFamily: 'Montserrat_800ExtraBold', fontSize: getFontSize(16)}} className="text-red-600"> *</Text>
                </Text>
                  <TextInput
                    className="border border-gray-200 rounded-full py-3 px-6 shadow-sm bg-white"
                    placeholder="Digite a sua senha"
                    value={senha}
                    onChangeText={setSenha}
                    secureTextEntry={true}
                    style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(14)}}
                  />
                </View>

              {/* Telefone */}
                <View className="mb-6">
                <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(16)}} className= "mb-3">
                  Telefone
                  <Text style={{ fontFamily: 'Montserrat_800ExtraBold', fontSize: getFontSize(16)}} className="text-red-600"> *</Text>
                </Text>
                  <TextInput
                    className="border border-gray-200 rounded-full py-3 px-6 shadow-sm bg-white"
                    placeholder="Digite o seu número de telefone"
                    value={telefoneDisplay}
                    onChangeText={handleTelefoneChange}
                    inputMode="numeric"
                    keyboardType="numeric"
                    maxLength={15}
                    style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(14)}}
                  />
                </View>

              {tipoUsuario === 'paciente' && (
                <View className="mb-6">
                <CustomCheckbox
                  label="Esta conta está sendo criada por um responsável?"
                  value={responsavel}
                  onValueChange={setResponsavel}
                  color="#FFA500"
                />
                </View>
              )}

              <View className="flex justify-center items-end -mr-2">
                <TouchableOpacity 
                  onPress={handleNext} 
                  className="py-2 px-3 bg-orange rounded-full">
                  <Text 
                    style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(14)}} 
                    className="font-bold text-center text-white">
                    Prosseguir
                  </Text>
                </TouchableOpacity>
              </View>
          </View>
        )}

      {/* Step 2 */}
      {step === 2 && (
            <View className="flex-1 p-8 bg-white rounded-t-3xl shadow-xl -mt-8">
              {/* Back Button */}
              <View className="flex-row justify-center justify-between -mt-2 -mr-2 mb-7">
                <TouchableOpacity 
                  onPress={handlePrevious} 
                  className="py-1 bg-white border border-gray-400 rounded-full w-20">
                  <Text 
                    style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(14)}} 
                    className="font-bold text-center text-gray-400">
                    Voltar
                  </Text>
                </TouchableOpacity>
              </View>

              {/* CEP */}
            <View className="mb-6">
                <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(16)}} className= "mb-3">
                  CEP
                  <Text style={{ fontFamily: 'Montserrat_800ExtraBold', fontSize: getFontSize(16)}} className="text-red-600"> *</Text>
                </Text>
                  <View className="flex-row items-center border border-gray-200 rounded-full py-3 px-6 shadow-sm bg-white">
                    <TextInput
                      placeholder="Digite o CEP de onde reside"
                      value={CEPDisplay}
                      onChangeText={handleCEPChange}
                      inputMode="numeric"
                      keyboardType="numeric"
                      maxLength={9}
                      className="flex-1"
                      style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(14)}}
                    />

                    {loadingCEP && (
                      <ActivityIndicator size="small" color="#ffbf00" className="ml-2" />
                    )}
                  </View>
            </View>
              
            {/* Logradouro */}
            <View className="mb-6">
                <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(16)}} className= "mb-3">
                  Logradouro
                  <Text style={{ fontFamily: 'Montserrat_800ExtraBold', fontSize: getFontSize(16)}} className="text-red-600"> *</Text>
                </Text>
                  <TextInput
                    className="border border-gray-200 rounded-full py-3 px-6 shadow-sm bg-white"
                    placeholder="Digite o logradouro de sua residência"
                    value={logradouro}
                    onChangeText={setLogradouro}
                    style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(14)}}
                  />
            </View>

            {/* Número */}
            <View className="mb-6">
                <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(16)}} className= "mb-3">
                  Número
                  <Text style={{ fontFamily: 'Montserrat_800ExtraBold', fontSize: getFontSize(16)}} className="text-red-600"> *</Text>
                </Text>
                  <TextInput
                    className="border border-gray-200 rounded-full py-3 px-6 shadow-sm bg-white"
                    placeholder="Digite o número de sua residência"
                    value={numeroEndereco}
                    onChangeText={setNumeroEndereco}
                    inputMode="numeric"
                    keyboardType="numeric"
                    style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(14)}}
                  />
            </View>

            {/* Bairro */}
            <View className="mb-6">
                <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(16)}} className= "mb-3">
                  Bairro
                  <Text style={{ fontFamily: 'Montserrat_800ExtraBold', fontSize: getFontSize(16)}} className="text-red-600"> *</Text>
                </Text>
                  <TextInput
                    className="border border-gray-200 rounded-full py-3 px-6 shadow-sm bg-white"
                    placeholder="Digite o bairro em que reside"
                    value={bairro}
                    onChangeText={setBairro}
                    style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(14)}}
                  />
            </View>

            {/* Cidade */}
            <View className="mb-6">
                <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(16)}} className= "mb-3">
                  Cidade
                  <Text style={{ fontFamily: 'Montserrat_800ExtraBold', fontSize: getFontSize(16)}} className="text-red-600"> *</Text>
                </Text>
                  <TextInput
                    className="border border-gray-200 rounded-full py-3 px-6 shadow-sm bg-white"
                    placeholder="Digite a cidade em que reside"
                    value={cidade}
                    onChangeText={setCidade}
                    style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(14)}}
                  />
            </View>

            {/* UF */}
            <View className="mb-6">
                <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(16)}} className= "mb-3">
                  Estado
                  <Text style={{ fontFamily: 'Montserrat_800ExtraBold', fontSize: getFontSize(16)}} className="text-red-600"> *</Text>
                </Text>
                  <Dropdown
                    className="border border-gray-200 rounded-full py-1 px-1 shadow-sm bg-white"
                    onValueChange={setUF}
                    items={listaDeUFs}
                    placeholder={placeholderEstado}
                    value={UF}
                    style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(14)}}
                  />
            </View>

            <View className="flex justify-center items-end -mr-2">
                <TouchableOpacity 
                  onPress={handleNext} 
                  className="py-2 px-3 bg-orange rounded-full">
                  <Text 
                    style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(14)}} 
                    className="font-bold text-center text-white">
                    Prosseguir
                  </Text>
                </TouchableOpacity>
              </View>
  
          </View>
      )}

      {/* Step 3 */}
      {step === 3 && tipoUsuario === 'especialista' && (
           <View className="flex-1 p-8 bg-white rounded-t-3xl shadow-xl -mt-8">

            <View className="flex-row justify-center justify-between -mt-2 -mr-2 mb-7">
                {/* Back Button */}
                <TouchableOpacity 
                  onPress={handlePrevious} 
                  className="py-1 bg-white border border-gray-400 rounded-full w-20">
                  <Text 
                    style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(14)}} 
                    className="font-bold text-center text-gray-400">
                    Voltar
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Especialidade */}
            <View className="mb-6">
                <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(16)}} className= "mb-3">
                  Área de Atuação
                  <Text style={{ fontFamily: 'Montserrat_800ExtraBold', fontSize: getFontSize(16)}} className="text-red-600"> *</Text>
                </Text>
                  <Dropdown
                    className="border border-gray-200 rounded-full py-1 px-1 shadow-sm bg-white"
                    onValueChange={setTipo}
                    items={listaDeTipos}
                    placeholder={placeholderTipo}
                    value={tipo}
                    style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(14)}}
                  />
            </View>

            {/* Conselho */}
            <View className="mb-6">
                <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(16)}} className= "mb-3">
                  Conselho
                  <Text style={{ fontFamily: 'Montserrat_800ExtraBold', fontSize: getFontSize(16)}} className="text-red-600"> *</Text>
                </Text>
                  <TextInput
                    className="border border-gray-200 rounded-full py-3 px-6 shadow-sm bg-white"
                    placeholder="Digite a sigla do conselho"
                    value={conselho}
                    onChangeText={setConselho}
                    style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(14)}}
                  />
            </View>

            {/* Conselho */}
            <View className="mb-6">
                <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(16)}} className= "mb-3">
                  Número de Registro no Conselho
                  <Text style={{ fontFamily: 'Montserrat_800ExtraBold', fontSize: getFontSize(16)}} className="text-red-600"> *</Text>
                </Text>
                  <TextInput
                    className="border border-gray-200 rounded-full py-3 px-6 shadow-sm bg-white"
                    placeholder="Digite o seu número no conselho"
                    value={conselhoNmro}
                    onChangeText={setConselhoNmro}
                    style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(14)}}
                  />
            </View>

            {/* Descrição */}
              <View className="mb-6">
                <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(16)}}
                className="mb-3">Descrição</Text>
                <TextInput
                  className="border border-gray-200 rounded-xl shadow-sm py-3 px-6 h-48 bg-white"
                  placeholder="Descreva-se enquanto profissional"
                  multiline
                  value={descricao}
                  onChangeText={setDescricao}
                  style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(14)}}
                />
              </View>

              <View className="flex justify-center items-end -mr-2">
                <TouchableOpacity 
                  onPress={handleNext} 
                  className="py-2 px-3 bg-orange rounded-full">
                  <Text 
                    style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(14)}} 
                    className="font-bold text-center text-white">
                    Prosseguir
                  </Text>
                </TouchableOpacity>
              </View>

            </View>
        )}

        {step === 4 && tipoUsuario === 'especialista' && (
           <View className="flex-1 p-8 bg-white rounded-t-3xl shadow-xl -mt-8">

            <View className="flex-row justify-center justify-between -mt-2 -mr-2 mb-7">
                {/* Back Button */}
                <TouchableOpacity 
                  onPress={handlePrevious} 
                  className="py-1 bg-white border border-gray-400 rounded-full w-20">
                  <Text 
                    style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(14)}} 
                    className="font-bold text-center text-gray-400">
                    Voltar
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Valor Consulta */}
            <View className="mb-6">
              <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(16)}}className= "mb-3">
                Valor da Consulta
                <Text style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(14)}} className= "mb-3"> (em reais)</Text>
              </Text>
                <TextInput
                  className="border border-gray-200 rounded-full py-3 px-6 shadow-sm bg-white"
                  value={precoDisplay}
                  onChangeText={handlePrecoChange}
                  inputMode="numeric"
                  keyboardType="numeric"
                  style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(14)}}
              />
            </View>

              {/* Duração Consulta */}
            <View className="mb-6">
              <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(16)}} className= "mb-3">
                Duração da Consulta
                <Text style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(14)}} className= "mb-3"> (em minutos)</Text>
              </Text>
              <View className="flex-row items-center border border-gray-200 rounded-full py-3 px-6 shadow-sm bg-white justify-start">
                <TextInput
                  value={duracaoConsulta}
                  onChangeText={handleDuracaoChange}
                  inputMode="numeric"
                  keyboardType="numeric"
                  className="text-left w-6"
                  style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(14)}}
                />

                {duracaoConsulta ? (
                  <Text className="text-gray-500 font-montMedium ml-1">
                    min
                  </Text>
                ) : null}
              </View>
            </View>

            {/* Dias de Trabalho */}
            <View className="mb-6">
              <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(16)}}
                className= "mb-3">Dias de Trabalho</Text>
                <WeekdaySelector 
                  onPress={handleWeekDay}
                  bgColor="#ff7900"
                />
            </View>

            {/* Início e Fim do Expediente */}
            <View className="mb-6">
              <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(16)}}
                className= "mb-3">Horário de Trabalho</Text>
                <TimeRangePicker
                  startTime={expedienteInicio}
                  endTime={expedienteFim}
                  onStartTimeChange={setExpedienteInicio}
                  onEndTimeChange={setExpedienteFim}
                />
            </View>

            <View className="flex justify-center items-end -mr-2">
                <TouchableOpacity 
                  onPress={handleNext} 
                  className="py-2 px-3 bg-orange rounded-full">
                  <Text 
                    style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(14)}} 
                    className="font-bold text-center text-white">
                    Prosseguir
                  </Text>
                </TouchableOpacity>
              </View>

            </View>
        )}

        {/* Step 5 */}
      {step === 5 && tipoUsuario === 'especialista' && (
           <View className="flex-1 p-8 bg-white rounded-t-3xl shadow-xl -mt-8">

            <View className="flex-row justify-center justify-between -mt-2 -mr-2 mb-7">
                {/* Back Button */}
                <TouchableOpacity 
                  onPress={handlePrevious} 
                  className="py-1 bg-white border border-gray-400 rounded-full w-20">
                  <Text 
                    style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(14)}} 
                    className="font-bold text-center text-gray-400">
                    Voltar
                  </Text>
                </TouchableOpacity>
              </View>

             {/* Seletores */}
            <View>
              {/* Seletor de condições */}
              <TouchableOpacity onPress={() => toggleSection('condicoes')} className="flex-row justify-between items-center mx-8">
                <View className="flex-row mb-5">
                    <View className="ml-3 mt-1">
                      <Text style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(12)}}
                      className="-mb-1 ">Escolha as condições mentais em que você tem</Text>

                      <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(16)}}
                      className="mt-1">Especialidade</Text>
                    </View>
                </View>
            
                <Image className="-mt-4"
                  source={visibleSections.condicoes ? require('../assets/icons/up.png') : require('../assets/icons/down.png')}
                  style={{ width: 13, height: 13 }} 
                />
              </TouchableOpacity>

              <View className="px-5">
                {renderTags(condicoes, 'condicoes')}
              </View>

              {/* Line */}
              <View className="border-b border-gray-100 mt-5" />
  
              {/* Seletor de Convenios */}
              <TouchableOpacity onPress={() => toggleSection('convenios')} className="flex-row justify-between items-center my-5 mx-8">
                <View className="flex-row mb-1">
                    <View className="ml-3 mt-1">
                     <Text style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(12)}}
                      className="-mb-1 ">Você também atende por quais</Text>

                      <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(16)}}
                      className="mt-1">Convênios</Text>
                    </View>
                </View>
                
                <Image
                  source={visibleSections.convenios ? require('../assets/icons/up.png') : require('../assets/icons/down.png')}
                  style={{ width: 13, height: 13 }} 
                />
              </TouchableOpacity>

              <View className="px-5">
                {renderTags(convenios, 'convenios')}
              </View>

              </View>

              <View className="flex justify-center items-end -mr-2">
                <TouchableOpacity 
                  onPress={handleNext} 
                  className="py-2 px-3 bg-orange rounded-full">
                  <Text 
                    style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(14)}} 
                    className="font-bold text-center text-white">
                    Prosseguir
                  </Text>
                </TouchableOpacity>
              </View>

            </View>
        )}

        {/* Step 5 */}
      {step === 3 && tipoUsuario === 'paciente' && (
           <View className="flex-1 p-8 bg-white rounded-t-3xl shadow-xl -mt-8">

            <View className="flex-row justify-center justify-between -mt-2 -mr-2 mb-7">
                {/* Back Button */}
                <TouchableOpacity 
                  onPress={handlePrevious} 
                  className="py-1 bg-white border border-gray-400 rounded-full w-20">
                  <Text 
                    style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(14)}} 
                    className="font-bold text-center text-gray-400">
                    Voltar
                  </Text>
                </TouchableOpacity>
              </View>

             {/* Seletores */}
            <View>
              {/* Seletor de condições */}
              <TouchableOpacity onPress={() => toggleSection('condicoes')} className="flex-row justify-between items-center mx-8">
                <View className="flex-row mb-5">
                    <View className="ml-3 mt-1">
                      <Text style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(12)}}
                      className="-mb-1 ">Você possui diagnóstico ou acredita ter alguma dessas</Text>

                      <Text style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(16)}}
                      className="mt-1">Condições mentais?</Text>
                    </View>
                </View>
            
                <Image className="-mt-4"
                  source={visibleSections.condicoes ? require('../assets/icons/up.png') : require('../assets/icons/down.png')}
                  style={{ width: 13, height: 13 }} 
                />
              </TouchableOpacity>

              <View className="px-5">
                {renderTags(condicoes, 'condicoes')}
              </View>

              </View>

              <View className="flex justify-center items-end -mr-2">
                <TouchableOpacity 
                  onPress={handleNext} 
                  className="py-2 px-3 bg-orange rounded-full">
                  <Text 
                    style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(14)}} 
                    className="font-bold text-center text-white">
                    Prosseguir
                  </Text>
                </TouchableOpacity>
              </View>

            </View>
        )}

        {/* Step 6 */}
      {((step === 4 && tipoUsuario === 'paciente') || (step === 6 && tipoUsuario === 'especialista')) && (
           <View className="flex-1 p-8 bg-white rounded-t-3xl shadow-xl -mt-8">

            <View className="flex-row justify-center justify-between -mt-2 -mr-2 mb-7">
                {/* Back Button */}
                <TouchableOpacity 
                  onPress={handlePrevious} 
                  className="py-1 bg-white border border-gray-400 rounded-full w-20">
                  <Text 
                    style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(14)}} 
                    className="font-bold text-center text-gray-400">
                    Voltar
                  </Text>
                </TouchableOpacity>
              </View>

            <View className="mb-6">
              <Text style={{ fontFamily: 'Montserrat_800ExtraBold', fontSize: getFontSize(16)}} className= "mb-3">
                {tipoUsuario === 'paciente' ? 'Eu gostaria que o terapeuta...' : 'Ao trabalhar com pacientes, eu prefiro...'}
                <Text style={{ fontFamily: 'Montserrat_800ExtraBold', fontSize: getFontSize(16)}} className="text-red-600"> *</Text>
              </Text>
            </View>

            {/* Questão A-1 */}
            <View className="flex-row items-center bg-white py-4 rounded-xl">
              {/* Texto da Esquerda */}
              <Text 
                style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(11)}} 
                className="flex-1 text-left px-2">
                {tipoUsuario === 'paciente' ? 'Focasse em metas específicas' : 'Focar em metas específicas'}
              </Text>

              {/* Texto do Centro */}
              <Text style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(11)}} 
                className="flex-1 text-center px-2">
                Nenhuma preferência
              </Text>

              {/* Texto da Direita */}
              <Text style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(11)}} 
                className="flex-1 text-right px-2">
                {tipoUsuario === 'paciente' ? 'Não focasse em metas específicas' : 'Não focar em metas específicas'}
              </Text>
            </View> 

            <View className="mb-6">
              <CustomRadioGroup
                items={radioOptions}
                value={pontTesteA[0]}
                onValueChange={handleMudancaResposta(pontTesteA, setPontTesteA, 0)}
              />
            </View>

            {/* Line */}
              <View className="border-b border-gray-100 mt-5" />

              {/* Questão A-2 */}
            <View className="flex-row items-center bg-white py-4 rounded-xl">
              {/* Texto da Esquerda */}
              <Text 
                style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(11)}} 
                className="flex-1 text-left px-2">
                {tipoUsuario === 'paciente' ? 'Desse estrutura a terapia' : 'Dar estrutura a terapia'}
              </Text>

              {/* Texto do Centro */}
              <Text style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(11)}} 
                className="flex-1 text-center px-2">
                Nenhuma preferência
              </Text>

              {/* Texto da Direita */}
              <Text style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(11)}} 
                className="flex-1 text-right px-2">
                {tipoUsuario === 'paciente' ? 'Permitesse que a terapia não tivesse estrutura' : 'Permitir que a terapia não tenha estrutura'}
              </Text>
            </View> 

            <View className="mb-6">
              <CustomRadioGroup
                items={radioOptions}
                value={pontTesteA[1]}
                onValueChange={handleMudancaResposta(pontTesteA, setPontTesteA, 1)}
              />
            </View>

            {/* Line */}
              <View className="border-b border-gray-100 mt-5" />

              {/* Questão A-3 */}
            <View className="flex-row items-center bg-white py-4 rounded-xl">
              {/* Texto da Esquerda */}
              <Text 
                style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(11)}} 
                className="flex-1 text-left px-2">
                {tipoUsuario === 'paciente' ? 'Me ensinasse formas de lidar com os meus problemas' : 'Ensinar aos pacientes formas de lidarem com os seus problemas'}
              </Text>

              {/* Texto do Centro */}
              <Text style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(11)}} 
                className="flex-1 text-center px-2">
                Nenhuma preferência
              </Text>

              {/* Texto da Direita */}
              <Text style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(11)}} 
                className="flex-1 text-right px-2">
                {tipoUsuario === 'paciente' ? 'Não me ensinasse formas de lidar com os meus problemas' : 'Não ensinar aos pacientes formas de lidarem com os seus problemas'}
              </Text>
            </View> 

            <View className="mb-6">
              <CustomRadioGroup
                items={radioOptions}
                value={pontTesteA[2]}
                onValueChange={handleMudancaResposta(pontTesteA, setPontTesteA, 2)}
              />
            </View>

            {/* Line */}
              <View className="border-b border-gray-100 mt-5" />

              {/* Questão A-4 */}
            <View className="flex-row items-center bg-white py-4 rounded-xl">
              {/* Texto da Esquerda */}
              <Text 
                style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(11)}} 
                className="flex-1 text-left px-2">
                {tipoUsuario === 'paciente' ? 'Me desse "lição de casa"' : 'Dar aos pacientes "lição de casa"'}
              </Text>

              {/* Texto do Centro */}
              <Text style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(11)}} 
                className="flex-1 text-center px-2">
                Nenhuma preferência
              </Text>

              {/* Texto da Direita */}
              <Text style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(11)}} 
                className="flex-1 text-right px-2">
                {tipoUsuario === 'paciente' ? 'Não me desse "lição de casa"' : 'Não dar aos pacientes "lição de casa"'}
              </Text>
            </View> 

            <View className="mb-6">
              <CustomRadioGroup
                items={radioOptions}
                value={pontTesteA[3]}
                onValueChange={handleMudancaResposta(pontTesteA, setPontTesteA, 3)}
              />
            </View>

            {/* Line */}
              <View className="border-b border-gray-100 mt-5" />

              {/* Questão A-5 */}
            <View className="flex-row items-center bg-white py-4 rounded-xl">
              {/* Texto da Esquerda */}
              <Text 
                style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(11)}} 
                className="flex-1 text-left px-2">
                {tipoUsuario === 'paciente' ? 'Direcionasse a terapia' : 'Direcionar a terapia'}
              </Text>

              {/* Texto do Centro */}
              <Text style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(11)}} 
                className="flex-1 text-center px-2">
                Nenhuma preferência
              </Text>

              {/* Texto da Direita */}
              <Text style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(11)}} 
                className="flex-1 text-right px-2">
                {tipoUsuario === 'paciente' ? 'Me permitir direcionar a terapia' : 'Permitir aos pacientes direcionar a terapia'}
              </Text>
            </View> 

            <View className="mb-6">
              <CustomRadioGroup
                items={radioOptions}
                value={pontTesteA[4]}
                onValueChange={handleMudancaResposta(pontTesteA, setPontTesteA, 4)}
              />
            </View>

            <View className="flex justify-center items-end -mr-2">
                <TouchableOpacity 
                  onPress={handleNext} 
                  className="py-2 px-3 bg-orange rounded-full">
                  <Text 
                    style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(14)}} 
                    className="font-bold text-center text-white">
                    Prosseguir
                  </Text>
                </TouchableOpacity>
              </View>

          </View>
        )}

        {/* Step 7 */}
      {((step === 5 && tipoUsuario === 'paciente') || (step === 7 && tipoUsuario === 'especialista')) && (
           <View className="flex-1 p-8 bg-white rounded-t-3xl shadow-xl -mt-8">

            <View className="flex-row justify-center justify-between -mt-2 -mr-2 mb-7">
                {/* Back Button */}
                <TouchableOpacity 
                  onPress={handlePrevious} 
                  className="py-1 bg-white border border-gray-400 rounded-full w-20">
                  <Text 
                    style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(14)}} 
                    className="font-bold text-center text-gray-400">
                    Voltar
                  </Text>
                </TouchableOpacity>
              </View>

            <View className="mb-6">
              <Text style={{ fontFamily: 'Montserrat_800ExtraBold', fontSize: getFontSize(16)}} className= "mb-3">
                {tipoUsuario === 'paciente' ? 'Eu gostaria que o terapeuta...' : 'Ao trabalhar com pacientes, eu prefiro...'}
                <Text style={{ fontFamily: 'Montserrat_800ExtraBold', fontSize: getFontSize(16)}} className="text-red-600"> *</Text>
              </Text>
            </View>

            {/* Questão B-6 */}
            <View className="flex-row items-center bg-white py-4 rounded-xl">
              {/* Texto da Esquerda */}
              <Text 
                style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(11)}} 
                className="flex-1 text-left px-2">
                {tipoUsuario === 'paciente' ? 'Me encorajasse a me aprofundar em emoções complicadas' : 'Encorajar os pacientes a se aprofundarem em emoções complicadas'}
              </Text>

              {/* Texto do Centro */}
              <Text style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(11)}} 
                className="flex-1 text-center px-2">
                Nenhuma preferência
              </Text>

              {/* Texto da Direita */}
              <Text style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(11)}} 
                className="flex-1 text-right px-2">
                {tipoUsuario === 'paciente' ? 'Não me encorajasse a me aprofundar em emoções complicadas' : 'Não encorajar os pacientes a see aprofundarem em emoções complicadas'}
              </Text>
            </View> 

            <View className="mb-6">
              <CustomRadioGroup
                items={radioOptions}
                value={pontTesteB[0]}
                onValueChange={handleMudancaResposta(pontTesteB, setPontTesteB, 0)}
              />
            </View>

            {/* Line */}
              <View className="border-b border-gray-100 mt-5" />

              {/* Questão B-7 */}
            <View className="flex-row items-center bg-white py-4 rounded-xl">
              {/* Texto da Esquerda */}
              <Text 
                style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(11)}} 
                className="flex-1 text-left px-2">
                {tipoUsuario === 'paciente' ? 'Conversasse comigo sobre a relacionamento entre paciente e especialista' : 'Conversar com os pacientes sobre a relacionamento entre paciente e especialista'}
              </Text>

              {/* Texto do Centro */}
              <Text style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(11)}} 
                className="flex-1 text-center px-2">
                Nenhuma preferência
              </Text>

              {/* Texto da Direita */}
              <Text style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(11)}} 
                className="flex-1 text-right px-2">
                {tipoUsuario === 'paciente' ? 'Não conversasse comigo sobre a relacionamento entre paciente e especialista' : 'Não conversar com os pacientes sobre a relacionamento entre paciente e especialista'}
              </Text>
            </View> 

            <View className="mb-6">
              <CustomRadioGroup
                items={radioOptions}
                value={pontTesteB[1]}
                onValueChange={handleMudancaResposta(pontTesteB, setPontTesteB, 1)}
              />
            </View>

            {/* Line */}
              <View className="border-b border-gray-100 mt-5" />

              {/* Questão B-8 */}
            <View className="flex-row items-center bg-white py-4 rounded-xl">
              {/* Texto da Esquerda */}
              <Text 
                style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(11)}} 
                className="flex-1 text-left px-2">
                {tipoUsuario === 'paciente' ? 'Focasse no relacionamento entre paciente e especialista' : 'Focar no relacionamento entre paciente e especialista'}
              </Text>

              {/* Texto do Centro */}
              <Text style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(11)}} 
                className="flex-1 text-center px-2">
                Nenhuma preferência
              </Text>

              {/* Texto da Direita */}
              <Text style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(11)}} 
                className="flex-1 text-right px-2">
                {tipoUsuario === 'paciente' ? 'Não focasse no relacionamento entre paciente e especialista' : 'Não focar no relacionamento entre paciente e especialista'}
              </Text>
            </View> 

            <View className="mb-6">
              <CustomRadioGroup
                items={radioOptions}
                value={pontTesteB[2]}
                onValueChange={handleMudancaResposta(pontTesteB, setPontTesteB, 2)}
              />
            </View>

            {/* Line */}
              <View className="border-b border-gray-100 mt-5" />

              {/* Questão B-9 */}
            <View className="flex-row items-center bg-white py-4 rounded-xl">
              {/* Texto da Esquerda */}
              <Text 
                style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(11)}} 
                className="flex-1 text-left px-2">
                {tipoUsuario === 'paciente' ? 'Me encorajasse a expressar sentimentos fortes' : 'Encorajar os pacientes a expressarem sentimentos fortes'}
              </Text>

              {/* Texto do Centro */}
              <Text style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(11)}} 
                className="flex-1 text-center px-2">
                Nenhuma preferência
              </Text>

              {/* Texto da Direita */}
              <Text style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(11)}} 
                className="flex-1 text-right px-2">
                {tipoUsuario === 'paciente' ? 'Não me encorajasse a expressar sentimentos fortes' : 'Não encorajar os pacientes a expressarem sentimentos fortes'}
              </Text>
            </View> 

            <View className="mb-6">
              <CustomRadioGroup
                items={radioOptions}
                value={pontTesteB[3]}
                onValueChange={handleMudancaResposta(pontTesteB, setPontTesteB, 3)}
              />
            </View>

            {/* Line */}
              <View className="border-b border-gray-100 mt-5" />

              {/* Questão B-10 */}
            <View className="flex-row items-center bg-white py-4 rounded-xl">
              {/* Texto da Esquerda */}
              <Text 
                style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(11)}} 
                className="flex-1 text-left px-2">
                {tipoUsuario === 'paciente' ? 'Focasse principalmente nos meus sentimentos' : 'Focar principalmente nos sentimentos dos pacientes'}
              </Text>

              {/* Texto do Centro */}
              <Text style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(11)}} 
                className="flex-1 text-center px-2">
                Nenhuma preferência
              </Text>

              {/* Texto da Direita */}
              <Text style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(11)}} 
                className="flex-1 text-right px-2">
                {tipoUsuario === 'paciente' ? 'Não focasse principalmente nos meus sentimentos' : 'Não focar principalmente nos sentimentos dos pacientes'}
              </Text>
            </View> 

            <View className="mb-6">
              <CustomRadioGroup
                items={radioOptions}
                value={pontTesteB[4]}
                onValueChange={handleMudancaResposta(pontTesteB, setPontTesteB, 4)}
              />
            </View>

            <View className="flex justify-center items-end -mr-2">
                <TouchableOpacity 
                  onPress={handleNext} 
                  className="py-2 px-3 bg-orange rounded-full">
                  <Text 
                    style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(14)}} 
                    className="font-bold text-center text-white">
                    Prosseguir
                  </Text>
                </TouchableOpacity>
              </View>

          </View>
        )}

        {/* Step 8 */}
      {((step === 6 && tipoUsuario === 'paciente') || (step === 8 && tipoUsuario === 'especialista')) && (
           <View className="flex-1 p-8 bg-white rounded-t-3xl shadow-xl -mt-8">

            <View className="flex-row justify-center justify-between -mt-2 -mr-2 mb-7">
                {/* Back Button */}
                <TouchableOpacity 
                  onPress={handlePrevious} 
                  className="py-1 bg-white border border-gray-400 rounded-full w-20">
                  <Text 
                    style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(14)}} 
                    className="font-bold text-center text-gray-400">
                    Voltar
                  </Text>
                </TouchableOpacity>
              </View>

            <View className="mb-6">
              <Text style={{ fontFamily: 'Montserrat_800ExtraBold', fontSize: getFontSize(16)}} className= "mb-3">
                {tipoUsuario === 'paciente' ? 'Eu gostaria que o terapeuta...' : 'Ao trabalhar com pacientes, eu prefiro...'}
                <Text style={{ fontFamily: 'Montserrat_800ExtraBold', fontSize: getFontSize(16)}} className="text-red-600"> *</Text>
              </Text>
            </View>

            {/* Questão C-11 */}
            <View className="flex-row items-center bg-white py-4 rounded-xl">
              {/* Texto da Esquerda */}
              <Text 
                style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(11)}} 
                className="flex-1 text-left px-2">
                {tipoUsuario === 'paciente' ? 'Focasse na minha vida no passado' : 'Focar na vida dos pacientes no passado'}
              </Text>

              {/* Texto do Centro */}
              <Text style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(11)}} 
                className="flex-1 text-center px-2">
                Nenhuma preferência
              </Text>

              {/* Texto da Direita */}
              <Text style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(11)}} 
                className="flex-1 text-right px-2">
                {tipoUsuario === 'paciente' ? 'Focasse na minha vida no presente' : 'Focar na vida dos pacientes no presente'}
              </Text>
            </View> 

            <View className="mb-6">
              <CustomRadioGroup
                items={radioOptions}
                value={pontTesteC[0]}
                onValueChange={handleMudancaResposta(pontTesteC, setPontTesteC, 0)}
              />
            </View>

            {/* Line */}
              <View className="border-b border-gray-100 mt-5" />

              {/* Questão C-12 */}
            <View className="flex-row items-center bg-white py-4 rounded-xl">
              {/* Texto da Esquerda */}
              <Text 
                style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(11)}} 
                className="flex-1 text-left px-2">
                {tipoUsuario === 'paciente' ? 'Me ajudasse a refletir sobre a minha infância' : 'Ajudar pacientes a refletirem sobre as suas infâncias'}
              </Text>

              {/* Texto do Centro */}
              <Text style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(11)}} 
                className="flex-1 text-center px-2">
                Nenhuma preferência
              </Text>

              {/* Texto da Direita */}
              <Text style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(11)}} 
                className="flex-1 text-right px-2">
                {tipoUsuario === 'paciente' ? 'Me ajudasse a refletir sobre a minha fase atual da vida' : 'Ajudar pacientes a refletirem sobre a fase atual de suas vidas'}
              </Text>
            </View> 

            <View className="mb-6">
              <CustomRadioGroup
                items={radioOptions}
                value={pontTesteC[1]}
                onValueChange={handleMudancaResposta(pontTesteC, setPontTesteC, 1)}
              />
            </View>

            {/* Line */}
              <View className="border-b border-gray-100 mt-5" />

              {/* Questão C-13 */}
            <View className="flex-row items-center bg-white py-4 rounded-xl">
              {/* Texto da Esquerda */}
              <Text 
                style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(11)}} 
                className="flex-1 text-left px-2">
                {tipoUsuario === 'paciente' ? 'Focasse no meu passado' : 'Focar no passado dos pacientes'}
              </Text>

              {/* Texto do Centro */}
              <Text style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(11)}} 
                className="flex-1 text-center px-2">
                Nenhuma preferência
              </Text>

              {/* Texto da Direita */}
              <Text style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(11)}} 
                className="flex-1 text-right px-2">
                {tipoUsuario === 'paciente' ? 'Focasse no meu presente' : 'Focar no presente dos pacientes'}
              </Text>
            </View> 

            <View className="mb-6">
              <CustomRadioGroup
                items={radioOptions}
                value={pontTesteC[2]}
                onValueChange={handleMudancaResposta(pontTesteC, setPontTesteC, 2)}
              />
            </View>

            <View className="flex justify-center items-end -mr-2">
                <TouchableOpacity 
                  onPress={handleNext} 
                  className="py-2 px-3 bg-orange rounded-full">
                  <Text 
                    style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(14)}} 
                    className="font-bold text-center text-white">
                    Prosseguir
                  </Text>
                </TouchableOpacity>
              </View>

          </View>
        )}
        
        {/* Step 9 */}
      {((step === 7 && tipoUsuario === 'paciente') || (step === 9 && tipoUsuario === 'especialista')) && (
           <View className="flex-1 p-8 bg-white rounded-t-3xl shadow-xl -mt-8">

            <View className="flex-row justify-center justify-between -mt-2 -mr-2 mb-7">
                {/* Back Button */}
                <TouchableOpacity 
                  onPress={handlePrevious} 
                  className="py-1 bg-white border border-gray-400 rounded-full w-20">
                  <Text 
                    style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(14)}} 
                    className="text-center text-gray-400">
                    Voltar
                  </Text>
                </TouchableOpacity>
              </View>

            <View className="mb-6">
              <Text style={{ fontFamily: 'Montserrat_800ExtraBold', fontSize: getFontSize(16)}} className= "mb-3">
                {tipoUsuario === 'paciente' ? 'Eu gostaria que o terapeuta...' : 'Ao trabalhar com pacientes, eu prefiro...'}
                <Text style={{ fontFamily: 'Montserrat_800ExtraBold', fontSize: getFontSize(16)}} className="text-red-600"> *</Text>
              </Text>
            </View>

            {/* Questão D-14 */}
            <View className="flex-row items-center bg-white py-4 rounded-xl">
              {/* Texto da Esquerda */}
              <Text 
                style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(11)}} 
                className="flex-1 text-left px-2">
                {tipoUsuario === 'paciente' ? 'Fosse gentil' : 'Ser gentil'}
              </Text>

              {/* Texto do Centro */}
              <Text style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(11)}} 
                className="flex-1 text-center px-2">
                Nenhuma preferência
              </Text>

              {/* Texto da Direita */}
              <Text style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(11)}} 
                className="flex-1 text-right px-2">
                {tipoUsuario === 'paciente' ? 'Me desafiasse' : 'Desafiar os pacientes'}
              </Text>
            </View> 

            <View className="mb-6">
              <CustomRadioGroup
                items={radioOptions}
                value={pontTesteD[0]}
                onValueChange={handleMudancaResposta(pontTesteD, setPontTesteD, 0)}
              />
            </View>

            {/* Line */}
              <View className="border-b border-gray-100 mt-5" />

              {/* Questão D-15 */}
            <View className="flex-row items-center bg-white py-4 rounded-xl">
              {/* Texto da Esquerda */}
              <Text 
                style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(11)}} 
                className="flex-1 text-left px-2">
                {tipoUsuario === 'paciente' ? 'Me apoiasse' : 'Apoiar os pacientes'}
              </Text>

              {/* Texto do Centro */}
              <Text style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(11)}} 
                className="flex-1 text-center px-2">
                Nenhuma preferência
              </Text>

              {/* Texto da Direita */}
              <Text style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(11)}} 
                className="flex-1 text-right px-2">
                {tipoUsuario === 'paciente' ? 'Me confrontasse' : 'Confrontar os pacientes'}
              </Text>
            </View> 

            <View className="mb-6">
              <CustomRadioGroup
                items={radioOptions}
                value={pontTesteD[1]}
                onValueChange={handleMudancaResposta(pontTesteD, setPontTesteD, 1)}
              />
            </View>

            {/* Line */}
              <View className="border-b border-gray-100 mt-5" />

              {/* Questão D-16 */}
            <View className="flex-row items-center bg-white py-4 rounded-xl">
              {/* Texto da Esquerda */}
              <Text 
                style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(11)}} 
                className="flex-1 text-left px-2">
                {tipoUsuario === 'paciente' ? 'Não me interrompesse' : 'Não interromper pacientes'}
              </Text>

              {/* Texto do Centro */}
              <Text style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(11)}} 
                className="flex-1 text-center px-2">
                Nenhuma preferência
              </Text>

              {/* Texto da Direita */}
              <Text style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(11)}} 
                className="flex-1 text-right px-2">
                {tipoUsuario === 'paciente' ? 'Me interrompesse e me mantivesse focado(a)' : 'Interromper pacientes e mantê-los focados(as)'}
              </Text>
            </View> 

            <View className="mb-6">
              <CustomRadioGroup
                items={radioOptions}
                value={pontTesteD[2]}
                onValueChange={handleMudancaResposta(pontTesteD, setPontTesteD, 2)}
              />
            </View>

            {/* Line */}
              <View className="border-b border-gray-100 mt-5" />

              {/* Questão D-17 */}
            <View className="flex-row items-center bg-white py-4 rounded-xl">
              {/* Texto da Esquerda */}
              <Text 
                style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(11)}} 
                className="flex-1 text-left px-2">
                {tipoUsuario === 'paciente' ? 'Não desafiasse minhas crenças e opiniões' : 'Não desafiar as crenças e opiniões de pacientes'}
              </Text>

              {/* Texto do Centro */}
              <Text style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(11)}} 
                className="flex-1 text-center px-2">
                Nenhuma preferência
              </Text>

              {/* Texto da Direita */}
              <Text style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(11)}} 
                className="flex-1 text-right px-2">
                {tipoUsuario === 'paciente' ? 'Desafiasse minhas crenças e opiniões' : 'Desafiar as crenças e opiniões de pacientes'}
              </Text>
            </View> 

            <View className="mb-6">
              <CustomRadioGroup
                items={radioOptions}
                value={pontTesteD[3]}
                onValueChange={handleMudancaResposta(pontTesteD, setPontTesteD, 3)}
              />
            </View>

            {/* Line */}
              <View className="border-b border-gray-100 mt-5" />

              {/* Questão D-18 */}
            <View className="flex-row items-center bg-white py-4 rounded-xl">
              {/* Texto da Esquerda */}
              <Text 
                style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(11)}} 
                className="flex-1 text-left px-2">
                {tipoUsuario === 'paciente' ? 'Apoiasse o meu comportamento incondicionalmente' : 'Apoiar o comportamento de pacientes\nincondicionalmente'}
              </Text>

              {/* Texto do Centro */}
              <Text style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(11)}} 
                className="flex-1 text-center px-2">
                Nenhuma preferência
              </Text>

              {/* Texto da Direita */}
              <Text style={{ fontFamily: 'Montserrat_400Regular', fontSize: getFontSize(11)}} 
                className="flex-1 text-right px-2">
                {tipoUsuario === 'paciente' ? 'Desafiar o meu comportamento caso ele(a) acha que está errado' : 'Desafiar o comportamento de pacientes caso eu ache que ele está errado'}
              </Text>
            </View> 

            <View className="mb-6">
              <CustomRadioGroup
                items={radioOptions}
                value={pontTesteD[4]}
                onValueChange={handleMudancaResposta(pontTesteD, setPontTesteD, 4)}
              />
            </View>

            <View className="flex justify-center items-end -mr-2">
                <TouchableOpacity 
                  onPress={handleSignup}  
                  className="py-2 px-3 bg-orange rounded-full">
                  <Text 
                    style={{ fontFamily: 'Montserrat_600SemiBold', fontSize: getFontSize(14)}} 
                    className="font-bold text-center text-white">
                    Cadastrar
                  </Text>
                </TouchableOpacity>
              </View>

          </View>
        )}

  </View>
  </ScrollView>
  )
}