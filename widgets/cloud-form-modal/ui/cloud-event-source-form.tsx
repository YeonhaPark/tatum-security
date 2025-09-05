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

  const getFieldConfig = () => {
    switch (provider) {
      case "AWS":
        return {
          label: "Cloud Trail Name",
          fieldName: "eventSource.cloudTrailName" as const,
        };
      case "GCP":
      case "AZURE":
        return {
          label: "Storage Account Name",
          fieldName: "eventSource.storageAccountName" as const,
        };
      default:
        return {
          label: "Cloud Trail Name",
          fieldName: "eventSource.cloudTrailName" as const,
        };
    }
  };

  const { label, fieldName } = getFieldConfig();

  return (
    <div className="mb-10">
      <Label className="mb-3 text-gray-700 font-semibold" htmlFor="eventSource">
        {label}
      </Label>
      <Input id="eventSource" {...register(fieldName)} />
    </div>
  );
};
