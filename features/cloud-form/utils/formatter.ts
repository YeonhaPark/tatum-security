import { ScheduleScanSetting } from "@/shared/types/clouds";

// Helper function to convert 24-hour to 12-hour format
export const formatHourTo12Hour = (hour: string) => {
  const hourNum = parseInt(hour);
  if (hourNum === 0) return "12 AM";
  if (hourNum === 12) return "12 PM";
  if (hourNum < 12) return `${hourNum} AM`;
  return `${hourNum - 12} PM`;
};

// Helper function to format time as "12:00 PM"
export const formatTime12Hour = (hour: string, minute: string) => {
  const hourNum = parseInt(hour || "12"); // Default to 12 if hour is empty/undefined
  const minuteStr = minute || "0"; // Default to "0" if minute is empty/undefined

  if (isNaN(hourNum)) {
    return "12:00 PM"; // Fallback if parsing fails
  }

  const displayHour =
    hourNum === 0 ? 12 : hourNum > 12 ? hourNum - 12 : hourNum;
  const ampm = hourNum < 12 ? "AM" : "PM";
  return `${displayHour}:${minuteStr.padStart(2, "0")} ${ampm}`;
};

// Helper function to convert frequency to human readable format
export const getFrequencyLabel = (
  frequency: ScheduleScanSetting["frequency"]
) => {
  switch (frequency) {
    case "DAY":
      return "Daily";
    case "HOUR":
      return "Hourly";
    case "WEEK":
      return "Weekly";
    case "MONTH":
      return "Monthly";
    default:
      return frequency;
  }
};
