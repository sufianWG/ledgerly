import NavBar from "@/components/shared/NavBar";
import Footer from "@/components/shared/Footer";

export default function MainLayout({ children }) {
  return (
    <>
      <NavBar ></NavBar>
      <main className="flex-1">{children}</main>
      <Footer ></Footer>
    </>
  );
}
