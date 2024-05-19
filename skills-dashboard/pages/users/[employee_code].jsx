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
} from "@chakra-ui/react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ViewUser = () => {
  const router = useRouter();
  const { employee_code } = router.query;
  const [user, setUser] = useState(null);
  const [chartData, setChartData] = useState({});

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

  if (!user)
    return (
      <h1 className="text-lg font-bold">
        ユーザー {employee_code} のデータを取得中...
      </h1>
    );

  return (
    <Container maxW="container.xl" p={4}>
      <Header user="Tanaka" />
      <SimpleGrid columns={2} spacing={10}>
        <Box bg="white" p={6} rounded="md" shadow="md">
          <VStack spacing={4} align="start">
            <Heading as="h2" size="lg" mb={6}>
              ユーザー情報
            </Heading>
            <Text>氏名: {user.user_name}</Text>
            <Text>社員コード: {user.employee_code}</Text>
            <Text>メールアドレス: {user.email_address}</Text>
            <Text>事業部: {user.department}</Text>
            <Text>担当: {user.division}</Text>
            <Text>役職: {user.position}</Text>
            <Text>最新更新: {user.updated_date}</Text>
          </VStack>
        </Box>
        <Box bg="white" p={6} rounded="md" shadow="md">
          <VStack spacing={4} align="start">
            <Heading as="h2" size="lg" mb={6}>
              認定資格
            </Heading>
            {user.certifications && user.certifications.length > 0 ? (
              user.certifications.map((cert, index) => (
                <Box key={index} mb={2}>
                  <Text>資格名: {cert.certification_name}</Text>
                  <Text>ベンダー: {cert.vender}</Text>
                  <Text>レベル: {cert.level}</Text>
                  <Text>取得日: {cert.acquired_date}</Text>
                </Box>
              ))
            ) : (
              <Text>認定資格なし</Text>
            )}
          </VStack>
        </Box>
      </SimpleGrid>
      <Box bg="white" p={6} rounded="md" shadow="md" mt={10} width="100%">
        <VStack spacing={10} align="start">
          <Heading as="h2" size="lg" mb={6}>
            保有スキル
          </Heading>
          {Object.keys(chartData).map((section) => (
            <Box key={section} mb={8} width="100%" mx="auto">
              <Heading as="h3" size="md" mb={16} borderBottom="2px solid black">
                {section}
              </Heading>
              <Box width="80%" height="15cm" mx="auto">
                <Bar
                  data={{
                    labels: chartData[section].map((skill) => skill.skill_name),
                    datasets: [
                      {
                        label: "スキルレベル",
                        data: chartData[section].map((skill) => skill.level),
                        backgroundColor: "rgba(75, 192, 192, 0.6)",
                        borderColor: "rgba(75, 192, 192, 1)",
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false,
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
