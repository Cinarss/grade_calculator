/**
 * Component for displaying detailed calculation receipt
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { CalculationResult } from '../types';
import { Ionicons } from '@expo/vector-icons';

interface ReceiptSectionProps {
  result: CalculationResult;
  midterm: number;
  final: number;
  midtermWeight: number;
  finalWeight: number;
}

export const ReceiptSection: React.FC<ReceiptSectionProps> = ({
  result,
  midterm,
  final,
  midtermWeight,
  finalWeight,
}) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Ionicons name="receipt-outline" size={24} color="#6366f1" />
        <Text style={styles.headerText}>Calculation Report</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Grade Breakdown</Text>
          
          <View style={styles.row}>
            <Text style={styles.label}>Midterm Grade:</Text>
            <Text style={styles.value}>{midterm.toFixed(1)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Midterm Weight:</Text>
            <Text style={styles.value}>{midtermWeight}%</Text>
          </View>
          <View style={styles.calculationRow}>
            <Text style={styles.calculationText}>
              {midterm} × {midtermWeight}% = {result.breakdown.midtermContribution.toFixed(2)}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.label}>Final Grade:</Text>
            <Text style={styles.value}>{final.toFixed(1)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Final Weight:</Text>
            <Text style={styles.value}>{finalWeight}%</Text>
          </View>
          <View style={styles.calculationRow}>
            <Text style={styles.calculationText}>
              {final} × {finalWeight}% = {result.breakdown.finalContribution.toFixed(2)}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Semester Grade:</Text>
            <Text style={styles.totalValue}>{result.semesterGrade.toFixed(2)}</Text>
          </View>

          {result.letterGrade && (
            <>
              <View style={styles.divider} />
              <View style={styles.row}>
                <Text style={styles.label}>Letter Grade:</Text>
                <Text style={[styles.value, styles.letterGrade]}>{result.letterGrade}</Text>
              </View>
            </>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Result Analysis</Text>
          <View style={[styles.statusBadge, result.passed ? styles.passedBadge : styles.failedBadge]}>
            <Ionicons
              name={result.passed ? 'checkmark-circle' : 'close-circle'}
              size={20}
              color={result.passed ? '#10b981' : '#ef4444'}
            />
            <Text style={[styles.statusText, result.passed ? styles.passedText : styles.failedText]}>
              {result.passed ? 'PASSED' : 'FAILED'}
            </Text>
          </View>

          <View style={styles.reasonsContainer}>
            {result.reasons.map((reason, index) => (
              <View key={index} style={styles.reasonItem}>
                <Ionicons name="information-circle-outline" size={16} color="#6b7280" />
                <Text style={styles.reasonText}>{reason}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Generated: {formatDate(result.timestamp)}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginLeft: 8,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 15,
    color: '#6b7280',
  },
  value: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937',
  },
  calculationRow: {
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 12,
  },
  calculationText: {
    fontSize: 14,
    color: '#374151',
    fontFamily: 'monospace',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6366f1',
  },
  letterGrade: {
    fontSize: 24,
    color: '#8b5cf6',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  passedBadge: {
    backgroundColor: '#d1fae5',
  },
  failedBadge: {
    backgroundColor: '#fee2e2',
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  passedText: {
    color: '#10b981',
  },
  failedText: {
    color: '#ef4444',
  },
  reasonsContainer: {
    gap: 12,
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  reasonText: {
    flex: 1,
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 12,
    marginTop: 8,
  },
  footerText: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
  },
});

