// entities/cloud/ui - Cloud 도메인 컴포넌트
"use client";

import { Control, UseFormRegister } from "react-hook-form";
import { Label } from "@/shared/ui/label";
import { Input } from "@/shared/ui/input";
import { PasswordInput } from "@/shared/ui/password-input";
import { CloudFormValues } from "@/widgets/cloud-form-modal/model/types";

interface CloudCredentialsFormProps {
  provider: "AWS" | "AZURE" | "GCP";
  control: Control<CloudFormValues>;
  register: UseFormRegister<CloudFormValues>;
}

export function CloudCredentialsForm({
  provider,
  control,
  register,
}: CloudCredentialsFormProps) {
  if (provider === "AWS") {
    return (
      <>
        <div className="flex justify-end gap-4 items-center">
          <Label
            className="text-gray-700 font-semibold"
            htmlFor="credentials.accessKey"
          >
            Access Key<span className="text-red-500">*</span>
          </Label>
          <Input
            className="w-[60%]"
            id="credentials.accessKey"
            autoComplete="off"
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="none"
            {...register("credentials.accessKey", {
              required: true,
            })}
          />
        </div>
        <div className="flex justify-end gap-4 items-center">
          <Label
            className="text-gray-700 font-semibold"
            htmlFor="credentials.secretAccessKey"
          >
            Secret Key<span className="text-red-500">*</span>
          </Label>
          <PasswordInput
            className="w-[60%]"
            id="credentials.secretAccessKey"
            {...register("credentials.secretAccessKey", {
              required: true,
            })}
          />
        </div>
        <div className="flex justify-end items-center gap-4">
          <Label
            className=" text-gray-700 font-semibold"
            htmlFor="credentials.roleArn"
          >
            Role ARN
          </Label>
          <Input
            className="w-[60%]"
            id="credentials.roleArn"
            {...register("credentials.roleArn")}
          />
        </div>
      </>
    );
  }

  if (provider === "AZURE") {
    return (
      <>
        <div className="flex justify-end gap-4 items-center">
          <Label
            className="text-gray-700 font-semibold"
            htmlFor="credentials.tenantId"
          >
            Tenant ID<span className="text-red-500">*</span>
          </Label>
          <Input
            className="w-[60%]"
            id="credentials.tenantId"
            {...register("credentials.tenantId", {
              required: true,
            })}
          />
        </div>
        <div className="flex justify-end gap-4 items-center">
          <Label
            className="text-gray-700 font-semibold"
            htmlFor="credentials.subscriptionId"
          >
            Subscription ID<span className="text-red-500">*</span>
          </Label>
          <Input
            className="w-[60%]"
            id="credentials.subscriptionId"
            {...register("credentials.subscriptionId", {
              required: true,
            })}
          />
        </div>
        <div className="flex justify-end gap-4 items-center">
          <Label
            className="text-gray-700 font-semibold"
            htmlFor="credentials.applicationId"
          >
            Application ID<span className="text-red-500">*</span>
          </Label>
          <Input
            className="w-[60%]"
            id="credentials.applicationId"
            {...register("credentials.applicationId", {
              required: true,
            })}
          />
        </div>
        <div className="flex justify-end gap-4 items-center">
          <Label
            className=" text-gray-700 font-semibold"
            htmlFor="credentials.secretKey"
          >
            Secret Key<span className="text-red-500">*</span>
          </Label>
          <PasswordInput
            className="w-[60%]"
            id="credentials.secretKey"
            {...register("credentials.secretKey", {
              required: true,
            })}
          />
        </div>
      </>
    );
  }

  if (provider === "GCP") {
    return (
      <>
        <div className="flex justify-end gap-4 items-center">
          <Label
            className="text-gray-700 font-semibold"
            htmlFor="credentials.projectId"
          >
            Project ID
          </Label>
          <Input
            className="w-[60%]"
            id="credentials.projectId"
            {...register("credentials.projectId")}
          />
        </div>
        <div className="flex justify-end gap-4 items-center">
          <Label
            className=" text-gray-700 font-semibold"
            htmlFor="credentials.jsonText"
          >
            JSON Text<span className="text-red-500">*</span>
          </Label>
          <Input
            className="w-[60%]"
            id="credentials.jsonText"
            autoComplete="off"
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="none"
            {...register("credentials.jsonText", {
              required: true,
            })}
          />
        </div>
      </>
    );
  }

  return null;
}
