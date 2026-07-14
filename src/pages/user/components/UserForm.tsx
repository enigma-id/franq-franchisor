/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { Input, RemoteSelect } from "@/components/ui";
import { useUserGroup } from "@/services/usergroup/hooks";
import { useAppSelector } from "@/hooks";
import { UserIcon, ShieldCheck } from "lucide-react";

interface UserFormProps {
  id?: string;
  onSubmit: (data: Record<string, unknown>) => void;
}

export const UserForm: React.FC<UserFormProps> = ({
  id = "user-form",
  onSubmit,
}) => {
  const FormState = useAppSelector((s) => s.form);
  const { get: getUsergroups, getResult: usergroupsResult } = useUserGroup();

  const [usergroup, setUsergroup] = useState<any | null>(null);
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    getUsergroups({ page: 1, limit: 50 });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: Record<string, unknown> = {
      usergroup_id: usergroup?.id ?? "",
      username,
      name,
      password,
      confirm_password: confirmPassword,
    };

    onSubmit(payload);
  };

  return (
    <form id={id} onSubmit={handleSubmit} className="space-y-6">
      {/* Account Info */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h3 className="text-sm font-bold text-slate-700 uppercase mb-4 flex items-center gap-2">
          <UserIcon size={16} className="text-primary" />
          Informasi Akun
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Username"
            required
            placeholder="Contoh: budi.santoso"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={FormState?.errors?.username as string}
          />
          <Input
            label="Nama Lengkap"
            required
            placeholder="Contoh: Budi Santoso"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={FormState?.errors?.name as string}
          />
        </div>
      </div>

      {/* Security */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h3 className="text-sm font-bold text-slate-700 uppercase mb-4 flex items-center gap-2">
          <ShieldCheck size={16} className="text-primary" />
          Keamanan
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            type="password"
            label="Password"
            required
            placeholder="Min. 8 karakter"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={FormState?.errors?.password as string}
          />
          <Input
            type="password"
            label="Konfirmasi Password"
            required
            placeholder="Ulangi password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={FormState?.errors?.confirm_password as string}
          />
        </div>
      </div>

      {/* User Group */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h3 className="text-sm font-bold text-slate-700 uppercase mb-4 flex items-center gap-2">
          <ShieldCheck size={16} className="text-primary" />
          Grup Pengguna
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RemoteSelect
            placeholder="Pilih User Group"
            value={usergroup}
            hook={usergroupsResult as any}
            fetchData={(page, search) =>
              getUsergroups({ page: page || 1, limit: 50, search })
            }
            getLabel={(item: any) => (item ? item.name : "")}
            renderItem={(item: any) => item?.name}
            getValue={(item: any) => item?.id}
            onChange={(val: any) => setUsergroup(val)}
            onClear={() => setUsergroup(null)}
            required
          />
        </div>
        {FormState?.errors?.usergroup_id ? (
          <p className="text-xs text-red-500 mt-2">
            {FormState.errors.usergroup_id as string}
          </p>
        ) : null}
      </div>
    </form>
  );
};
