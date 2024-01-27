import { months } from "./consts";

export function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: NodeJS.Timeout | null;

  return function (...args: Parameters<T>) {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      func(...args);
      timer = null;
    }, delay);
  };
}

export function generateUUID() {
  var d = new Date().getTime();
  var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
    }
  );
  return uuid;
}

function formatTimestamp(timestamp: number): string {
  let date = new Date(timestamp).getDate();
  let month = new Date(timestamp).getMonth();
  let year = new Date(timestamp).getFullYear();

  let dateString = `${months[month]} ${date}`;

  if (year !== new Date().getFullYear()) {
    dateString += `, ${year}`;
  }

  return dateString;
}

export function formatRelativeTimestamp(timestamp: string): string {
  let ts = Date.parse(timestamp);
  let nowTs = Date.now();

  let difference = nowTs - ts;

  if (difference < 60 * 1000) {
    // Less than a minute ago
    return "Just now";
  } else if (difference < 60 * 60 * 1000) {
    // Less than an hour ago
    let differenceInMinutes = Math.floor(difference / (60 * 1000));
    return `${differenceInMinutes} minute${
      differenceInMinutes === 1 ? "" : "s"
    } ago`;
  } else if (difference < 24 * 60 * 60 * 1000) {
    // Less than a day ago
    let differenceInHours = Math.floor(difference / (60 * 60 * 1000));
    return `${differenceInHours} hour${differenceInHours === 1 ? "" : "s"} ago`;
  } else if (difference < 2 * 24 * 60 * 60 * 1000) {
    return "Yesterday";
  } else {
    return formatTimestamp(ts);
  }
}
