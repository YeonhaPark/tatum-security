// widgets/cloud-form-modal/ui - Widget 전용 컴포넌트
"use client";

import { Control, UseFormRegister } from "react-hook-form";
import { Label } from "@/shared/ui/label";
import { Input } from "@/shared/ui/input";
import { CloudFormValues } from "../model/types";

interface CloudBasicInfoFormProps {
  control: Control<CloudFormValues>;
  register: UseFormRegister<CloudFormValues>;
  errors: any;
}

export function CloudBasicInfoForm({
  control,
  register,
  errors,
}: CloudBasicInfoFormProps) {
  return (
    <div className="space-y-6">
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
          <p className="text-sm text-red-500">Cloud name is required.</p>
        )}
      </div>
    </div>
  );
}
