import { Box, Skeleton, TableCell, TableRow } from '@mui/material';

export function LogoChallengeTableSkeleton({ rows = 5 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <TableRow key={index}>
          {/* Logo + Title */}
          <TableCell>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Skeleton variant="rounded" width={56} height={56} />

              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="70%" height={24} />
                <Skeleton variant="text" width="40%" height={18} />
              </Box>
            </Box>
          </TableCell>

          {/* Applicant */}
          <TableCell>
            <Skeleton variant="text" width={120} height={22} />
            <Skeleton variant="text" width={150} height={18} />
          </TableCell>

          {/* Status */}
          <TableCell>
            <Skeleton variant="rounded" width={80} height={26} />
          </TableCell>

          {/* Submitted On */}
          <TableCell>
            <Skeleton variant="text" width={90} height={22} />
            <Skeleton variant="text" width={70} height={18} />
          </TableCell>

          {/* Action */}
          <TableCell align="right">
            <Skeleton variant="circular" width={36} height={36} sx={{ ml: 'auto' }} />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
