"use client";

import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import {
  AWSCredential,
  AzureCredential,
  GCPCredential,
  Cloud,
  ScheduleScanSetting,
  getAWSRegionOptions,
} from "@/shared/types/cloud";
import { PlusIcon, EyeOffIcon, EyeIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radio-group";
import { MultiSelect } from "@/shared/ui/multi-select";
import { cn } from "@/shared/lib/utils";
import {
  formatHourTo12Hour,
  formatTime12Hour,
  getFrequencyLabel,
} from "../utils/formatter";

type CloudFormValues = {
  name: string;
  regionList: string[];
  proxyUrl?: string;
  scheduleScanEnabled: Cloud["scheduleScanEnabled"];
  frequency: ScheduleScanSetting["frequency"];
  date: ScheduleScanSetting["date"];
  weekday: ScheduleScanSetting["weekday"];
  hour: ScheduleScanSetting["hour"];
  minute: ScheduleScanSetting["minute"];
} & (
  | {
      provider: "AWS";
      keyRegistrationMethod: "ACCESS_KEY" | "ASSUME_ROLE" | "ROLES_ANYWHERE";
      credentials: AWSCredential;
    }
  | {
      provider: "AZURE";
      credentials: AzureCredential;
    }
  | {
      provider: "GCP";
      credentials: GCPCredential;
    }
);

export function CreateCloudModal() {
  const [open, setOpen] = useState<boolean>(false);
  const [showSecretKey, setShowSecretKey] = useState<boolean>(false);
  const [showAzureSecretKey, setShowAzureSecretKey] = useState<boolean>(false);
  const {
    register,
    unregister,
    setValue,
    handleSubmit,
    control,
    watch,
    formState: { errors, isValid, isDirty },
  } = useForm<CloudFormValues>({
    mode: "onChange",
    defaultValues: {
      name: "",
      provider: "AWS",
      keyRegistrationMethod: "ACCESS_KEY",
      regionList: ["global"],
      scheduleScanEnabled: true,
      frequency: "DAY",
      date: "1",
      weekday: "MON",
      hour: "12",
      minute: "0",
      credentials: {
        accessKey: "",
        secretAccessKey: "",
      },
    } as CloudFormValues,
  });
  const provider = watch("provider");
  const frequency = watch("frequency");
  const name = watch("name");
  const credentials = watch("credentials");
  const regionList = watch("regionList");

  // Helper function to check if all required fields are filled
  const isFormValid = () => {
    // Use react-hook-form's built-in validation first
    if (Object.keys(errors).length > 0) {
      return false;
    }

    // Basic required fields
    if (!name || !regionList || regionList.length === 0) {
      return false;
    }

    // Provider-specific required fields
    if (provider === "AWS") {
      const awsCredentials = credentials as AWSCredential;
      // Only allow ACCESS_KEY method (other methods are disabled)
      const keyMethod = watch("keyRegistrationMethod");
      if (keyMethod !== "ACCESS_KEY") {
        return false;
      }
      return !!(awsCredentials?.accessKey && awsCredentials?.secretAccessKey);
    } else if (provider === "AZURE") {
      const azureCredentials = credentials as AzureCredential;
      return !!(
        azureCredentials?.tenantId &&
        azureCredentials?.subscriptionId &&
        azureCredentials?.applicationId &&
        azureCredentials?.secretKey
      );
    } else if (provider === "GCP") {
      const gcpCredentials = credentials as GCPCredential;
      return !!gcpCredentials?.jsonText;
    }

    return false;
  };

  // Helper functions to determine field availability
  const isDateFieldEnabled = () => {
    return frequency !== "DAY" && frequency !== "WEEK" && frequency !== "HOUR";
  };

  const isHourFieldEnabled = () => {
    return frequency !== "HOUR";
  };

  const isDayOfWeekFieldEnabled = () => {
    return frequency !== "DAY" && frequency !== "MONTH" && frequency !== "HOUR";
  };

  const schedule = (frequency: ScheduleScanSetting["frequency"]) => {
    const minute = watch("minute") || "0";
    const hour = watch("hour") || "12";
    const date = watch("date") || "1";
    const weekday = watch("weekday") || "MON";

    switch (frequency) {
      case "DAY":
        return `${getFrequencyLabel("DAY")} at ${formatTime12Hour(hour, minute)}`;
      case "WEEK":
        return `${getFrequencyLabel("WEEK")} on ${weekday} at ${formatTime12Hour(hour, minute)}`;
      case "HOUR":
        return minute === "0"
          ? "Every hour"
          : `Every hour at ${minute} minutes`;
      case "MONTH":
        return `${getFrequencyLabel("MONTH")} on ${date} at ${formatTime12Hour(hour, minute)}`;
    }
  };
  useEffect(() => {
    if (provider === "AWS") {
      // AWS 기본 credential shape
      setValue("credentials", {
        accessKey: "",
        secretAccessKey: "",
        roleArn: "",
      } as AWSCredential);
      // keyRegistrationMethod 기본값도 보장
      setValue("keyRegistrationMethod", "ACCESS_KEY");
    } else if (provider === "AZURE") {
      setValue("credentials", {
        tenantId: "",
        subscriptionId: "",
        applicationId: "",
        secretKey: "",
      } as AzureCredential);
      unregister("keyRegistrationMethod");
    } else if (provider === "GCP") {
      setValue("credentials", { projectId: "", jsonText: "" } as GCPCredential);
      unregister("keyRegistrationMethod");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider]);

  const onSubmit = (data: CloudFormValues) => {
    // Create a clean copy of data with only enabled fields
    const cleanData = { ...data };

    // Only include schedule fields that are actually enabled
    if (data.scheduleScanEnabled) {
      // Reset disabled fields to default values or exclude them
      if (!isDateFieldEnabled()) cleanData.date = "1"; // Default value for disabled date field
      if (!isDayOfWeekFieldEnabled()) cleanData.weekday = "MON"; // Default value for disabled weekday field
      if (!isHourFieldEnabled()) cleanData.hour = "0"; // Default value for disabled hour field
    }

    console.log("=== CLOUD FORM SUBMISSION ===");
    console.log("Form Data:", cleanData);
    console.log("Cloud Name:", cleanData.name);
    console.log("Provider:", cleanData.provider);
    console.log("Region List:", cleanData.regionList);
    console.log("Proxy URL:", cleanData.proxyUrl || "Not specified");
    console.log("Schedule Scan Enabled:", cleanData.scheduleScanEnabled);

    if (cleanData.scheduleScanEnabled) {
      console.log("Schedule Settings:", {
        frequency: cleanData.frequency,
        ...(isDateFieldEnabled() && { date: cleanData.date }),
        ...(isDayOfWeekFieldEnabled() && { weekday: cleanData.weekday }),
        ...(isHourFieldEnabled() && { hour: cleanData.hour }),
        minute: cleanData.minute,
      });
    }

    console.log("Credentials:", cleanData.credentials);

    if (cleanData.provider === "AWS") {
      console.log("Key Registration Method:", cleanData.keyRegistrationMethod);
    }

    console.log("=== END SUBMISSION ===");

    // Submit 성공 후 모달 닫기
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>
          <PlusIcon className="mr-1" />
          Create Cloud
        </Button>
      </DialogTrigger>
      <DialogContent
        aria-describedby={undefined}
        className="max-w-2xl h-[60%] flex flex-col p-0"
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
              <DialogTitle className="text-xl">Create Cloud</DialogTitle>
            </DialogHeader>
          </div>

          <div className="flex-1 overflow-y-auto p-6 pt-6">
            <div className="space-y-6">
              <div>
                <Label
                  className="mb-3 text-gray-700 font-semibold"
                  htmlFor="name"
                >
                  Cloud Name<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Please enter the cloud name."
                  {...register("name", { required: true })}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">
                    Cloud name is required.
                  </p>
                )}
              </div>

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
                      <SelectTrigger
                        id="provider"
                        aria-labelledby="providerLabel"
                      >
                        <SelectValue placeholder="Select a provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AWS">AWS</SelectItem>
                        <SelectItem value="GCP">
                          Google Cloud Provider
                        </SelectItem>
                        <SelectItem value="AZURE">Azure</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              {watch("provider") === "AWS" && (
                <div>
                  <Label
                    className="mb-3 text-gray-700 font-semibold"
                    htmlFor="keyRegistrationMethod"
                  >
                    Select Key Registration Method
                  </Label>
                  <Controller
                    name="keyRegistrationMethod"
                    control={control}
                    render={({ field }) => (
                      <Select {...field} onValueChange={field.onChange}>
                        <SelectTrigger id="keyRegistrationMethod">
                          <SelectValue placeholder="Access Key" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ACCESS_KEY">Access Key</SelectItem>
                          <SelectItem value="ASSUME_ROLE" disabled>
                            Assume Role
                          </SelectItem>
                          <SelectItem value="ROLES_ANYWHERE" disabled>
                            Roles Anywhere
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              )}
            </div>
            <hr className="my-10 border-gray-200" />
            <div>
              <div className="space-y-6">
                {/* Credentials Section - Render by Provider */}
                <div className="leading-none text-sm text-gray-700 font-semibold">
                  Credentials
                </div>
                {watch("provider") === "AWS" && (
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
                            showSecretKey
                              ? "Hide secret key"
                              : "Show secret key"
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

                {watch("provider") === "AZURE" && (
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
                          onClick={() =>
                            setShowAzureSecretKey(!showAzureSecretKey)
                          }
                          aria-label={
                            showAzureSecretKey
                              ? "Hide secret key"
                              : "Show secret key"
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

                {watch("provider") === "GCP" && (
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
                )}
              </div>
            </div>
            <hr className="my-10 border-gray-200" />
            <div>
              <div className="space-y-6">
                <div>
                  <Label
                    className="mb-3 text-gray-700 font-semibold"
                    htmlFor="regionLabel"
                  >
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

                <div>
                  <Label
                    className="mb-3 text-gray-700 font-semibold"
                    htmlFor="proxyUrl"
                  >
                    Proxy URL
                  </Label>
                  <Input id="proxyUrl" {...register("proxyUrl")} />
                </div>
              </div>
            </div>
            <hr className="my-10 border-gray-200" />
            <div>
              <div>
                <div>
                  <Label
                    className="mb-4 text-gray-700 font-semibold"
                    id="scheduleScanLabel"
                  >
                    Scan Schedule Setting
                  </Label>
                  <Controller
                    name="scheduleScanEnabled"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup
                        className="flex gap-10"
                        aria-labelledby="scheduleScanLabel"
                        value={field.value ? "true" : "false"}
                        onValueChange={(value) =>
                          field.onChange(value === "true")
                        }
                      >
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="true" id="enabled" />
                          <Label
                            htmlFor="enabled"
                            className={
                              watch("scheduleScanEnabled") === true
                                ? "text-gray-800"
                                : "text-gray-500"
                            }
                          >
                            Enabled
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="false" id="disabled" />
                          <Label
                            htmlFor="disabled"
                            className={
                              watch("scheduleScanEnabled") === false
                                ? "text-gray-900 font-semibold"
                                : "text-gray-600"
                            }
                          >
                            Disabled
                          </Label>
                        </div>
                      </RadioGroup>
                    )}
                  />
                </div>
              </div>
            </div>
            {watch("scheduleScanEnabled") && (
              <>
                <hr className="my-10 border-gray-200" />
                <div>
                  <div>
                    <Label className="mb-5 text-gray-700 font-semibold">
                      Set Scan Frequency
                    </Label>
                    <div className="text-gray-500 text-sm mb-5">
                      Scan Schedule: <span>{schedule(watch("frequency"))}</span>
                    </div>
                    <Controller
                      name="frequency"
                      control={control}
                      render={({ field }) => (
                        <Select {...field} onValueChange={field.onChange}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="DAY">Daily</SelectItem>
                            <SelectItem value="HOUR">Hourly</SelectItem>
                            <SelectItem value="WEEK">Weekly</SelectItem>
                            <SelectItem value="MONTH">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  <div className="flex flex-col gap-4 items-end mt-6">
                    <div className="flex gap-4">
                      <Label
                        className={`text-gray-700 font-semibold ${!isDateFieldEnabled() ? "text-gray-400" : ""}`}
                      >
                        Date
                      </Label>
                      <Controller
                        name="date"
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={!isDateFieldEnabled() ? "-" : field.value}
                            onValueChange={(value) => {
                              if (value !== "-") {
                                field.onChange(value);
                              }
                            }}
                            disabled={!isDateFieldEnabled()}
                          >
                            <SelectTrigger
                              className={cn({
                                "bg-gray-200 opacity-50 cursor-not-allowed":
                                  !isDateFieldEnabled(),
                              })}
                            >
                              <SelectValue placeholder="1" />
                            </SelectTrigger>
                            <SelectContent>
                              {!isDateFieldEnabled() && (
                                <SelectItem value="-" disabled>
                                  -
                                </SelectItem>
                              )}
                              {Array.from({ length: 28 }, (_, i) => (
                                <SelectItem key={i + 1} value={String(i + 1)}>
                                  {i + 1}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                    <div className="flex gap-4">
                      <Label
                        className={cn({
                          "text-gray-700 font-semibold": true,
                          "text-gray-400": !isDayOfWeekFieldEnabled(),
                        })}
                      >
                        Day of Week
                      </Label>
                      <Controller
                        name="weekday"
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={
                              !isDayOfWeekFieldEnabled() ? "-" : field.value
                            }
                            onValueChange={(value) => {
                              if (value !== "-") {
                                field.onChange(value);
                              }
                            }}
                            disabled={!isDayOfWeekFieldEnabled()}
                          >
                            <SelectTrigger
                              className={cn({
                                "opacity-50 cursor-not-allowed bg-gray-200":
                                  !isDayOfWeekFieldEnabled(),
                              })}
                            >
                              <SelectValue placeholder="MON" />
                            </SelectTrigger>
                            <SelectContent>
                              {!isDayOfWeekFieldEnabled() && (
                                <SelectItem value="-" disabled>
                                  -
                                </SelectItem>
                              )}
                              <SelectItem value="MON">Monday</SelectItem>
                              <SelectItem value="TUE">Tuesday</SelectItem>
                              <SelectItem value="WED">Wednesday</SelectItem>
                              <SelectItem value="THU">Thursday</SelectItem>
                              <SelectItem value="FRI">Friday</SelectItem>
                              <SelectItem value="SAT">Saturday</SelectItem>
                              <SelectItem value="SUN">Sunday</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                    <div className="flex gap-4">
                      <Label
                        className={cn({
                          "text-gray-700 font-semibold": true,
                          "text-gray-400": !isHourFieldEnabled(),
                        })}
                      >
                        Hour
                      </Label>
                      <Controller
                        name="hour"
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={!isHourFieldEnabled() ? "-" : field.value}
                            onValueChange={(value) => {
                              if (value !== "-") {
                                field.onChange(value);
                              }
                            }}
                            disabled={!isHourFieldEnabled()}
                          >
                            <SelectTrigger
                              className={cn({
                                "opacity-50 cursor-not-allowed bg-gray-200":
                                  !isHourFieldEnabled(),
                              })}
                            >
                              <SelectValue
                                placeholder={
                                  !isHourFieldEnabled() ? "-" : "12 PM"
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {!isHourFieldEnabled() && (
                                <SelectItem value="-" disabled>
                                  -
                                </SelectItem>
                              )}
                              {Array.from({ length: 24 }, (_, i) => (
                                <SelectItem key={i} value={String(i)}>
                                  {formatHourTo12Hour(String(i))}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                    <div className="flex gap-4">
                      <Label className="text-gray-700 font-semibold">
                        Minute
                      </Label>
                      <Controller
                        name="minute"
                        control={control}
                        render={({ field }) => (
                          <Select {...field} onValueChange={field.onChange}>
                            <SelectTrigger>
                              <SelectValue placeholder="0" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 12 }, (_, i) => (
                                <SelectItem key={i * 5} value={String(i * 5)}>
                                  {String(i * 5).padStart(2, "0")}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="flex-shrink-0 p-6 pt-4 border-t border-gray-200">
            <DialogFooter className="px-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!isFormValid()}
                className={
                  !isFormValid() ? "opacity-50 cursor-not-allowed" : ""
                }
              >
                Submit
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
