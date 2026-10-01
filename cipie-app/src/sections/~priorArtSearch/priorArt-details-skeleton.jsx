import { Box, Card, Divider, Skeleton, Stack } from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';

export function PriorArtDetailsSkeleton() {
  return (
    <DashboardContent>
      {/* HEADER SECTION */}
      <Stack direction="row" alignItems="flex-start" sx={{ mb: 3 }}>
        <Stack spacing={1} sx={{ flexGrow: 1 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Skeleton variant="text" width={350} height={40} />
            <Skeleton variant="rounded" width={70} height={24} />
          </Stack>

          <Skeleton variant="text" width={320} height={22} />
        </Stack>

        <Skeleton variant="rounded" width={80} height={36} />
      </Stack>

      {/* SUMMARY CARD */}
      <Card sx={{ p: 3, mb: 3 }}>
        <Stack spacing={1}>
          <Skeleton variant="text" width={170} height={28} />

          <Stack spacing={0.8}>
            <Skeleton variant="text" width="95%" />
            <Skeleton variant="text" width="90%" />
            <Skeleton variant="text" width="65%" />
          </Stack>

          <Box sx={{ pt: 1 }}>
            <Skeleton variant="text" width={100} height={28} />

            <Stack spacing={0.8}>
              <Skeleton variant="text" width="92%" />
              <Skeleton variant="text" width="85%" />
              <Skeleton variant="text" width="55%" />
            </Stack>
          </Box>
        </Stack>
      </Card>

      {/* TABS + CONTENT */}
      <Card>
        {/* TABS */}
        <Stack
          direction="row"
          spacing={4}
          sx={{
            px: 3,
            height: 56,
            alignItems: 'center',
            bgcolor: 'background.neutral',
          }}
        >
          <Skeleton variant="text" width={100} height={30} />
          <Skeleton variant="text" width={120} height={30} />
          <Skeleton variant="text" width={90} height={30} />
        </Stack>

        <Divider />

        {/* CONTENT */}
        <Box sx={{ p: 3 }}>
          <Stack spacing={3}>
            {/* BLOCK 1 */}
            <Stack spacing={1}>
              <Skeleton variant="text" width={190} height={28} />

              <Stack spacing={0.8}>
                <Skeleton variant="text" width="100%" />
                <Skeleton variant="text" width="96%" />
                <Skeleton variant="text" width="88%" />
                <Skeleton variant="text" width="72%" />
              </Stack>
            </Stack>

            {/* BLOCK 2 */}
            <Stack spacing={1}>
              <Skeleton variant="text" width={100} height={28} />

              <Stack spacing={0.8}>
                <Skeleton variant="text" width="95%" />
                <Skeleton variant="text" width="82%" />
                <Skeleton variant="text" width="60%" />
              </Stack>
            </Stack>
          </Stack>
        </Box>
      </Card>
    </DashboardContent>
  );
}
