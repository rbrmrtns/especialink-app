import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

const formatDateTime = (date) => {
  if (!date) return 'Selecionar Data e Hora...';

  const d = new Date(date);
  
  return d.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const DateTimePicker = ({ label, value, onChange }) => {
  
  const onTimeChange = (event, selectedTime) => {
    if (event.type === 'set') {
      if (selectedTime) {
        onChange(selectedTime);
      }
    }
  };

  const onDateChange = (event, selectedDate) => {
    if (event.type === 'set') {
      if (selectedDate) {
        DateTimePickerAndroid.open({
          value: selectedDate,
          onChange: onTimeChange,
          mode: 'time',
          is24Hour: true,
          display: 'default',
        });
      }
    }
  };

  const showPicker = () => {
    DateTimePickerAndroid.open({
      value: value || new Date(),
      onChange: onDateChange,
      mode: 'date',
      display: 'default',
    });
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <TouchableOpacity style={styles.button} onPress={showPicker}>
        <Text style={styles.buttonText}>{formatDateTime(value)}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  button: {
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  buttonText: {
    fontSize: 16,
    color: '#333',
  },
});