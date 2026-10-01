import { useEffect, useState } from 'react';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { getMyProfile } from 'src/auth/context/jwt';

import { InternationalPatentCreateEditForm } from '../internationalPatent-create-edit-form';

// ----------------------------------------------------------------------

export function InternationalPatentCreateView() {
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

    return (
        <DashboardContent>
            <CustomBreadcrumbs
                heading="Foreign Patent Filing Request"
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: 'Foreign Patent Filing Request', href: paths.dashboard.internationalPatentFiling.root },
                    { name: 'Create' },
                ]}
                sx={{ mb: { xs: 3, md: 5 } }}
            />
            <InternationalPatentCreateEditForm role={role} />
        </DashboardContent>
    );
}