import { useTabs } from 'minimal-shared/hooks';

import { Box, Container, Tab, Tabs, Typography } from '@mui/material';

import { IPFS_TABS_DETAILS, MEITY_TAB_CONTENT } from 'src/_mock/_services';

import {
  MeityDetailsAbout,
  MeityDetailsApplication,
  MeityDetailsEligibility,
  MeityDetailsTermsCondition,
  MeityHero,
} from '../meity';

export function MeityPageView() {
  const tabs = useTabs('about');

  const renderTabs = () => (
    <Tabs value={tabs.value} onChange={tabs.onChange} sx={{ mb: { xs: 3, md: 5 } }}>
      {IPFS_TABS_DETAILS.map((tab) => (
        <Tab key={tab.value} iconPosition="end" value={tab.value} label={tab.label} />
      ))}
    </Tabs>
  );

  return (
    <>
      <MeityHero />
      <Container component="section" sx={{ pb: 2, position: 'relative', pt: { xs: 2, md: 5 } }}>
        {renderTabs()}

        {tabs.value === 'about' && <MeityDetailsAbout content={MEITY_TAB_CONTENT?.ABOUT_CONTENT} />}
        {tabs.value === 'eligibility' && (
          <MeityDetailsEligibility content={MEITY_TAB_CONTENT?.ELIGIBILITY_CONTENT} />
        )}
        {tabs.value === 'terms-condition' && (
          <MeityDetailsTermsCondition content={MEITY_TAB_CONTENT?.TERMS_CONDITION_CONTENT} />
        )}
        {tabs.value === 'application' && (
          <MeityDetailsApplication />
        )}
       
      </Container>
    </>
  );
}
