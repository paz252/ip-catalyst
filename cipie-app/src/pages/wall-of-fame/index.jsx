import { CONFIG } from 'src/global-config';

import { WallOfFameHomeView } from 'src/sections/wallOfFame/view';

// ----------------------------------------------------------------------

const metadata = { title: `Wall Of Fame - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <WallOfFameHomeView />
    </>
  );
}

