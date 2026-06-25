export interface WithdrawalRequest {
  id: string;
  outlet_id: string;
  amount: number;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  updated_at: string;
  description?: string;
  outlet?: {
    id: string;
    name: string;
  };
}
