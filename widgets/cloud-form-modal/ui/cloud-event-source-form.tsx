import { Label, Input } from "@/shared/ui";
import { Control, UseFormRegister, useWatch } from "react-hook-form";
import { CloudFormValues } from "../model";

interface CloudEventSourceFormProps {
  register: UseFormRegister<CloudFormValues>;
  control: Control<CloudFormValues>;
}
export const CloudEventSourceForm = ({
  register,
  control,
}: CloudEventSourceFormProps) => {
  const provider = useWatch({ name: "provider", control });
  const label = () => {
    switch (provider) {
      case "AWS":
        return "Cloud Trail Name";
      case "GCP":
      case "AZURE":
        return "Storage Account Name";
      default:
        return "Cloud Trail Name";
    }
  };
  return (
    <div className="mb-10">
      <Label className="mb-3 text-gray-700 font-semibold" htmlFor="eventSource">
        {label()}
      </Label>
      <Input id="eventSource" {...register("eventSource")} />
    </div>
  );
};
