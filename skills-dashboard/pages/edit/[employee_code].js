import { useRouter } from "next/router";

export default function EditUser() {
  const router = useRouter();
  const { employee_code } = router.query;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-lg font-bold">ユーザー {employee_code} を編集</h1>
      {/* Form fields here */}
    </div>
  );
}
