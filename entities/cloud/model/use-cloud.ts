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
      //         {
      //     "name": "Dev1",
      //     "provider": "AWS",
      //     "regionList": [
      //         "global"
      //     ],
      //     "cloudGroupName": [],
      //     "scheduleScanEnabled": true,
      //     "eventProcessEnabled": true,
      //     "userActivityEnabled": true,
      //     "scanScheduleSetting": {
      //         "frequency": "DAY",
      //         "date": "1",
      //         "weekday": "MON",
      //         "hour": "12",
      //         "minute": "0"
      //     },
      //     "credentials": {
      //         "accessKey": "123",
      //         "secretAccessKey": "123",
      //         "roleArn": ""
      //     },
      //     "credentialType": "ACCESS_KEY",
      //     "proxyUrl": ""
      // }
      const res = await fetch("/api/clouds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error("Failed to save cloud");
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["clouds"] });
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
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["clouds"] });
    },
  });
}
