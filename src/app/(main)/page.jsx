import HeroSlider from "@/components/HeroSlider";
import PlatformStats from "@/components/PlatformStats";
import FeaturedLessons from "@/components/FeaturedLessons";
import WhyItMatters from "@/components/WhyItMatters";
import TopContributors from "@/components/TopContributors";

const Home = () => {
  return (
    <div className="bg-dll-background">
      <HeroSlider></HeroSlider>
      <PlatformStats></PlatformStats>
      <FeaturedLessons></FeaturedLessons>
      <WhyItMatters></WhyItMatters>
      <TopContributors></TopContributors>
    </div>
  );
};

export default Home;
