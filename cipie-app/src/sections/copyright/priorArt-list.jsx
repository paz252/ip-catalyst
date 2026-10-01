import Box from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';

import { paths } from 'src/routes/paths';

// 🔹 Import your newly created PriorArtItem
import { PriorArtItem } from './priorArt-item';
import { PriorArtSkeleton } from './product-skeleton';

// ----------------------------------------------------------------------

export function PriorArtList({ applications, loading, sx, ...other }) {

    // Render skeletons while the API call is fetching data for Users 3, 7, 8, or 9
    const renderLoading = () => (
        <>
            {[...Array(8)].map((_, index) => (
                <PriorArtSkeleton key={index} />
            ))}
        </>
    );

    const renderList = () =>
        applications?.map((app) => (
            <PriorArtItem
                key={app.applicationId}
                application={app}
                // 🔹 Update this path to your Prior Art details route
                detailsHref={paths.dashboard.priorArt.details(app.applicationId)}
            />
        ));

    return (
        <>
            <Box
                sx={[
                    {
                        gap: 3,
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: 'repeat(1, 1fr)',
                            sm: 'repeat(2, 1fr)',
                            md: 'repeat(3, 1fr)',
                            lg: 'repeat(4, 1fr)',
                        },
                    },
                    ...(Array.isArray(sx) ? sx : [sx]),
                ]}
                {...other}
            >
                {loading ? renderLoading() : renderList()}
            </Box>

            {/* Pagination remains useful if a user has many applications */}
            {applications?.length > 8 && (
                <Pagination
                    count={8}
                    sx={{
                        mt: { xs: 5, md: 8 },
                        [`& .${paginationClasses.ul}`]: { justifyContent: 'center' },
                    }}
                />
            )}
        </>
    );
}