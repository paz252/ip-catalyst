import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

export function HomeCategory({ title, description, category, action, path, img, sx, ...other }) {
  return (
    <Box
      key={title}
      className="home-category"
      sx={[
        (theme) => ({
          ...theme.mixins.bgGradient({
            // images: [
            //   `linear-gradient(to right, ${varAlpha(theme.vars.palette.grey['900Channel'], 0.88)} 0%, ${theme.vars.palette.grey[900]} 75%)`,
            //   `url(${CONFIG.assetsDir}/assets/background/background-5.webp)`,
            // ],
          }),
          // pt: 5,
          // pb: 5,
          py: 5,
          px: 4,
          gap: 1,
          borderRadius: 2,
          display: 'flex',
          height: { md: 1 },
          position: 'relative',
          // pl: { xs: 3, md: 5 },
          alignItems: 'center',
          color: 'common.black',
          textAlign: { xs: 'center', md: 'left' },
          flexDirection: { xs: 'column', md: 'row' },
          border: `solid 1px ${theme.vars.palette.grey[300]}`,
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Box
        sx={{
          display: 'flex',
          flex: '1 1 auto',
          flexDirection: 'column',
          alignItems: { xs: 'center', md: 'flex-start' },
        }}
      >
        <Typography variant="h4" sx={{ whiteSpace: 'pre-line', mb: 1 }}>
          {title}
        </Typography>

        <Typography variant="body2" sx={{ opacity: 0.64, maxWidth: 460, ...(action && { mb: 3 }) }}>
          {description}
        </Typography>
        {/* {console.log(category)} */}

        {category && (
          <Box component="ul" sx={{ mb: 3, display: 'flex', flexDirection: 'column', gap: 1 }}>
            {category.map((item, index) => (
              <Typography
                key={`${title}${index}`}
                component="li"
                variant="body2"
                sx={{ opacity: 0.64, maxWidth: 460 }}
              >
                {item}
              </Typography>
            ))}
          </Box>
        )}

        {action && action}
      </Box>

      {img && <Box sx={{ maxWidth: 160 }}>{img}</Box>}
    </Box>
  );
}
