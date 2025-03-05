export interface DashboardItem {
  type: string;
  count: number;
}

export interface DashboardResponse {
  data: DashboardItem[];
}
