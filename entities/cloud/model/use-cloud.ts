import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CloudFormValues,
  UpdateCloudPayload,
} from "@/widgets/cloud-form-modal/model/types";

// Deep merge utility function
function deepMerge(target: any, source: any): any {
  if (typeof target !== 'object' || target === null) return source;
  if (typeof source !== 'object' || source === null) return target;

  const result = { ...target };

  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
        result[key] = deepMerge(target[key], source[key]);
      } else {
        result[key] = source[key];
      }
    }
  }

  return result;
}

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
        method: "PUT",
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
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateCloudPayload;
    }) => {
      // 먼저 기존 데이터를 가져옴
      const existingRes = await fetch(`/api/clouds/${id}`);
      if (!existingRes.ok) throw new Error("Failed to fetch existing cloud data");
      const existingData = await existingRes.json();

      // Deep merge를 사용하여 기존 데이터와 새 데이터를 병합
      const mergedData = deepMerge(existingData, data);

      // 병합된 데이터를 서버로 전송
      const res = await fetch(`/api/clouds/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mergedData),
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
