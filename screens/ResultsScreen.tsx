/**
 * Screen for displaying calculation results and receipt
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { ResultCard } from '../components/ResultCard';
import { ReceiptSection } from '../components/ReceiptSection';
import { useAppContext } from '../context/AppContext';

export const ResultsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { calculationResult, gradeInput, settings, resetCalculation } = useAppContext();

  if (!calculationResult || gradeInput.midterm === null || gradeInput.final === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No calculation result available</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('GradeInput' as never)}
        >
          <Text style={styles.buttonText}>Go to Calculator</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Results</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ResultCard
          title="Semester Grade"
          value={calculationResult.semesterGrade.toFixed(2)}
          subtitle={calculationResult.letterGrade || undefined}
          icon={calculationResult.passed ? 'checkmark-circle' : 'close-circle'}
          gradientColors={
            calculationResult.passed ? ['#10b981', '#059669'] : ['#ef4444', '#dc2626']
          }
        />

        <ReceiptSection
          result={calculationResult}
          midterm={gradeInput.midterm}
          final={gradeInput.final}
          midtermWeight={settings.midtermWeight}
          finalWeight={settings.finalWeight}
        />

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              resetCalculation();
              navigation.navigate('GradeInput' as never);
            }}
          >
            <Ionicons name="refresh-outline" size={20} color="#ffffff" />
            <Text style={styles.actionButtonTextPrimary}>Calculate Again</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryActionButton]}
            onPress={() => navigation.navigate('GoalCalculator' as never)}
          >
            <Ionicons name="target-outline" size={20} color="#6366f1" />
            <Text style={styles.actionButtonText}>Goal Calculator</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#6366f1',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6366f1',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  secondaryActionButton: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#6366f1',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366f1',
  },
  actionButtonTextPrimary: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
});

