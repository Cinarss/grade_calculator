import { GradeSettings, GradeInput, CalculationResult, GoalInput, GoalResult, LetterGradeRange } from '../types';
import { Translations } from '../context/LanguageContext';

export const validateGrade = (grade: number | null): boolean => {
  if (grade === null || grade === undefined) return false;
  return grade >= 0 && grade <= 100;
};

export const calculateSemesterGrade = (
  midterm: number,
  final: number,
  settings: GradeSettings
): number => {
  const midtermContribution = (midterm * settings.midtermWeight) / 100;
  const finalContribution = (final * settings.finalWeight) / 100;
  return midtermContribution + finalContribution;
};

export const checkPassFail = (
  midterm: number,
  final: number,
  semesterGrade: number,
  settings: GradeSettings,
  t: Translations
): { passed: boolean; reasons: string[] } => {
  const reasons: string[] = [];
  let passed = true;

  if (final < settings.minimumFinalGrade) {
    passed = false;
    reasons.push(
      t.calculations.finalBelowMinimum
        .replace('{final}', final.toFixed(1))
        .replace('{minimum}', settings.minimumFinalGrade.toString())
    );
  }

  if (semesterGrade < settings.minimumSemesterGrade) {
    passed = false;
    reasons.push(
      t.calculations.semesterBelowMinimum
        .replace('{semester}', semesterGrade.toFixed(1))
        .replace('{minimum}', settings.minimumSemesterGrade.toString())
    );
  }

  if (passed) {
    reasons.push(
      t.calculations.congratulations.replace('{grade}', semesterGrade.toFixed(1))
    );
  }

  return { passed, reasons };
};

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

export const performCalculation = (
  input: GradeInput,
  settings: GradeSettings,
  t: Translations
): CalculationResult | null => {
  if (!validateGrade(input.midterm) || !validateGrade(input.final)) {
    return null;
  }

  const midterm = input.midterm!;
  const final = input.final!;

  const semesterGrade = calculateSemesterGrade(midterm, final, settings);
  const { passed, reasons } = checkPassFail(midterm, final, semesterGrade, settings, t);

  let letterGrade: string | undefined;
  if (settings.letterGradesEnabled) {
    letterGrade = getLetterGrade(semesterGrade, settings.letterGradeRanges);
  }

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

export const calculateGoal = (
  goalInput: GoalInput,
  settings: GradeSettings,
  t: Translations
): GoalResult => {
  if (!validateGrade(goalInput.midterm)) {
    return {
      requiredFinal: null,
      possible: false,
      message: t.calculations.invalidMidterm,
    };
  }

  const midterm = goalInput.midterm!;

  let targetSemesterGrade: number;

  if (goalInput.targetType === 'pass') {
    targetSemesterGrade = settings.minimumSemesterGrade;
  } else if (goalInput.targetType === 'score') {
    if (!goalInput.targetValue || typeof goalInput.targetValue !== 'number') {
      return {
        requiredFinal: null,
        possible: false,
        message: t.calculations.invalidTargetScore,
      };
    }
    targetSemesterGrade = goalInput.targetValue as number;
  } else {
    if (!goalInput.targetValue || typeof goalInput.targetValue !== 'string') {
      return {
        requiredFinal: null,
        possible: false,
        message: t.calculations.invalidLetterGrade,
      };
    }
    const targetLetter = goalInput.targetValue as string;
    const letterRange = settings.letterGradeRanges.find((r) => r.letter === targetLetter);
    if (!letterRange) {
      return {
        requiredFinal: null,
        possible: false,
        message: t.calculations.invalidLetterSelected,
      };
    }
    targetSemesterGrade = letterRange.min;
  }

  const midtermContribution = (midterm * settings.midtermWeight) / 100;
  const requiredFinalContribution = targetSemesterGrade - midtermContribution;
  const requiredFinal = (requiredFinalContribution * 100) / settings.finalWeight;

  if (requiredFinal < 0) {
    return {
      requiredFinal: null,
      possible: false,
      message: t.calculations.impossibleGoal,
    };
  }

  if (requiredFinal > 100) {
    return {
      requiredFinal: null,
      possible: false,
      message: t.calculations.impossibleGoal,
    };
  }

  if (goalInput.targetType === 'pass' && requiredFinal < settings.minimumFinalGrade) {
    const adjustedRequiredFinal = settings.minimumFinalGrade;
    const adjustedSemesterGrade = calculateSemesterGrade(midterm, adjustedRequiredFinal, settings);
    
    if (adjustedSemesterGrade < settings.minimumSemesterGrade) {
      return {
        requiredFinal: null,
        possible: false,
        message: t.calculations.impossiblePass
          .replace('{minimumFinal}', settings.minimumFinalGrade.toString())
          .replace('{minimumSemester}', settings.minimumSemesterGrade.toString()),
      };
    }

    return {
      requiredFinal: adjustedRequiredFinal,
      possible: true,
      message: t.calculations.needFinalToPass
        .replace('{final}', adjustedRequiredFinal.toFixed(1))
        .replace('{minimum}', settings.minimumFinalGrade.toString()),
    };
  }

  if (requiredFinal < settings.minimumFinalGrade) {
    return {
      requiredFinal: null,
      possible: false,
      message: t.calculations.needFinalBelowMinimum
        .replace('{required}', requiredFinal.toFixed(1))
        .replace('{minimum}', settings.minimumFinalGrade.toString()),
    };
  }

  let message = t.calculations.needFinalForGoal.replace('{final}', requiredFinal.toFixed(1));
  if (goalInput.targetType === 'pass') {
    message += ' ' + t.calculations.toPass;
  } else if (goalInput.targetType === 'score') {
    message += ' ' + t.calculations.toAchieveScore.replace('{score}', targetSemesterGrade.toString());
  } else {
    message += ' ' + t.calculations.toAchieveLetter.replace('{letter}', goalInput.targetValue as string);
  }

  return {
    requiredFinal,
    possible: true,
    message,
  };
};
