import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const formatTime = (date) => {
  if (!date) return '--:--';
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

export const TimeRangePicker = ({ label, startTime, endTime, onStartTimeChange, onEndTimeChange }) => {
  const [showPicker, setShowPicker] = useState(false);
  const [pickerFor, setPickerFor] = useState('start');

  const showTimePicker = (mode) => {
    setPickerFor(mode);
    setShowPicker(true);
  };

  const onTimeChange = (event, selectedDate) => {
    setShowPicker(false);

    if (selectedDate) {
      if (pickerFor === 'start') {
        onStartTimeChange(selectedDate);
      } else {
        onEndTimeChange(selectedDate);
      }
    }
  };

  const pickerValue = pickerFor === 'start' ? startTime : endTime;

  return (
    <View style={styles.container}>
      <View style={styles.pickerContainer}>
        {/* Seletor de Início */}
        <TouchableOpacity style={styles.timeButton} onPress={() => showTimePicker('start')}>
          <Text style={styles.timeText}>{formatTime(startTime)}</Text>
        </TouchableOpacity>

        <Text style={styles.separator}>às</Text>

        {/* Seletor de Fim */}
        <TouchableOpacity style={styles.timeButton} onPress={() => showTimePicker('end')}>
          <Text style={styles.timeText}>{formatTime(endTime)}</Text>
        </TouchableOpacity>
      </View>

      {/* O componente do seletor de data/hora */}
      {showPicker && (
        <DateTimePicker
          value={pickerValue || new Date()}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={onTimeChange}
        />
      )}
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
    marginBottom: 10,
    color: '#333',
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 10,
  },
  timeButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  timeText: {
    fontSize: 18,
    fontWeight: '500',
  },
  separator: {
    fontSize: 16,
    color: '#666',
  },
});