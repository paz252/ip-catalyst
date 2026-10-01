import { CONFIG } from 'src/global-config';

import CopyrightPageView from 'src/sections/services/ip-facilitation-services/view/copyright-page-view';

// ----------------------------------------------------------------------

const metadata = {
  title: `Domestic Patent Filing & Maintaining | IP Facilitation Services - ${CONFIG.appName}`,
};

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <CopyrightPageView />
    </>
  );
}
