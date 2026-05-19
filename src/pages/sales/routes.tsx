import { SalesOrder } from "./salesOrder";
import { SalesOrderDetail } from "./salesOrderDetail";
import { SalesOrderCreate } from "./salesOrderCreate";

export const salesRoutes = [
  {
    path: "/sales/order",
    element: <SalesOrder />,
  },
  {
    path: "/sales/order/create",
    element: <SalesOrderCreate />,
  },
  {
    path: "/sales/order/:id",
    element: <SalesOrderDetail />,
  },
];
