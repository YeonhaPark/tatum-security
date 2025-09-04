import { UseFormRegister } from "react-hook-form";
import { Label } from "@/shared/ui/label";
import { Input } from "@/shared/ui/input";
import { CloudFormValues } from "../model/types";

interface CloudNameFormProps {
  register: UseFormRegister<CloudFormValues>;
  errors: any;
}

export function CloudNameForm({ register, errors }: CloudNameFormProps) {
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // 텍스트 선택을 방지하고 커서를 맨 끝으로 이동
    const target = e.target;
    setTimeout(() => {
      target.setSelectionRange(target.value.length, target.value.length);
    }, 0);
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLInputElement>) => {
    // 마우스 클릭으로 인한 텍스트 선택 방지
    e.preventDefault();
  };

  const handleSelect = (e: React.SyntheticEvent<HTMLInputElement>) => {
    // 선택 이벤트 발생 시 커서를 맨 끝으로 이동
    const target = e.target as HTMLInputElement;
    target.setSelectionRange(target.value.length, target.value.length);
  };

  return (
    <div>
      <Label className="mb-3 text-gray-700 font-semibold" htmlFor="name">
        Cloud Name<span className="text-red-500">*</span>
      </Label>
      <Input
        id="name"
        placeholder="Please enter the cloud name."
        {...register("name", { required: true })}
        autoFocus={false}
        onFocus={handleFocus}
        onMouseUp={handleMouseUp}
        onSelect={handleSelect}
      />
      {errors.name && (
        <p className="text-sm mt-2 text-red-500">Cloud name is required.</p>
      )}
    </div>
  );
}
