import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import Header from "../../components/Header.jsx";

export default function ViewUser() {
  const router = useRouter();
  const { employee_code } = router.query;

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header title="ユーザ情報の閲覧" user="Tanaka" />

      <div className="container mx-auto p-4">
        <h1 className="text-lg font-bold">ユーザー {employee_code} を閲覧</h1>
        {/* Form fields here */}
      </div>
    </div>
  );
}
