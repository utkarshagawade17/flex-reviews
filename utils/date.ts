import { format } from 'date-fns';

export function safeFormatDate(date: any, formatString: string): string {
  try {
    const dateObj = new Date(date);
    
    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      return 'Invalid Date';
    }
    
    return format(dateObj, formatString);
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Invalid Date';
  }
}

export function isValidDate(date: any): boolean {
  try {
    const dateObj = new Date(date);
    return !isNaN(dateObj.getTime());
  } catch (error) {
    return false;
  }
}

