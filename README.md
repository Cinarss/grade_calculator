# Grade Calculator App (made by Cursor)

A modern, feature-rich React Native mobile application for university students to calculate semester grades, analyze goals, and track academic performance.

## Features

### 📊 Grade Calculation
- Enter midterm (vize) and final exam grades
- Real-time validation and error handling
- Adjustable weighting rules (default: 40% midterm, 60% final)
- Instant semester grade calculation

### 📋 Detailed Results
- Beautiful receipt-style calculation report
- Step-by-step breakdown of calculations
- Pass/fail determination with detailed explanations
- Optional letter grade display (AA, BA, BB, CB, CC, DC, DD, FF)

### 🎯 Goal Calculator
- Calculate minimum final exam grade needed to:
  - Pass the course
  - Achieve a target score
  - Reach a specific letter grade
- Handles edge cases and impossible scenarios

### ⚙️ Customizable Settings
- Adjust midterm/final exam weights
- Set minimum passing thresholds
- Configure minimum final exam requirement
- Enable/disable letter grades
- All settings persisted with AsyncStorage

## Tech Stack

- **React Native** - Mobile framework
- **Expo** - Development platform
- **TypeScript** - Type safety
- **React Navigation** - Navigation system
- **React Context** - State management
- **AsyncStorage** - Local data persistence
- **Expo Vector Icons** - Icon library
- **Expo Linear Gradient** - Gradient components

## Project Structure

```
├── App.tsx                 # Main app entry point
├── navigation/
│   └── AppNavigator.tsx    # Navigation configuration
├── screens/
│   ├── GradeInputScreen.tsx
│   ├── ResultsScreen.tsx
│   ├── GoalCalculatorScreen.tsx
│   └── SettingsScreen.tsx
├── components/
│   ├── InputField.tsx
│   ├── ResultCard.tsx
│   ├── ReceiptSection.tsx
│   ├── SettingsField.tsx
│   └── GoalCalculatorUI.tsx
├── context/
│   └── AppContext.tsx      # Global state management
├── helpers/
│   └── calculations.ts    # Calculation logic
└── types/
    └── index.ts           # TypeScript type definitions
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the Expo development server:
```bash
npm start
```

3. Run on your device:
   - Scan the QR code with Expo Go app (iOS/Android)
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Press `w` for web browser

## Usage

### Calculating Semester Grade
1. Navigate to the Calculator tab
2. Enter your midterm and final exam grades
3. Tap "Calculate Semester Grade"
4. View detailed results and receipt

### Using Goal Calculator
1. Go to the Goal tab
2. Enter your midterm grade
3. Select your target (Pass, Score, or Letter Grade)
4. View the required final exam grade

### Adjusting Settings
1. Go to the Settings tab
2. Modify grade weights, passing criteria, or letter grade settings
3. Tap "Save Settings" to persist changes

## Default Settings

- **Midterm Weight**: 40%
- **Final Weight**: 60%
- **Minimum Semester Grade**: 60
- **Minimum Final Exam Grade**: 50
- **Letter Grades**: Enabled
- **Lang**: Turkish


## Calculation Formula

```
Semester Grade = (Midterm × Midterm Weight) + (Final × Final Weight)
```

## Pass/Fail Rules

A student passes if:
1. Final exam grade ≥ Minimum Final Exam Grade
2. Semester grade ≥ Minimum Semester Grade

Both conditions must be met.

## License

This project is open source and available for educational purposes.

