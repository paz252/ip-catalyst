import Stack from '@mui/material/Stack';
import { Divider } from '@mui/material';

import { BackToTopButton } from 'src/components/animate/back-to-top-button';
import { ScrollProgress, useScrollProgress } from 'src/components/animate/scroll-progress';

import { HomeHeroSlider } from '../home-hero-slider';
import { HomeCountSection } from '../home-count-sections';
import { IPOverviewSection } from '../home-ip-overview-section';
import { BrowseTechnologyCarousel } from '../home-browse-technology-carousel';

// import { ProgramsSection } from '../home-schema-section';
// import { HomeInsightsSection } from '../home-insights-section';

// import { IPCatalystImpact } from '../home-catalyst-impact-section';
// import { WhoCanApply } from '../home-who-can-apply-section';

// import { HomeMinimal } from '../home-minimal';
// import { PatentStatsMinimal } from '../home-custom-testimonials';
// import { BrowseByTechnology } from '../home-browse-by-technology';
// import { HomeHero } from '../home-hero';
// import { HomeFAQs } from '../home-faqs';
// import { HomeZoneUI } from '../home-zone-ui';
// import { HomeMinimalRev } from '../home-minimal-rev';
// import { HomePricing } from '../home-pricing';
// import { HomeForDesigner } from '../home-for-designer';
// import { HomeTestimonials } from '../home-testimonials';
// import { HomeIntegrations } from '../home-integrations';
// import { HomeAdvertisement } from '../home-advertisement';
// import { HomeHugePackElements } from '../home-hugepack-elements';
// import { HomeStrategicEngagements } from '../home-strategic-engagements';
// import { HomeStrategicEngagementsCopy } from '../home-strategic-engagements-copy';
// import { HomeHighlightFeatures } from '../home-highlight-features';

// ----------------------------------------------------------------------

export function HomeView() {
  const pageProgress = useScrollProgress();

  return (
    <>
      <ScrollProgress
        variant="linear"
        progress={pageProgress.scrollYProgress}
        sx={[(theme) => ({ position: 'fixed', zIndex: theme.zIndex.appBar + 1 })]}
      />

      <BackToTopButton />

      <HomeHeroSlider />

      <Stack sx={{ position: 'relative', bgcolor: 'background.default' }}>
        <HomeCountSection />

        <IPOverviewSection />
        <Divider />

        <BrowseTechnologyCarousel />
        <Divider />

        {/* 
        <IPCatalystImpact />
        <Divider />

        <ProgramsSection />
        <Divider />

        <WhoCanApply />
        <Divider />

        <HomeInsightsSection />
        <Divider /> */}

        {/* <HomeInsightsSection1 /> */}
        {/* <BrowseByTechnology /> */}

        {/* <PatentStatsMinimal /> */}

        {/* <HomeMinimal /> */}

        {/* <HomeHero /> */}

        {/* <HomeTestimonials /> */}

        {/* <HomeMinimalRev /> */}

        {/* <HomeHugePackElements /> */}

        {/* <HomeForDesigner /> */}

        {/* <HomeHighlightFeatures /> */}

        {/* <HomeIntegrations /> */}
        {/* <HomeStrategicEngagementsCopy /> */}

        {/* <HomePricing /> */}

        {/* <HomeStrategicEngagements /> */}

        {/* <HomeFAQs /> */}

        {/* <HomeZoneUI /> */}

        {/* <HomeAdvertisement /> */}
      </Stack>
    </>
  );
}
