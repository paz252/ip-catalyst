import { CONFIG } from 'src/global-config';

import { StartupPageView } from 'src/sections/services/ipfs-services/view/startup-page-view';

// ----------------------------------------------------------------------

const metadata = { title: `Startup / MSME |IPFS Services - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <StartupPageView />
    </>
  );
}
