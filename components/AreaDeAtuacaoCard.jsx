import { View, Text, Image, ImageBackground} from 'react-native';
import Animated from 'react-native-reanimated';
import { FlipInEasyX } from 'react-native-reanimated';

export const AreaDeAtuacaoCard = ({ areaDeAtuacao }) => {
  const nome = {
    psicologia: "Psicologia",
    psiquiatria: "Psiquiatria",
    psicopedagogia: "Psicopedagogia",
    fonoaudiologia: "Fonoaudiologia",
    terapiaOcupacional: "Terapia Ocupacional"
  }

  const texto = {
    psicologia: "O(a) psicólogo(a) é responsável por tratar distúrbios psicológicos e emocionais, ajudando indivíduos a entenderem e lidarem com suas emoções, comportamentos e problemas psicológicos.",
    psiquiatria: "O(a) psiquiatra é responsável por realizar o diagnóstico, tratamento e acompanhamento de transtornos mentais, também podendo prescrever medicamentos após consultas.",
    psicopedagogia: "O(a) psicopedagogo(a) tem como objetivo identificar possíveis problemas no aprendizado, orientando sobre a sua prevenção, além de diagnosticar e até mesmo corrigir patologias do aprendizado.",
    fonoaudiologia: "O(a) fonoaudiólogo(a) atende pacientes com dificuldades na fala, audição, voz e linguagem, como atrasos no desenvolvimento da fala e problemas decorrentes de doenças neurológicas.",
    terapiaOcupacional: "O(a) terapeuta ocupacional responsável por reabilitar indivíduos afetados por limitações físicas, cognitivas ou emocionais para as atividades do dia a dia."
  }

  const urlImg = {
    psicologia: require('../assets/images/area_de_atuacao/psicologia.png'),
    psiquiatria: require('../assets/images/area_de_atuacao/psiquiatria.png'),
    psicopedagogia: require('../assets/images/area_de_atuacao/psicopedagogia.png'),
    fonoaudiologia: require('../assets/images/area_de_atuacao/fonoaudiologia.png'),
    terapiaOcupacional: require('../assets/images/area_de_atuacao/terapia-ocupacional.png')
  }  

  return (
    <Animated.View entering={FlipInEasyX.delay(100).duration(2000).springify()}>
      <View className="flex-row shadow-md mx-7 rounded-xl mb-8 items-center">
        <ImageBackground source={require('./../assets/images/bg-card.png')} className="flex-row items-center rounded-xl border-gray-100" style={{ borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: '#E5E5E5' }}>
          {/* Title + Info */}
          <View className="w-40 ml-5 py-5 mr-9">
            <Text style={{ fontFamily: 'Montserrat_600SemiBold' }} className="mb-2 text-lg">
              {nome[areaDeAtuacao]}
            </Text>
            <Text style={{ fontFamily: 'Montserrat_400Regular' }} className="text-[13px]">
              {texto[areaDeAtuacao]}
            </Text>
          </View>

          {/* Image */}
          <View>
            <Image className="w-[128] h-[128] rounded-r-xl mr-10" source={ urlImg[areaDeAtuacao] } />
          </View>
        </ImageBackground>
      </View>
    </Animated.View>
  );
}
