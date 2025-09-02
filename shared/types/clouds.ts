type Provider = "AWS" | "AZURE" | "GCP"; // AWS만 활성화

const AWSRegionList = [
  "global",
  "ap-northeast-1",
  "ap-northeast-2",
  "ap-northeast-3",
  "ap-south-1",
  "ap-southeast-1",
  "ap-southeast-2",
  "ca-central-1",
  "eu-central-1",
  "eu-north-1",
  "eu-west-1",
  "eu-west-2",
  "eu-west-3",
  "sa-east-1",
  "us-east-1",
  "us-east-2",
  "us-west-1",
  "us-west-2",
] as const;

// Region options for MultiSelect
export const getAWSRegionOptions = () =>
  AWSRegionList.map((region) => ({
    value: region,
    label: region === "global" ? "Global" : region.toUpperCase(),
  }));

type AWSCredentialType = "ACCESS_KEY" | "ASSUME_ROLE" | "ROLES_ANYWHERE"; // ACCESS_KEY만 활성화

interface AWSCredential {
  accessKey: string;
  secretAccessKey: string;
  roleArn?: string;
}
interface AzureCredential {
  tenantId: string;
  subscriptionId: string;
  applicationId: string;
  secretKey: string;
}
interface GCPCredential {
  projectId?: string;
  jsonText: string;
}
interface AWSEventSource {
  cloudTrailName?: string;
}

// 타 프로바이더 예시, 미사용
type AzureCredentialType = "APPLICATION";

interface AzureEventSource {
  storageAccountName?: string;
}

type GCPCredentialType = "JSON_TEXT";

interface GCPEventSource {
  storageAccountName?: string;
}

interface ScheduleScanSetting {
  frequency: "HOUR" | "DAY" | "WEEK" | "MONTH";
  date: string; // '1' ~ '28'
  weekday: "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";
  hour: string; // '0' ~ '23'
  minute: string; // '0' ~ '60', '5' 단위로 증가
}

// 상세 정보 불러오는 API를 GET, 저장하는 API를 PUT으로 가정
interface Cloud {
  id: string; // GET 요청 시 획득
  provider: Provider;
  name: string;
  cloudGroupName?: string[]; // 멀티 셀렉트 가능해야함
  eventProcessEnabled: boolean; // valid, invalid
  userActivityEnabled: boolean; // off, on
  scheduleScanEnabled: boolean; // set, not set
  scheduleScanSetting: ScheduleScanSetting;
  regionList: string[]; // 멀티 셀렉트 가능해야함.
  proxyUrl?: string;
  credentials: AWSCredential | AzureCredential | GCPCredential; // GET 요쳥 시 비밀값이라 마스킹 상태로 전달됨 row 표시 ?
  credentialType: AWSCredentialType | AzureCredentialType | GCPCredentialType; // row 표시 ?
  eventSource?: AWSEventSource | AzureEventSource | GCPEventSource; // row 표시 ?
}
export { AWSRegionList };

export type {
  Provider,
  AWSCredentialType,
  AzureCredentialType,
  GCPCredentialType,
  AWSCredential,
  AzureCredential,
  GCPCredential,
  AWSEventSource,
  AzureEventSource,
  GCPEventSource,
  ScheduleScanSetting,
  Cloud,
};
