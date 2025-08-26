  export const formatTime = (timestamp: string | number | Date) => {
    const now = new Date();
    const past = new Date(timestamp);

    if (isNaN(past.getTime())) {
      return 'Invalid date';
    }

    const diffInMs = now.getTime() - past.getTime();

    if (diffInMs < 0) {
      return 'In the future';
    }

    const seconds = Math.floor(diffInMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 60) {
      return seconds <= 1 ? 'just now' : `${seconds} secs ago`;
    } else if (minutes < 60) {
      return minutes === 1 ? '1 min ago' : `${minutes} mins ago`;
    } else if (hours < 24) {
      return hours === 1 ? '1 hr ago' : `${hours} hrs ago`;
    } else if (days < 30) {
      return days === 1 ? '1 day ago' : `${days} days ago`;
    } else if (months < 12) {
      return months === 1 ? '1 month ago' : `${months} months ago`;
    } else {
      return years === 1 ? '1 year ago' : `${years} years ago`;
    }
  };

  export const formatPathDuration = (duration: string) => {
    return duration.replace(/\s*min$/i, '').trim()
  }