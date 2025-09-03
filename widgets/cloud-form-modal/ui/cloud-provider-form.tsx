import { Controller, Control } from "react-hook-form";
import {
  Label,
  Select,
  SelectTrigger,
  SelectItem,
  SelectValue,
  SelectContent,
} from "@/shared/ui";
import { CloudFormValues } from "@/widgets/cloud-form-modal/model/types";

interface CloudProviderFormProps {
  control: Control<CloudFormValues>;
}

export const CloudProviderForm = ({ control }: CloudProviderFormProps) => {
  console.log({ control });
  return (
    <div>
      <Label
        className="mb-3 text-gray-700 font-semibold"
        htmlFor="provider"
        id="providerLabel"
      >
        Select Provider
      </Label>
      <Controller
        name="provider"
        control={control}
        render={({ field }) => (
          <Select {...field} onValueChange={field.onChange}>
            <SelectTrigger id="provider" aria-labelledby="providerLabel">
              <SelectValue placeholder="Select a provider" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AWS">AWS</SelectItem>
              <SelectItem value="GCP">Google Cloud Provider</SelectItem>
              <SelectItem value="AZURE">Azure</SelectItem>
            </SelectContent>
          </Select>
        )}
      />
    </div>
  );
};
