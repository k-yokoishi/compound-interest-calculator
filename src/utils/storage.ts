const STORAGE_KEY = 'savings-calculator-params';

export interface SavedParams {
  monthlyAmount: string;
  annualRate: string;
  years: string;
  initialAmount: string;
}

export function saveParams(params: SavedParams): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(params));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

export function loadParams(): SavedParams | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved) as SavedParams;
    }
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
  }
  return null;
}
