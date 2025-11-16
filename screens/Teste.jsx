import React, { useState } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import ConsultaCard from '../components/ConsultaCard';

export default function Teste() {

  return (
    <View style={styles.container}>
      <ConsultaCard />
    </View>
  );
}

// Estilos para o exemplo
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff', // White background
  },
});