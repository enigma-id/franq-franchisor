/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from "react";
import { Input, Checkbox } from "@/components/ui";
import { useAppSelector } from "@/hooks";
import { ShieldCheck, Loader2, ChevronDown, ChevronRight } from "lucide-react";
import { usePermission } from "@/services/permission/hooks";
import type { PermissionGroup, PermissionItem } from "@/services/types";

interface UserGroupFormProps {
  id?: string;
  initialData?: { name: string; permissions?: string[] };
  onSubmit: (data: Record<string, unknown>) => void;
}

export const UserGroupForm: React.FC<UserGroupFormProps> = ({
  id = "usergroup-form",
  initialData,
  onSubmit,
}) => {
  const FormState = useAppSelector((s) => s.form);
  const { get: getPermissions, getResult: permissionsResult } = usePermission();

  const [name, setName] = useState(initialData?.name ?? "");
  const [currentPermissionIds, setCurrentPermissionIds] = useState<string[]>(
    initialData?.permissions ?? [],
  );
  const [expandedServices, setExpandedServices] = useState<Set<string>>(
    new Set(),
  );

  // Sync field saat initialData berubah (data datang async dari show)
  useEffect(() => {
    if (!initialData) return;
    setName(initialData.name ?? "");
    setCurrentPermissionIds(initialData.permissions ?? []);
  }, [initialData]);

  // Fetch list permission dari GET /permission (grouped by module)
  useEffect(() => {
    getPermissions({});
  }, []);

  const groups: PermissionGroup[] =
    (permissionsResult?.data as any)?.data ?? [];

  const isLoading =
    permissionsResult?.isLoading || permissionsResult?.isFetching;

  // Kelompokkan permission menjadi service → { module: PermissionItem[] }
  const services = useMemo(() => {
    const map: Record<string, Record<string, PermissionItem[]>> = {};
    for (const group of groups) {
      for (const perm of group.permissions) {
        if (!perm.is_active && perm.is_active !== undefined) continue;
        const svc = perm.service || perm.application || "other";
        if (!map[svc]) map[svc] = {};
        if (!map[svc][perm.module]) map[svc][perm.module] = [];
        map[svc][perm.module].push(perm);
      }
    }
    return map;
  }, [groups]);

  const toggleServiceCollapse = (service: string) => {
    setExpandedServices((prev) => {
      const next = new Set(prev);
      if (next.has(service)) next.delete(service);
      else next.add(service);
      return next;
    });
  };

  // Ubah slug module → label terbaca, mis. "report.warehouse-stock" → "report warehouse stock"
  const humanizeLabel = (slug: string) =>
    slug.split(".").join(" ").split("-").join(" ").trim();

  const handleToggleModule = (perms: PermissionItem[], checked: boolean) => {
    setCurrentPermissionIds((prev) => {
      let next = [...prev];
      if (checked) {
        for (const p of perms) {
          if (!next.includes(p.id)) next.push(p.id);
          // manage dipilih → read ikut otomatis
          if (p.action === "manage") {
            const read = perms.find((x) => x.action === "read");
            if (read && !next.includes(read.id)) next.push(read.id);
          }
        }
      } else {
        const ids = perms.map((p) => p.id);
        next = next.filter((id) => !ids.includes(id));
      }
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      permissions: currentPermissionIds,
    });
  };

  return (
    <form id={id} onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-sm font-bold text-slate-700 uppercase mb-3 flex items-center gap-2">
          <ShieldCheck size={16} className="text-primary" />
          Informasi Usergroup
        </h3>
        <div className="grid grid-cols-1 gap-6">
          <Input
            label="Nama Usergroup"
            required
            placeholder="Contoh: Admin, Super Admin, Operator"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={FormState?.errors?.name as string}
          />
        </div>
      </div>

      {/* Permission checklist — accordion per service, module rows */}
      <div>
        <h3 className="text-sm font-bold text-slate-700 uppercase mb-3 flex items-center gap-2">
          <ShieldCheck size={16} className="text-primary" />
          Permissions
        </h3>

        {isLoading && !groups.length ? (
          <div className="flex items-center justify-center py-10 text-slate-400">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Memuat permission...
          </div>
        ) : Object.keys(services).length === 0 ? (
          <p className="text-sm text-slate-400">
            Tidak ada permission tersedia.
          </p>
        ) : (
          <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
            {Object.entries(services).map(([service, modules]) => {
              const allServicePerms = Object.values(modules).flat();
              const isAllServiceSelected = allServicePerms.every((p) =>
                currentPermissionIds.includes(p.id),
              );
              const isSomeServiceSelected =
                allServicePerms.some((p) =>
                  currentPermissionIds.includes(p.id),
                ) && !isAllServiceSelected;
              const isServiceExpanded = expandedServices.has(service);

              return (
                <div
                  key={service}
                  className="border border-gray-200 rounded-xl overflow-hidden bg-white"
                >
                  {/* Accordion Header (Service Level) */}
                  <div
                    className="flex items-center justify-between p-4 bg-gray-50/80 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => toggleServiceCollapse(service)}
                  >
                    <div className="flex items-center space-x-3">
                      <div onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          size="sm"
                          checked={isAllServiceSelected}
                          indeterminate={isSomeServiceSelected}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleToggleModule(
                              allServicePerms,
                              e.target.checked,
                            )
                          }
                        />
                      </div>
                      <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                        {humanizeLabel(service)} Service
                      </h4>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border shadow-sm ${
                          isSomeServiceSelected || isAllServiceSelected
                            ? "bg-blue-50 border-blue-100 text-blue-600"
                            : "bg-white border-gray-100 text-gray-500"
                        }`}
                      >
                        {allServicePerms.filter((p) =>
                          currentPermissionIds.includes(p.id),
                        ).length}{" "}
                        / {allServicePerms.length} selected
                      </span>
                      {isServiceExpanded ? (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {/* Collapsible Content (Module Rows) */}
                  {isServiceExpanded && (
                    <div className="divide-y divide-gray-100 border-t border-gray-100">
                      {Object.entries(modules).map(([module, perms]) => {
                        const isAllModuleSelected = perms.every((p) =>
                          currentPermissionIds.includes(p.id),
                        );
                        const isSomeModuleSelected =
                          perms.some((p) =>
                            currentPermissionIds.includes(p.id),
                          ) && !isAllModuleSelected;

                        return (
                          <div
                            key={module}
                            className="flex flex-col sm:flex-row sm:items-center p-4 hover:bg-gray-50/50 transition-colors"
                          >
                            {/* Module Name & Select All */}
                            <div className="flex items-center w-48 mb-3 sm:mb-0 shrink-0">
                              <Checkbox
                                size="sm"
                                id={`mod-${service}-${module}`}
                                checked={isAllModuleSelected}
                                indeterminate={isSomeModuleSelected}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>,
                                ) =>
                                  handleToggleModule(
                                    perms,
                                    e.target.checked,
                                  )
                                }
                              />
                              <label
                                htmlFor={`mod-${service}-${module}`}
                                className="ml-3 text-xs font-semibold text-gray-800 capitalize cursor-pointer"
                              >
                                {humanizeLabel(module)}
                              </label>
                            </div>

                            {/* Permissions Line Checkboxes */}
                            <div className="flex flex-wrap gap-4 pl-7 sm:pl-0">
                              {perms.map((perm) => {
                                const managePerm = perms.find(
                                  (p) => p.action === "manage",
                                );
                                const isManageChecked = managePerm
                                  ? currentPermissionIds.includes(
                                      managePerm.id,
                                    )
                                  : false;
                                const isRead = perm.action === "read";

                                const checked =
                                  isRead && isManageChecked
                                    ? true
                                    : currentPermissionIds.includes(perm.id);
                                const disabled = isRead && isManageChecked;

                                return (
                                  <div
                                    key={perm.id}
                                    className="flex items-center space-x-2"
                                  >
                                    <Checkbox
                                      size="sm"
                                      id={`perm-${perm.id}`}
                                      checked={checked}
                                      disabled={disabled}
                                      onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>,
                                      ) => {
                                        const c = e.target.checked;
                                        setCurrentPermissionIds((prev) => {
                                          let next = [...prev];
                                          if (c) {
                                            if (!next.includes(perm.id))
                                              next.push(perm.id);
                                            if (perm.action === "manage") {
                                              const readPerm = perms.find(
                                                (p) =>
                                                  p.action === "read",
                                              );
                                              if (
                                                readPerm &&
                                                !next.includes(readPerm.id)
                                              ) {
                                                next.push(readPerm.id);
                                              }
                                            }
                                          } else {
                                            next = next.filter(
                                              (id) => id !== perm.id,
                                            );
                                          }
                                          return next;
                                        });
                                      }}
                                    />
                                    <label
                                      htmlFor={`perm-${perm.id}`}
                                      className="text-[11px] font-medium text-gray-600 cursor-pointer capitalize"
                                    >
                                      {perm.action}
                                    </label>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {(FormState?.errors?.permissions as string) && (
          <p className="text-xs text-red-500 mt-2">
            {FormState.errors.permissions as string}
          </p>
        )}
      </div>
    </form>
  );
};
