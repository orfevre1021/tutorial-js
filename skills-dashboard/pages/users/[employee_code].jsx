import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Header from "../../components/Header";
import {
  Container,
  Box,
  Heading,
  Text,
  VStack,
  SimpleGrid,
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
  const toast = useToast();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(
          `https://yurdpuchaa.execute-api.ap-northeast-1.amazonaws.com/dev8/users/${employee_code}`
        );
        const data = await response.json();
        setUser(data);
        setFilteredCertifications([]);
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
      let filtered = user.certifications || [];
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
    switch (vendor) {
      case "AWS":
        return <FaAws />;
      case "Azure":
        return <SiMicrosoftazure />;
      case "GCP":
        return <DiGoogleCloudPlatform />;
      default:
        return <PiCertificateLight />;
    }
  };

  if (!user)
    return (
      <h1 className="text-lg font-bold">
        ユーザー {employee_code} のデータを取得中...
      </h1>
    );

  return (
    <Container maxW="container.xl" p={4}>
      <Flex mb={4}>
        <Header user="Tanaka" />
        <Spacer />
        <Button colorScheme="red" onClick={handleDeleteUser} width="100px">
          削除
        </Button>
      </Flex>
      <SimpleGrid columns={5} spacing={10}>
        <Box gridColumn="span 2" bg="white" p={6} rounded="md" shadow="md">
          <Flex justify="space-between" align="center">
            <Heading as="h2" size="lg">
              ユーザー情報
            </Heading>
            <Button colorScheme="blue" onClick={handleEditUser}>
              編集
            </Button>
          </Flex>
          <VStack spacing={4} align="start" mt={6}>
            <Text>氏名コード: {user.employee_code}</Text>
            <Text>氏名: {user.user_name}</Text>
            <Text>メールアドレス: {user.email_address}</Text>
            <Text>事業部: {user.department}</Text>
            <Text>担当: {user.division}</Text>
            <Text>役職: {user.position}</Text>
            <Text>最新更新: {user.updated_date}</Text>
          </VStack>
        </Box>
        <Box gridColumn="span 3" bg="white" p={6} rounded="md" shadow="md">
          <Flex justify="space-between" align="center">
            <Heading as="h2" size="lg">
              認定資格
            </Heading>
            <Button colorScheme="blue" onClick={handleEditCertifications}>
              編集
            </Button>
          </Flex>
          <Box mb={6}>
            <Text mb={2}>ベンダーでフィルター:</Text>
            <Select onChange={(e) => setVendorFilter(e.target.value)}>
              <option value="">全て</option>
              <option value="AWS">AWS</option>
              <option value="Azure">Azure</option>
              <option value="GCP">GCP</option>
              <option value="Other">Other</option>
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
          <Table variant="simple" mb={6}>
            <Thead>
              <Tr>
                <Th>ベンダー</Th>
                <Th>資格名</Th>
                <Th>取得日</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredCertifications.length > 0 ? (
                filteredCertifications.map((cert, index) => (
                  <Tr key={index}>
                    <Td>{renderVendorIcon(cert.vender)}</Td>
                    <Td>{cert.certification_name}</Td>
                    <Td>{cert.acquired_date}</Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan="3">認定資格なし</Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </Box>
      </SimpleGrid>
      <Box bg="white" p={6} rounded="md" shadow="md" mt={10} width="100%">
        <Flex justify="space-between" align="center">
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
              <Heading as="h3" size="md" mb={14} borderBottom="2px solid black">
                {section}
              </Heading>
              <Box width="80%" height="15cm" mx="auto">
                <Bar
                  data={{
                    labels: chartData[section].map((skill) => skill.skill_name),
                    datasets: [
                      {
                        type: "bar",
                        label: "自分のスキルレベル",
                        data: chartData[section].map((skill) => skill.level),
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
    </Container>
  );
};

export default ViewUser;
