import React from "react";
import {
  Container,
  Box,
  Heading,
  Text,
  VStack,
  Flex,
  Spacer,
} from "@chakra-ui/react";
import Header from "../components/Header";

const Notifications = () => {
  // テストデータ
  const notifications = [
    { date: "2024-05-30", message: "ユーザー登録が成功しました。" },
    { date: "2024-05-29", message: "ユーザー情報が更新されました。" },
    { date: "2024-05-28", message: "新しいスキルが追加されました。" },
    { date: "2024-05-27", message: "資格が更新されました。" },
    { date: "2024-05-26", message: "システムメンテナンスが完了しました。" },
  ];

  return (
    <Container maxW="container.xl" padding={4}>
      <Header user="Tanaka" />
      <Flex mb={4} alignItems="center">
        <Heading as="h2" size="lg">
          お知らせ
        </Heading>
        <Spacer />
      </Flex>
      <Box bg="white" p={6} rounded="md" shadow="md">
        <VStack spacing={4} align="start">
          {notifications.map((notification, index) => (
            <Box key={index} mb={4}>
              <Text fontWeight="bold">{notification.date}</Text>
              <Text>{notification.message}</Text>
            </Box>
          ))}
        </VStack>
      </Box>
    </Container>
  );
};

export default Notifications;
