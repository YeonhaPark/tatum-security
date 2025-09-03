import { Control, Controller } from "react-hook-form";
import { Label, MultiSelect } from "@/shared/ui";
import { CloudFormValues } from "../model";

interface CloudGroupFormProps {
  control: Control<CloudFormValues>;
}

export const CloudGroupForm = ({ control }: CloudGroupFormProps) => {
  return (
    <div>
      <div>
        <Label
          className="mb-3 text-gray-700 font-semibold"
          htmlFor="cloudGroupName"
        >
          Cloud Group
        </Label>
        <Controller
          name="cloudGroupName"
          control={control}
          render={({ field }) => (
            <MultiSelect
              options={[
                { label: "AWS-Group", value: "AWS-Group" },
                { label: "GCP-Group", value: "GCP-Group" },
                { label: "Azure-Group", value: "Azure-Group" },
              ]}
              selected={field.value || []}
              onChange={field.onChange}
              placeholder="Select group..."
              className="w-full"
            />
          )}
        />
      </div>
    </div>
  );
};
