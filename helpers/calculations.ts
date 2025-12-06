/**
 * Core calculation logic for grade calculations
 */

import { GradeSettings, GradeInput, CalculationResult, GoalInput, GoalResult, LetterGradeRange } from '../types';

/**
 * Validates if a grade is within valid range (0-100)
 */
export const validateGrade = (grade: number | null): boolean => {
  if (grade === null || grade === undefined) return false;
  return grade >= 0 && grade <= 100;
};

/**
 * Calculates the semester grade based on midterm and final grades
 * Formula: (midterm * midtermWeight) + (final * finalWeight)
 */
export const calculateSemesterGrade = (
  midterm: number,
  final: number,
  settings: GradeSettings
): number => {
  const midtermContribution = (midterm * settings.midtermWeight) / 100;
  const finalContribution = (final * settings.finalWeight) / 100;
  return midtermContribution + finalContribution;
};

/**
 * Determines if the student passed based on all rules
 */
export const checkPassFail = (
  midterm: number,
  final: number,
  semesterGrade: number,
  settings: GradeSettings
): { passed: boolean; reasons: string[] } => {
  const reasons: string[] = [];
  let passed = true;

  // Check minimum final exam grade rule
  if (final < settings.minimumFinalGrade) {
    passed = false;
    reasons.push(
      `Final exam grade (${final.toFixed(1)}) is below the minimum required (${settings.minimumFinalGrade}). Automatic fail.`
    );
  }

  // Check minimum semester grade rule
  if (semesterGrade < settings.minimumSemesterGrade) {
    passed = false;
    reasons.push(
      `Semester grade (${semesterGrade.toFixed(1)}) is below the minimum required (${settings.minimumSemesterGrade}).`
    );
  }

  // If passed, provide positive feedback
  if (passed) {
    reasons.push(
      `Congratulations! You passed with a semester grade of ${semesterGrade.toFixed(1)}.`
    );
  }

  return { passed, reasons };
};

/**
 * Gets the letter grade based on semester grade and letter grade ranges
 */
export const getLetterGrade = (
  semesterGrade: number,
  letterGradeRanges: LetterGradeRange[]
): string | undefined => {
  for (const range of letterGradeRanges) {
    if (semesterGrade >= range.min && semesterGrade <= range.max) {
      return range.letter;
    }
  }
  return undefined;
};

/**
 * Main calculation function that returns complete result
 */
export const performCalculation = (
  input: GradeInput,
  settings: GradeSettings
): CalculationResult | null => {
  // Validate inputs
  if (!validateGrade(input.midterm) || !validateGrade(input.final)) {
    return null;
  }

  const midterm = input.midterm!;
  const final = input.final!;

  // Calculate semester grade
  const semesterGrade = calculateSemesterGrade(midterm, final, settings);

  // Check pass/fail
  const { passed, reasons } = checkPassFail(midterm, final, semesterGrade, settings);

  // Get letter grade if enabled
  let letterGrade: string | undefined;
  if (settings.letterGradesEnabled) {
    letterGrade = getLetterGrade(semesterGrade, settings.letterGradeRanges);
  }

  // Calculate breakdown
  const midtermContribution = (midterm * settings.midtermWeight) / 100;
  const finalContribution = (final * settings.finalWeight) / 100;

  return {
    semesterGrade,
    passed,
    reasons,
    letterGrade,
    breakdown: {
      midtermContribution,
      finalContribution,
    },
    timestamp: new Date(),
  };
};

/**
 * Calculates the minimum final exam grade needed to achieve a goal
 */
