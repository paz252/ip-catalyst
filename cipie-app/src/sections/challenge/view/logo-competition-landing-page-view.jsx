import { HeroSection } from '../landing/hero';
import { TermsSection } from '../landing/terms-section';
import { EligibilitySection } from '../landing/eligibility-section';
import { HowToParticipateSection } from '../landing/how-to-participate';
import { WhyParticipateSection } from '../landing/why-participate-section';

export function LogoCompetitionView() {
  return (
    <>
      {/* Hero Section */}
      <HeroSection />

      {/* Prize Section */}
      <WhyParticipateSection />

      {/* Eligibility Section */}
      <EligibilitySection />

      {/* How to participate */}
      <HowToParticipateSection />

      {/* Terms Section */}
      <TermsSection />
    </>
  );
}
