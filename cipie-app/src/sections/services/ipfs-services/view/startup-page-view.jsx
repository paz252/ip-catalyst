import { useTabs } from 'minimal-shared/hooks';

import { Container, Tab, Tabs, Typography } from '@mui/material';

import {
  IPFS_TABS_DETAILS,
  STARTUP_IPFS_TABS_DETAILS,
  STARTUP_TAB_CONTENT,
  STARTUP_TERMS_CONDITION_OPTIONS,
} from 'src/_mock/_services';

import {
  StartupHero,
  StartupDetailsAbout,
  StartupDetailsEligibility,
  StartupDetailsTermsCondition,
  StartupDetailsApplication,
} from '../startup';

export function StartupPageView() {
  const tabs = useTabs('about');

  const renderTabs = () => (
    <Tabs value={tabs.value} onChange={tabs.onChange} sx={{ mb: { xs: 3, md: 5 } }}>
      {STARTUP_IPFS_TABS_DETAILS.map((tab) => (
        <Tab key={tab.value} iconPosition="end" value={tab.value} label={tab.label} />
      ))}
    </Tabs>
  );

  return (
    <>
      <StartupHero />
      <Container component="section" sx={{ pb: 2, position: 'relative', pt: { xs: 2, md: 5 } }}>
        {renderTabs()}

        {tabs.value === 'about' && (
          <StartupDetailsAbout content={STARTUP_TAB_CONTENT?.ABOUT_CONTENT} />
        )}
        {tabs.value === 'eligibility' && (
          <StartupDetailsEligibility content={STARTUP_TAB_CONTENT?.ELIGIBILITY_CONTENT} />
        )}
        {tabs.value === 'terms-condition' && (
          <StartupDetailsTermsCondition
            content={STARTUP_TAB_CONTENT?.TERMS_CONDITION_CONTENT}
          // options={STARTUP_TERMS_CONDITION_OPTIONS}
          />
        )}
        {tabs.value === 'application' && (
          <StartupDetailsApplication />
        )}
        {/* {tabs.value === 'application' && (
          <StartupDetailsApplication content={STARTUP_TAB_CONTENT?.APPLICATION_CONTENT} />
        )} */}

        {/* <Box
          sx={{
            gap: 10,
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' },
          }}
        >
          hello
        </Box> */}
      </Container>
    </>
  );
}