export const calculateGoal = (
  goalInput: GoalInput,
  settings: GradeSettings
): GoalResult => {
  if (!validateGrade(goalInput.midterm)) {
    return {
      requiredFinal: null,
      possible: false,
      message: 'Please enter a valid midterm grade.',
    };
  }

  const midterm = goalInput.midterm!;

  // Calculate required semester grade based on target type
  let targetSemesterGrade: number;

  if (goalInput.targetType === 'pass') {
    // Need to pass: must meet both minimum semester grade and minimum final grade
    targetSemesterGrade = settings.minimumSemesterGrade;
  } else if (goalInput.targetType === 'score') {
    if (!goalInput.targetValue || typeof goalInput.targetValue !== 'number') {
      return {
        requiredFinal: null,
        possible: false,
        message: 'Please enter a valid target score.',
      };
    }
    targetSemesterGrade = goalInput.targetValue as number;
  } else {
    // Letter grade
    if (!goalInput.targetValue || typeof goalInput.targetValue !== 'string') {
      return {
        requiredFinal: null,
        possible: false,
        message: 'Please select a valid letter grade.',
      };
    }
    const targetLetter = goalInput.targetValue as string;
    const letterRange = settings.letterGradeRanges.find((r) => r.letter === targetLetter);
    if (!letterRange) {
      return {
        requiredFinal: null,
        possible: false,
        message: 'Invalid letter grade selected.',
      };
    }
    // Use minimum of the range to achieve the letter grade
    targetSemesterGrade = letterRange.min;
  }

  // Formula: semesterGrade = (midterm * midtermWeight) + (final * finalWeight)
  // Solving for final: final = (semesterGrade - (midterm * midtermWeight)) / finalWeight
  const midtermContribution = (midterm * settings.midtermWeight) / 100;
  const requiredFinalContribution = targetSemesterGrade - midtermContribution;
  const requiredFinal = (requiredFinalContribution * 100) / settings.finalWeight;

  // Check if it's possible (final must be between 0 and 100)
  if (requiredFinal < 0) {
    return {
      requiredFinal: null,
      possible: false,
      message: 'It is mathematically impossible to reach this goal. The target is too high given your midterm grade.',
    };
  }

  if (requiredFinal > 100) {
    return {
      requiredFinal: null,
      possible: false,
      message: 'It is mathematically impossible to reach this goal. The target is too high given your midterm grade.',
    };
  }

  // Check if required final meets minimum final grade requirement
  if (goalInput.targetType === 'pass' && requiredFinal < settings.minimumFinalGrade) {
    // Need to use minimum final grade instead
    const adjustedRequiredFinal = settings.minimumFinalGrade;
    const adjustedSemesterGrade = calculateSemesterGrade(midterm, adjustedRequiredFinal, settings);
    
    if (adjustedSemesterGrade < settings.minimumSemesterGrade) {
      return {
        requiredFinal: null,
        possible: false,
        message: `It is mathematically impossible to pass. Even with the minimum final grade (${settings.minimumFinalGrade}), you cannot reach the minimum semester grade (${settings.minimumSemesterGrade}).`,
      };
    }

    return {
      requiredFinal: adjustedRequiredFinal,
      possible: true,
      message: `You need at least ${adjustedRequiredFinal.toFixed(1)} in the final exam to pass (meeting the minimum final grade requirement of ${settings.minimumFinalGrade}).`,
    };
  }

  // Check if required final meets minimum final grade for other targets
  if (requiredFinal < settings.minimumFinalGrade) {
    return {
      requiredFinal: null,
      possible: false,
      message: `It is mathematically impossible to reach this goal. The required final grade (${requiredFinal.toFixed(1)}) is below the minimum final exam requirement (${settings.minimumFinalGrade}).`,
    };
  }

  let message = `You need at least ${requiredFinal.toFixed(1)} in the final exam`;
  if (goalInput.targetType === 'pass') {
    message += ' to pass.';
  } else if (goalInput.targetType === 'score') {
    message += ` to achieve a semester grade of ${targetSemesterGrade}.`;
  } else {
    message += ` to achieve a letter grade of ${goalInput.targetValue}.`;
  }

  return {
    requiredFinal,
    possible: true,
    message,
  };
};

