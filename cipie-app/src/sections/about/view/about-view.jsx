import { AboutHero } from '../about-hero';
import { AboutWhat } from '../about-what';
import { AboutServe } from '../about-serve';
import { AboutVision } from '../about-vision';
import { AboutMission } from '../about-mission';
import { AboutServices } from '../about-services';
import { AboutEvolution } from '../about-evolution';
import { AboutInnovation } from '../about-innovation';
// import { AboutTeam } from '../about-team';
// import AboutVisionNew from '../about-vision';
// import { AboutTestimonials } from '../about-testimonials';

// ----------------------------------------------------------------------

export function AboutView() {
  return (
    <>
      <AboutHero />

      <AboutWhat />

      <AboutEvolution />

      <AboutVision />

      <AboutMission />

      <AboutServices />

      <AboutServe />

      <AboutInnovation />

      {/* <AboutVisionNew /> */}

      {/* <AboutTeam /> */}

      {/* <AboutTestimonials /> */}
    </>
  );
}
