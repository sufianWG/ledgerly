import Register from "@/components/Register";

export const metadata = {
    title: "Register — Digital Life Lessons",
};

const RegisterPage = async ({ searchParams }) => {
    const { redirect } = await searchParams;
    const redirectTo = redirect || "/";

    return <Register redirectTo={redirectTo}></Register>;
};

export default RegisterPage;
