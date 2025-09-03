"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { useClouds, useCloudById, useDeleteCloud } from "@/entities/cloud";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/ui/dialog";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { CloudFormModal } from "@/widgets/cloud-form-modal";

const cols = [
  {
    accessorKey: "provider",
    header: "Provider",
  },
  {
    accessorKey: "name",
    header: "Account",
  },
  {
    accessorKey: "cloudGroupName",
    header: "Cloud Group",
  },
  {
    accessorKey: "scheduleScanEnabled",
    header: "Scan Schedule",
  },
  {
    accessorKey: "eventProcessEnabled",
    header: "Event Process",
  },
  {
    accessorKey: "userActivityEnabled",
    header: "User Activity",
  },
  {
    accessorKey: "proxyUrl",
    header: "Proxy URL",
  },
];

interface Cloud {
  id: string;
  provider: "AWS" | "AZURE" | "GCP";
  name: string;
  cloudGroupName?: string[];
  scheduleScanEnabled: boolean;
  eventProcessEnabled: boolean;
  userActivityEnabled: boolean;
  proxyUrl?: string;
}

export const CloudTable = () => {
  const { data: clouds = [], isLoading, error } = useClouds();
  const [editingCloudId, setEditingCloudId] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deletingCloud, setDeletingCloud] = useState<Cloud | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data: editingCloudData, isLoading: isLoadingEditData } =
    useCloudById(editingCloudId);

  const deleteCloud = useDeleteCloud();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Loading clouds...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-red-500">Failed to load clouds</div>
      </div>
    );
  }

  const renderCellValue = (cloud: Cloud, accessorKey: string) => {
    const value = cloud[accessorKey as keyof Cloud];

    switch (accessorKey) {
      case "provider":
        return (
          <Badge variant="outline" className="font-medium">
            {value as string}
          </Badge>
        );

      case "cloudGroupName":
        const groups = value as string[] | undefined;
        if (!groups || groups.length === 0) {
          return <span className="text-gray-400">-</span>;
        }
        return (
          <div className="flex gap-1 flex-wrap">
            {groups.map((group, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {group}
              </Badge>
            ))}
          </div>
        );

      case "scheduleScanEnabled":
      case "eventProcessEnabled":
      case "userActivityEnabled":
        return (
          <Badge
            variant={value ? "default" : "secondary"}
            className={
              value
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-600"
            }
          >
            {value ? "Enabled" : "Disabled"}
          </Badge>
        );

      case "proxyUrl":
        return value ? (
          <span className="text-blue-600 hover:underline cursor-pointer">
            {value as string}
          </span>
        ) : (
          <span className="text-gray-400">-</span>
        );

      default:
        return value || <span className="text-gray-400">-</span>;
    }
  };

  const handleEdit = (cloud: Cloud) => {
    setEditingCloudId(cloud.id);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingCloudId(null);
  };

  const handleDelete = (cloud: Cloud) => {
    setDeletingCloud(cloud);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (deletingCloud) {
      try {
        await deleteCloud.mutateAsync(deletingCloud.id);
        setIsDeleteModalOpen(false);
        setDeletingCloud(null);
      } catch (error) {
        console.error("Failed to delete cloud:", error);
      }
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setDeletingCloud(null);
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Cloud Accounts</h2>
        <div className="text-sm text-gray-500">
          {clouds.length} account{clouds.length !== 1 ? "s" : ""} total
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              {cols.map((col) => (
                <TableHead key={col.accessorKey} className="font-semibold">
                  {col.header}
                </TableHead>
              ))}
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clouds.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={cols.length + 1}
                  className="text-center py-8 text-gray-500"
                >
                  No cloud accounts configured yet
                </TableCell>
              </TableRow>
            ) : (
              clouds.map((cloud: Cloud) => (
                <TableRow key={cloud.id} className="hover:bg-gray-50">
                  {cols.map((col) => (
                    <TableCell key={col.accessorKey}>
                      {renderCellValue(cloud, col.accessorKey)}
                    </TableCell>
                  ))}
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(cloud)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(cloud)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && editingCloudId && (
        <CloudFormModal
          mode="edit"
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          cloudId={editingCloudId}
          defaultValues={editingCloudData}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent
          className="sm:max-w-[425px]"
          aria-describedby={undefined}
        >
          <DialogHeader>
            <DialogTitle>Delete Cloud Account</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-600">
              Are you sure you want to delete the cloud account{" "}
              <span className="font-semibold">{deletingCloud?.name}</span>?
            </p>
            <p className="text-sm text-gray-500 mt-2">
              This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={cancelDelete}
              disabled={deleteCloud.isPending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteCloud.isPending}
            >
              {deleteCloud.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
