import { CONFIG } from 'src/global-config';

import { IPHostingInfoView } from 'src/sections/patentHosting/view';

// ----------------------------------------------------------------------

const metadata = { title: `Intellectual Property Hosting | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <IPHostingInfoView />
    </>
  );
}
