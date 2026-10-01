import { HomeHeroCarousel } from '../new-view/home-hero-carousel';
import { HomeCountStatsSection } from '../new-view/home-count-stats-section';
import { HomeNewsEventsSection } from '../new-view/home-news-events-section';
import { HomeIPPortfolioSection } from '../new-view/home-ip-portfolio-section';
import { HomeWhoCanApplySection } from '../new-view/home-who-can-apply-section';
import { HomeServicesProgramSection } from '../new-view/home-services-program-section';
import { HomeBrowsePatentsTechnologySection } from '../new-view/home-browse-patents-technology-section';
import { HomeSuccessStoriesSectionHorizontal } from '../new-view/home-success-stories-section-horizontal';


export function HomePage() {
  return (
    <>
      <HomeHeroCarousel />
      <HomeIPPortfolioSection />
      <HomeBrowsePatentsTechnologySection />
      <HomeServicesProgramSection />
      <HomeCountStatsSection />
      <HomeSuccessStoriesSectionHorizontal />
      <HomeWhoCanApplySection />
      <HomeNewsEventsSection />
    </>
  );
}
