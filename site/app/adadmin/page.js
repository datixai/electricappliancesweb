import "./admin.css";
import { getProducts, isAdmin } from "@/lib/store";
import { CATEGORIES } from "@/lib/site";
import AdminPanel, { Login } from "./AdminPanel";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin | Adnan Electronics Household", robots: { index: false } };

export default async function Admin() {
  if (!(await isAdmin())) return <Login />;
  return <AdminPanel products={await getProducts()} categories={CATEGORIES} />;
}
