import { useRouter } from "next/router";
import Header from "../../components/Header.jsx";

export default function deleteUser() {
  const router = useRouter();
  const { employee_code } = router.query;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-lg font-bold">ユーザー {employee_code} を削除</h1>
      {/* Form fields here */}
    </div>
  );
}
