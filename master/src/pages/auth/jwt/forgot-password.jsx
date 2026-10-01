import { CONFIG } from 'src/global-config';

import { ForgotPasswordView } from 'src/auth/view/jwt';

// ----------------------------------------------------------------------

const metadata = { title: `Forgot password | Layout split - ${CONFIG.appName}` };

export default function Page() {
    return (
        <>
            <title>{metadata.title}</title>

            <ForgotPasswordView />
        </>
    );
}