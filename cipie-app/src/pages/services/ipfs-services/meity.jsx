import { CONFIG } from 'src/global-config';

import { MeityPageView } from 'src/sections/services/ipfs-services/view/meity-page-view';

// ----------------------------------------------------------------------

const metadata = {
  title: `Meity Societies / R&D / Autonomous bodies | IPFS Services - ${CONFIG.appName}`,
};

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <MeityPageView />
    </>
  );
}
