import { CONFIG } from 'src/global-config';

import { DomesticPageView } from 'src/sections/services/ip-facilitation-services/view/domestic-page-view';

// ----------------------------------------------------------------------

const metadata = {
  title: `Domestic Patent IP Filing Support | IP Facilitation Services - ${CONFIG.appName}`,
};

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <DomesticPageView />
    </>
  );
}
