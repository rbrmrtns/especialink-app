import {
  HStack,
  VStack,
  Radio,
  RadioGroup,
  RadioIcon,
  RadioIndicator,
  CircleIcon,
  Text
} from '@gluestack-ui/themed';

// Versão simplificada que não precisa de labels e aceita um array de números
export const CustomRadioGroup = ({ items, value, onValueChange }) => {
  return (
    <RadioGroup value={value !== null ? String(value) : null} onChange={onValueChange}>
      <HStack space="md" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
        {items.map((item) => (
          <VStack key={String(item.value)} style={{alignItems: 'center', minWidth: 30}}>
            <Radio value={String(item.value)}>
              <RadioIndicator>
                <RadioIcon as={CircleIcon} />
              </RadioIndicator>
            </Radio>
            <Text style={{marginTop: 5, fontSize: 12, color: '#6c757d', textAlign: 'center'}}>
              {item.display}
            </Text>
          </VStack>
        ))}
      </HStack>
    </RadioGroup>
  );
};