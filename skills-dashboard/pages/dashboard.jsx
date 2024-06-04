// pages/dashboard.jsx

import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Heading,
  VStack,
  Flex,
  Spacer,
  Text,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
} from "@chakra-ui/react";
import { FaAws } from "react-icons/fa";
import { SiMicrosoftazure } from "react-icons/si";
import { DiGoogleCloudPlatform } from "react-icons/di";
import { PiCertificateLight } from "react-icons/pi";
import Header from "../components/Header";
import { Bar } from "react-chartjs-2";
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

const Dashboard = () => {
  const [latestUpdates, setLatestUpdates] = useState([]);
  const [user, setUser] = useState(null);
  const [chartData, setChartData] = useState({});
  const [averageData, setAverageData] = useState({});
  const [filteredCertifications, setFilteredCertifications] = useState([]);
  const [vendorFilter, setVendorFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const toast = useToast();

  useEffect(() => {
    // Fetch the latest updates
    const fetchLatestUpdates = async () => {
      try {
        const response = await fetch("/api/latest-updates");
        const data = await response.json();
        setLatestUpdates(data);
      } catch (error) {
        console.error("Failed to fetch latest updates:", error);
      }
    };

    fetchLatestUpdates();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/user"); // Adjust the endpoint as needed
        const data = await response.json();
        setUser(data);
        setFilteredCertifications(data.certifications || []);

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

          const position = data.position;
          const avgResponse = await fetch(
            `/api/average-skills?position=${position}`
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

    fetchUser();
  }, []);

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

  const getLevelColor = (level) => {
    switch (level) {
      case "1":
        return "rgba(144, 238, 144, 0.6)"; // Light green for 初級
      case "2":
        return "rgba(255, 255, 153, 0.6)"; // Light yellow for 中級
      case "3":
        return "rgba(255, 182, 193, 0.6)"; // Light pink for 上級
      default:
        return "transparent";
    }
  };

  const renderVendorIcon = (vendor) => {
    const iconStyle = {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "40px",
      height: "40px",
      padding: "0",
      borderRadius: "8px",
      textAlign: "center",
      margin: "0 auto",
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

  return (
    <Container maxW="container.xl" padding={4}>
      <Header user="Tanaka" />
      <Flex mt={4}>
        <Box flex="1" mr={4}>
          <VStack spacing={4} align="stretch">
            <Box bg="white" p={6} rounded="md" shadow="md">
              <Heading as="h2" size="lg" mb={4}>
                スキルコンテナー
              </Heading>
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
                              barThickness: 60,
                              categoryPercentage: 0.8,
                              barPercentage: 0.8,
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

            <Box bg="white" p={6} rounded="md" shadow="md">
              <Heading as="h2" size="lg" mb={4}>
                資格コンテナー
              </Heading>
              <Box mb={6}>
                <Text mt={6} mb={2}>
                  ベンダーでフィルター:
                </Text>
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
                      >
                        ベンダー
                      </Th>
                      <Th
                        width="55%"
                        borderRight="1px solid lightgray"
                        textAlign="center"
                      >
                        資格名
                      </Th>
                      <Th
                        width="13%"
                        borderRight="1px solid lightgray"
                        textAlign="center"
                      >
                        レベル
                      </Th>
                      <Th width="20%" textAlign="center">
                        取得日
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
                          <span
                            style={{
                              backgroundColor: getLevelColor(cert.level),
                              padding: "10px 16px",
                              borderRadius: "4px",
                              display: "inline-block",
                            }}
                          >
                            {cert.level === "1"
                              ? "初級"
                              : cert.level === "2"
                              ? "中級"
                              : "上級"}
                          </span>
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
          </VStack>
        </Box>

        <Box width="30%" bg="white" p={6} rounded="md" shadow="md">
          <Heading as="h2" size="lg" mb={4}>
            最新更新
          </Heading>
          {latestUpdates.length > 0 ? (
            latestUpdates.map((update, index) => (
              <Box key={index} mb={4}>
                <Text>{update.date}</Text>
                <Text>{update.message}</Text>
              </Box>
            ))
          ) : (
            <Text>最新の更新情報はありません。</Text>
          )}
        </Box>
      </Flex>
    </Container>
  );
};

export default Dashboard;
