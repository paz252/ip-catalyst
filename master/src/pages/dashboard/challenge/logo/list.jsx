import { CONFIG } from 'src/global-config';

import { LogoListView } from 'src/sections/challenge/view';

// ----------------------------------------------------------------------

const metadata = { title: `Logo Challenge | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <LogoListView />
    </>
  );
}
