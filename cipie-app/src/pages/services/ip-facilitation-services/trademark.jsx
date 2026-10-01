import { CONFIG } from 'src/global-config';

import TrademarkPageView from 'src/sections/services/ip-facilitation-services/view/trademark-page-view';

// ----------------------------------------------------------------------

const metadata = {
  title: `Domestic Patent Filing & Maintaining | IP Facilitation Services - ${CONFIG.appName}`,
};

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <TrademarkPageView />
    </>
  );
}
