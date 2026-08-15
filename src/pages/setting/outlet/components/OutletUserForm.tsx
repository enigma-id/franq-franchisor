/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui";
import { useAppSelector } from "@/hooks";

interface OutletUserFormProps {
  id?: string;
  /** Mode edit — prefill nama & password tidak wajib. */
  initialData?: { name?: string; username?: string } | null;
  onSubmit: (data: {
    name: string;
    password?: string;
    confirm_password?: string;
  }) => void;
}

/**
 * Form khusus update user di konteks outlet.
 * Hanya mengelola nama & password (opsional saat edit) — tanpa usergroup.
 * Username ditampilkan read-only (disabled) saat edit, mengikuti pola UserForm.
 */
export const OutletUserForm: React.FC<OutletUserFormProps> = ({
  id = "outlet-user-form",
  initialData,
  onSubmit,
}) => {
  const FormState = useAppSelector((s) => s.form);
  const isEdit = !!initialData;

  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    setUsername(initialData?.username ?? "");
    setName(initialData?.name ?? "");
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: {
      name: string;
      password?: string;
      confirm_password?: string;
    } = { name };
    if (password) {
      payload.password = password;
      payload.confirm_password = confirmPassword;
    }
    onSubmit(payload);
  };

  return (
    <form id={id} onSubmit={handleSubmit} className="space-y-6">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
