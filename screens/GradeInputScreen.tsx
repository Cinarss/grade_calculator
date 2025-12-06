/**
 * Main screen for entering midterm and final grades
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { InputField } from '../components/InputField';
import { useAppContext } from '../context/AppContext';
import { performCalculation, validateGrade } from '../helpers/calculations';

export const GradeInputScreen: React.FC = () => {
  const navigation = useNavigation();
  const { gradeInput, setGradeInput, setCalculationResult, settings } = useAppContext();
  const [errors, setErrors] = useState<{ midterm?: string; final?: string }>({});

  const handleMidtermChange = (text: string) => {
    const num = text === '' ? null : parseFloat(text);
    if (text === '' || (num !== null && !isNaN(num))) {
      setGradeInput({ ...gradeInput, midterm: num });
      if (errors.midterm) {
        setErrors({ ...errors, midterm: undefined });
      }
    }
  };

  const handleFinalChange = (text: string) => {
    const num = text === '' ? null : parseFloat(text);
    if (text === '' || (num !== null && !isNaN(num))) {
      setGradeInput({ ...gradeInput, final: num });
      if (errors.final) {
        setErrors({ ...errors, final: undefined });
      }
    }
  };

  const handleCalculate = () => {
    const newErrors: { midterm?: string; final?: string } = {};

    // Validate midterm
    if (gradeInput.midterm === null || gradeInput.midterm === undefined) {
      newErrors.midterm = 'Please enter your midterm grade';
    } else if (!validateGrade(gradeInput.midterm)) {
      newErrors.midterm = 'Grade must be between 0 and 100';
    }

    // Validate final
    if (gradeInput.final === null || gradeInput.final === undefined) {
      newErrors.final = 'Please enter your final grade';
    } else if (!validateGrade(gradeInput.final)) {
      newErrors.final = 'Grade must be between 0 and 100';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      Alert.alert('Validation Error', 'Please fix the errors before calculating.');
      return;
    }

    // Perform calculation
    const result = performCalculation(gradeInput, settings);
    if (result) {
      setCalculationResult(result);
      navigation.navigate('Results' as never);
    } else {
      Alert.alert('Error', 'Failed to calculate. Please check your inputs.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Ionicons name="calculator-outline" size={48} color="#6366f1" />
          <Text style={styles.title}>Grade Calculator</Text>
          <Text style={styles.subtitle}>Enter your midterm and final exam grades</Text>
        </View>

        <View style={styles.card}>
          <InputField
            label="Midterm Grade (Vize)"
            value={gradeInput.midterm}
            onChangeText={handleMidtermChange}
            placeholder="Enter midterm grade"
            error={errors.midterm}
            icon="school-outline"
          />

          <InputField
            label="Final Exam Grade (Final)"
            value={gradeInput.final}
            onChangeText={handleFinalChange}
            placeholder="Enter final grade"
            error={errors.final}
            icon="document-text-outline"
          />

          <View style={styles.infoBox}>
            <Ionicons name="information-circle-outline" size={20} color="#6366f1" />
            <Text style={styles.infoText}>
              Current weights: Midterm {settings.midtermWeight}% • Final {settings.finalWeight}%
            </Text>
          </View>

          <TouchableOpacity style={styles.calculateButton} onPress={handleCalculate}>
            <Ionicons name="calculator" size={24} color="#ffffff" />
            <Text style={styles.calculateButtonText}>Calculate Semester Grade</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('GoalCalculator' as never)}
        >
          <Ionicons name="target-outline" size={20} color="#6366f1" />
          <Text style={styles.secondaryButtonText}>Goal Calculator</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    gap: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#1e40af',
  },
  calculateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6366f1',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    elevation: 2,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  calculateButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#6366f1',
    gap: 8,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6366f1',
  },
});

