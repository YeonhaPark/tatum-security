import { CreateCloudModal } from "@/features/cloud-form/ui/cloud-form-modal";
import { CloudTable } from "@/widgets/cloud-table/cloud-table";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center p-4">
      <CreateCloudModal />
      <CloudTable />
    </div>
  );
}
