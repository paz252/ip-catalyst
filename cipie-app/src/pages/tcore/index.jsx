import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

const metadata = { title: `TCore - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <h1>TCore</h1>
    </>
  );
}
