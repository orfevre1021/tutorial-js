import { useRouter } from "next/router";
import Header from "../../components/Header.jsx";

export default function deleteUser() {
  const router = useRouter();
  const { employee_code } = router.query;

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header title="ユーザ情報の削除" user="Tanaka" />

      <div className="container mx-auto p-4">
        <h1 className="text-lg font-bold">ユーザー {employee_code} を削除</h1>
        {/* Form fields here */}
      </div>
    </div>
  );
}
