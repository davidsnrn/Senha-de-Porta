export type ThemeType = 'paper' | 'vault' | 'castle' | 'cyber';
export type KeypadLayoutType = 'drawing' | 'classic';

export interface PasscodeConfig {
  pin: string;
  doorName: string;
  hint: string;
  unlockMessage: string;
  theme: ThemeType;
  keypadLayout: KeypadLayoutType;
  soundEnabled: boolean;
  voiceEnabled: boolean;
  autoLockSeconds: number; // 0 for manual only, or seconds e.g. 6
}

export interface AttemptLog {
  id: string;
  timestamp: number;
  attemptedCode: string;
  success: boolean;
  doorName: string;
}
