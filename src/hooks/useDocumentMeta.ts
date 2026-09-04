import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export interface RouteMeta {
  title: string;
  description: string;
}

const META_MAP: Record<string, RouteMeta> = {
  "/": {
    title: "Franchisor Portal",
    description: "Portal Manajemen Utama Sukabread Franchisor.",
  },
  "/signin": {
    title: "Sign In - Franchisor Portal",
    description: "Masuk ke akun Franchisor Portal Anda.",
  },
  "/dashboard": {
    title: "Dashboard - Franchisor Portal",
    description: "Ringkasan performa bisnis Anda hari ini.",
  },
  "/sales/order": {
    title: "Sales Order - Franchisor Portal",
    description: "Daftar pesanan penjualan franchise.",
  },
  "/sales/order/create": {
    title: "Tambah Sales Order - Franchisor Portal",
    description: "Buat pesanan penjualan baru.",
  },
  "/sales/order/:id": {
    title: "Sales Order Detail - Franchisor Portal",
    description: "Detail informasi pesanan penjualan.",
  },
  "/purchase/supplier": {
    title: "Supplier - Franchisor Portal",
    description: "Daftar supplier barang.",
  },
  "/purchase/supplier/create": {
    title: "Tambah Supplier - Franchisor Portal",
    description: "Tambah data supplier baru.",
  },
  "/purchase/supplier/update/:id": {
    title: "Ubah Supplier - Franchisor Portal",
    description: "Perbarui data supplier.",
  },
  "/purchase/order": {
    title: "Purchase Order - Franchisor Portal",
    description: "Daftar pesanan pembelian.",
  },
  "/purchase/order/create": {
    title: "Tambah Purchase Order - Franchisor Portal",
    description: "Buat pesanan pembelian baru.",
  },
  "/purchase/order/:id": {
    title: "Purchase Order Detail - Franchisor Portal",
    description: "Detail informasi pesanan pembelian.",
  },
  "/purchase/demand": {
    title: "Demand - Franchisor Portal",
    description: "Manajemen permintaan barang.",
  },
  "/report/pos": {
    title: "POS Order Report - Franchisor Portal",
    description: "Laporan transaksi POS outlet.",
  },
  "/report/outstanding": {
    title: "Outstanding Report - Franchisor Portal",
    description: "Laporan piutang outstanding.",
  },
  "/report/payment": {
    title: "Settlement - Franchisor Portal",
    description: "Laporan penyelesaian bulanan pembayaran POS.",
  },
  "/report/payment/daily": {
    title: "Settlement Daily - Franchisor Portal",
    description: "Laporan penyelesaian harian pembayaran POS.",
  },
  "/report/item": {
    title: "POS Order Item - Franchisor Portal",
    description: "Laporan penjualan item POS.",
  },
  "/report/daily": {
    title: "POS Item Daily - Franchisor Portal",
    description: "Laporan harian item POS.",
  },
  "/report/stock": {
    title: "Stock Report - Franchisor Portal",
    description: "Laporan stok barang.",
  },
  "/setting/business": {
    title: "Franchise Setting - Franchisor Portal",
    description: "Pengaturan identitas bisnis franchise.",
  },
  "/setting/inventory/catalog": {
    title: "Master Catalog - Franchisor Portal",
    description: "Manajemen katalog barang.",
  },
  "/setting/inventory/catalog/create": {
    title: "Tambah Master Catalog - Franchisor Portal",
    description: "Tambah master katalog baru.",
  },
  "/setting/inventory/catalog/update/:id": {
    title: "Ubah Master Catalog - Franchisor Portal",
    description: "Perbarui master katalog.",
  },
  "/setting/inventory/item": {
    title: "Master Item - Franchisor Portal",
    description: "Manajemen item barang.",
  },
  "/setting/inventory/item/create": {
    title: "Tambah Master Item - Franchisor Portal",
    description: "Tambah master item baru.",
  },
  "/setting/inventory/item/update/:id": {
    title: "Ubah Master Item - Franchisor Portal",
    description: "Perbarui master item.",
  },
  "/franchise": {
    title: "Franchise - Franchisor Portal",
    description: "Manajemen franchise.",
  },
  "/franchise/create": {
    title: "Tambah Franchise - Franchisor Portal",
    description: "Tambah franchise baru.",
  },
  "/franchise/update/:id": {
    title: "Ubah Franchise - Franchisor Portal",
    description: "Perbarui franchise.",
  },
  "/franchise/:id": {
    title: "Detail Franchise - Franchisor Portal",
    description: "Detail franchise & outlet.",
  },
  "/franchise/:franchiseId/outlet/create": {
    title: "Tambah Outlet - Franchisor Portal",
    description: "Tambah outlet franchise baru.",
  },
  "/franchise/:franchiseId/outlet/update/:outletId": {
    title: "Ubah Outlet - Franchisor Portal",
    description: "Perbarui data outlet franchise.",
  },
  "/setting/type/outlet": {
    title: "Tipe Outlet - Franchisor Portal",
    description: "Manajemen tipe outlet franchise.",
  },
  "/setting/type/outlet/create": {
    title: "Tambah Tipe Outlet - Franchisor Portal",
    description: "Tambah tipe outlet franchise baru.",
  },
  "/setting/type/outlet/update/:id": {
    title: "Ubah Tipe Outlet - Franchisor Portal",
    description: "Perbarui tipe outlet franchise.",
  },
  "/setting/pos/channel": {
    title: "POS Channel - Franchisor Portal",
    description: "Manajemen POS channel.",
  },
  "/setting/pos/category": {
    title: "POS Category - Franchisor Portal",
    description: "Manajemen kategori POS.",
  },
  "/setting/pos/catalog": {
    title: "POS Catalog - Franchisor Portal",
    description: "Manajemen katalog POS.",
  },
  "/setting/pos/catalog/create": {
    title: "Tambah POS Catalog - Franchisor Portal",
    description: "Tambah katalog POS baru.",
  },
  "/setting/pos/catalog/update/:id": {
    title: "Ubah POS Catalog - Franchisor Portal",
    description: "Perbarui katalog POS.",
  },
  "/setting/pos/payment": {
    title: "POS Payment - Franchisor Portal",
    description: "Manajemen POS payment.",
  },
  "/setting/pos/topup-schema": {
    title: "Topup Schema - Franchisor Portal",
    description: "Manajemen skema topup POS.",
  },
  "/setting/user": {
    title: "Manajemen User - Franchisor Portal",
    description: "Manajemen pengguna sistem.",
  },
  "/setting/user/create": {
    title: "Tambah User - Franchisor Portal",
    description: "Registrasikan pengguna sistem baru.",
  },
  "/setting/user/update/:id": {
    title: "Ubah User - Franchisor Portal",
    description: "Perbarui profil pengguna sistem.",
  },
  "/auth/me": {
    title: "My Profile - Franchisor Portal",
    description: "Informasi profil akun Anda.",
  },
};

function matchRoute(pathname: string): RouteMeta {
  if (META_MAP[pathname]) {
    return META_MAP[pathname];
  }

  for (const pattern of Object.keys(META_MAP)) {
    if (pattern.includes("/:")) {
      const regexPattern = new RegExp(
        "^" + pattern.replace(/\/:[^/]+/g, "/[^/]+") + "$",
      );
      if (regexPattern.test(pathname)) {
        return META_MAP[pattern];
      }
    }
  }

  return {
    title: "Franchisor Portal",
    description: "Portal Manajemen Utama Sukabread Franchisor.",
  };
}

export function useAppMetadata() {
  const location = useLocation();

  useEffect(() => {
    const meta = matchRoute(location.pathname);
    document.title = meta.title;

    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.setAttribute("name", "description");
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute("content", meta.description);
  }, [location.pathname]);
}

export function useDocumentMeta(title: string, description: string) {
  useEffect(() => {
    document.title = title;
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.setAttribute("name", "description");
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute("content", description);
  }, [title, description]);
}
