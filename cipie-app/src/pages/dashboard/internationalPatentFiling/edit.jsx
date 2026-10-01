import { useEffect, useState } from 'react';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { useGetInternationalPatent } from 'src/actions/internationalPatentFiling';

import { InternationalPatentEditView } from 'src/sections/internationalPatentFiling/view/internationalPatent-edit-view';

import { getMyProfile } from 'src/auth/context/jwt';


// ----------------------------------------------------------------------

const metadata = { title: `Trademark edit | Dashboard - ${CONFIG.appName}` };

export default function Page() {
    const [role, setRole] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profile = await getMyProfile();
                setRole(profile.userTypeCode);
            } catch (error) {
                console.error('Failed to fetch profile', error);
            }
        };

        fetchProfile();
    }, []);

    const { id } = useParams(); // Extracts the GUID from URL

    const { patent, patentLoading: loading, patentError: error } = useGetInternationalPatent(id);

    if (loading || role === null) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <title>{metadata.title}</title>

            <InternationalPatentEditView internationalPatent={patent} role={role} />
        </>
    );
}