import { useRef } from 'react';
import { m } from 'framer-motion';
import { useInView } from 'framer-motion';

import { alpha, useTheme } from '@mui/material/styles';
import { Box, Stack, Grid, Card, Container, Typography } from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { useCountUp } from 'src/components/animate/custom-count-up';
import { varFade, MotionViewport, AnimateCountUp } from 'src/components/animate';

import { FloatLine, FloatTriangleDownIcon } from './components/svg-elements';
// ----------------------------------------------------------------------

const DATA = [
  {
    title: 'Domestic Patents',
    items: [
      { label: 'Filed', value: 29, icon: 'solar:document-add-bold', color: 'primary' },
      { label: 'Granted', value: 131, icon: 'solar:check-circle-bold', color: 'success' },
    ],
  },
  {
    title: 'International Patents',
    items: [
      { label: 'Filed', value: 5, icon: 'solar:global-bold', color: 'info' },
      { label: 'Granted', value: 60, icon: 'solar:verified-check-bold', color: 'success' },
    ],
  },
  {
    title: 'Intellectual Property',
    items: [
      { label: 'Copyright', value: 529, icon: 'solar:copyright-bold', color: 'warning' },
      { label: 'Trademark', value: 168, icon: 'solar:tag-bold', color: 'secondary' },
    ],
  },
];

const EXTRA = [
  { label: 'Copyright', value: 529, icon: 'solar:copyright-bold', color: 'warning' },
  { label: 'Trademark', value: 168, icon: 'solar:tag-bold', color: 'secondary' },
];

const renderLines = () => (
  <>
    <Stack
      spacing={8}
      alignItems="center"
      sx={{
        top: 64,
        left: 80,
        position: 'absolute',
        transform: 'translateX(-50%)',
      }}
    >
      <FloatTriangleDownIcon sx={{ position: 'static', opacity: 0.12 }} />
      <FloatTriangleDownIcon
        sx={{
          width: 30,
          height: 15,
          opacity: 0.24,
          position: 'static',
        }}
      />
    </Stack>

    <FloatLine vertical sx={{ top: 0, left: 80 }} />
  </>
);

// ----------------------------------------------------------------------

