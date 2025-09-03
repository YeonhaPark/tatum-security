"use client";

import { useForm } from "react-hook-form";
import { useEffect } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/ui";
import {
  AWSCredential,
  AzureCredential,
  GCPCredential,
} from "@/shared/types/clouds";
import { CloudFormValues } from "../model/types";
import { cn } from "@/shared/lib/utils";
import { useCreateCloud, useUpdateCloud } from "@/entities/cloud";
import {
  CloudNameForm,
  CloudProviderForm,
  CloudCredentialTypeForm,
  CloudCredentialsForm,
  CloudEventProcessingForm,
  CloudGroupForm,
  CloudProxyUrlForm,
  CloudRegionForm,
  CloudUserActivityForm,
  CloudScanFrequencyForm,
  CloudScanScheduleSettingForm,
} from "./index";

import { getFieldEnabledState } from "../lib";

interface CloudFormModalProps {
  mode?: "create" | "edit";
  cloudId?: string;
  defaultValues?: CloudFormValues | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CloudFormModal({
  mode = "create",
  cloudId,
  defaultValues,
  open,
  onOpenChange,
}: CloudFormModalProps) {
  const isEditMode = mode === "edit";

  const {
    register,
    setValue,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<CloudFormValues>({
    mode: "onSubmit",
    defaultValues: {
      name: "",
      provider: "AWS",
      regionList: ["global"],
      cloudGroupName: [],
      scheduleScanEnabled: true,
      eventProcessEnabled: true,
      userActivityEnabled: true,
      scanScheduleSetting: {
        frequency: "DAY",
        date: "1",
        weekday: "MON",
        hour: "12",
        minute: "0",
      },
      credentials: {
        accessKey: "",
        secretAccessKey: "",
      },
      credentialType: "ACCESS_KEY",
    } as CloudFormValues,
  });
  const provider = watch("provider");

  const createCloud = useCreateCloud();
  const updateCloud = useUpdateCloud();

  // Load default values for edit mode
  useEffect(() => {
    if (defaultValues && isEditMode && open) {
      reset(defaultValues);
    }
  }, [defaultValues, isEditMode, open, reset]);

  useEffect(() => {
    // 편집 모드에서는 기존 credentials 값을 보존
    if (isEditMode && defaultValues) {
      return;
    }

    if (provider === "AWS") {
      // AWS 기본 credential shape
      setValue("credentials", {
        accessKey: "",
        secretAccessKey: "",
        roleArn: "",
      } as AWSCredential);
      // keyRegistrationMethod 기본값도 보장
    } else if (provider === "AZURE") {
      setValue("credentials", {
        tenantId: "",
        subscriptionId: "",
        applicationId: "",
        secretKey: "",
      } as AzureCredential);
    } else if (provider === "GCP") {
      setValue("credentials", { projectId: "", jsonText: "" } as GCPCredential);
    }
  }, [provider, isEditMode, setValue]);

  const onSubmit = async (data: CloudFormValues) => {
    const cleanData = { ...data };
    const scanScheduleSetting = watch("scanScheduleSetting");
    const { isDateFieldEnabled, isDayOfWeekFieldEnabled, isHourFieldEnabled } =
      getFieldEnabledState(scanScheduleSetting.frequency);
    // Only include schedule fields that are actually enabled
    if (data.scheduleScanEnabled) {
      // Reset disabled fields to default values within scanScheduleSetting
      if (!isDateFieldEnabled()) {
        cleanData.scanScheduleSetting = {
          ...cleanData.scanScheduleSetting,
          date: "1",
        };
      }
      if (!isDayOfWeekFieldEnabled()) {
        cleanData.scanScheduleSetting = {
          ...cleanData.scanScheduleSetting,
          weekday: "MON",
        };
      }
      if (!isHourFieldEnabled()) {
        cleanData.scanScheduleSetting = {
          ...cleanData.scanScheduleSetting,
          hour: "0",
        };
      }
    }

    console.log(`=== ${isEditMode ? "UPDATE" : "CREATE"} PAYLOAD ===`);
    console.log("PAYLOAD:", cleanData);

    if (isEditMode && cloudId) {
      await updateCloud.mutateAsync({ id: cloudId, data: cleanData });
    } else {
      await createCloud.mutateAsync(cleanData);
    }

    onOpenChange(false);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        aria-describedby={undefined}
        className="max-w-2xl h-[60%] min-h-[520px] flex flex-col p-0"
        onEscapeKeyDown={(e) => {
          e.preventDefault();
        }}
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col h-full"
        >
          <div className="flex-shrink-0 p-6 pb-0">
            <DialogHeader>
              <DialogTitle className="text-xl">
                {isEditMode ? "Edit Cloud" : "Create Cloud"}
              </DialogTitle>
            </DialogHeader>
          </div>
          <div className="flex-1 overflow-y-auto p-6 pt-6">
            <div className="space-y-6">
              <CloudNameForm register={register} errors={errors} />
              <CloudProviderForm control={control} />
              <CloudCredentialTypeForm control={control} />
            </div>
            <hr className="my-10 border-gray-200" />
            <div>
              <div className="space-y-6">
                <CloudCredentialsForm register={register} control={control} />
              </div>
            </div>
            <hr className="my-10 border-gray-200" />
            <div>
              <div className="space-y-6">
                <CloudRegionForm control={control} />
                <CloudProxyUrlForm register={register} />
              </div>
            </div>
            <hr className="my-10 border-gray-200" />
            <CloudGroupForm control={control} />
            <hr className="my-10 border-gray-200" />
            <CloudScanScheduleSettingForm control={control} />
            <CloudScanFrequencyForm control={control} />
            <hr className="my-10 border-gray-200" />
            <CloudEventProcessingForm control={control} />
            <hr className="my-10 border-gray-200" />
            <CloudUserActivityForm control={control} />
          </div>
          <div className="flex-shrink-0 p-6 pt-4 border-t border-gray-200">
            <DialogFooter className="px-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onOpenChange(false);
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!isValid}
                className={cn({
                  "opacity-50 cursor-not-allowed": !isValid,
                })}
              >
                {isEditMode ? "Update" : "Submit"}
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
