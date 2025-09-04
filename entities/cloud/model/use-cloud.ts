import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CloudFormValues } from "@/widgets/cloud-form-modal/model/types";

export function useClouds() {
  return useQuery({
    queryKey: ["clouds"],
    queryFn: async () => {
      const res = await fetch("/api/clouds");
      if (!res.ok) throw new Error("Failed to fetch clouds");
      return res.json();
    },
  });
}

export function useCloudById(id: string | null) {
  return useQuery({
    queryKey: ["cloud", id],
    queryFn: async () => {
      if (!id) return null;
      const res = await fetch(`/api/clouds/${id}`);
      if (!res.ok) throw new Error("Failed to fetch cloud");
      return res.json();
    },
    enabled: !!id,
  });
}

export function useCreateCloud() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (input: CloudFormValues) => {
      const res = await fetch("/api/clouds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error("Failed to save cloud");
      return res.json();
    },
    onSuccess: () => {
      // 모든 cloud 관련 쿼리 무효화
      qc.invalidateQueries({ queryKey: ["clouds"] });
      qc.invalidateQueries({ queryKey: ["cloud"] });
    },
  });
}

export function useUpdateCloud() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CloudFormValues }) => {
      const res = await fetch(`/api/clouds/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update cloud");
      return res.json();
    },
    onSuccess: (data, variables) => {
      // 모든 cloud 관련 쿼리 무효화 (더 안전한 방법)
      qc.invalidateQueries({ queryKey: ["clouds"] });
      qc.invalidateQueries({ queryKey: ["cloud"] });
    },
  });
}

export function useDeleteCloud() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/clouds/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete cloud");
      return res.json();
    },
    onSuccess: (data, id) => {
      // 모든 cloud 관련 쿼리 무효화
      qc.invalidateQueries({ queryKey: ["clouds"] });
      qc.invalidateQueries({ queryKey: ["cloud"] });
    },
  });
}
