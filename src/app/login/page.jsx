import Login from "@/components/Login";

export const metadata = {
    title: "Log In — Digital Life Lessons",
};

const LoginPage = async ({ searchParams }) => {
    const { redirect } = await searchParams;
    const redirectTo = redirect || "/";

    return <Login redirectTo={redirectTo}></Login>;
};

export default LoginPage;
