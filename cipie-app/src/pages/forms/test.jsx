import { CONFIG } from 'src/global-config';

import Test from 'src/sections/forms/test';

// ----------------------------------------------------------------------

const metadata = { title: `Test form | Dashboard - ${CONFIG.appName}` };

export default function Test1() {
  return (
    <>
      <title>{metadata.title}</title>

      <Test />
    </>
  );
}
