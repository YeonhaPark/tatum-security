import { Label, RadioGroup, RadioGroupItem } from "@/shared/ui";
import { useWatch, Control, Controller } from "react-hook-form";
import { CloudFormValues } from "../model";

interface CloudUserActivityFormProps {
  control: Control<CloudFormValues>;
}

export const CloudUserActivityForm = ({
  control,
}: CloudUserActivityFormProps) => {
  const userActivityEnabled = useWatch({
    control,
    name: "userActivityEnabled",
  });
  return (
    <div className="mb-10">
      <Label
        className="mb-3 text-gray-700 font-semibold"
        id="userActivityEnabledLabel"
      >
        User Activity Setting
      </Label>
      <Controller
        name="userActivityEnabled"
        control={control}
        render={({ field }) => (
          <RadioGroup
            className="flex gap-10"
            aria-labelledby="userActivityEnabledLabel"
            value={field.value ? "true" : "false"}
            onValueChange={(value) => field.onChange(value === "true")}
          >
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="true" id="activity-enabled" />
              <Label
                htmlFor="activity-enabled"
                className={
                  userActivityEnabled === true
                    ? "text-gray-800"
                    : "text-gray-500"
                }
              >
                Enabled
              </Label>
            </div>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="false" id="activity-disabled" />
              <Label
                htmlFor="activity-disabled"
                className={
                  userActivityEnabled === false
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
