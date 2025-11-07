import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import Cadastro from './screens/Cadastro';
import Login from './screens/Login';
import Teste from './screens/Teste';
import I18n from 'i18n-js';

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
  Montserrat_800ExtraBold
} from '@expo-google-fonts/montserrat';

import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    Montserrat_200ExtraLight,
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_800ExtraBold,
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
     <View style={styles.container} onLayout={onLayoutRootView}>
      <GluestackUIProvider config={config}>
        <Teste />
      </GluestackUIProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});