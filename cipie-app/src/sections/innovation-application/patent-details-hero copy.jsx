import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Container from '@mui/material/Container';
import SpeedDial from '@mui/material/SpeedDial';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import useMediaQuery from '@mui/material/useMediaQuery';
import SpeedDialAction from '@mui/material/SpeedDialAction';

import { fDate } from 'src/utils/format-time';

import { _socials } from 'src/_mock';
import { CONFIG } from 'src/global-config';

import { Iconify } from 'src/components/iconify';
import { useFilePreview } from 'src/components/file-thumbnail';

// ----------------------------------------------------------------------

export function PatentDetailsHero({ sx, title, author, coverUrl, createdAt, ...other }) {
  const smUp = useMediaQuery((theme) => theme.breakpoints.up('sm'));
  const { previewUrl } = useFilePreview(coverUrl);

  return (
    <Box
      sx={[
        (theme) => ({
          ...theme.mixins.bgGradient({}),
          height: { xs: 300, md: 200 },
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Container
        maxWidth={false}
        sx={{
          px: { xs: 2, md: 12 },
          py: { xs: 3, md: 4 },
          width: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: 1,
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          sx={{
            color: 'var(--palette-text-primary)',
          }}
        >
          {title}
        </Typography>

        {author && createdAt && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              mt: 2,
            }}
          >
            <Iconify
              icon="fluent:building-people-24-filled"
              width={34}
              sx={{ color: 'primary.main', mr: 1 }}
            />

            <ListItemText
              sx={{ color: 'var(--palette-text-primary)' }}
              primary={author}
              secondary={fDate(createdAt)}
              slotProps={{
                primary: { sx: { typography: 'subtitle2' } },
                secondary: { sx: { mt: 0.5, opacity: 0.64, color: 'inherit' } },
              }}
            />
          </Box>
        )}
      </Container>
    </Box>
  );
}
