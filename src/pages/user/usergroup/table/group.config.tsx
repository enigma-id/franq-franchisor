import config from "@/services/table/const";
import { Badge } from "@/components/ui/badge";
import type { UserGroupDetail } from "@/services/types";

const createTableConfig = () => ({
  ...config,
  url: "/user/usergroup",
  columns: {
    name: { title: "Nama Grup", sortable: true, class: "font-medium" },
    is_active: {
      title: "Aktif",
      sortable: true,
      class: "text-center",
      headerClass: "text-center",
      component: (row: UserGroupDetail) => (
        <Badge variant={row.is_active ? "success" : "error"}>{row.is_active ? "Aktif" : "Nonaktif"}</Badge>
      ),
    },
    created_at: {
      title: "Dibuat",
      sortable: true,
      class: "text-sm",
      component: (row: UserGroupDetail) => (
        <span>{new Date(row.created_at).toLocaleDateString("id-ID")}</span>
      ),
    },
  },
});

export default createTableConfig;
