/**
 * Type definitions for the Grade Calculator App
 */

export interface GradeSettings {
  midtermWeight: number; // Percentage (0-100)
  finalWeight: number; // Percentage (0-100)
  minimumFinalGrade: number; // Minimum final exam grade to pass (0-100)
  minimumSemesterGrade: number; // Minimum semester grade to pass (0-100)
  letterGradesEnabled: boolean;
  letterGradeRanges: LetterGradeRange[];
}

export interface LetterGradeRange {
  letter: string;
  min: number;
  max: number;
}

export interface GradeInput {
  midterm: number | null;
  final: number | null;
}

export interface CalculationResult {
  semesterGrade: number;
  passed: boolean;
  reasons: string[];
  letterGrade?: string;
  breakdown: {
    midtermContribution: number;
    finalContribution: number;
  };
  timestamp: Date;
}

export interface GoalInput {
  midterm: number | null;
  targetType: 'pass' | 'score' | 'letter';
  targetValue: number | string | null; // For 'score': number, for 'letter': string
}

export interface GoalResult {
  requiredFinal: number | null;
  possible: boolean;
  message: string;
}

export const DEFAULT_SETTINGS: GradeSettings = {
  midtermWeight: 40,
  finalWeight: 60,
  minimumFinalGrade: 50,
  minimumSemesterGrade: 60,
  letterGradesEnabled: true,
  letterGradeRanges: [
    { letter: 'AA', min: 90, max: 100 },
    { letter: 'BA', min: 85, max: 89 },
    { letter: 'BB', min: 80, max: 84 },
    { letter: 'CB', min: 75, max: 79 },
    { letter: 'CC', min: 70, max: 74 },
    { letter: 'DC', min: 65, max: 69 },
    { letter: 'DD', min: 60, max: 64 },
    { letter: 'FF', min: 0, max: 59 },
  ],
};

