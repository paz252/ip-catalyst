import { CONFIG } from 'src/global-config';

import { JwtVerifyOtpView } from 'src/auth/view/jwt';

// ----------------------------------------------------------------------

const metadata = { title: `Verify Otp | Layout split - ${CONFIG.appName}` };

export default function Page() {
    return (
        <>
            <title>{metadata.title}</title>

            <JwtVerifyOtpView />
        </>
    );
}
