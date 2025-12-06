/**
 * Reusable component for settings input fields
 */

import React from 'react';
import { View, Text, StyleSheet, TextInput, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SettingsFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  type?: 'slider' | 'input' | 'switch';
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
}

export const SettingsField: React.FC<SettingsFieldProps> = ({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  unit = '%',
  icon = 'settings-outline',
  type = 'slider',
  switchValue,
  onSwitchChange,
}) => {
  if (type === 'switch' && switchValue !== undefined && onSwitchChange) {
    return (
      <View style={styles.container}>
        <View style={styles.labelContainer}>
          <Ionicons name={icon} size={20} color="#6366f1" style={styles.icon} />
          <Text style={styles.label}>{label}</Text>
        </View>
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ false: '#d1d5db', true: '#6366f1' }}
          thumbColor={switchValue ? '#ffffff' : '#f3f4f6'}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Ionicons name={icon} size={20} color="#6366f1" style={styles.icon} />
        <Text style={styles.label}>{label}</Text>
      </View>
      {type === 'slider' ? (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={value.toString()}
            onChangeText={(text) => {
              const num = parseFloat(text) || 0;
              if (num >= min && num <= max) {
                onChange(num);
              }
            }}
            keyboardType="numeric"
            maxLength={5}
          />
          <Text style={styles.unit}>{unit}</Text>
        </View>
      ) : (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={value.toString()}
            onChangeText={(text) => {
              const num = parseFloat(text) || 0;
              if (num >= min && num <= max) {
                onChange(num);
              }
            }}
            keyboardType="numeric"
            maxLength={5}
          />
          <Text style={styles.unit}>{unit}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    marginRight: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  unit: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 8,
  },
});

