import { UseFormRegister } from "react-hook-form";
import { Label } from "@/shared/ui/label";
import { Input } from "@/shared/ui/input";
import { CloudFormValues } from "../model/types";

interface CloudNameFormProps {
  register: UseFormRegister<CloudFormValues>;
  errors: any;
}

export function CloudNameForm({ register, errors }: CloudNameFormProps) {
  return (
    <div>
      <Label className="mb-3 text-gray-700 font-semibold" htmlFor="name">
        Cloud Name<span className="text-red-500">*</span>
      </Label>
      <Input
        id="name"
        placeholder="Please enter the cloud name."
        {...register("name", { required: true })}
      />
      {errors.name && (
        <p className="text-sm mt-2 text-red-500">Cloud name is required.</p>
      )}
    </div>
  );
}
