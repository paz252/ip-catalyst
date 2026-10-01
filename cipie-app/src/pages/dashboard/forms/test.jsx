import { CONFIG } from 'src/global-config';

// import Test from 'src/sections/forms/test';

// ----------------------------------------------------------------------

const metadata = { title: `Tour list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      {/* <Test /> */}
    </>
  );
}
