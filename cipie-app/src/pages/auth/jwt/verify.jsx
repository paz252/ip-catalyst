import { CONFIG } from 'src/global-config';

import { JwtVerifyView } from 'src/auth/view/jwt';

// ----------------------------------------------------------------------

const metadata = { title: `Verify | Layout centered - ${CONFIG.appName}` };

export default function Page() {
    return (
        <>
            <title>{metadata.title}</title>

            <JwtVerifyView />
        </>
    );
}
