/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Input } from "@/components/ui";
import { useAppSelector } from "@/hooks";
import { ShieldCheck } from "lucide-react";

interface UserGroupFormProps {
  id?: string;
  initialData?: { name: string; permissions?: Record<string, unknown> };
  onSubmit: (data: Record<string, unknown>) => void;
}

export const UserGroupForm: React.FC<UserGroupFormProps> = ({
  id = "usergroup-form",
  initialData,
  onSubmit,
}) => {
  const FormState = useAppSelector((s) => s.form);
  const [name, setName] = useState(initialData?.name ?? "");
  const [permissions, setPermissions] = useState(
    initialData?.permissions
      ? JSON.stringify(initialData.permissions, null, 2)
      : "",
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let parsedPermissions: Record<string, unknown> = {};
    if (permissions.trim()) {
      try {
        parsedPermissions = JSON.parse(permissions);
      } catch {
        // Let validation handle it
      }
    }

    const payload: Record<string, unknown> = {
      name,
      permissions: parsedPermissions,
    };

    onSubmit(payload);
  };

  const permissionsError =
    permissions.trim() && (() => {
      try {
        JSON.parse(permissions);
        return null;
      } catch {
        return "Format JSON tidak valid";
      }
    })();

  return (
    <form id={id} onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h3 className="text-sm font-bold text-slate-700 uppercase mb-4 flex items-center gap-2">
          <ShieldCheck size={16} className="text-primary" />
          Informasi Grup
        </h3>
        <div className="grid grid-cols-1 gap-6">
          <Input
            label="Nama Grup"
            required
            placeholder="Contoh: Admin, Super Admin, Operator"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={FormState?.errors?.name as string}
          />
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Permissions (JSON)
            </label>
            <textarea
              className={`w-full min-h-[200px] px-3 py-2 text-sm font-mono border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
                permissionsError
                  ? "border-red-400 bg-red-50"
                  : "border-slate-200 bg-white"
              }`}
              placeholder='{\n  "module": {\n    "read": true,\n    "write": false\n  }\n}'
              value={permissions}
              onChange={(e) => setPermissions(e.target.value)}
            />
            {permissionsError && (
              <p className="text-xs text-red-500 mt-1">{permissionsError}</p>
            )}
            {FormState?.errors?.permissions && (
              <p className="text-xs text-red-500 mt-1">
                {FormState.errors.permissions as string}
              </p>
            )}
          </div>
        </div>
      </div>
    </form>
  );
};
