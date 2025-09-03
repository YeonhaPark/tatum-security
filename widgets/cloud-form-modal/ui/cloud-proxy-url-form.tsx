import { Label, Input } from "@/shared/ui";
import { UseFormRegister } from "react-hook-form";
import { CloudFormValues } from "../model";

interface CloudProxyUrlFormProps {
  register: UseFormRegister<CloudFormValues>;
}
export const CloudProxyUrlForm = ({ register }: CloudProxyUrlFormProps) => {
  return (
    <div>
      <Label className="mb-3 text-gray-700 font-semibold" htmlFor="proxyUrl">
        Proxy URL
      </Label>
      <Input id="proxyUrl" {...register("proxyUrl")} />
    </div>
  );
};
