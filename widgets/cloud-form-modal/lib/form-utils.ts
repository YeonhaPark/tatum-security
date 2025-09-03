import { ScheduleScanSetting } from "@/shared/types/clouds";
import {
  AWSCredential,
  AzureCredential,
  GCPCredential,
} from "@/shared/types/clouds";
import { formatTime12Hour } from "@/shared/lib/formatter";

/**
 * 폼 검증 로직 - cloud-form-modal 전용
 */
export const validateCloudForm = (
  formData: {
    name?: string;
    regionList?: string[];
    provider?: string;
    credentials?: any;
    keyRegistrationMethod?: string;
  },
  errors: Record<string, any>
): boolean => {
  // Use react-hook-form's built-in validation first
  if (Object.keys(errors).length > 0) {
    return false;
  }

  // Basic required fields
  if (
    !formData.name ||
    !formData.regionList ||
    formData.regionList.length === 0
  ) {
    return false;
  }

  // Provider-specific required fields
  if (formData.provider === "AWS") {
    const awsCredentials = formData.credentials as AWSCredential;
    // Only allow ACCESS_KEY method (other methods are disabled)
    if (formData.keyRegistrationMethod !== "ACCESS_KEY") {
      return false;
    }
    return !!(awsCredentials?.accessKey && awsCredentials?.secretAccessKey);
  } else if (formData.provider === "AZURE") {
    const azureCredentials = formData.credentials as AzureCredential;
    return !!(
      azureCredentials?.tenantId &&
      azureCredentials?.subscriptionId &&
      azureCredentials?.applicationId &&
      azureCredentials?.secretKey
    );
  } else if (formData.provider === "GCP") {
    const gcpCredentials = formData.credentials as GCPCredential;
    return !!gcpCredentials?.jsonText;
  }

  return false;
};

/**
 * 스케줄 필드 활성화 여부 체크 - cloud-form-modal 전용
 */
export const getFieldEnabledState = (
  frequency?: ScheduleScanSetting["frequency"]
) => {
  return {
    isDateFieldEnabled: () =>
      frequency !== "DAY" && frequency !== "WEEK" && frequency !== "HOUR",
    isHourFieldEnabled: () => frequency !== "HOUR",
    isDayOfWeekFieldEnabled: () =>
      frequency !== "DAY" && frequency !== "MONTH" && frequency !== "HOUR",
  };
};

/**
 * 스케줄 텍스트 생성 - cloud-form-modal 전용
 */
export const generateScheduleText = (
  frequency: ScheduleScanSetting["frequency"],
  scanScheduleSetting?: ScheduleScanSetting
): string => {
  const setting = scanScheduleSetting;
  const minute = setting?.minute || "0";
  const hour = setting?.hour || "12";
  const date = setting?.date || "1";
  const weekday = setting?.weekday || "MON";

  switch (frequency) {
    case "DAY":
      return `${getFrequencyLabel("DAY")} at ${formatTime12Hour(hour, minute)}`;
    case "WEEK":
      return `${getFrequencyLabel("WEEK")} on ${weekday} at ${formatTime12Hour(hour, minute)}`;
    case "HOUR":
      return minute === "0" ? "Every hour" : `Every hour at ${minute} minutes`;
    case "MONTH":
      return `${getFrequencyLabel("MONTH")} on ${date} at ${formatTime12Hour(hour, minute)}`;
    default:
      return frequency;
  }
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

export const schedule = (setting: ScheduleScanSetting) => {
  const frequency = setting?.frequency || "DAY";
  const minute = setting?.minute || "0";
  const hour = setting?.hour || "12";
  const date = setting?.date || "1";
  const weekday = setting?.weekday || "MON";

  switch (frequency) {
    case "DAY":
      return `${getFrequencyLabel("DAY")} at ${formatTime12Hour(hour, minute)}`;
    case "WEEK":
      return `${getFrequencyLabel("WEEK")} on ${weekday} at ${formatTime12Hour(hour, minute)}`;
    case "HOUR":
      return minute === "0" ? "Every hour" : `Every hour at ${minute} minutes`;
    case "MONTH":
      return `${getFrequencyLabel("MONTH")} on ${date} at ${formatTime12Hour(hour, minute)}`;
  }
};
