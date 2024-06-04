import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  Spacer,
  Select,
  Text,
} from "@chakra-ui/react";
import Header from "../components/Header";

const skillOrder = [
  { section: "IaaS", skill_name: "仮想マシン" },
  { section: "IaaS", skill_name: "オートスケーリング" },
  { section: "IaaS", skill_name: "ロードバランサー" },
  { section: "Databases", skill_name: "SQLDB" },
  { section: "Databases", skill_name: "NoSQLDB" },
  { section: "Databases", skill_name: "インメモリDB" },
  { section: "Databases", skill_name: "グラフDB" },
  { section: "Databases", skill_name: "データウェアハウス" },
  { section: "Storage", skill_name: "BlockStorage" },
  { section: "Storage", skill_name: "FileStorage" },
  { section: "Storage", skill_name: "ObjectStorage" },
  { section: "Analytics&ML", skill_name: "データレイク" },
  { section: "Analytics&ML", skill_name: "データ分析" },
  { section: "Analytics&ML", skill_name: "ストリームデータ処理" },
  { section: "Analytics&ML", skill_name: "ETL" },
  { section: "Analytics&ML", skill_name: "データ可視化" },
  { section: "Analytics&ML", skill_name: "機械学習" },
  { section: "DeveloperTools", skill_name: "ソース管理" },
  { section: "DeveloperTools", skill_name: "WebIDE" },
  { section: "DeveloperTools", skill_name: "CI/CDツール" },
  { section: "Security,Identity,Compliance", skill_name: "複数アカウント管理" },
  { section: "Security,Identity,Compliance", skill_name: "証明書管理" },
  { section: "Security,Identity,Compliance", skill_name: "暗号化/復号化" },
  { section: "Security,Identity,Compliance", skill_name: "モバイル認証" },
  { section: "Security,Identity,Compliance", skill_name: "アクセス制御" },
  { section: "Migration,Transfer", skill_name: "VMマイグレーション" },
  { section: "Migration,Transfer", skill_name: "DBマイグレーション" },
  { section: "Migration,Transfer", skill_name: "大容量データ移行" },
  { section: "Management,Governance", skill_name: "ソース管理/監視" },
  { section: "Management,Governance", skill_name: "イベント監視" },
  { section: "Management,Governance", skill_name: "ログ監視" },
  { section: "CaaS", skill_name: "コンテナ" },
  { section: "CaaS", skill_name: "コンテナオーケストレーション" },
  { section: "FaaS", skill_name: "サーバレス" },
  { section: "クラウド内NW", skill_name: "仮想NW" },
  { section: "クラウド内NW", skill_name: "DNS" },
  { section: "クラウド内NW", skill_name: "CDN" },
  { section: "オンプレ連携", skill_name: "専用線接続" },
  { section: "オンプレ連携", skill_name: "ハイブリッドストレージ" },
];

const getSymbolForLevel = (level) => {
  const parsedLevel = parseFloat(level);
  if (parsedLevel === 0) return ""; // Cross for level 0
  if (parsedLevel === 0.5) return "・"; // Dot for level 0.5
  if (parsedLevel === 1.0) return "△"; // Triangle for level 1.0
  if (parsedLevel === 1.5) return "▲"; // Filled triangle for level 1.5
  if (parsedLevel === 2.0) return "○"; // Circle for level 2.0
  if (parsedLevel === 2.5) return "◎"; // Double circle for level 2.5
  if (parsedLevel === 3.0) return "☆"; // Star for level 3.0
  if (parsedLevel === 4.0) return "★"; // Filled star for level 4.0
  if (parsedLevel === 5.0) return "★"; // Filled star for level 5.0 (same as 4.0 in example)
  return "？"; // Question mark for undefined levels
};

