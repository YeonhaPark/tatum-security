import { useWatch, UseFormRegister, Control } from "react-hook-form";
import { Label, Input } from "@/shared/ui";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { CloudFormValues } from "@/widgets/cloud-form-modal/model/types";
import { useState } from "react";

interface CloudCredentialsFormProps {
  register: UseFormRegister<CloudFormValues>;
  control: Control<CloudFormValues>;
}

export const CloudCredentialsForm = ({
  register,
  control,
}: CloudCredentialsFormProps) => {
  const [showSecretKey, setShowSecretKey] = useState<boolean>(false);
  const [showAzureSecretKey, setShowAzureSecretKey] = useState<boolean>(false);

  const provider = useWatch({ control, name: "provider" });

  return (
    <>
      {" "}
      {/* Credentials Section - Render by Provider */}
      <div className="leading-none text-sm text-gray-700 font-semibold">
        Credentials
      </div>
      {provider === "AWS" && (
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
            <div className="relative w-[60%]">
              <Input
                id="credentials.secretAccessKey"
                type={showSecretKey ? "text" : "password"}
                autoComplete="off"
                spellCheck="false"
                autoCorrect="off"
                autoCapitalize="none"
                {...register("credentials.secretAccessKey", {
                  required: true,
                })}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                aria-label={
                  showSecretKey ? "Hide secret key" : "Show secret key"
                }
                aria-pressed={showSecretKey}
                onClick={() => setShowSecretKey(!showSecretKey)}
              >
                {showSecretKey ? (
                  <EyeOffIcon className="h-4 w-4 text-gray-400" />
                ) : (
                  <EyeIcon className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
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
      )}
      {provider === "AZURE" && (
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
            <div className="relative w-[60%]">
              <Input
                id="credentials.secretKey"
                type={showAzureSecretKey ? "text" : "password"}
                autoComplete="off"
                spellCheck={false}
                autoCorrect="off"
                autoCapitalize="none"
                {...register("credentials.secretKey", {
                  required: true,
                })}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowAzureSecretKey(!showAzureSecretKey)}
                aria-label={
                  showAzureSecretKey ? "Hide secret key" : "Show secret key"
                }
                aria-pressed={showAzureSecretKey}
              >
                {showAzureSecretKey ? (
                  <EyeOffIcon className="h-4 w-4 text-gray-400" />
                ) : (
                  <EyeIcon className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>
        </>
      )}
      {provider === "GCP" && (
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
      )}{" "}
    </>
  );
};
