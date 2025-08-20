export function parseDurationToMinutes(duration: string): number {
  if (!duration || typeof duration !== 'string') {
    return 0;
  }
  
  const match = duration.match(/([0-9.]+)\s*(hour|hr|min|minute)s?/i);
  if (!match) {
    return 0;
  }
  
  const value = parseFloat(match[1]);
  const unit = match[2].toLowerCase();
  
  if (unit.startsWith('hour') || unit.startsWith('hr')) {
    return Math.round(value * 60); 
  } else {
    return Math.round(value); 
  }
}

export function parseDurationToHours(duration: string): number {
  const minutes = parseDurationToMinutes(duration);
  return Math.round((minutes / 60) * 100) / 100; 
}