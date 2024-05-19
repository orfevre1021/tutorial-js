import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Header from "../../components/Header.jsx";
import EmployeeForm from "../register.jsx";
import { Container } from "@chakra-ui/react";

const EditUser = () => {
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

  if (!user) return <p>Loading...</p>;

  return (
    <Container maxW="container.md">
      <Header user="Tanaka" />
      <EmployeeForm user={user} isEdit={true} />
    </Container>
  );
};

export default EditUser;
