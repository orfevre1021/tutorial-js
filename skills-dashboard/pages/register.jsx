import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  Input,
  Select,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Text,
  VStack,
  Tooltip,
} from "@chakra-ui/react";
import { useRouter } from "next/router";

const API_ENDPOINT =
  "https://yurdpuchaa.execute-api.ap-northeast-1.amazonaws.com/dev6/register";

const EmployeeForm = () => {
  const router = useRouter();
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

  const employeeCodeRef = useRef(null);
  const userNameRef = useRef(null);
  const emailAddressRef = useRef(null);
  const departmentRef = useRef(null);
  const divisionRef = useRef(null);
  const positionRef = useRef(null);
  const certificationsContainerRef = useRef(null);

  const handleCertificationChange = (index, field, value) => {
    const updatedCertifications = certifications.map((cert, i) => {
      if (i === index) {
        return { ...cert, [field]: value };
      }
      return cert;
    });

    // Clear errors for the current certification
    const updatedErrors = { ...errors };
    delete updatedErrors[`certifications[${index}]`];

    setCertifications(updatedCertifications);
    setErrors(updatedErrors);
  };

  const handleSkillChange = (index, value) => {
    const updatedSkills = skills.map((skill, i) => {
      if (i === index) {
        return { ...skill, level: value };
      }
      return skill;
    });
    setSkills(updatedSkills);
  };

  const handleCertificationDelete = (index) => {
    const updatedCertifications = certifications.filter((_, i) => i !== index);

    const updatedErrors = { ...errors };
    delete updatedErrors[`certifications[${index}]`];

    setCertifications(updatedCertifications);
    setErrors(updatedErrors);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!employee_code.match(/^\d{7}$/))
      newErrors.employee_code = "氏名コードは7桁の数字でなければなりません";
    if (!user_name) newErrors.user_name = "氏名は必須です";
    if (!email_address.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      newErrors.email_address = "有効なメールアドレスを入力してください";
    if (!department) newErrors.department = "事業部は必須です";
    if (!division) newErrors.division = "担当は必須です";
    if (!position) newErrors.position = "役職は必須です";
    certifications.forEach((cert, index) => {
      if (
        !cert.certification_name ||
        !cert.vender ||
        !cert.acquired_date ||
        cert.level === undefined
      ) {
        newErrors[`certifications[${index}]`] =
          "すべてのフィールドを入力するか、資格を削除してください";
      }
    });
    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);

      const errorFields = [
        { ref: employeeCodeRef, field: "employee_code" },
        { ref: userNameRef, field: "user_name" },
        { ref: emailAddressRef, field: "email_address" },
        { ref: departmentRef, field: "department" },
        { ref: divisionRef, field: "division" },
        { ref: positionRef, field: "position" },
      ];

      for (const field of errorFields) {
        if (formErrors[field.field]) {
          field.ref.current.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
          return;
        }
      }

      if (
        Object.keys(formErrors).some((key) => key.startsWith("certifications"))
      ) {
        certificationsContainerRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }

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
      router.push(
        `/users?newUser=true&userName=${encodeURIComponent(user_name)}`
      );
    } catch (error) {
      console.error("Error:", error);
      alert("データの送信に失敗しました");
    }
  };

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

  const renderSkillMarks = () => {
    const skillLevelDescriptions = [
      "経験なし",
      "基礎学習した",
      "指導ありで実施できる",
      "指導ありで実施した",
      "一人で実施できる",
      "一人で実施した",
      "指導できる（アソシ）",
      "その道のプロ（シニア）",
      "第一人者（エグゼ）",
    ];

    return [...Array(9)].map((_, i) => (
      <Tooltip
        key={i}
        label={skillLevelDescriptions[i] || `スキルレベル ${i}`}
        hasArrow
        placement="top"
      >
        <Box
          position="absolute"
          left={`${(i / 8) * 100}%`}
          transform="translateX(-50%)"
          height="12px"
          width="2px"
          bg="blue.500"
          _hover={{ width: "1cm" }}
        />
      </Tooltip>
    ));
  };

  const renderCertMarks = () => {
    const certLevelDescriptions = ["初級", "中級", "上級"];

    return [...Array(3)].map((_, i) => (
      <Tooltip
        key={i}
        label={certLevelDescriptions[i] || `資格レベル ${i + 1}`}
        hasArrow
        placement="top"
      >
        <Box
          position="absolute"
          left={`${(i / 2) * 100}%`}
          transform="translateX(-50%)"
          height="12px"
          width="2px"
          bg="blue.500"
          _hover={{ width: "1cm" }}
        />
      </Tooltip>
    ));
  };

  return (
    <Container maxW="container.xl" p={4}>
      <form onSubmit={handleSubmit}>
        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
          <Box
            ref={employeeCodeRef}
            bg="white"
            borderWidth="1px"
            borderRadius="lg"
            p={6}
          >
            <Heading as="h2" size="lg" mb={6}>
              基本情報
            </Heading>
            <Box p={4} color="gray.600" bg="gray.100" borderRadius="md" mb={10}>
              必須入力値です。氏名コードと氏名は後から変更できません。
            </Box>
            <VStack spacing={6} align="stretch">
              <Box>
                <Text mb={2}>氏名コード（数字7桁）</Text>
                <Input
                  type="text"
                  value={employee_code}
                  borderColor="gray.200"
                  borderWidth="2px"
                  onChange={(e) => {
                    setEmployeeCode(e.target.value);
                    setErrors({ ...errors, employee_code: "" });
                  }}
                />
                {errors.employee_code && (
                  <Text color="red.500" fontSize="sm">
                    {errors.employee_code}
                  </Text>
                )}
              </Box>
              <Box ref={userNameRef}>
                <Text mb={2}>氏名</Text>
                <Input
                  type="text"
                  value={user_name}
                  borderColor="gray.200"
                  borderWidth="2px"
                  onChange={(e) => {
                    setUserName(e.target.value);
                    setErrors({ ...errors, user_name: "" });
                  }}
                />
                {errors.user_name && (
                  <Text color="red.500" fontSize="sm">
                    {errors.user_name}
                  </Text>
                )}
              </Box>
              <Box ref={emailAddressRef}>
                <Text mb={2}>メールアドレス</Text>
                <Input
                  type="email"
                  value={email_address}
                  borderColor="gray.200"
                  borderWidth="2px"
                  onChange={(e) => {
                    setEmailAddress(e.target.value);
                    setErrors({ ...errors, email_address: "" });
                  }}
                />
                {errors.email_address && (
                  <Text color="red.500" fontSize="sm">
                    {errors.email_address}
                  </Text>
                )}
              </Box>
            </VStack>
          </Box>
          <Box
            ref={departmentRef}
            bg="white"
            borderWidth="1px"
            borderRadius="lg"
            p={6}
          >
            <Heading as="h2" size="lg" mb={6}>
              所属情報
            </Heading>
            <Box p={4} color="gray.600" bg="gray.100" borderRadius="md" mb={10}>
              必須入力値です。
            </Box>
            <VStack spacing={6} align="stretch">
              <Box>
                <Text mb={2}>事業部</Text>
                <Select
                  value={department}
                  borderColor="gray.200"
                  borderWidth="2px"
                  onChange={(e) => {
                    setDepartment(e.target.value);
                    setErrors({ ...errors, department: "" });
                  }}
                >
                  <option value="">プルダウンから選択</option>
                  <option value="A事業部">A事業部</option>
                  <option value="B事業部">B事業部</option>
                  <option value="C事業部">C事業部</option>
                </Select>
                {errors.department && (
                  <Text color="red.500" fontSize="sm">
                    {errors.department}
                  </Text>
                )}
              </Box>
              <Box ref={divisionRef}>
                <Text mb={2}>担当</Text>
                <Select
                  value={division}
                  borderColor="gray.200"
                  borderWidth="2px"
                  onChange={(e) => {
                    setDivision(e.target.value);
                    setErrors({ ...errors, division: "" });
                  }}
                >
                  <option value="">プルダウンから選択</option>
                  <option value="インフラ担当">インフラ担当</option>
                  <option value="アプリ担当">アプリ担当</option>
                  <option value="セキュリティ担当">セキュリティ担当</option>
                </Select>
                {errors.division && (
                  <Text color="red.500" fontSize="sm">
                    {errors.division}
                  </Text>
                )}
              </Box>
              <Box ref={positionRef}>
                <Text mb={2}>役職</Text>
                <Select
                  value={position}
                  borderColor="gray.200"
                  borderWidth="2px"
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
                </Select>
                {errors.position && (
                  <Text color="red.500" fontSize="sm">
                    {errors.position}
                  </Text>
                )}
              </Box>
            </VStack>
          </Box>
        </Grid>
        <Box bg="white" borderWidth="1px" borderRadius="lg" p={6} mt={6}>
          <Heading as="h2" size="lg" mb={6}>
            保有スキル
          </Heading>
          <Box p={4} color="gray.600" bg="gray.100" borderRadius="md" mb={10}>
            任意入力値です。<br></br>
            スキルレベルのデフォルト値は0で、0〜8を選択できます。
          </Box>
          <VStack spacing={6} align="stretch">
            {skillSections.map((section) => (
              <Box key={section} mb={6}>
                <Heading
                  as="h3"
                  size="md"
                  mb={8}
                  borderBottom="2px solid black"
                >
                  {section}
                </Heading>
                {skills
                  .filter((skill) => skill.section === section)
                  .map((skill, index) => (
                    <Box key={index} mb={4}>
                      <Text mb={2}>{skill.skill_name}</Text>
                      <Flex align="center">
                        <Slider
                          flex="1"
                          value={skill.level}
                          min={0}
                          max={8}
                          step={1}
                          onChange={(val) =>
                            handleSkillChange(
                              skills.findIndex(
                                (s) => s.skill_name === skill.skill_name
                              ),
                              val
                            )
                          }
                        >
                          <SliderTrack
                            bg="gray.300"
                            height="10px"
                            borderRadius="5px"
                          >
                            {renderSkillMarks()}
                            <SliderFilledTrack
                              bg="blue.500"
                              borderRadius="5px"
                            />
                          </SliderTrack>
                          <SliderThumb boxSize={6}>
                            <Text color="blue" fontSize="xs">
                              {skill.level}
                            </Text>
                          </SliderThumb>
                        </Slider>
                      </Flex>
                    </Box>
                  ))}
              </Box>
            ))}
          </VStack>
        </Box>
        <Box
          ref={certificationsContainerRef}
          bg="white"
          borderWidth="1px"
          borderRadius="lg"
          p={6}
          mt={6}
        >
          <Heading as="h2" size="lg" mb={6}>
            認定資格
          </Heading>
          <Box p={4} color="gray.600" bg="gray.100" borderRadius="md" mb={10}>
            任意入力値です。<br></br>
            資格追加がある場合は「追加」、追加を取り消す場合は「削除」をクリックしてください。
          </Box>
          <VStack spacing={6} align="stretch">
            {certifications.map((cert, index) => (
              <Box key={index} mb={4}>
                <Box mb={4}>
                  <Text mb={2}>資格名</Text>
                  <Input
                    type="text"
                    value={cert.certification_name || ""}
                    borderColor="gray.200"
                    borderWidth="2px"
                    onChange={(e) =>
                      handleCertificationChange(
                        index,
                        "certification_name",
                        e.target.value
                      )
                    }
                  />
                </Box>
                <Box mb={4}>
                  <Text mb={2}>ベンダー</Text>
                  <Select
                    value={cert.vender || ""}
                    onChange={(e) =>
                      handleCertificationChange(index, "vender", e.target.value)
                    }
                  >
                    <option value="">ベンダーを選択</option>
                    <option value="AWS">AWS</option>
                    <option value="Azure">Azure</option>
                    <option value="GCP">GCP</option>
                    <option value="Other">Other</option>
                  </Select>
                </Box>
                <Box mb={4}>
                  <Text mb={2}>取得日</Text>
                  <Input
                    type="date"
                    value={cert.acquired_date || ""}
                    borderColor="gray.200"
                    borderWidth="2px"
                    onChange={(e) =>
                      handleCertificationChange(
                        index,
                        "acquired_date",
                        e.target.value
                      )
                    }
                  />
                </Box>
                <Box mb={4}>
                  <Text mb={2}>資格レベル</Text>
                  <Flex align="center">
                    <Slider
                      flex="1"
                      value={cert.level ?? 1}
                      min={1}
                      max={3}
                      step={1}
                      onChange={(val) =>
                        handleCertificationChange(index, "level", val)
                      }
                    >
                      <SliderTrack
                        bg="gray.300"
                        height="10px"
                        borderRadius="5px"
                      >
                        {renderCertMarks()}
                        <SliderFilledTrack bg="blue.500" borderRadius="5px" />
                      </SliderTrack>
                      <SliderThumb boxSize={6}>
                        <Text color="blue" fontSize="xs">
                          {["初", "中", "高"][cert.level - 1] || "初"}
                        </Text>
                      </SliderThumb>
                    </Slider>
                  </Flex>
                </Box>
                <Button
                  mt={2}
                  colorScheme="red"
                  onClick={() => handleCertificationDelete(index)}
                >
                  削除
                </Button>
                {errors[`certifications[${index}]`] && (
                  <Text color="red.500" fontSize="sm">
                    {errors[`certifications[${index}]`]}
                  </Text>
                )}
              </Box>
            ))}
            <Button
              colorScheme="blue"
              onClick={() =>
                setCertifications([...certifications, { level: 1 }])
              }
            >
              追加
            </Button>
          </VStack>
        </Box>
        <Button
          mt={6}
          colorScheme="green"
          type="submit"
          width="full"
          onClick={handleSubmit}
        >
          登録
        </Button>
      </form>
    </Container>
  );
};

export default EmployeeForm;