const SkillsPage = () => {
  const [users, setUsers] = useState([]);
  const [sortedUsers, setSortedUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [positions, setPositions] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch(
        "https://yurdpuchaa.execute-api.ap-northeast-1.amazonaws.com/dev3/users"
      );
      const data = await response.json();
      setUsers(data.Items);

      const sortedData = data.Items.sort((a, b) => {
        if (a.department.S < b.department.S) return -1;
        if (a.department.S > b.department.S) return 1;
        if (a.division.S < b.division.S) return -1;
        if (a.division.S > b.division.S) return 1;
        if (a.position.S < b.position.S) return -1;
        if (a.position.S > b.position.S) return 1;
        return 0;
      });

      setSortedUsers(sortedData);

      const departments = [
        ...new Set(data.Items.map((user) => user.department.S)),
      ];
      const divisions = [...new Set(data.Items.map((user) => user.division.S))];
      const positions = [...new Set(data.Items.map((user) => user.position.S))];

      setDepartments(departments);
      setDivisions(divisions);
      setPositions(positions);
    };

    fetchUsers();
  }, []);

  const handleDepartmentChange = (event) => {
    setSelectedDepartment(event.target.value);
  };

  const handleDivisionChange = (event) => {
    setSelectedDivision(event.target.value);
  };

  const handlePositionChange = (event) => {
    setSelectedPosition(event.target.value);
  };

  const filteredUsers = sortedUsers.filter((user) => {
    return (
      (selectedDepartment ? user.department.S === selectedDepartment : true) &&
      (selectedDivision ? user.division.S === selectedDivision : true) &&
      (selectedPosition ? user.position.S === selectedPosition : true)
    );
  });

  const renderHeader = () => {
    return (
      <Tr>
        <Th></Th>
        <Th></Th>
        {filteredUsers.map((user, index) => (
          <Th key={index} textAlign="center">
            {user.user_name.S}
          </Th>
        ))}
      </Tr>
    );
  };

  const renderRows = () => {
    let previousSection = "";
    return skillOrder.map((skill, skillIndex) => {
      const isSameSection = previousSection === skill.section;
      previousSection = skill.section;
      return (
        <Tr key={skillIndex}>
          {!isSameSection && (
            <Td
              rowSpan={
                skillOrder.filter((s) => s.section === skill.section).length
              }
              textAlign="center"
              verticalAlign="middle"
            >
              <Text fontWeight="bold">{skill.section}</Text>
            </Td>
          )}
          <Td>
            <Text fontWeight="bold">{skill.skill_name}</Text>
          </Td>
          {filteredUsers.map((user, userIndex) => {
            const userSkill = user.skills.L.find(
              (s) =>
                s.M.skill_name.S === skill.skill_name &&
                s.M.section.S === skill.section
            );
            return (
              <Td key={userIndex} textAlign="center">
                {userSkill ? getSymbolForLevel(userSkill.M.level.N) : "-"}
              </Td>
            );
          })}
        </Tr>
      );
    });
  };

  return (
    <Container maxW="container.xl" p={4}>
      <Header user="Tanaka" />
      <Flex mb={4} alignItems="center">
        <Spacer />
      </Flex>
      <Flex mb={4} alignItems="center">
        <Select placeholder="事業部" onChange={handleDepartmentChange} mr={2}>
          {departments.map((department, index) => (
            <option key={index} value={department}>
              {department}
            </option>
          ))}
        </Select>
        <Select placeholder="担当" onChange={handleDivisionChange} mr={2}>
          {divisions.map((division, index) => (
            <option key={index} value={division}>
              {division}
            </option>
          ))}
        </Select>
        <Select placeholder="役職" onChange={handlePositionChange}>
          {positions.map((position, index) => (
            <option key={index} value={position}>
              {position}
            </option>
          ))}
        </Select>
      </Flex>
      <Box
        bg="white"
        p={6}
        rounded="md"
        shadow="md"
        overflow="auto"
        maxH="70vh"
        sx={{ display: "flex", justifyContent: "center" }}
      >
        <Box>
          <Table
            variant="simple"
            size="sm"
            w="100%"
            sx={{ tableLayout: "fixed" }}
          >
            <Thead>{renderHeader()}</Thead>
            <Tbody>{renderRows()}</Tbody>
          </Table>
        </Box>
      </Box>
    </Container>
  );
};

export default SkillsPage;
