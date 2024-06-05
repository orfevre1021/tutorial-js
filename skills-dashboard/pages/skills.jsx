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
  Select,
  Text,
  Tooltip,
  Link,
} from "@chakra-ui/react";
import Header from "../components/Header";
import NextLink from "next/link";

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

const SkillsPage = () => {
  const [users, setUsers] = useState([]);
  const [sortedUsers, setSortedUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [positions, setPositions] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

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

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const filteredUsers = sortedUsers.filter((user) => {
    return (
      (selectedDepartment ? user.department.S === selectedDepartment : true) &&
      (selectedDivision ? user.division.S === selectedDivision : true) &&
      (selectedPosition ? user.position.S === selectedPosition : true)
    );
  });

  const sortedFilteredUsers = [...filteredUsers].sort((a, b) => {
    if (sortConfig.key) {
      let aValue, bValue;
      if (sortConfig.key === "user_name") {
        aValue = a.user_name.S;
        bValue = b.user_name.S;
      } else if (sortConfig.key === "department") {
        aValue = a.department.S;
        bValue = b.department.S;
      } else if (sortConfig.key === "division") {
        aValue = a.division.S;
        bValue = b.division.S;
      } else if (sortConfig.key === "position") {
        aValue = a.position.S;
        bValue = b.position.S;
      } else {
        const skill = skillOrder.find(
          (s) =>
            s.skill_name === sortConfig.key.skill_name &&
            s.section === sortConfig.key.section
        );
        const userASkill = a.skills.L.find(
          (s) =>
            s.M.skill_name.S === skill.skill_name &&
            s.M.section.S === skill.section
        );
        const userBSkill = b.skills.L.find(
          (s) =>
            s.M.skill_name.S === skill.skill_name &&
            s.M.section.S === skill.section
        );
        aValue = userASkill ? parseFloat(userASkill.M.level.N) : 0;
        bValue = userBSkill ? parseFloat(userBSkill.M.level.N) : 0;
      }

      if (aValue < bValue) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
    }
    return 0;
  });

  const renderSortIcons = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "ascending" ? "▲" : "▼";
    }
    return "▼";
  };

  const renderHeader = () => {
    let previousSection = "";
    return (
      <>
        <Tr>
          <Th
            rowSpan={2}
            textAlign="center"
            border="1px"
            borderColor="gray.300"
            w="120px"
            textTransform="none"
            cursor="pointer"
            onClick={() => handleSort("user_name")}
            className="sticky-header"
          >
            氏名 <br />
            <span style={{ fontSize: "0.8em" }}>
              {renderSortIcons("user_name")}
            </span>
          </Th>
          <Th
            rowSpan={2}
            textAlign="center"
            border="1px"
            borderColor="gray.300"
            w="160px"
            textTransform="none"
            cursor="pointer"
            onClick={() => handleSort("department")}
            className="sticky-header"
          >
            事業部 <br />
            <span style={{ fontSize: "0.8em" }}>
              {renderSortIcons("department")}
            </span>
          </Th>
          <Th
            rowSpan={2}
            textAlign="center"
            border="1px"
            borderColor="gray.300"
            w="160px"
            textTransform="none"
            cursor="pointer"
            onClick={() => handleSort("division")}
            className="sticky-header"
          >
            担当 <br />
            <span style={{ fontSize: "0.8em" }}>
              {renderSortIcons("division")}
            </span>
          </Th>
          <Th
            rowSpan={2}
            textAlign="center"
            border="1px"
            borderColor="gray.300"
            w="100px"
            textTransform="none"
            cursor="pointer"
            onClick={() => handleSort("position")}
            className="sticky-header"
          >
            役職 <br />
            <span style={{ fontSize: "0.8em" }}>
              {renderSortIcons("position")}
            </span>
          </Th>
          {skillOrder.map((skill, index) => {
            const isNewSection = skill.section !== previousSection;
            previousSection = skill.section;
            return isNewSection ? (
              <Th
                key={index}
                colSpan={
                  skillOrder.filter((s) => s.section === skill.section).length
                }
                textAlign="center"
                border="1px"
                borderColor="gray.300"
                textTransform="none"
                padding={3}
                className="sticky-header"
              >
                {skill.section}
              </Th>
            ) : null;
          })}
        </Tr>
        <Tr>
          {skillOrder.map((skill, index) => (
            <Th
              key={index}
              textAlign="center"
              border="1px"
              borderColor="gray.300"
              width={30}
              textTransform="none"
              cursor="pointer"
              padding={1}
              onClick={() => handleSort(skill)}
              className="sticky-header"
            >
              {skill.skill_name} <br />
              <span style={{ fontSize: "0.8em" }}>
                {renderSortIcons(skill)}
              </span>
            </Th>
          ))}
        </Tr>
      </>
    );
  };

  const getSkillLevelColor = (level) => {
    if (level >= 5.0) return "red.400";
    if (level >= 4.0) return "pink.200";
    if (level >= 3.0) return "yellow.200";
    if (level >= 2.5) return "orange.200";
    if (level >= 2.0) return "green.200";
    if (level >= 1.5) return "teal.200";
    if (level >= 1.0) return "blue.200";
    if (level >= 0.5) return "cyan.200";
    return "transparent";
  };

  const renderRows = () => {
    return sortedFilteredUsers.map((user, userIndex) => {
      const isEvenRow = userIndex % 2 === 0;
      return (
        <Tr key={userIndex} bg={isEvenRow ? "gray.200" : "white"}>
          <Td
            border="1px"
            borderColor="gray.300"
            textAlign="center"
            width={80}
            color="blue.500"
            _hover={{ color: "blue.700", textDecoration: "underline" }}
            className="fixed-column fixed-column-1"
          >
            <NextLink href={`/users/${user.employee_code.N}`} passHref>
              <Link>{user.user_name.S}</Link>
            </NextLink>
          </Td>
          <Td
            border="1px"
            borderColor="gray.300"
            textAlign="center"
            width={150}
            className="fixed-column fixed-column-2"
          >
            <Text>{user.department.S}</Text>
          </Td>
          <Td
            border="1px"
            borderColor="gray.300"
            textAlign="center"
            width={150}
            className="fixed-column fixed-column-3"
          >
            <Text>{user.division.S}</Text>
          </Td>
          <Td
            border="1px"
            borderColor="gray.300"
            textAlign="center"
            width={150}
            className="fixed-column fixed-column-4"
          >
            <Text>{user.position.S}</Text>
          </Td>
          {skillOrder.map((skill, skillIndex) => {
            const userSkill = user.skills.L.find(
              (s) =>
                s.M.skill_name.S === skill.skill_name &&
                s.M.section.S === skill.section
            );
            const skillLevel = userSkill ? parseFloat(userSkill.M.level.N) : 0;
            return (
              <Td
                key={skillIndex}
                textAlign="center"
                border="1px"
                borderColor="gray.300"
                width={30}
              >
                {userSkill ? (
                  <Box
                    bg={getSkillLevelColor(skillLevel)}
                    p={2}
                    borderRadius="md"
                    display="inline-block"
                  >
                    {skillLevel === 0 ? "0" : skillLevel.toFixed(1)}
                  </Box>
                ) : (
                  "-"
                )}
              </Td>
            );
          })}
        </Tr>
      );
    });
  };

  return (
    <Container maxW="container.xl">
      <Box className="bg-gray-100 min-h-screen">
        <Header user="Tanaka" />
        <Box p={4}>
          <Flex mb={4} alignItems="center">
            <Select
              placeholder="事業部"
              onChange={handleDepartmentChange}
              mr={2}
              width="300px"
              bgColor="white"
            >
              {departments.map((department, index) => (
                <option key={index} value={department}>
                  {department}
                </option>
              ))}
            </Select>
            <Select
              placeholder="担当"
              onChange={handleDivisionChange}
              mr={2}
              width="300px"
              bgColor="white"
            >
              {divisions.map((division, index) => (
                <option key={index} value={division}>
                  {division}
                </option>
              ))}
            </Select>
            <Select
              placeholder="役職"
              onChange={handlePositionChange}
              width="300px"
              bgColor="white"
            >
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
            overflowX="auto"
            overflowY="auto"
            maxH="70vh"
          >
            <Tooltip
              label={
                <Box p={4} bg="blue.700" color="white">
                  <Text>0: 経験なし</Text>
                  <Text>0.5: 基礎学習した</Text>
                  <Text>1.0: 指導ありで実施できる</Text>
                  <Text>1.5: 指導ありで実施した</Text>
                  <Text>2.0: 一人で実施できる</Text>
                  <Text>2.5: 一人で実施した</Text>
                  <Text>3.0: 指導できる（アソシ）</Text>
                  <Text>4.0: その道のプロ（シニア）</Text>
                  <Text>5.0: 第一人者（エグゼ）</Text>
                </Box>
              }
              aria-label="Skill level legend"
              placement="bottom-start"
              bg="blue.700"
              p={4}
              rounded="md"
              closeOnClick={false}
            >
              <Text
                ml={2}
                mb={4}
                cursor="pointer"
                color="blue.500"
                width="130px"
                _hover={{ color: "blue.700", textDecoration: "underline" }}
              >
                スキルレベル凡例
              </Text>
            </Tooltip>

            <Box width="6000px">
              <Table
                variant="simple"
                size="sm"
                sx={{ tableLayout: "fixed", borderCollapse: "collapse" }}
              >
                <Thead>{renderHeader()}</Thead>
                <Tbody>{renderRows()}</Tbody>
              </Table>
            </Box>
          </Box>
        </Box>
      </Box>
      <style jsx>{`
        .sticky-header {
          position: sticky;
          top: 0;
          background-color: white;
          z-index: 2;
        }
        .fixed-column {
          position: sticky;
          left: 0;
          background-color: white;
          z-index: 1;
        }
        .fixed-column-2 {
          left: 120px; /* Adjust based on the width of the previous fixed column */
        }
        .fixed-column-3 {
          left: 280px; /* Adjust based on the width of the previous fixed columns */
        }
        .fixed-column-4 {
          left: 440px; /* Adjust based on the width of the previous fixed columns */
        }
        thead th {
          position: sticky;
          top: 0;
          background-color: white;
          z-index: 2;
        }
      `}</style>
    </Container>
  );
};

export default SkillsPage;
