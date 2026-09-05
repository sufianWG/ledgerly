import HeroSlider from "@/components/HeroSlider";
import PlatformStats from "@/components/PlatformStats";
import FeaturedLessons from "@/components/FeaturedLessons";
import WhyItMatters from "@/components/WhyItMatters";
import TopContributors from "@/components/TopContributors";
import MostSavedLessons from "@/components/MostSavedLessons";
import CTABanner from "@/components/CTABanner";

const Home = () => {
  return (
    <div className="bg-dll-background">
      <HeroSlider></HeroSlider>
      <PlatformStats></PlatformStats>
      <FeaturedLessons></FeaturedLessons>
      <WhyItMatters></WhyItMatters>
      <TopContributors></TopContributors>
      <MostSavedLessons></MostSavedLessons>
      <CTABanner></CTABanner>
    </div>
  );
};

export default Home;
