import { Label, RadioGroup, RadioGroupItem } from "@/shared/ui";
import { Control, Controller, useWatch } from "react-hook-form";
import { CloudFormValues } from "../model";

interface CloudEventProcessingFormProps {
  control: Control<CloudFormValues>;
}
export const CloudEventProcessingForm = ({
  control,
}: CloudEventProcessingFormProps) => {
  const eventProcessEnabled = useWatch({
    name: "eventProcessEnabled",
    control,
  });
  return (
    <div>
      <div>
        <Label
          className="mb-4 text-gray-700 font-semibold"
          id="eventProcessEnabledLabel"
        >
          Event Process Setting
        </Label>
        <Controller
          name="eventProcessEnabled"
          control={control}
          render={({ field }) => (
            <RadioGroup
              className="flex gap-10"
              aria-labelledby="eventProcessEnabledLabel"
              value={field.value ? "true" : "false"}
              onValueChange={(value) => field.onChange(value === "true")}
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="true" id="event-enabled" />
                <Label
                  htmlFor="event-enabled"
                  className={
                    eventProcessEnabled === true
                      ? "text-gray-800"
                      : "text-gray-500"
                  }
                >
                  Enabled
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="false" id="event-disabled" />
                <Label
                  htmlFor="event-disabled"
                  className={
                    eventProcessEnabled === false
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
    </div>
  );
};
