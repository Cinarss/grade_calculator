/**
 * Settings screen for customizing calculation rules
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { SettingsField } from '../components/SettingsField';
import { useAppContext } from '../context/AppContext';
import { DEFAULT_SETTINGS } from '../types';

export const SettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { settings, updateSettings } = useAppContext();
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSave = async () => {
    // Validate that weights sum to 100
    if (localSettings.midtermWeight + localSettings.finalWeight !== 100) {
      Alert.alert(
        'Invalid Weights',
        'Midterm and Final weights must sum to 100%.',
        [{ text: 'OK' }]
      );
      return;
    }

    await updateSettings(localSettings);
    Alert.alert('Success', 'Settings saved successfully!', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  const handleReset = () => {
    Alert.alert(
      'Reset Settings',
      'Are you sure you want to reset all settings to default values?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            setLocalSettings(DEFAULT_SETTINGS);
            updateSettings(DEFAULT_SETTINGS);
            Alert.alert('Success', 'Settings reset to default values.');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Grade Weights</Text>
          <Text style={styles.sectionDescription}>
            Set the percentage weights for midterm and final exams. They must sum to 100%.
          </Text>

          <SettingsField
            label="Midterm Weight"
            value={localSettings.midtermWeight}
            onChange={(value) => {
              const newMidterm = value;
              const newFinal = 100 - newMidterm;
              setLocalSettings({
                ...localSettings,
                midtermWeight: newMidterm,
                finalWeight: newFinal,
              });
            }}
            min={0}
            max={100}
            step={1}
            unit="%"
            icon="scale-outline"
            type="slider"
          />

          <SettingsField
            label="Final Weight"
            value={localSettings.finalWeight}
            onChange={(value) => {
              const newFinal = value;
              const newMidterm = 100 - newFinal;
              setLocalSettings({
                ...localSettings,
                midtermWeight: newMidterm,
                finalWeight: newFinal,
              });
            }}
            min={0}
            max={100}
            step={1}
            unit="%"
            icon="scale-outline"
            type="slider"
          />

          <View style={styles.sumBox}>
            <Text style={styles.sumText}>
              Total: {localSettings.midtermWeight + localSettings.finalWeight}%
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Passing Criteria</Text>
          <Text style={styles.sectionDescription}>
            Set the minimum grades required to pass the course.
          </Text>

          <SettingsField
            label="Minimum Semester Grade"
            value={localSettings.minimumSemesterGrade}
            onChange={(value) =>
              setLocalSettings({ ...localSettings, minimumSemesterGrade: value })
            }
            min={0}
            max={100}
            step={1}
            unit=""
            icon="trophy-outline"
            type="slider"
          />

          <SettingsField
            label="Minimum Final Exam Grade"
            value={localSettings.minimumFinalGrade}
            onChange={(value) =>
              setLocalSettings({ ...localSettings, minimumFinalGrade: value })
            }
            min={0}
            max={100}
            step={1}
            unit=""
            icon="document-text-outline"
            type="slider"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Letter Grades</Text>
          <Text style={styles.sectionDescription}>
            Enable or disable letter grade display in results.
          </Text>

          <SettingsField
            label="Enable Letter Grades"
            value={0}
            onChange={() => {}}
            icon="star-outline"
            type="switch"
            switchValue={localSettings.letterGradesEnabled}
            onSwitchChange={(value) =>
              setLocalSettings({ ...localSettings, letterGradesEnabled: value })
            }
          />
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Ionicons name="checkmark-circle" size={20} color="#ffffff" />
            <Text style={styles.saveButtonText}>Save Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Ionicons name="refresh-outline" size={20} color="#6366f1" />
            <Text style={styles.resetButtonText}>Reset to Default</Text>
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
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 20,
    lineHeight: 20,
  },
  sumBox: {
    backgroundColor: '#f0f9ff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  sumText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e40af',
  },
  actions: {
    gap: 12,
    marginBottom: 20,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6366f1',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  resetButton: {
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
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6366f1',
  },
});

