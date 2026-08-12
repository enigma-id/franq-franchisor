import config from "@/services/table/const";
import { Button } from "@/components/ui/button";
import { Eye, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { UserDetail } from "@/services/types";

const createTableConfig = ({
  onView,
}: {
  onView?: (row: UserDetail) => void;
}) => ({
  ...config,
  url: "/user",
  columns: {
    name: { title: "Nama", sortable: true, class: "font-medium" },
    username: { title: "Username", sortable: true },
    is_active: {
      title: "Aktif",
      sortable: true,
      class: "text-center",
      headerClass: "text-center",
      component: (row: UserDetail) => (
        <Badge variant={row.is_active ? "success" : "error"}>
          {row.is_active ? "Aktif" : "Nonaktif"}
        </Badge>
      ),
    },
    last_activity_at: {
      title: "Terakhir Aktif",
      sortable: true,
      class: "text-sm",
      component: (row: UserDetail) => (
        <span>
          {row.last_activity_at
            ? new Date(row.last_activity_at).toLocaleDateString("id-ID")
            : "-"}
        </span>
      ),
    },
    action: {
      title: "",
      sortable: false,
      width: 100,
      component: (row: UserDetail) => (
        <div className="flex justify-end gap-1">
          <Button
            size="sm"
            className="text-primary hover:bg-primary/10"
            onClick={() => onView?.(row)}
          >
            <Eye size={16} />
          </Button>
          <Button
            size="sm"
            className="text-primary hover:bg-primary/10"
            onClick={() => (window.location.href = `/user/update/${row.id}`)}
          >
            <Pencil size={16} />
          </Button>
        </div>
      ),
    },
  },
});

export default createTableConfig;
