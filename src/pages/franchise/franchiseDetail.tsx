/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Page } from "@/components/app/layout";
import { Badge, Button, Drawer, Loading, Modal } from "@/components/ui";
import { useFranchisorList } from "@/services/franchisor/hooks";
import { useIsSuperuser } from "@/utils/permission";
import { getTypeVariant } from "@/utils";
import { Building2, Edit, Save, Store, Trash2 } from "lucide-react";
import type {
  FranchisorRow,
  FranchisorRowUpdateRequest,
} from "@/services/types/franchisor";
import { useEnigmaUI } from "@/components";
import FranchiseOutletTab from "@/pages/franchise/components/FranchiseOutletTab";
import { FranchiseMenuTab } from "@/pages/franchise/components/FranchiseMenuTab";
import { FranchiseCategoryTab } from "@/pages/franchise/components/FranchiseCategoryTab";
import { FranchiseForm } from "@/pages/franchise/components/FranchiseForm";

const FRANCHISE_TABS = [
  { key: "outlet", label: "Outlet" },
  { key: "menu", label: "Menu" },
  { key: "category", label: "Kategori POS" },
] as const;

type FranchiseTabKey = (typeof FRANCHISE_TABS)[number]["key"];

const FranchiseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isSuperuser = useIsSuperuser();
  const { showToast } = useEnigmaUI();
  const {
    show: showFranchise,
    showResult: franchiseResult,
    update,
    updateResult,
    remove,
    removeResult,
  } = useFranchisorList();

  const [activeTab, setActiveTab] = useState<FranchiseTabKey>("outlet");
  const franchisorId = id ?? "";

  // Edit / hapus data franchise (brand) itu sendiri.
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    if (!isSuperuser) {
      navigate("/dashboard", { replace: true });
    }
    if (id) {
      showFranchise({ id });
    }
  }, [isSuperuser, id, showFranchise, navigate]);

  const franchise = franchiseResult?.data?.data as FranchisorRow | undefined;
  const isLoading = franchiseResult?.isLoading || franchiseResult?.isFetching;

  const closeEditDrawer = () => {
    setEditDrawerOpen(false);
    updateResult?.reset?.();
  };

  const handleUpdateFranchise = (data: FranchisorRowUpdateRequest) => {
    if (!id) return;
    update({ id, payload: data as any });
  };

  useEffect(() => {
    if (updateResult?.isSuccess) {
      showToast({
        message: "Franchise berhasil diperbarui",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      closeEditDrawer();
      updateResult.reset?.();
      if (id) showFranchise({ id });
    }
  }, [updateResult?.isSuccess]);

  useEffect(() => {
    if (removeResult?.isSuccess) {
      showToast({
        message: "Franchise berhasil dihapus",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      removeResult.reset?.();
      navigate("/franchise", { replace: true });
    }
  }, [removeResult?.isSuccess]);

  if (!isSuperuser) {
    return (
      <Page className="h-full flex flex-col min-h-0 bg-slate-50">
        <Page.Body className="flex items-center justify-center">
          <p className="text-slate-400">Tidak ada akses.</p>
        </Page.Body>
      </Page>
    );
  }

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Settings"
        title={
          franchise?.name
            ? `Detail Franchise — ${franchise.name}`
            : "Detail Franchise"
        }
        subtitle="Informasi brand beserta outlet, menu, dan kategori POS."
        backTo={() => navigate("/franchise")}
        action={
          <div className='flex gap-2'>
            <Button
              variant='info'
              onClick={() => setEditDrawerOpen(true)}
              disabled={!franchise}
              title='Edit'
            >
              <Edit className='w-4 h-4' />
            </Button>
            <Button
              variant='error'
              onClick={() => setDeleteOpen(true)}
              disabled={!franchise}
              title='Hapus'
            >
              <Trash2 className='w-4 h-4' />
            </Button>
          </div>
        }
      />
      <Page.Body className="flex-1 overflow-auto p-6 space-y-6">
        {isLoading || !franchise ? (
          <div className="flex justify-center py-20">
            <Loading size="lg" variant="spinner" />
          </div>
        ) : (
          <>
            {/* Info Brand */}
            <div className="card-info card-animate p-6 bg-white border border-slate-200 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Store size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {franchise.name}
                  </h2>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge
                      variant={getTypeVariant(franchise.type)}
                      size="xs"
                      className="px-2.5 font-semibold text-[10px] tracking-wider capitalize"
                    >
                      {franchise.type}
                    </Badge>
                    <Badge
                      variant={franchise.is_active ? "success" : "error"}
                      size="xs"
                      className="px-2.5 font-semibold text-[10px] tracking-wider"
                    >
                      {franchise.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              </div>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                <div className="info-row">
                  <dt className="info-label">Email</dt>
                  <dd className="info-value">{franchise.email || "-"}</dd>
                </div>
                <div className="info-row">
                  <dt className="info-label">Telepon</dt>
                  <dd className="info-value">{franchise.phone || "-"}</dd>
                </div>
                <div className="info-row md:col-span-2">
                  <dt className="info-label">Alamat</dt>
                  <dd className="info-value">{franchise.address || "-"}</dd>
                </div>
              </dl>
            </div>

            {/* Tab navigasi: Outlet | Menu | Kategori POS */}
            <div className='flex items-center gap-1 border-b border-slate-200'>
              {FRANCHISE_TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-2.5 text-sm font-bold rounded-t-lg transition-colors cursor-pointer ${
                    activeTab === tab.key
                      ? "bg-white text-primary border border-b-0 border-slate-200 -mb-px"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === "outlet" && (
              <FranchiseOutletTab
                franchisorId={franchisorId}
                franchiseName={franchise.name}
              />
            )}
            {activeTab === "menu" && (
              <FranchiseMenuTab
                franchisorId={franchisorId}
                franchiseName={franchise.name}
              />
            )}
            {activeTab === "category" && (
              <FranchiseCategoryTab
                franchisorId={franchisorId}
                franchiseName={franchise.name}
              />
            )}
          </>
        )}
      </Page.Body>

      {/* Drawer: edit data franchise (brand) */}
      <Drawer
        open={editDrawerOpen}
        onClose={closeEditDrawer}
        position='right'
        className='!w-[30rem]'
      >
        <div className='flex flex-col h-full'>
          <div className='p-5 border-b border-slate-100'>
            <h3 className='text-lg font-bold text-slate-900 flex items-center gap-2'>
              <Building2 size={18} className='text-primary' />
              Edit Franchise
            </h3>
            <p className='text-xs text-slate-500 mt-1'>
              Perbarui data brand / franchisor.
            </p>
          </div>
          <div className='flex-1 overflow-y-auto p-5'>
            <FranchiseForm
              id='franchise-edit-form'
              initialData={franchise ?? null}
              onSubmit={handleUpdateFranchise}
            />
          </div>
          <div className='p-5 border-t border-slate-100 flex justify-end gap-2'>
            <Button variant='secondary' onClick={closeEditDrawer}>
              Batal
            </Button>
            <Button
              type='submit'
              form='franchise-edit-form'
              variant='success'
              isLoading={updateResult?.isLoading}
            >
              <Save className='w-4 h-4 mr-2' />
              Simpan
            </Button>
          </div>
        </div>
      </Drawer>

      {/* Modal konfirmasi hapus franchise */}
      <Modal.Wrapper
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        closeOnOutsideClick={false}
      >
        <Modal.Header>Hapus Franchise</Modal.Header>
        <Modal.Body>
          <p className='text-sm text-slate-600'>
            Apakah Anda yakin ingin menghapus franchise{" "}
            <strong>{franchise?.name}</strong>? Tindakan ini tidak dapat
            dibatalkan.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => setDeleteOpen(false)}>
            Batal
          </Button>
          <Button
            variant='error'
            onClick={() => {
              if (id) remove({ id });
            }}
            isLoading={removeResult?.isLoading}
          >
            Hapus
          </Button>
        </Modal.Footer>
      </Modal.Wrapper>
    </Page>
  );
};

export default FranchiseDetailPage;
