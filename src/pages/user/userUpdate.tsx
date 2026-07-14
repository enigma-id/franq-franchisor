import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Page } from "@/components/app/layout";

const UserUpdatePage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header category="Settings" title="Update User" backTo={() => navigate(-1)} />
      <Page.Body className="p-6">
        <div className="max-w-xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <p className="text-slate-500">Form update user {id} — implementasi menyusul.</p>
        </div>
      </Page.Body>
    </Page>
  );
};

export default UserUpdatePage;
