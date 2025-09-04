import { Control, useWatch, Controller } from "react-hook-form";
import {
  Label,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/shared/ui";
import { CloudFormValues } from "../model";

interface CloudCredentialTypeFormProps {
  control: Control<CloudFormValues>;
}

export const CloudCredentialTypeForm = ({
  control,
}: CloudCredentialTypeFormProps) => {
  const provider = useWatch({ name: "provider", control });
  return (
    <>
      {" "}
      {provider === "AWS" && (
        <div>
          <Label
            className="mb-3 text-gray-700 font-semibold"
            htmlFor="credentialType"
          >
            Select Key Registration Method
          </Label>
          <Controller
            name="credentialType"
            control={control}
            render={({ field }) => (
              <Select {...field} onValueChange={field.onChange}>
                <SelectTrigger id="credentialType">
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
    </>
  );
};
