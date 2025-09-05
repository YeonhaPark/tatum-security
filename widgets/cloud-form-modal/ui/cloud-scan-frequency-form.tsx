import { useWatch } from "react-hook-form";
import { CloudFormValues } from "../model";
import {
  Label,
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/shared/ui";
import { Control, Controller } from "react-hook-form";
import { getFieldEnabledState, schedule } from "../lib/form-utils";
import { cn } from "@/shared/lib/utils";
import { formatHourTo12Hour } from "@/shared/lib/formatter";
interface CloudScanFrequencyFormProps {
  control: Control<CloudFormValues>;
}

export const CloudScanFrequencyForm = ({
  control,
}: CloudScanFrequencyFormProps) => {
  const scheduleScanEnabled = useWatch({
    control,
    name: "scheduleScanEnabled",
  });
  const scanScheduleSetting = useWatch({
    control,
    name: "scanScheduleSetting",
  });
  const { isDateFieldEnabled, isDayOfWeekFieldEnabled, isHourFieldEnabled } =
    getFieldEnabledState(scanScheduleSetting?.frequency ?? "DAY");

  return scheduleScanEnabled ? (
    <>
      <hr className="my-10 border-gray-200" />
      <div>
        <div>
          <Label className="mb-5 text-gray-700 font-semibold">
            Set Scan Frequency
          </Label>
          <div className="text-gray-500 text-sm mb-5">
            Scan Schedule: <span>{schedule(scanScheduleSetting)}</span>
          </div>
          <Controller
            name="scanScheduleSetting.frequency"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DAY">Daily</SelectItem>
                  <SelectItem value="HOUR">Hourly</SelectItem>
                  <SelectItem value="WEEK">Weekly</SelectItem>
                  <SelectItem value="MONTH">Monthly</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="flex flex-col gap-4 items-end mt-6">
          <div className="flex gap-4">
            <Label
              className={`text-gray-700 font-semibold ${!isDateFieldEnabled() ? "text-gray-400" : ""}`}
            >
              Date
            </Label>
            <Controller
              name="scanScheduleSetting.date"
              control={control}
              render={({ field }) => (
                <Select
                  value={!isDateFieldEnabled() ? "-" : field.value}
                  onValueChange={(value) => {
                    if (value !== "-") {
                      field.onChange(value);
                    }
                  }}
                  disabled={!isDateFieldEnabled()}
                >
                  <SelectTrigger
                    className={cn({
                      "bg-gray-200 opacity-50 cursor-not-allowed":
                        !isDateFieldEnabled(),
                    })}
                  >
                    <SelectValue placeholder="1" />
                  </SelectTrigger>
                  <SelectContent>
                    {!isDateFieldEnabled() && (
                      <SelectItem value="-" disabled>
                        -
                      </SelectItem>
                    )}
                    {Array.from({ length: 28 }, (_, i) => (
                      <SelectItem key={i + 1} value={String(i + 1)}>
                        {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="flex gap-4">
            <Label
              className={cn({
                "text-gray-700 font-semibold": true,
                "text-gray-400": !isDayOfWeekFieldEnabled(),
              })}
            >
              Day of Week
            </Label>
            <Controller
              name="scanScheduleSetting.weekday"
              control={control}
              render={({ field }) => (
                <Select
                  value={!isDayOfWeekFieldEnabled() ? "-" : field.value}
                  onValueChange={(value) => {
                    if (value !== "-") {
                      field.onChange(value);
                    }
                  }}
                  disabled={!isDayOfWeekFieldEnabled()}
                >
                  <SelectTrigger
                    className={cn({
                      "opacity-50 cursor-not-allowed bg-gray-200":
                        !isDayOfWeekFieldEnabled(),
                    })}
                  >
                    <SelectValue placeholder="MON" />
                  </SelectTrigger>
                  <SelectContent>
                    {!isDayOfWeekFieldEnabled() && (
                      <SelectItem value="-" disabled>
                        -
                      </SelectItem>
                    )}
                    <SelectItem value="MON">Monday</SelectItem>
                    <SelectItem value="TUE">Tuesday</SelectItem>
                    <SelectItem value="WED">Wednesday</SelectItem>
                    <SelectItem value="THU">Thursday</SelectItem>
                    <SelectItem value="FRI">Friday</SelectItem>
                    <SelectItem value="SAT">Saturday</SelectItem>
                    <SelectItem value="SUN">Sunday</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="flex gap-4">
            <Label
              className={cn({
                "text-gray-700 font-semibold": true,
                "text-gray-400": !isHourFieldEnabled(),
              })}
            >
              Hour
            </Label>
            <Controller
              name="scanScheduleSetting.hour"
              control={control}
              render={({ field }) => (
                <Select
                  value={!isHourFieldEnabled() ? "-" : field.value}
                  onValueChange={(value) => {
                    if (value !== "-") {
                      field.onChange(value);
                    }
                  }}
                  disabled={!isHourFieldEnabled()}
                >
                  <SelectTrigger
                    className={cn({
                      "opacity-50 cursor-not-allowed bg-gray-200":
                        !isHourFieldEnabled(),
                    })}
                  >
                    <SelectValue
                      placeholder={!isHourFieldEnabled() ? "-" : "12 PM"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {!isHourFieldEnabled() && (
                      <SelectItem value="-" disabled>
                        -
                      </SelectItem>
                    )}
                    {Array.from({ length: 24 }, (_, i) => (
                      <SelectItem key={i} value={String(i)}>
                        {formatHourTo12Hour(String(i))}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="flex gap-4">
            <Label className="text-gray-700 font-semibold">Minute</Label>
            <Controller
              name="scanScheduleSetting.minute"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="0" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => (
                      <SelectItem key={i * 5} value={String(i * 5)}>
                        {String(i * 5).padStart(2, "0")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>
      </div>
    </>
  ) : null;
};
