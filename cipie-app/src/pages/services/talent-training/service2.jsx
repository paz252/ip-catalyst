import { CONFIG } from 'src/global-config';

import Service2PageView from 'src/sections/services/talent-training/service2-page-view';

// ----------------------------------------------------------------------

const metadata = {
  title: `Service2 | Talent Training - ${CONFIG.appName}`,
};

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <Service2PageView />
    </>
  );
}
