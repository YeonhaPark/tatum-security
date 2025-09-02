import { CreateCloudModal } from "@/features/cloud-form/ui/cloud-form-modal";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center p-4">
      <CreateCloudModal />
    </div>
  );
}
