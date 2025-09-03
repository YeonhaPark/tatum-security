import { Control, Controller } from "react-hook-form";
import { Label, MultiSelect } from "@/shared/ui";
import { CloudFormValues } from "../model";
import { getAWSRegionOptions } from "@/shared/types/clouds";
interface CloudRegionFormProps {
  control: Control<CloudFormValues>;
}
export const CloudRegionForm = ({ control }: CloudRegionFormProps) => {
  return (
    <div>
      <Label className="mb-3 text-gray-700 font-semibold" htmlFor="regionLabel">
        Region
      </Label>
      <Controller
        name="regionList"
        control={control}
        render={({ field }) => (
          <MultiSelect
            options={getAWSRegionOptions()}
            selected={field.value || []}
            onChange={field.onChange}
            placeholder="Select regions..."
            className="w-full"
          />
        )}
      />
    </div>
  );
};
