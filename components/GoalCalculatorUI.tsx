/**
 * UI component for goal calculator
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { InputField } from './InputField';
import { GoalInput, GoalResult, GradeSettings } from '../types';
import { calculateGoal } from '../helpers/calculations';

interface GoalCalculatorUIProps {
  settings: GradeSettings;
}

export const GoalCalculatorUI: React.FC<GoalCalculatorUIProps> = ({ settings }) => {
  const [goalInput, setGoalInput] = useState<GoalInput>({
    midterm: null,
    targetType: 'pass',
    targetValue: null,
  });
  const [result, setResult] = useState<GoalResult | null>(null);

  const handleCalculate = () => {
    if (!goalInput.midterm) {
      Alert.alert('Missing Input', 'Please enter your midterm grade.');
      return;
    }

    if (goalInput.targetType === 'score' && !goalInput.targetValue) {
      Alert.alert('Missing Input', 'Please enter a target score.');
      return;
    }

    if (goalInput.targetType === 'letter' && !goalInput.targetValue) {
      Alert.alert('Missing Input', 'Please select a letter grade.');
      return;
    }

    const calculated = calculateGoal(goalInput, settings);
    setResult(calculated);
  };

  const getLetterGrades = () => {
    return settings.letterGradeRanges
      .filter((r) => r.letter !== 'FF')
      .map((r) => r.letter)
      .reverse();
  };

  return (
    <View style={styles.container}>
      <InputField
        label="Midterm Grade"
        value={goalInput.midterm}
        onChangeText={(text) => {
          const num = parseFloat(text);
          setGoalInput({ ...goalInput, midterm: isNaN(num) ? null : num });
        }}
        placeholder="Enter midterm grade"
        icon="school-outline"
      />

      <View style={styles.targetSection}>
        <Text style={styles.sectionLabel}>Target Goal</Text>
        <View style={styles.targetButtons}>
          <TouchableOpacity
            style={[
              styles.targetButton,
              goalInput.targetType === 'pass' && styles.targetButtonActive,
            ]}
            onPress={() => setGoalInput({ ...goalInput, targetType: 'pass', targetValue: null })}
          >
            <Ionicons
              name="checkmark-circle"
              size={20}
              color={goalInput.targetType === 'pass' ? '#ffffff' : '#6366f1'}
            />
            <Text
              style={[
                styles.targetButtonText,
                goalInput.targetType === 'pass' && styles.targetButtonTextActive,
              ]}
            >
              Pass
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.targetButton,
              goalInput.targetType === 'score' && styles.targetButtonActive,
            ]}
            onPress={() => setGoalInput({ ...goalInput, targetType: 'score', targetValue: null })}
          >
            <Ionicons
              name="trophy"
              size={20}
              color={goalInput.targetType === 'score' ? '#ffffff' : '#6366f1'}
            />
            <Text
              style={[
                styles.targetButtonText,
                goalInput.targetType === 'score' && styles.targetButtonTextActive,
              ]}
            >
              Score
            </Text>
          </TouchableOpacity>

          {settings.letterGradesEnabled && (
            <TouchableOpacity
              style={[
                styles.targetButton,
                goalInput.targetType === 'letter' && styles.targetButtonActive,
              ]}
              onPress={() =>
                setGoalInput({ ...goalInput, targetType: 'letter', targetValue: null })
              }
            >
              <Ionicons
                name="star"
                size={20}
                color={goalInput.targetType === 'letter' ? '#ffffff' : '#6366f1'}
              />
              <Text
                style={[
                  styles.targetButtonText,
                  goalInput.targetType === 'letter' && styles.targetButtonTextActive,
                ]}
              >
                Letter
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {goalInput.targetType === 'score' && (
          <InputField
            label="Target Score"
            value={
              goalInput.targetValue && typeof goalInput.targetValue === 'number'
                ? goalInput.targetValue
                : null
            }
            onChangeText={(text) => {
              const num = parseFloat(text);
              setGoalInput({
                ...goalInput,
                targetValue: isNaN(num) ? null : num,
              });
            }}
            placeholder="Enter target score"
            icon="target-outline"
          />
        )}

        {goalInput.targetType === 'letter' && settings.letterGradesEnabled && (
          <View style={styles.letterGrid}>
            {getLetterGrades().map((letter) => (
              <TouchableOpacity
                key={letter}
                style={[
                  styles.letterButton,
                  goalInput.targetValue === letter && styles.letterButtonActive,
                ]}
                onPress={() => setGoalInput({ ...goalInput, targetValue: letter })}
              >
                <Text
                  style={[
                    styles.letterButtonText,
                    goalInput.targetValue === letter && styles.letterButtonTextActive,
                  ]}
                >
                  {letter}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.calculateButton} onPress={handleCalculate}>
        <Ionicons name="calculator" size={24} color="#ffffff" />
        <Text style={styles.calculateButtonText}>Calculate Required Final</Text>
      </TouchableOpacity>

      {result && (
        <View
          style={[
            styles.resultCard,
            result.possible ? styles.resultCardSuccess : styles.resultCardError,
          ]}
        >
          <Ionicons
            name={result.possible ? 'checkmark-circle' : 'close-circle'}
            size={32}
            color={result.possible ? '#10b981' : '#ef4444'}
          />
          {result.possible && result.requiredFinal !== null && (
            <Text style={styles.resultValue}>{result.requiredFinal.toFixed(1)}</Text>
          )}
          <Text style={styles.resultMessage}>{result.message}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  targetSection: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  targetButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  targetButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#6366f1',
    backgroundColor: '#ffffff',
    gap: 6,
  },
  targetButtonActive: {
    backgroundColor: '#6366f1',
  },
  targetButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366f1',
  },
  targetButtonTextActive: {
    color: '#ffffff',
  },
  letterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  letterButton: {
    width: 60,
    height: 60,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#6366f1',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  letterButtonActive: {
    backgroundColor: '#6366f1',
  },
  letterButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6366f1',
  },
  letterButtonTextActive: {
    color: '#ffffff',
  },
  calculateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6366f1',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    marginBottom: 24,
  },
  calculateButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  resultCard: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    gap: 12,
  },
  resultCardSuccess: {
    backgroundColor: '#d1fae5',
  },
  resultCardError: {
    backgroundColor: '#fee2e2',
  },
  resultValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#10b981',
  },
  resultMessage: {
    fontSize: 16,
    color: '#1f2937',
    textAlign: 'center',
    lineHeight: 24,
  },
});

