import { Label, RadioGroupItem, RadioGroup } from "@/shared/ui";
import { CloudFormValues } from "../model";
import { Control, Controller, useWatch } from "react-hook-form";

interface CloudScanScheduleSettingFormProps {
  control: Control<CloudFormValues>;
}

export const CloudScanScheduleSettingForm = ({
  control,
}: CloudScanScheduleSettingFormProps) => {
  const scheduleScanEnabled = useWatch({
    name: "scheduleScanEnabled",
    control,
  });

  return (
    <div>
      <Label
        className="mb-4 text-gray-700 font-semibold"
        id="scheduleScanLabel"
      >
        Scan Schedule Setting
      </Label>
      <Controller
        name="scheduleScanEnabled"
        control={control}
        render={({ field }) => (
          <RadioGroup
            className="flex gap-10"
            aria-labelledby="scheduleScanLabel"
            value={field.value ? "true" : "false"}
            onValueChange={(value) => field.onChange(value === "true")}
          >
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="true" id="schedule-enabled" />
              <Label
                htmlFor="schedule-enabled"
                className={
                  scheduleScanEnabled === true
                    ? "text-gray-800"
                    : "text-gray-500"
                }
              >
                Enabled
              </Label>
            </div>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="false" id="schedule-disabled" />
              <Label
                htmlFor="schedule-disabled"
                className={
                  scheduleScanEnabled === false
                    ? "text-gray-900 font-semibold"
                    : "text-gray-600"
                }
              >
                Disabled
              </Label>
            </div>
          </RadioGroup>
        )}
      />
    </div>
  );
};
