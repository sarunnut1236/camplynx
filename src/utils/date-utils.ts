/**
 * Format a date string to a human-readable format (e.g., "Jan 1, 2023")
 * @param dateString ISO date string
 * @returns Formatted date string
 */
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    // Check if the date is invalid
    if (isNaN(date.getTime())) {
      return dateString;
    }
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

/**
 * Format a date range with a consistent format
 * @param startDate ISO date string for start date
 * @param endDate ISO date string for end date
 * @returns Formatted date range string
 */
export const formatDateRange = (startDate: string, endDate: string): string => {
  const start = formatDate(startDate);
  const end = formatDate(endDate);
  
  return `${start} - ${end}`;
};

/**
 * Calculate the number of days between two dates
 * @param startDate ISO date string for start date
 * @param endDate ISO date string for end date
 * @returns Number of days between dates (inclusive)
 */
export const daysBetweenDates = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Reset time part to avoid time zone issues
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  
  // Calculate difference in milliseconds
  const diffTime = Math.abs(end.getTime() - start.getTime());
  
  // Convert to days and add 1 to include both start and end dates
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
}; 