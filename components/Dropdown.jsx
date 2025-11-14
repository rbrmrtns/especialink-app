import RNPickerSelect from 'react-native-picker-select';
import { StyleSheet, View } from 'react-native';


const defaultPickerStyles = StyleSheet.create({
  inputAndroid: {
    color: 'black',
    elevation: 1, // Sombra para Android
  },
  placeholder: {
    color: 'gray',
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
  }
});

export const Dropdown = ({ onValueChange, items, placeholder, value, className = "" }) => {

  const handleValueChange = (selectedValue) => {
    if (selectedValue !== null && selectedValue !== undefined) {
      onValueChange(selectedValue);
    }
  };

  return (
    <View className={className}>
      <RNPickerSelect
        onValueChange={handleValueChange}
        items={items}
        value={value}
        placeholder={placeholder}
        style={defaultPickerStyles}
      />
    </View>
  );
};

