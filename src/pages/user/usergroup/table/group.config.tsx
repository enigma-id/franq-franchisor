import config from "@/services/table/const";
import { Badge } from "@/components/ui/badge";
import type { UserGroupDetail } from "@/services/types";

const createTableConfig = () => ({
  ...config,
  url: "/user/usergroup",
  columns: {
    name: { title: "Nama Grup", class: "font-medium" },
    is_active: {
      title: "Aktif",
      class: "text-center",
      headerClass: "text-center",
      component: (row: UserGroupDetail) => (
        <Badge variant={row.is_active ? "success" : "error"}>{row.is_active ? "Aktif" : "Nonaktif"}</Badge>
      ),
    },
    created_at: {
      title: "Dibuat",
      class: "text-sm",
      component: (row: UserGroupDetail) => (
        <span>{new Date(row.created_at).toLocaleDateString("id-ID")}</span>
      ),
    },
  },
});

export default createTableConfig;
