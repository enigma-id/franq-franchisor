/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Input, RemoteSelect } from "@/components/ui";
import { useUserGroup } from "@/services/usergroup/hooks";
import { useAppSelector } from "@/hooks";
import type { UserDetail } from "@/services/types";

interface UserFormProps {
  id?: string;
  /** Mode edit — prefill field & password tidak wajib. */
  initialData?: UserDetail | null;
  onSubmit: (data: Record<string, unknown>) => void;
}

export const UserForm: React.FC<UserFormProps> = ({
  id = "user-form",
  initialData,
  onSubmit,
}) => {
  const FormState = useAppSelector((s) => s.form);
  const { get: getUsergroups, getResult: usergroupsResult } = useUserGroup();

  const isEdit = !!initialData;

  const [usergroup, setUsergroup] = useState<any | null>(null);
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    getUsergroups({ page: 1, limit: 50 });
  }, []);

  // Mode edit — prefill dari initialData
  useEffect(() => {
    if (!initialData) return;
    setUsername(initialData.username ?? "");
    setName(initialData.name ?? "");

    const list = (usergroupsResult?.data as any)?.data ?? [];
    const found = list.find((g: any) => g.id === initialData.usergroup_id);
    setUsergroup(found ?? null);
  }, [initialData, usergroupsResult?.data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEdit) {
      const payload: Record<string, unknown> = {
        name,
        usergroup_id: usergroup?.id ?? "",
      };
      if (password) payload.password = password;
      if (confirmPassword) payload.confirm_password = confirmPassword;
      onSubmit(payload);
      return;
    }

    onSubmit({
      usergroup_id: usergroup?.id ?? "",
      username,
      name,
      password,
      confirm_password: confirmPassword,
    });
  };

  return (
    <form id={id} onSubmit={handleSubmit} className="space-y-6">
      {/* Informasi Akun */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Username"
          required
          placeholder="Contoh: budi.santoso"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          error={FormState?.errors?.username as string}
          disabled={isEdit}
        />
        <Input
          label="Nama Lengkap"
          required
          placeholder="Contoh: Budi Santoso"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={FormState?.errors?.name as string}
        />
        <RemoteSelect
          label="Usergroup"
          placeholder="Pilih Usergroup"
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
        <p className="text-xs text-red-500 -mt-4">
          {FormState.errors.usergroup_id as string}
        </p>
      ) : null}

      {/* Keamanan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          type="password"
          label="Password"
          required={!isEdit}
          placeholder={isEdit ? "Kosongkan jika tidak diganti" : "Min. 8 karakter"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={FormState?.errors?.password as string}
        />
        <Input
          type="password"
          label="Konfirmasi Password"
          required={!isEdit}
          placeholder={isEdit ? "Kosongkan jika tidak diganti" : "Ulangi password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={FormState?.errors?.confirm_password as string}
        />
      </div>
    </form>
  );
};
