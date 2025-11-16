import React, { useCallback } from 'react';
import { View, StyleSheet, LogBox } from 'react-native';
import Cadastro from './screens/Cadastro';
import Login from './screens/Login';
import Teste from './screens/Teste';
import Perfil from './screens/Perfil';
import Home from './screens/Home';
import Busca from './screens/Busca';
import AgendamentoConsulta from './screens/AgendamentoConsulta';
import ListaConsultas from './screens/ListaConsultas';
import I18n from 'i18n-js';
import Mapbox from '@rnmapbox/maps';

Mapbox.setAccessToken(`${process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN}`);

I18n.locale = 'pt_BR';
I18n.defaultLocale = 'pt_BR';

import { GluestackUIProvider } from '@gluestack-ui/themed';
import { config } from '@gluestack-ui/config';

import { useFonts } from 'expo-font';
import { 
  Montserrat_200ExtraLight,
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_800ExtraBold,
  Montserrat_300Light_Italic,
  Montserrat_500Medium_Italic
} from '@expo-google-fonts/montserrat';

import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

LogBox.ignoreLogs([
  "UserAvatar: Support for defaultProps"
]);

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    Montserrat_200ExtraLight,
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_800ExtraBold,
    Montserrat_300Light_Italic,
    Montserrat_500Medium_Italic
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
     <View style={styles.container} onLayout={onLayoutRootView} className="font-montRegular">
      <GluestackUIProvider config={config}>
        <ListaConsultas />
      </GluestackUIProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});