function StatCard({ item }) {
  const theme = useTheme();
  const { label, value, icon, color } = item;

  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const count = useCountUp({
    end: value,
    duration: 1500,
    startOn: inView,
  });

  return (
    <Card
      className="animate__animated145"
      ref={ref}
      sx={{
        p: { xs: 2.5, md: 4.5 },
        borderRadius: 4,
        minHeight: { xs: 130, md: 140 },
        // minWidth: { xs: '80%', md: 1 },
        display: 'flex',
        alignItems: 'center',
        backdropFilter: 'blur(10px)',
        background: alpha(theme.palette.background.paper, 0.9),
        border: `1px solid ${alpha(theme.palette[color].main, 0.2)}`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: `0 16px 32px ${alpha(theme.palette[color].main, 0.2)}`,
        },
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center" width={1}>
        {/* ICON */}
        <Box
          sx={{
            width: { xs: 40, sm: 56 },
            height: { xs: 40, sm: 56 },
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: alpha(theme.palette[color].main, 0.12),
            color: theme.palette[color].main,
            flexShrink: 0,
          }}
        >
          <Iconify icon={icon} width={28} />
        </Box>

        {/* TEXT */}
        <Stack spacing={0.5}>
          <Box sx={{ height: 36 }}>
            <Typography
              sx={{
                fontSize: 28,
                fontWeight: 700,
                color: theme.palette.text.primary,
              }}
            >
              {count}
            </Typography>
          </Box>

          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
}

// function StatCard({ item }) {
//   const theme = useTheme();
//   const { label, value, icon, color } = item;

//   return (
//     <Card
//       sx={{
//         p: 3.5,
//         borderRadius: 4,
//         minHeight: 140,
//         display: 'flex',
//         alignItems: 'center',

//         backdropFilter: 'blur(10px)',
//         background: alpha(theme.palette.background.paper, 0.9),

//         border: `1px solid ${alpha(theme.palette[color].main, 0.2)}`,
//         transition: 'all 0.3s ease',

//         '&:hover': {
//           transform: 'translateY(-6px)',
//           boxShadow: `0 16px 32px ${alpha(theme.palette[color].main, 0.2)}`,
//         },
//       }}
//     >
//       <Stack direction="row" spacing={2} alignItems="center" width={1}>
//         {/* ICON */}
//         <Box
//           sx={{
//             width: 56,
//             height: 56,
//             borderRadius: 2,
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             bgcolor: alpha(theme.palette[color].main, 0.12),
//             color: theme.palette[color].main,
//             flexShrink: 0,
//           }}
//         >
//           <Iconify icon={icon} width={28} />
//         </Box>

//         {/* TEXT */}
//         <Stack spacing={0.5} sx={{ overflow: 'hidden' }}>
//           {/* NUMBER (no flicker) */}
//           <Box sx={{ height: 36 }}>
//             <m.div variants={varFade('inUp', { distance: 24 })}>
//               {value}
//               {/* <AnimateCountUp
//                 key={value}
//                 to={value}
//                 // unit="+"
//                 toFixed={0}
//                 sx={{
//                   fontSize: 28,
//                   fontWeight: 700,
//                   color: theme.palette.text.primary,
//                   lineHeight: 1.2,
//                 }}
//               /> */}
//             </m.div>
//           </Box>

//           {/* LABEL */}
//           <Typography variant="body2" color="text.secondary">
//             {label}
//           </Typography>
//         </Stack>
//       </Stack>
//     </Card>
//   );
// }

// function StatCard({ item }) {
//   const theme = useTheme();
//   const { label, value, icon, color } = item;

//   const ref = useRef(null);
//   const inView = useInView(ref, { once: true, margin: '-80px' });
//   // margin triggers slightly before fully visible

//   return (
//     <Card
//       className="animate__animated145"
//       ref={ref}
//       sx={{
//         width: 1,
//         p: 3.5,
//         borderRadius: 4,
//         minHeight: 140,
//         display: 'flex',
//         alignItems: 'center',

//         backdropFilter: 'blur(10px)',
//         background: alpha(theme.palette.background.paper, 0.9),

//         border: `1px solid ${alpha(theme.palette[color].main, 0.2)}`,
//         transition: 'all 0.3s ease',

//         '&:hover': {
//           transform: 'translateY(-6px)',
//           boxShadow: `0 16px 32px ${alpha(theme.palette[color].main, 0.2)}`,
//         },
//       }}
//     >
//       <Stack direction="row" spacing={2} alignItems="center" width={1}>
//         {/* ICON */}
//         <Box
//           sx={{
//             width: 56,
//             height: 56,
//             borderRadius: 2,
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             bgcolor: alpha(theme.palette[color].main, 0.12),
//             color: theme.palette[color].main,
//             flexShrink: 0,
//           }}
//         >
//           <Iconify icon={icon} width={28} />
//         </Box>

//         {/* TEXT */}
//         <Stack spacing={0.5} sx={{ overflow: 'hidden' }}>
//           {/* NUMBER */}
//           <Box sx={{ height: 36 }} className="animate__animated123">
//             {inView && (
//               <m.div variants={varFade('inUp', { distance: 24 })}>
//                 <AnimateCountUp
//                   to={value}
//                   unit="+"
//                   toFixed={0}
//                   sx={{
//                     fontSize: 28,
//                     fontWeight: 700,
//                     color: theme.palette.text.primary,
//                     lineHeight: 1.2,
//                   }}
//                 />
//               </m.div>
//             )}
//           </Box>

//           {/* LABEL */}
//           <Typography variant="body2" color="text.secondary">
//             {label}
//           </Typography>
//         </Stack>
//       </Stack>
//     </Card>
//   );
// }
// ----------------------------------------------------------------------

export function PatentStatsMinimal({ sx, ...other }) {
  const theme = useTheme();

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, md: 12 },
        // m: { xs: 1, md: 10 },
        position: 'relative',
        overflow: 'hidden',
        // borderRadius: { xs: 5, md: 10 },

        // subtle premium background glow
        // background: `
        //   radial-gradient(circle at 20% 20%, ${alpha(theme.palette.primary.main, 0.12)}, transparent 40%),
        //   radial-gradient(circle at 80% 30%, ${alpha(theme.palette.warning.main, 0.12)}, transparent 40%),
        //   radial-gradient(circle at 50% 80%, ${alpha(theme.palette.info.main, 0.12)}, transparent 50%)
        // `,
        background: `
          radial-gradient(circle at 20% 20%, ${alpha(theme.palette.primary.main, 0.25)}, transparent 80%),
          radial-gradient(circle at 80% 30%, ${alpha(theme.palette.warning.main, 0.25)}, transparent 50%),
          radial-gradient(circle at 50% 80%, ${alpha(theme.palette.info.main, 0.12)}, transparent 80%)
        `,
        ...sx,
      }}
      {...other}
    >
      <MotionViewport>
        {renderLines()}
        <Container>
          <Stack spacing={8} className="animate__animated">
            {/* MAIN GROUPS */}
            <Grid container spacing={4} justifyContent="center">
              {DATA.map((group) => (
                <Grid key={group.title} item xs={12} md={6}>
                  <Stack spacing={3}>
                    {/* <Typography
                      variant="h4"
                      sx={{
                        textAlign: 'center',
                        fontWeight: 700,
                        color: 'text.primary',
                      }}
                    >
                      {group.title}
                    </Typography> */}

                    <m.div variants={varFade('inUp', { distance: 24 })}>
                      <Typography
                        variant="h4"
                        sx={{
                          textAlign: 'center',
                          fontWeight: 700,
                          color: 'text.primary',
                        }}
                      >
                        {group.title}
                      </Typography>
                    </m.div>

                    <Grid container spacing={3}>
                      {group.items.map((item) => (
                        <Grid key={item.label} item xs={12} sm={6}>
                          <StatCard item={item} />
                        </Grid>
                      ))}
                    </Grid>
                  </Stack>
                </Grid>
              ))}
            </Grid>

            {/* EXTRA STATS */}
            {/* <Grid container spacing={4} justifyContent="center">
              {EXTRA.map((item) => (
                <Grid key={item.label} item xs={12} sm={6} md={3}>
                  <StatCard item={item} />
                </Grid>
              ))}
            </Grid> */}
          </Stack>
        </Container>
      </MotionViewport>
    </Box>
  );
}
