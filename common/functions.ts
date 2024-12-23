import { months } from "./consts";

/**
 * Debounces a function, ensuring it is only called after a specified delay since the last invocation.
 *
 * @param func The function to be debounced
 * @param delay The interval (in milliseconds) to wait until invoking the function again
 * @returns
 */
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

/**
 * Helper function to generate a UUID
 * @returns The generated UUID
 */
export function generateUUID(): string {
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

/**
 * Format a timestamp into "Month Date, Year". Year only occurs if the timestamp's year
 * differs from the current year
 * @param timestamp Timestamp to format
 * @returns The timestamp formatted into "Month Date, Year"
 */
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

/**
 * Format a timestamp into a string that describes how long ago that timestamp was. For example, if a timestamp
 * was from 6 hours ago, this function would return "6 hours ago"
 * @param timestamp The timestamp to format
 * @returns A string representing how long ago the timestamp was
 */
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

/**
 * auth0 returns user IDs in a weird format that looks strange when put in a URL (e.g. for
 * the `/profile/[userId]` path). Because of this, I'm applying a transformation to the IDs to make them
 * look more natural, while also ensuring they are unique.
 * @param auth0Id The generated user ID from Auth0
 * @returns A transformed user ID
 */
export function translateAuth0Id(auth0Id?: string | null): string {
  if (!auth0Id) return "";
  let authSections = auth0Id.split("|");

  if (authSections.length !== 2) {
    console.error("Unexpected auth0 ID format");
    return auth0Id;
  }

  if (authSections[0] === "auth0") {
    return "0" + authSections[1];
  } else if (authSections[0] === "facebook") {
    return "1" + authSections[1];
  } else if (authSections[0] === "google-oauth2") {
    return "2" + authSections[1];
  } else if (authSections[0] === "guest") {
    return "3" + authSections[1];
  }

  console.error("Unrecognized auth provider:", authSections[0]);
  return auth0Id;
}
