import { useTabs } from 'minimal-shared/hooks';

import { Box, Container, Tab, Tabs, Typography } from '@mui/material';

import { IP_FACILITATION_TABS_DETAILS, IP_FACILITATION_TAB_CONTENT } from 'src/_mock/_services';

import { ImageHero } from '../ImageHero/Image-hero';
import { DomesticDetailsInfo } from '../domestic/domestic-ip-filing-support-info';
import { DomesticDetailsAbout } from '../domestic/domestic-ip-filing-support-about';
import { DomesticDetailsApplication } from '../domestic/domestic-ip-filing-support-application';

export function DomesticPageView() {
  const tabs = useTabs('about');

  const renderTabs = () => (
    <Tabs value={tabs.value} onChange={tabs.onChange} sx={{ mb: { xs: 3, md: 5 } }}>
      {IP_FACILITATION_TABS_DETAILS.map((tab) => (
        <Tab key={tab.value} iconPosition="end" value={tab.value} label={tab.label} />
      ))}
    </Tabs>
  );
  return (
    <>
      <ImageHero />
      {/* <DomesticIpFilingSupport /> */}
      <Container component="section" sx={{ pb: 2, position: 'relative', pt: { xs: 2, md: 5 } }}>
        {renderTabs()}

        {tabs.value === 'about' && (
          <DomesticDetailsAbout content={IP_FACILITATION_TAB_CONTENT?.ABOUT_CONTENT} />
        )}
        {tabs.value === 'eligibility' && (
          <DomesticDetailsInfo content={IP_FACILITATION_TAB_CONTENT?.ELIGIBILITY_CONTENT} />
        )}
        {tabs.value === 'application' && (
          <DomesticDetailsApplication
            content={IP_FACILITATION_TAB_CONTENT?.TERMS_CONDITION_CONTENT}
          />
        )}
      </Container>
    </>
  );
}
