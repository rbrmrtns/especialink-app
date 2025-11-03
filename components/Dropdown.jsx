import RNPickerSelect from 'react-native-picker-select';

export const Dropdown = ({ onValueChange, items, placeholder, value, customStyles = {} }) => {
  
  const pickerSelectStyles = {
    input: {
      fontSize: 16,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 8,
      color: 'black',
      paddingRight: 30,
      ...customStyles, // E aqui também, para consistência entre plataformas
    },
    placeholder: {
      color: '#9EA0A4', // Cor padrão do placeholder
      ...customStyles.placeholder, // Permite customizar o placeholder também
    },
  };

  return (
    <RNPickerSelect
      onValueChange={onValueChange}
      items={items}
      value={value}
      placeholder={placeholder}
      style={pickerSelectStyles}
    />
  );
};

