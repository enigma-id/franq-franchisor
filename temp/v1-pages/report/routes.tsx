import { PosOrder } from "./posOrder";
import { PosOutstanding } from "./posOutstanding";
import { SettlementMonthly } from "./posSettlement";
import { SettlementDaily } from "./posSettlementDaily";
import { PosItem } from "./posItem";
import { PosItemDaily } from "./posItemDaily";
import { StockReport } from "./stockReport";

export const reportRoutes = [
  {
    path: "/report/pos",
    element: <PosOrder />,
  },
  {
    path: "/report/outstanding",
    element: <PosOutstanding />,
  },
  {
    path: "/report/payment",
    element: <SettlementMonthly />,
  },
  {
    path: "/report/payment/daily",
    element: <SettlementDaily />,
  },
  {
    path: "/report/item",
    element: <PosItem />,
  },
  {
    path: "/report/daily",
    element: <PosItemDaily />,
  },
  {
    path: "/report/stock",
    element: <StockReport />,
  },
];
