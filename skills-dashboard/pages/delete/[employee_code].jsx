import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Header from "../../components/Header.jsx";
import { Container, Box, Button, Text } from "@chakra-ui/react";

const DeleteUser = () => {
  const router = useRouter();
  const { id } = router.query;
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(
          `https://yurdpuchaa.execute-api.ap-northeast-1.amazonaws.com/dev3/users/${id}`
        );
        const data = await response.json();
        setUser(data.Item);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    if (id) {
      fetchUser();
    }
  }, [id]);

  const handleDelete = async () => {
    try {
      await fetch(
        `https://yurdpuchaa.execute-api.ap-northeast-1.amazonaws.com/dev3/users/${id}`,
        {
          method: "DELETE",
        }
      );
      router.push("/employeeList");
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <Container maxW="container.md">
      <Header user="Tanaka" />
      <Box bg="white" p={6} rounded="md" shadow="md">
        <Text mb={4}>本当に {user.user_name.S} を削除しますか？</Text>
        <Button colorScheme="red" onClick={handleDelete}>
          削除
        </Button>
      </Box>
    </Container>
  );
};

export default DeleteUser;
