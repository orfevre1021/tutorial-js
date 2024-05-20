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
  useToast,
} from "@chakra-ui/react";

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

// LineControllerを登録
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
  const toast = useToast();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(
          `https://yurdpuchaa.execute-api.ap-northeast-1.amazonaws.com/dev8/users/${employee_code}`
        );
        const data = await response.json();
        setUser(data);
        console.log(data);

        if (data.skills && Array.isArray(data.skills)) {
          const transformedData = data.skills.reduce((acc, skill) => {
            const section = skill.section;
            if (!acc[section]) acc[section] = [];
            acc[section].push({
              skill_name: skill.skill_name,
              level: parseInt(skill.level),
            });
            return acc;
          }, {});
          setChartData(transformedData);

          // 平均スキルレベルを取得
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
                average_level: parseInt(skill.M.average_level.N),
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
      <SimpleGrid columns={2} spacing={10}>
        <Box bg="white" p={6} rounded="md" shadow="md">
          <Flex justify="space-between" align="center">
            <Heading as="h2" size="lg">
              ユーザー情報
            </Heading>
            <Button colorScheme="blue" onClick={handleEditUser}>
              編集
            </Button>
          </Flex>
          <VStack spacing={4} align="start" mt={6}>
            <Text>氏名: {user.user_name}</Text>
            <Text>氏名コード: {user.employee_code}</Text>
            <Text>メールアドレス: {user.email_address}</Text>
            <Text>事業部: {user.department}</Text>
            <Text>担当: {user.division}</Text>
            <Text>役職: {user.position}</Text>
            <Text>最新更新: {user.updated_date}</Text>
          </VStack>
        </Box>
        <Box bg="white" p={6} rounded="md" shadow="md">
          <Flex justify="space-between" align="center">
            <Heading as="h2" size="lg">
              認定資格
            </Heading>
            <Button colorScheme="blue" onClick={handleEditCertifications}>
              編集
            </Button>
          </Flex>
          <VStack spacing={4} align="start" mt={6}>
            {user.certifications && user.certifications.length > 0 ? (
              user.certifications.map((cert, index) => (
                <Box key={index} mb={4}>
                  <Text mb={3.5}>資格名: {cert.certification_name}</Text>
                  <Text mb={3.5}>ベンダー: {cert.vender}</Text>
                  <Text mb={3.5}>レベル: {cert.level}</Text>
                  <Text mb={3.5}>取得日: {cert.acquired_date}</Text>
                </Box>
              ))
            ) : (
              <Text>認定資格なし</Text>
            )}
          </VStack>
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
                        barThickness: 60, // ここでバーの太さを指定
                        categoryPercentage: 0.8, // カテゴリー全体の幅の割合を指定
                        barPercentage: 0.8, // 各バーの幅の割合を指定
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
                        max: 8,
                        ticks: {
                          stepSize: 1,
                          callback: function (value) {
                            return skillLevels[value];
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
