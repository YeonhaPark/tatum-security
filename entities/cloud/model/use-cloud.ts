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
        method: "PUT",
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
