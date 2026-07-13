import type { ApprovalStatus } from "./api";

export interface WithdrawalRequest {
  id: string;
  outlet_id: string;
  ref_id: string;
  code: string;
  amount: number;
  balance_at_request: number;
  bank_name: string;
  bank_account_name: string;
  bank_account_number: string;
  notes: string;
  document_status: ApprovalStatus;
  rejected_reason: string | null;
  processed_by: string;
  processed_at: string;
  created_at: string;
  updated_at: string;
  outlet?: {
    id: string;
    name: string;
    [k: string]: unknown;
  };
}
