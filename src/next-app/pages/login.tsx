import type { NextPage } from "next";
import FormField from "../components/FormField";

const LoginPage: NextPage = () => {
  return (
    <FormField name="Username" placeholder="Enter your username" width="80%" />
  );
};

export default LoginPage;
