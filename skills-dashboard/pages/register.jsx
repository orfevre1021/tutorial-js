import React, { useState } from "react";
import Header from "../components/Header.jsx";

// API Gatewayのエンドポイント
const API_ENDPOINT =
  "https://yurdpuchaa.execute-api.ap-northeast-1.amazonaws.com/dev6/register";

const EmployeeForm = () => {
  const [activeTab, setActiveTab] = useState("basicInfo");
  const [activeSkillTab, setActiveSkillTab] = useState("IaaS");
  const [employee_code, setEmployeeCode] = useState("");
  const [user_name, setUserName] = useState("");
  const [email_address, setEmailAddress] = useState("");
  const [department, setDepartment] = useState("");
  const [division, setDivision] = useState("");
  const [position, setPosition] = useState("");
  const [skills, setSkills] = useState([
    { section: "IaaS", skill_name: "仮想マシン", level: 0 },
    { section: "IaaS", skill_name: "オートスケーリング", level: 0 },
    { section: "IaaS", skill_name: "ロードバランサー", level: 0 },
    { section: "Databases", skill_name: "SQLDB", level: 0 },
    { section: "Databases", skill_name: "NoSQLDB", level: 0 },
    { section: "Databases", skill_name: "インメモリDB", level: 0 },
    { section: "Databases", skill_name: "グラフDB", level: 0 },
    { section: "Databases", skill_name: "データウェアハウス", level: 0 },
    { section: "Storage", skill_name: "BlockStorage", level: 0 },
    { section: "Storage", skill_name: "FileStorage", level: 0 },
    { section: "Storage", skill_name: "ObjectStorage", level: 0 },
    { section: "Analytics&ML", skill_name: "データレイク", level: 0 },
    { section: "Analytics&ML", skill_name: "データ分析", level: 0 },
    { section: "Analytics&ML", skill_name: "ストリームデータ処理", level: 0 },
    { section: "Analytics&ML", skill_name: "ETL", level: 0 },
    { section: "Analytics&ML", skill_name: "データ可視化", level: 0 },
    { section: "Analytics&ML", skill_name: "機械学習", level: 0 },
    { section: "DeveloperTools", skill_name: "ソース管理", level: 0 },
    { section: "DeveloperTools", skill_name: "WebIDE", level: 0 },
    { section: "DeveloperTools", skill_name: "CI/CDツール", level: 0 },
    {
      section: "Security,Identity,Compliance",
      skill_name: "複数アカウント管理",
      level: 0,
    },
    {
      section: "Security,Identity,Compliance",
      skill_name: "証明書管理",
      level: 0,
    },
    {
      section: "Security,Identity,Compliance",
      skill_name: "暗号化/復号化",
      level: 0,
    },
    {
      section: "Security,Identity,Compliance",
      skill_name: "モバイル認証",
      level: 0,
    },
    {
      section: "Security,Identity,Compliance",
      skill_name: "アクセス制御",
      level: 0,
    },
    {
      section: "Migration,Transfer",
      skill_name: "VMマイグレーション",
      level: 0,
    },
    {
      section: "Migration,Transfer",
      skill_name: "DBマイグレーション",
      level: 0,
    },
    {
      section: "Migration,Transfer",
      skill_name: "大容量データ移行",
      level: 0,
    },
    {
      section: "Management,Governance",
      skill_name: "ソース管理/監視",
      level: 0,
    },
    {
      section: "Management,Governance",
      skill_name: "イベント監視",
      level: 0,
    },
    {
      section: "Management,Governance",
      skill_name: "ログ監視",
      level: 0,
    },
    {
      section: "CaaS",
      skill_name: "コンテナ",
      level: 0,
    },
    {
      section: "CaaS",
      skill_name: "コンテナオーケストレーション",
      level: 0,
    },
    {
      section: "FaaS",
      skill_name: "サーバレス",
      level: 0,
    },
    {
      section: "クラウド内NW",
      skill_name: "仮想NW",
      level: 0,
    },
    {
      section: "クラウド内NW",
      skill_name: "DNS",
      level: 0,
    },
    {
      section: "クラウド内NW",
      skill_name: "CDN",
      level: 0,
    },
    {
      section: "オンプレ連携",
      skill_name: "専用線接続",
      level: 0,
    },
    {
      section: "オンプレ連携",
      skill_name: "ハイブリッドストレージ",
      level: 0,
    },
  ]);
  const [certifications, setCertifications] = useState([]);
  const [errors, setErrors] = useState({});

  const handleCertificationChange = (index, field, value) => {
    const updatedCertifications = certifications.map((cert, i) => {
      if (i === index) {
        return { ...cert, [field]: value };
      }
      return cert;
    });
    setCertifications(updatedCertifications);
  };

  const handleSkillChange = (index, field, value) => {
    const updatedSkills = skills.map((skill, i) => {
      if (i === index) {
        return { ...skill, [field]: value };
      }
      return skill;
    });
    setSkills(updatedSkills);
  };

  const handleCertificationDelete = (index) => {
    const updatedCertifications = certifications.filter((_, i) => i !== index);
    setCertifications(updatedCertifications);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!employee_code.match(/^\d{7}$/))
      newErrors.employee_code = "社員コードは7桁の数字でなければなりません";
    if (!user_name) newErrors.user_name = "氏名は必須です";
    if (!email_address) newErrors.email_address = "メールアドレスは必須です";
    if (!department) newErrors.department = "事業部は必須です";
    if (!division) newErrors.division = "担当は必須です";
    if (!position) newErrors.position = "役職は必須です";
    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    const updated_date = new Date().toISOString().split("T")[0];
    const created_date = new Date().toISOString().split("T")[0];

    const data = {
      employee_code: parseInt(employee_code),
      user_name,
      email_address,
      department,
      division,
      position,
      skills: skills.map((skill) => ({
        ...skill,
        level: parseInt(skill.level),
      })),
      certifications: certifications.map((cert) => ({
        ...cert,
        level: parseInt(cert.level),
        acquired_date: cert.acquired_date || "",
      })),
      updated_date,
      created_date,
    };
    console.log(data);

    try {
      const response = await fetch(API_ENDPOINT, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const responseData = await response.json();
      console.log("Success:", responseData);
      alert("データが正常に送信されました！");
    } catch (error) {
      console.error("Error:", error);
      alert("データの送信に失敗しました");
    }
  };

  const tabStyle =
    "py-3 px-6 rounded-t-lg text-lg font-semibold w-full text-center";
  const skillTabStyle =
    "py-2 px-4 rounded-t-lg text-md font-semibold w-full text-center";
  const inputStyle =
    "block w-full bg-gray-200 text-gray-700 border border-gray-300 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500";
  const circleTabStyle =
    "inline-block p-4 m-2 text-center rounded-full cursor-pointer border-2 border-gray-500";
  const skillSections = [
    "IaaS",
    "Databases",
    "Storage",
    "Analytics&ML",
    "DeveloperTools",
    "Security,Identity,Compliance",
    "Migration,Transfer",
    "Management,Governance",
    "CaaS",
    "FaaS",
    "クラウド内NW",
    "オンプレ連携",
  ];

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header user="Tanaka" />
      <div className="p-6">
        <div className="max-w-5xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <div className="flex justify-between mb-6 border-b-2 border-gray-200">
            <button
              className={`${tabStyle} ${
                activeTab === "basicInfo"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 border border-black"
              }`}
              onClick={() => setActiveTab("basicInfo")}
            >
              基本情報
            </button>
            <button
              className={`${tabStyle} ${
                activeTab === "departmentInfo"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 border border-black"
              }`}
              onClick={() => setActiveTab("departmentInfo")}
            >
              所属情報
            </button>
            <button
              className={`${tabStyle} ${
                activeTab === "skills"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 border border-black"
              }`}
              onClick={() => setActiveTab("skills")}
            >
              スキル
            </button>
            <button
              className={`${tabStyle} ${
                activeTab === "certifications"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 border border-black"
              }`}
              onClick={() => setActiveTab("certifications")}
            >
              資格
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {activeTab === "basicInfo" && (
              <div className="mb-24">
                <div className="my-14">
                  <label className="block text-gray-700 text-2xl font-bold mb-2">
                    氏名コード（数字7桁）
                  </label>
                  <input
                    className={inputStyle}
                    type="text"
                    value={employee_code}
                    onChange={(e) => {
                      setEmployeeCode(e.target.value);
                      setErrors({ ...errors, employee_code: "" });
                    }}
                  />
                  {errors.employee_code && (
                    <p className="text-red-500 text-sm">
                      {errors.employee_code}
                    </p>
                  )}
                </div>

                <div className="my-14">
                  <label className="block text-gray-700 text-2xl font-bold mb-2">
                    氏名
                  </label>
                  <input
                    className={inputStyle}
                    type="text"
                    value={user_name}
                    onChange={(e) => {
                      setUserName(e.target.value);
                      setErrors({ ...errors, user_name: "" });
                    }}
                  />
                  {errors.user_name && (
                    <p className="text-red-500 text-sm">{errors.user_name}</p>
                  )}
                </div>

                <div className="my-14">
                  <label className="block text-gray-700 text-2xl font-bold mb-2">
                    メールアドレス
                  </label>
                  <input
                    className={inputStyle}
                    type="email"
                    value={email_address}
                    onChange={(e) => {
                      setEmailAddress(e.target.value);
                      setErrors({ ...errors, email_address: "" });
                    }}
                  />
                  {errors.email_address && (
                    <p className="text-red-500 text-sm">
                      {errors.email_address}
                    </p>
                  )}
                </div>
              </div>
            )}

            {activeTab === "departmentInfo" && (
              <div className="mb-24">
                <div className="my-14">
                  <label className="block text-gray-700 text-2xl font-bold mb-2">
                    事業部
                  </label>
                  <select
                    className={inputStyle}
                    value={department}
                    onChange={(e) => {
                      setDepartment(e.target.value);
                      setErrors({ ...errors, department: "" });
                    }}
                  >
                    <option value="">プルダウンから選択</option>
                    <option value="A事業部">A事業部</option>
                    <option value="B事業部">B事業部</option>
                    <option value="C事業部">C事業部</option>
                  </select>
                  {errors.department && (
                    <p className="text-red-500 text-sm">{errors.department}</p>
                  )}
                </div>

                <div className="my-14">
                  <label className="block text-gray-700 text-2xl font-bold mb-2">
                    担当
                  </label>
                  <select
                    className={inputStyle}
                    value={division}
                    onChange={(e) => {
                      setDivision(e.target.value);
                      setErrors({ ...errors, division: "" });
                    }}
                  >
                    <option value="">プルダウンから選択</option>
                    <option value="インフラ担当">インフラ担当</option>
                    <option value="アプリ担当">アプリ担当</option>
                    <option value="セキュリティ担当">セキュリティ担当</option>
                  </select>
                  {errors.division && (
                    <p className="text-red-500 text-sm">{errors.division}</p>
                  )}
                </div>

                <div className="my-14">
                  <label className="block text-gray-700 text-2xl font-bold mb-2">
                    役職
                  </label>
                  <select
                    className={inputStyle}
                    value={position}
                    onChange={(e) => {
                      setPosition(e.target.value);
                      setErrors({ ...errors, position: "" });
                    }}
                  >
                    <option value="">プルダウンから選択</option>
                    <option value="課長">課長</option>
                    <option value="課長代理">課長代理</option>
                    <option value="主任">主任</option>
                    <option value="勤務">勤務</option>
                  </select>
                  {errors.position && (
                    <p className="text-red-500 text-sm">{errors.position}</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === "skills" && (
              <div className="mb-24">
                <div className="flex justify-center flex-wrap mb-4">
                  {skillSections.map((section) => (
                    <div
                      key={section}
                      className={`${circleTabStyle} ${
                        activeSkillTab === section
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-700 border border-black"
                      }`}
                      onClick={() => setActiveSkillTab(section)}
                    >
                      {section}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {skills
                    .filter((skill) => skill.section === activeSkillTab)
                    .map((skill, index) => (
                      <div key={index} className="flex items-center mb-6">
                        <div className="text-gray-700 text-2xl font-bold mr-4">
                          {skill.skill_name}
                        </div>
                        <div className="flex">
                          {[1, 2, 3, 4, 5, 6, 7].map((level) => (
                            <span
                              key={level}
                              className={`cursor-pointer text-2xl ${
                                skill.level >= level
                                  ? "text-yellow-500"
                                  : "text-gray-300"
                              }`}
                              onClick={() =>
                                handleSkillChange(index, "level", level)
                              }
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {activeTab === "certifications" && (
              <div className="mb-24">
                <h3 className="text-gray-700 text-2xl font-bold my-14"></h3>
                {certifications.map((cert, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-4 gap-4 my-14 items-center"
                  >
                    <select
                      className={`${inputStyle} md:col-span-1`}
                      value={cert.vender || ""}
                      onChange={(e) =>
                        handleCertificationChange(
                          index,
                          "vender",
                          e.target.value
                        )
                      }
                    >
                      <option value="">ベンダーを選択</option>
                      <option value="AWS">AWS</option>
                      <option value="Azure">Azure</option>
                      <option value="GCP">GCP</option>
                      <option value="Other">Other</option>
                    </select>
                    <input
                      className={`${inputStyle} md:col-span-1`}
                      type="date"
                      value={cert.acquired_date || ""}
                      onChange={(e) =>
                        handleCertificationChange(
                          index,
                          "acquired_date",
                          e.target.value
                        )
                      }
                      placeholder="取得日"
                    />
                    <input
                      className={`${inputStyle} md:col-span-2`}
                      type="text"
                      value={cert.certification_name || ""}
                      onChange={(e) =>
                        handleCertificationChange(
                          index,
                          "certification_name",
                          e.target.value
                        )
                      }
                      placeholder="資格名"
                    />
                    <div className="flex items-center justify-end">
                      <span className="text-gray-700 my-5 text-xl font-bold">
                        資格レベル
                      </span>
                      <div className="flex">
                        {[1, 2, 3].map((level) => (
                          <span
                            key={level}
                            className={`cursor-pointer text-2xl ${
                              cert.level >= level
                                ? "text-yellow-500"
                                : "text-gray-300"
                            }`}
                            onClick={() =>
                              handleCertificationChange(index, "level", level)
                            }
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                      onClick={() => handleCertificationDelete(index)}
                    >
                      削除
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                  onClick={() => setCertifications([...certifications, {}])}
                >
                  資格を追加
                </button>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded"
            >
              登録
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmployeeForm;
