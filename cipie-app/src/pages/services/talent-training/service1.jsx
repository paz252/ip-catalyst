import { CONFIG } from 'src/global-config';

import Service1PageView from 'src/sections/services/talent-training/service1-page-view';

// ----------------------------------------------------------------------

const metadata = {
  title: `Service1 | Talent Training - ${CONFIG.appName}`,
};

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <Service1PageView />
    </>
  );
}
