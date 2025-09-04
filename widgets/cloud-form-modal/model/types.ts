import {
  AWSCredential,
  AzureCredential,
  GCPCredential,
  Cloud,
  ScheduleScanSetting,
  AWSCredentialType,
  AzureEventSource,
  AWSEventSource,
  GCPEventSource,
  AzureCredentialType,
  GCPCredentialType,
  Provider,
} from "@/shared/types/clouds";

export type CloudFormValues = {
  provider: Provider;
  name: string;
  cloudGroupName?: string[];
  eventProcessEnabled: Cloud["eventProcessEnabled"];
  userActivityEnabled: Cloud["userActivityEnabled"];
  scheduleScanEnabled: Cloud["scheduleScanEnabled"];
  scanScheduleSetting: ScheduleScanSetting;
  regionList: string[];
  proxyUrl?: string;
  credentials: AWSCredential | AzureCredential | GCPCredential; // GET 요쳥 시 비밀값이라 마스킹 상태로 전달됨 row 표시 ?
  credentialType: AWSCredentialType | AzureCredentialType | GCPCredentialType; // row 표시 ?
  eventSource?: AWSEventSource | AzureEventSource | GCPEventSource; // row 표시 ?
} & (
  | {
      provider: "AWS";
      credentialType: "ACCESS_KEY" | "ASSUME_ROLE" | "ROLES_ANYWHERE";
      credentials: AWSCredential;
    }
  | {
      provider: "AZURE";
      credentials: AzureCredential;
      credentialType: AzureCredentialType;
    }
  | {
      provider: "GCP";
      credentials: GCPCredential;
      credentialType: GCPCredentialType;
    }
);
