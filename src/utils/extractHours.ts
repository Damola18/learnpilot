export const extractHours = (timeStr: string): number => {
    const hoursMatch = timeStr.match(/(\d+)\s*hours?/i);
    if (hoursMatch) {
      return parseInt(hoursMatch[1]);
    }
    const minutesMatch = timeStr.match(/(\d+)\s*min/i);
    if (minutesMatch) {
      return parseInt(minutesMatch[1]) / 60;
    }
    const numberMatch = timeStr.match(/(\d+)/);
    return numberMatch ? parseInt(numberMatch[1]) : 0;
};