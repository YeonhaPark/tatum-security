"use client";

import { useForm } from "react-hook-form";
import { useEffect, useMemo } from "react";
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
import { CloudEventSourceForm } from "./cloud-event-source-form";

interface CloudFormModalProps {
  mode?: "create" | "edit";
  cloudId?: string;
  defaultValues?: CloudFormValues | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BASE_VALUES: CloudFormValues = {
  name: "",
  provider: "AWS",
  regionList: ["global"],
  cloudGroupName: [],
  scheduleScanEnabled: false,
  eventProcessEnabled: false,
  userActivityEnabled: false,
  scanScheduleSetting: {
    frequency: "DAY",
    date: "1",
    weekday: "MON",
    hour: "0",
    minute: "0",
  },
  credentials: { accessKey: "", secretAccessKey: "" },
  credentialType: "ACCESS_KEY",
  proxyUrl: "",
};
export function CloudFormModal({
  mode = "create",
  cloudId,
  defaultValues,
  open,
  onOpenChange,
}: CloudFormModalProps) {
  const isEditMode = mode === "edit";
  const ready = !isEditMode || !!defaultValues;
  const mergedValues = useMemo<CloudFormValues>(() => {
    if (!isEditMode || !defaultValues) return BASE_VALUES;
    return {
      ...BASE_VALUES,
      ...defaultValues,
      scanScheduleSetting: {
        ...BASE_VALUES.scanScheduleSetting,
        ...defaultValues.scanScheduleSetting,
      },
    };
  }, [isEditMode, defaultValues]);
  const {
    register,
    setValue,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<CloudFormValues>({
    mode: "onChange",
    values: ready ? mergedValues : BASE_VALUES,
  });
  const provider = watch("provider");

  const createCloud = useCreateCloud();
  const updateCloud = useUpdateCloud();

  // Load default values for edit mode
  useEffect(() => {
    if (isEditMode && defaultValues && open) {
      const completeValues = {
        ...BASE_VALUES,
        ...defaultValues,
        scanScheduleSetting: {
          ...BASE_VALUES.scanScheduleSetting,
          ...defaultValues.scanScheduleSetting,
        },
      } as CloudFormValues;
      console.log({ completeValues });

      setTimeout(() => {
        reset(completeValues);
      }, 0);
    } else if (!isEditMode && open) {
      // Create 모드일 때는 항상 폼을 초기화
      reset(BASE_VALUES as CloudFormValues);
    }
  }, [defaultValues, isEditMode, open, reset]);

  useEffect(() => {
    if (isEditMode) {
      return;
    }

    // Create 모드이거나 provider가 변경된 경우 credentials 초기화
    if (provider === "AWS") {
      setValue("credentials", {
        accessKey: "",
        secretAccessKey: "",
        roleArn: "",
      } as AWSCredential);
      setValue("credentialType", "ACCESS_KEY");
    } else if (provider === "AZURE") {
      setValue("credentials", {
        tenantId: "",
        subscriptionId: "",
        applicationId: "",
        secretKey: "",
      } as AzureCredential);
      setValue("credentialType", "APPLICATION");
    } else if (provider === "GCP") {
      setValue("credentials", { projectId: "", jsonText: "" } as GCPCredential);
      setValue("credentialType", "JSON_TEXT");
    }
  }, [provider, isEditMode, defaultValues, setValue]);

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
        {/* Edit 모드에서 데이터 로딩 중일 때 로딩 UI */}
        {isEditMode && !defaultValues ? (
          <>
            <div className="flex-shrink-0 p-6 pb-0">
              <DialogHeader>
                <DialogTitle className="text-xl">
                  {isEditMode ? "Edit Cloud" : "Create Cloud"}
                </DialogTitle>
              </DialogHeader>
            </div>
            <div className="flex flex-col h-full items-center justify-center">
              <div className="flex items-center gap-3">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
                <span className="text-gray-600">Loading cloud data...</span>
              </div>
            </div>
          </>
        ) : (
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
              <hr className="my-10 border-gray-200" />
              <CloudEventSourceForm control={control} register={register} />
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
                  disabled={!isValid || isSubmitting}
                  className={cn({
                    "opacity-50 cursor-not-allowed": !isValid || isSubmitting,
                  })}
                >
                  {isSubmitting
                    ? "Submitting..."
                    : isEditMode
                      ? "Update"
                      : "Submit"}
                </Button>
              </DialogFooter>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
