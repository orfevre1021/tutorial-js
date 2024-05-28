import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Header from "../../components/Header";
import {
  Container,
  Box,
  Heading,
  Text,
  VStack,
  Button,
  Flex,
  Spacer,
  Select,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import { FaAws } from "react-icons/fa";
import { SiMicrosoftazure } from "react-icons/si";
import { DiGoogleCloudPlatform } from "react-icons/di";
import { PiCertificateLight } from "react-icons/pi";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  LineController,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Register LineController
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  LineController,
  Title,
  Tooltip,
  Legend
);

const ViewUser = () => {
  const router = useRouter();
  const { employee_code } = router.query;
  const [user, setUser] = useState(null);
  const [chartData, setChartData] = useState({});
  const [averageData, setAverageData] = useState({});
  const [filteredCertifications, setFilteredCertifications] = useState([]);
  const [vendorFilter, setVendorFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [levelSortOrder, setLevelSortOrder] = useState("asc");
  const [vendorSortOrder, setVendorSortOrder] = useState("asc");
  const [nameSortOrder, setNameSortOrder] = useState("asc");
  const toast = useToast();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(
          `https://yurdpuchaa.execute-api.ap-northeast-1.amazonaws.com/dev8/users/${employee_code}`
        );
        const data = await response.json();
        setUser(data);
        setFilteredCertifications(data.certifications || []);
        console.log(data);

        if (data.skills && Array.isArray(data.skills)) {
          const transformedData = data.skills.reduce((acc, skill) => {
            const section = skill.section;
            if (!acc[section]) acc[section] = [];
            acc[section].push({
              skill_name: skill.skill_name,
              level: parseFloat(skill.level),
            });
            return acc;
          }, {});
          setChartData(transformedData);

          // Fetch average skill levels
          const position = data.position;
          const avgResponse = await fetch(
            `https://yurdpuchaa.execute-api.ap-northeast-1.amazonaws.com/dev10/average?position=${position}`
          );
          const avgData = await avgResponse.json();
          const avgTransformedData = avgData.Items[0].skills.L.reduce(
            (acc, skill) => {
              const section = skill.M.section.S;
              if (!acc[section]) acc[section] = [];
              acc[section].push({
                skill_name: skill.M.skill_name.S,
                average_level: parseFloat(skill.M.average_level.N),
              });
              return acc;
            },
            {}
          );
          setAverageData(avgTransformedData);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    if (employee_code) {
      fetchUser();
    }
  }, [employee_code]);

  useEffect(() => {
    if (user) {
      let filtered = [...user.certifications] || [];
      if (vendorFilter) {
        filtered = filtered.filter((cert) => cert.vender === vendorFilter);
      }
      if (levelFilter) {
        filtered = filtered.filter(
          (cert) => parseInt(cert.level) === parseInt(levelFilter)
        );
      }
      setFilteredCertifications(filtered);
    }
  }, [vendorFilter, levelFilter, user]);

  useEffect(() => {
    let sortedCertifications = [...filteredCertifications];
    if (sortOrder) {
      sortedCertifications = sortedCertifications.sort((a, b) =>
        sortOrder === "asc"
          ? new Date(a.acquired_date) - new Date(b.acquired_date)
          : new Date(b.acquired_date) - new Date(a.acquired_date)
      );
    }
    setFilteredCertifications(sortedCertifications);
  }, [sortOrder]);

  useEffect(() => {
    let sortedCertifications = [...filteredCertifications];
    if (levelSortOrder) {
      sortedCertifications = sortedCertifications.sort((a, b) =>
        levelSortOrder === "asc"
          ? a.level.localeCompare(b.level)
          : b.level.localeCompare(a.level)
      );
    }
    setFilteredCertifications(sortedCertifications);
  }, [levelSortOrder]);

  useEffect(() => {
    let sortedCertifications = [...filteredCertifications];
    if (vendorSortOrder) {
      sortedCertifications = sortedCertifications.sort((a, b) =>
        vendorSortOrder === "asc"
          ? a.vender.localeCompare(b.vender)
          : b.vender.localeCompare(a.vender)
      );
    }
    setFilteredCertifications(sortedCertifications);
  }, [vendorSortOrder]);

  useEffect(() => {
    let sortedCertifications = [...filteredCertifications];
    if (nameSortOrder) {
      sortedCertifications = sortedCertifications.sort((a, b) =>
        nameSortOrder === "asc"
          ? a.certification_name.localeCompare(b.certification_name)
          : b.certification_name.localeCompare(a.certification_name)
      );
    }
    setFilteredCertifications(sortedCertifications);
  }, [nameSortOrder]);

  const skillLevels = [
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

  const handleEditUser = () => {
    router.push(`/edit/user/${employee_code}`);
  };

  const handleEditCertifications = () => {
    router.push(`/edit/certifications/${employee_code}`);
  };

  const handleEditSkills = () => {
    router.push(`/edit/skills/${employee_code}`);
  };

  const handleDeleteUser = async () => {
    if (!user) return;
    const confirmDelete = confirm(
      `本当にユーザー「${user.user_name}」を削除しますか？`
    );

    if (confirmDelete) {
      try {
        const response = await fetch(
          "https://yurdpuchaa.execute-api.ap-northeast-1.amazonaws.com/dev9/delete",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              employee_code: employee_code,
            }),
          }
        );

        if (response.ok) {
          router.push({
            pathname: "/users",
            query: { deleteSuccess: true, userName: user.user_name },
          });
        } else {
          toast({
            title: "ユーザーの削除に失敗しました。",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
          console.error("Failed to delete user");
        }
      } catch (error) {
        toast({
          title: "ユーザーの削除中にエラーが発生しました。",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        console.error("Failed to delete user:", error);
      }
    }
  };

  const renderVendorIcon = (vendor) => {
    const iconStyle = {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "40px", // 固定幅
      height: "40px", // 固定高さ
      padding: "0", // パディングをリセット
      borderRadius: "8px",
      textAlign: "center",
      margin: "0 auto", // Center in the column
    };

    switch (vendor) {
      case "AWS":
        return (
          <div
            style={{ ...iconStyle, backgroundColor: "rgba(255, 153, 51, 0.2)" }}
          >
            <FaAws style={{ color: "rgba(255, 153, 51, 1)" }} />
          </div>
        );
      case "Azure":
        return (
          <div
            style={{ ...iconStyle, backgroundColor: "rgba(51, 153, 255, 0.2)" }}
          >
            <SiMicrosoftazure style={{ color: "rgba(51, 153, 255, 1)" }} />
          </div>
        );
      case "GCP":
        return (
          <div
            style={{ ...iconStyle, backgroundColor: "rgba(255, 82, 82, 0.2)" }}
          >
            <DiGoogleCloudPlatform style={{ color: "rgba(255, 82, 82, 1)" }} />
          </div>
        );
      default:
        return (
          <div
            style={{
              ...iconStyle,
              backgroundColor: "rgba(128, 128, 128, 0.2)",
            }}
          >
            <PiCertificateLight style={{ color: "rgba(128, 128, 128, 1)" }} />
          </div>
        );
    }
  };

  const handleSortOrderChange = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleLevelSortOrderChange = () => {
    setLevelSortOrder(levelSortOrder === "asc" ? "desc" : "asc");
  };

  const handleVendorSortOrderChange = () => {
    setVendorSortOrder(vendorSortOrder === "asc" ? "desc" : "asc");
  };

  const handleNameSortOrderChange = () => {
    setNameSortOrder(nameSortOrder === "asc" ? "desc" : "asc");
  };

  if (!user)
    return (
      <h1 className="text-lg font-bold">
        ユーザー {employee_code} のデータを取得中...
      </h1>
    );

  return (
    <Container maxW="container.xl" paddingLeft={4}>
      <Flex mb={4} alignItems="center">
        <Header user="Tanaka" />
        <Spacer />
      </Flex>
      <Tabs variant="soft-rounded" colorScheme="blue">
        <Flex justifyContent="space-between" alignItems="center">
          <TabList>
            <Tab>ユーザー情報</Tab>
            <Tab>保有スキル</Tab>
            <Tab>認定資格</Tab>
          </TabList>
          <Button colorScheme="red" onClick={handleDeleteUser} mr={10}>
            削除
          </Button>
        </Flex>
        <TabPanels>
          <TabPanel>
            <Box bg="white" p={6} rounded="md" shadow="md">
              <Flex justify="space-between" align="center" mb={4}>
                <Heading as="h2" size="lg">
                  ユーザー情報
                </Heading>
                <Button colorScheme="blue" onClick={handleEditUser}>
                  編集
                </Button>
              </Flex>
              <VStack spacing={4} align="start" mt={6}>
                <Text mb={4}>氏名コード: {user.employee_code}</Text>
                <Text mb={4}>氏名: {user.user_name}</Text>
                <Text mb={4}>メールアドレス: {user.email_address}</Text>
                <Text mb={4}>事業部: {user.department}</Text>
                <Text mb={4}>担当: {user.division}</Text>
                <Text mb={4}>役職: {user.position}</Text>
                <Text mb={4}>最新更新: {user.updated_date}</Text>
              </VStack>
            </Box>
          </TabPanel>

          <TabPanel>
            <Box bg="white" p={6} rounded="md" shadow="md">
              <Flex justify="space-between" align="center" mb={4}>
                <Heading as="h2" size="lg">
                  保有スキル
                </Heading>
                <Button colorScheme="blue" onClick={handleEditSkills}>
                  編集
                </Button>
              </Flex>
              <VStack spacing={10} align="start" mt={6}>
                {Object.keys(chartData).map((section) => (
                  <Box key={section} mb={8} width="100%" mx="auto">
                    <Heading
                      as="h3"
                      size="md"
                      mb={14}
                      borderBottom="2px solid black"
                    >
                      {section}
                    </Heading>
                    <Box width="80%" height="15cm" mx="auto">
                      <Bar
                        data={{
                          labels: chartData[section].map(
                            (skill) => skill.skill_name
                          ),
                          datasets: [
                            {
                              type: "bar",
                              label: "自分のスキルレベル",
                              data: chartData[section].map(
                                (skill) => skill.level
                              ),
                              backgroundColor: "rgba(255, 99, 132, 0.6)",
                              borderColor: "rgba(255, 99, 132, 1)",
                              borderWidth: 1,
                              barThickness: 60, // Set bar thickness here
                              categoryPercentage: 0.8, // Set category percentage here
                              barPercentage: 0.8, // Set bar percentage here
                            },
                            {
                              type: "line",
                              label: "同じ役職の平均スキルレベル",
                              data:
                                averageData[section]?.map(
                                  (skill) => skill.average_level
                                ) || [],
                              backgroundColor: "rgba(54, 162, 235, 1)",
                              borderColor: "rgba(54, 162, 235, 1)",
                              borderWidth: 2,
                              fill: false,
                            },
                          ],
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              display: true,
                            },
                            title: {
                              display: false,
                            },
                          },
                          scales: {
                            y: {
                              beginAtZero: true,
                              max: 5,
                              ticks: {
                                stepSize: 0.5,
                                callback: function (value) {
                                  switch (value) {
                                    case 0:
                                      return "0.0: 経験なし";
                                    case 0.5:
                                      return "0.5 基礎学習した";
                                    case 1.0:
                                      return "1.0: 指導ありで実施できる";
                                    case 1.5:
                                      return "1.5: 指導ありで実施した";
                                    case 2.0:
                                      return "2.0: 一人で実施できる";
                                    case 2.5:
                                      return "2.5: 一人で実施した";
                                    case 3.0:
                                      return "3.0: 指導できる（アソシ）";
                                    case 4.0:
                                      return "4.0: その道のプロ（シニア）";
                                    case 5.0:
                                      return "5.0: 第一人者（エグゼ）";
                                    default:
                                      return "";
                                  }
                                },
                              },
                            },
                          },
                        }}
                      />
                    </Box>
                  </Box>
                ))}
              </VStack>
            </Box>
          </TabPanel>

          <TabPanel>
            <Box bg="white" p={6} rounded="md" shadow="md">
              <Flex justify="space-between" align="center" mb={4}>
                <Heading as="h2" size="lg">
                  認定資格
                </Heading>
                <Button colorScheme="blue" onClick={handleEditCertifications}>
                  編集
                </Button>
              </Flex>
              <Box mb={6}>
                <Text mb={6}>ベンダーでフィルター:</Text>
                <Select onChange={(e) => setVendorFilter(e.target.value)}>
                  <option value="">全て</option>
                  <option value="AWS">AWS</option>
                  <option value="Azure">Azure</option>
                  <option value="GCP">GCP</option>
                  <option value="Another">Another</option>
                </Select>
              </Box>
              <Box mb={4}>
                <Text mb={2}>資格レベルでフィルター:</Text>
                <Select onChange={(e) => setLevelFilter(e.target.value)}>
                  <option value="">全て</option>
                  <option value="1">初級</option>
                  <option value="2">中級</option>
                  <option value="3">上級</option>
                </Select>
              </Box>
              {filteredCertifications.length > 0 ? (
                <Table variant="simple" mb={6} mt={10} size="sm">
                  <Thead>
                    <Tr>
                      <Th
                        width="13%"
                        textAlign="center"
                        borderRight="1px solid lightgray"
                        onClick={handleVendorSortOrderChange}
                        cursor="pointer"
                      >
                        ベンダー {vendorSortOrder === "asc" ? "▲" : "▼"}
                      </Th>
                      <Th
                        width="55%"
                        borderRight="1px solid lightgray"
                        textAlign="center"
                        onClick={handleNameSortOrderChange}
                        cursor="pointer"
                      >
                        資格名 {nameSortOrder === "asc" ? "▲" : "▼"}
                      </Th>
                      <Th
                        width="13%"
                        borderRight="1px solid lightgray"
                        textAlign="center"
                        onClick={handleLevelSortOrderChange}
                        cursor="pointer"
                      >
                        レベル {levelSortOrder === "asc" ? "▲" : "▼"}
                      </Th>
                      <Th
                        width="20%"
                        textAlign="center"
                        onClick={handleSortOrderChange}
                        cursor="pointer"
                      >
                        取得日 {sortOrder === "asc" ? "▲" : "▼"}
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {filteredCertifications.map((cert, index) => (
                      <Tr key={index} borderBottom="1px solid lightgray">
                        <Td
                          textAlign="center"
                          borderRight="1px solid lightgray"
                          width="40px"
                        >
                          {renderVendorIcon(cert.vender)}
                        </Td>
                        <Td
                          textAlign="center"
                          borderRight="1px solid lightgray"
                        >
                          {cert.certification_name}
                        </Td>
                        <Td
                          textAlign="center"
                          borderRight="1px solid lightgray"
                        >
                          {cert.level === "1"
                            ? "初級"
                            : cert.level === "2"
                            ? "中級"
                            : "上級"}
                        </Td>
                        <Td textAlign="center">{cert.acquired_date}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              ) : (
                <Box mt={6} mb={6} borderRadius="md">
                  <Text>該当資格なし</Text>
                </Box>
              )}
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export default ViewUser;
