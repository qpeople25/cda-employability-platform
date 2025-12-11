// CDA Brand Design System - Professional & Deluxe

export const CDA_COLORS = {
  // Primary Brand Colors
  primary: {
    900: '#052D44', // Deep Ocean Blue - Main brand color
    800: '#0A4D68', // CDA Blue
    700: '#0D6090', // Medium Blue
    600: '#1565A6', // Bright Blue
    500: '#1E7EBF', // Sky Blue
    400: '#3498DB', // Light Blue
    300: '#5DADE2', // Soft Blue
    200: '#85C1E9', // Pale Blue
    100: '#AED6F1', // Very Light Blue
    50: '#D6EAF8',  // Ice Blue
  },
  
  // Secondary - Gold/Bronze (UAE heritage)
  gold: {
    900: '#8B6914', // Dark Gold
    800: '#B8860B', // Deep Gold
    700: '#D4AF37', // CDA Gold - Premium accent
    600: '#DAA520', // Goldenrod
    500: '#F0D97D', // Light Gold
    400: '#F4E5A1', // Soft Gold
    300: '#F8F0C5', // Pale Gold
    200: '#FBF8E8', // Cream Gold
    100: '#FEFCF4', // Almost White Gold
  },
  
  // Neutrals
  neutral: {
    900: '#1A1F2E', // Almost Black
    800: '#2D3748', // Dark Gray
    700: '#4A5568', // Medium Gray
    600: '#718096', // Gray
    500: '#A0AEC0', // Light Gray
    400: '#CBD5E0', // Pale Gray
    300: '#E2E8F0', // Very Light Gray
    200: '#EDF2F7', // Off White
    100: '#F7FAFC', // Near White
    50: '#FAFBFC',  // White Tint
  },
  
  // Status Colors
  success: {
    700: '#2F855A',
    600: '#38A169',
    500: '#48BB78',
    100: '#C6F6D5',
  },
  
  warning: {
    700: '#C05621',
    600: '#DD6B20',
    500: '#ED8936',
    100: '#FEEBC8',
  },
  
  error: {
    700: '#C53030',
    600: '#E53E3E',
    500: '#F56565',
    100: '#FED7D7',
  },
  
  info: {
    700: '#2C5282',
    600: '#2B6CB0',
    500: '#3182CE',
    100: '#BEE3F8',
  },
};

export const CDA_GRADIENTS = {
  primary: 'linear-gradient(135deg, #0A4D68 0%, #1565A6 100%)',
  gold: 'linear-gradient(135deg, #D4AF37 0%, #F0D97D 100%)',
  premiumBlue: 'linear-gradient(135deg, #052D44 0%, #0A4D68 50%, #1565A6 100%)',
  premiumGold: 'linear-gradient(135deg, #8B6914 0%, #D4AF37 50%, #F0D97D 100%)',
  subtle: 'linear-gradient(180deg, rgba(212, 175, 55, 0.05) 0%, rgba(10, 77, 104, 0.05) 100%)',
  hero: 'linear-gradient(135deg, #0A4D68 0%, #1565A6 50%, #0A4D68 100%)',
};

export const CDA_SHADOWS = {
  sm: '0 1px 2px 0 rgba(5, 45, 68, 0.05)',
  base: '0 1px 3px 0 rgba(5, 45, 68, 0.1), 0 1px 2px 0 rgba(5, 45, 68, 0.06)',
  md: '0 4px 6px -1px rgba(5, 45, 68, 0.1), 0 2px 4px -1px rgba(5, 45, 68, 0.06)',
  lg: '0 10px 15px -3px rgba(5, 45, 68, 0.1), 0 4px 6px -2px rgba(5, 45, 68, 0.05)',
  xl: '0 20px 25px -5px rgba(5, 45, 68, 0.1), 0 10px 10px -5px rgba(5, 45, 68, 0.04)',
  '2xl': '0 25px 50px -12px rgba(5, 45, 68, 0.25)',
  premium: '0 30px 60px -15px rgba(5, 45, 68, 0.3), 0 10px 20px -10px rgba(212, 175, 55, 0.2)',
};
