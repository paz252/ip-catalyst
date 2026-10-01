import { CONFIG } from 'src/global-config';

import { LogoCompetitionView } from 'src/sections/challenge/view';

// ----------------------------------------------------------------------

const metadata = { title: `Logo Competition - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <LogoCompetitionView />
    </>
  );
}
