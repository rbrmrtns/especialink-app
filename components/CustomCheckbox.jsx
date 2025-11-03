import { Checkbox } from 'expo-checkbox';
import { StyleSheet, Text, View } from 'react-native';

export const CustomCheckbox = ({ label, value, onValueChange, disabled = false, color, style }) => {
  return (
    <View style={[styles.container, style]}>
      <Checkbox
        style={styles.checkbox}
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        color={value ? color : undefined}
      />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  checkbox: {
    marginRight: 12,
  },
  label: {
    fontSize: 16,
  },
});
