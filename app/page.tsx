"use client";
import { useState } from "react";
import { CloudFormModal } from "@/widgets/cloud-form-modal/ui/cloud-form-modal";
import { Button } from "@/shared/ui/button";
import { CloudTable } from "@/widgets/cloud-table/cloud-table";
import { PlusIcon } from "lucide-react";

export default function Home() {
  const [isCloudModalOpen, setIsCloudModalOpen] = useState(false);

  return (
    <div className="flex min-h-full flex-col items-center justify-center p-4">
      <Button onClick={() => setIsCloudModalOpen(true)}>
        {" "}
        <PlusIcon className="mr-1" />
        Create Cloud
      </Button>
      <CloudFormModal
        open={isCloudModalOpen}
        onOpenChange={setIsCloudModalOpen}
      />
      <CloudTable />
    </div>
  );
}
