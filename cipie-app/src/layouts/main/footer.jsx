import { alpha, styled } from '@mui/material/styles';
import {
  Box,
  Grid,
  Link,
  Divider,
  Stack,
  Typography,
  IconButton,
  Container,
  Button,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useConfirmNavigate } from 'src/hooks/useConfirmNavigateCustom';

import { _socials } from 'src/_mock';
import { CONFIG } from 'src/global-config';
import CurrentMonthYear from 'src/_customs/CurrentMonthYear';

import { ConfirmDialog } from 'src/components/custom-dialog';

// ----------------------------------------------------------------------

const LINKS = [
  {
    headline: 'Navigate',
    children: [
      { name: 'About us', href: paths.about },
      { name: 'Contact us', href: paths.contact },
      { name: 'Resources', href: paths.resources.root },
      { name: 'Events', href: paths.events.root },
      { name: 'Wall of fame', href: paths.wallOfFame },
      // { name: 'FAQs', href: paths.faqs },
    ],
  },
  // {
  //   headline: 'Legal',
  //   children: [
  //     { name: 'Terms and condition', href: '#' },
  //     { name: 'Privacy policy', href: '#' },
  //   ],
  // },
  // {
  //   headline: 'Funded By',
  //   label: 'Meity',
  //   image: 'meity.svg',
  //   href: 'https://www.meity.gov.in',
  // },
  // {
  //   headline: 'Coordinated By',
  //   label: 'Cdac',
  //   image: 'cdac.png',
  //   href: 'https://cdac.in',
  // },
];

const LOGOS = [
  {
    headline: 'Funded By',
    label: 'Meity',
    image: 'meity.svg',
    href: 'https://www.meity.gov.in',
  },
  {
    headline: 'Coordinated By',
    label: 'Cdac',
    image: 'cdac.png',
    href: 'https://cdac.in',
  },
];

// ----------------------------------------------------------------------

const FooterRoot = styled('footer')(({ theme }) => ({
  position: 'relative',
  backgroundColor: theme.vars.palette.background.default,
}));

const renderConfirmDialog = (confirmDialog, confirmAndNavigate) => (
  <ConfirmDialog
    open={confirmDialog.value}
    onClose={confirmDialog.onFalse}
    title="Confirm"
    content="This link will take you to external website."
    action={
      <Button variant="contained" color="primary" onClick={() => confirmAndNavigate()}>
        Confirm
      </Button>
    }
  />
);

export function HomeFooter({ sx, layoutQuery = 'lg', ...other }) {
  const { confirmDialog, openConfirm, confirmAndNavigate } = useConfirmNavigate();

  return (
    // <Box sx={{ py: { xs: 6, md: 5 }, px: { xs: 2, md: 8, lg: 12 } }}>
    <FooterRoot
      sx={[
        (theme) => ({
          // bgcolor: '#0B2A4A',
          // bgcolor: '#003466',
          bgcolor: '#2A2A2A',
          color: '#FFFFFF',
        }),

        // ✅ Allow override from parent
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Divider />

      <Container
        maxWidth={false}
        sx={(theme) => ({
          px: {
            xs: 2,
            md: 10,
            lg: 12,
          },

          py: 1,
          // pb: 2,
          // pt: 5,
          // padding: 1,
          textAlign: 'center',
          [theme.breakpoints.up(layoutQuery)]: { textAlign: 'unset' },
        })}
      >
        {/* <Link href="/dist.zip" download underline="hover" color="inherit">
          DIST
        </Link> */}
        {/* <Logo /> */}
        {/* <Box
          component="img"
          src={`${CONFIG.assetsDir}/logo/ip-catalyst.png`}
          alt="IP Catalyst Logo"
          style={{ height: 35 }}
        /> */}
        <Grid
          container
          sx={[
            (theme) => ({
              mt: 3,
              justifyContent: 'center',
              [theme.breakpoints.up(layoutQuery)]: { justifyContent: 'space-between' },
            }),
          ]}
        >
          <Grid size={{ xs: 12, [layoutQuery]: 3 }}>
            {/* Description */}
            <Typography
              variant="body2"
              sx={(theme) => ({
                mx: 'auto',
                maxWidth: 280,
                [theme.breakpoints.up(layoutQuery)]: { mx: 'unset' },
              })}
            >
              To Empower Innovators with Comprehensive IP Solutions in IT and Electronics.
            </Typography>

            {/* Social media icons */}
            <Box
              sx={(theme) => ({
                mt: 3,
                mb: 5,
                display: 'flex',
                justifyContent: 'center',
                // gap: 0,
                [theme.breakpoints.up(layoutQuery)]: { mb: 0, justifyContent: 'flex-start' },
              })}
            >
              {_socials.map((social) => (
                <IconButton
                  sx={(theme) => ({
                    // borderRadius: '50%',
                    // bgcolor: alpha(theme.palette.common.white, 0.08),
                    '&:hover': {
                      bgcolor: alpha(theme.palette.common.white, 0.16),
                    },
                  })}
                  key={social.label}
                  component="a"
                  href={social.path}
                  target="_blank"
                  color="inherit"
                >
                  {social.value === 'twitter' && <SocialIcon image="twitter.svg" />}
                  {social.value === 'facebook' && <SocialIcon image="facebook.svg" />}
                  {social.value === 'instagram' && <SocialIcon image="instagram.svg" />}
                  {social.value === 'linkedin' && <SocialIcon image="linkedin.svg" />}
                </IconButton>
              ))}
            </Box>
          </Grid>

          {/* Links */}
          <Grid size={{ xs: 12, [layoutQuery]: 6 }}>
            <Box
              sx={(theme) => ({
                gap: 4,
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                [theme.breakpoints.up(layoutQuery)]: {
                  flexDirection: 'row',
                },
              })}
            >
              {LINKS.map((list) => (
                <Box
                  key={list.headline}
                  sx={(theme) => ({
                    gap: 1,
                    // width: 1,
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',

                    [theme.breakpoints.up(layoutQuery)]: {
                      alignItems: 'flex-start',
                    },
                  })}
                >
                  {/* Heading */}
                  <Typography component="div" variant="overline">
                    {list.headline}
                  </Typography>

                  {/* LINKS */}
                  {list.children?.length > 0 &&
                    list.children.map((link) => (
                      <Link
                        key={link.name}
                        component={RouterLink}
                        href={link.href}
                        color="inherit"
                        variant="body2"
                        underline="hover"
                      >
                        {link.name}
                      </Link>
                    ))}

                  {/* Logos */}
                  {/* {!list.children?.length && list.image && (
                    <IconButton
                      component="a"
                      href={list.href}
                      onClick={(e) => openConfirm(e, list.href, { external: true })}
                      target="_blank"
                      rel="noopener noreferrer"
                      color="inherit"
                      sx={{ padding: 'unset', '&:hover': { bgcolor: 'unset' } }}
                    >
                      <Box
                        component="img"
                        src={`${CONFIG.assetsDir}/assets/images/footer/logo/${list.image}`}
                        alt={list.label}
                        // width={100}
                        // height={90}
                        sx={{
                          width: list.label === 'Meity' ? '270px' : '100px',
                          // height: list.label === 'Meity' ? '89px' : '99px',
                          objectFit: 'contain',
                        }}
                      />
                    </IconButton>
                  )} */}
                </Box>
              ))}
              <Box
                sx={{
                  gap: 4,
                  display: 'flex',
                  flexDirection: 'row',
                }}
              >
                {LOGOS.map((list) => (
                  <Box
                    className="fadeInUp"
                    key={list.headline}
                    sx={(theme) => ({
                      gap: 1,
                      width: 1,
                      display: 'flex',
                      alignItems: { xs: 'flex-start', md: 'flex-start' },
                      flexDirection: 'column',

                      [theme.breakpoints.up(layoutQuery)]: {
                        alignItems: 'flex-start',
                      },
                    })}
                  >
                    {/* Heading */}
                    <Typography component="div" variant="overline">
                      {list.headline}
                    </Typography>

                    {/* Logos */}
                    {!list.children?.length && list.image && (
                      <IconButton
                        component="a"
                        href={list.href}
                        onClick={(e) => openConfirm(e, list.href, { external: true })}
                        target="_blank"
                        rel="noopener noreferrer"
                        color="inherit"
                        sx={{ padding: 'unset', '&:hover': { bgcolor: 'unset' } }}
                      >
                        <Box
                          component="img"
                          src={`${CONFIG.assetsDir}/assets/images/footer/logo/${list.image}`}
                          alt={list.label}
                          // width={100}
                          // height={90}
                          sx={{
                            width: list.label === 'Meity' ? '280px' : '100px',
                            // height: list.label === 'Meity' ? '89px' : '99px',
                            objectFit: 'contain',
                          }}
                        />
                      </IconButton>
                    )}
                  </Box>
                ))}
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ mt: 4 }} />

        {/* Copyright, developed and date */}
        <Stack
          gap={2}
          sx={{
            p: { xs: 0.5, md: 1 },
            justifyContent: 'center',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
          }}
        >
          <Typography variant="body2">
            © Centre for Development of Advanced Computing (C-DAC)
          </Typography>
          <Box
            sx={{
              borderRight: '1px solid white',
              height: 15,
              display: { xs: 'none', md: 'block' },
            }}
          />
          <Typography variant="body2" component="div">
            Designed and developed by
            <Link
              href="https://cdac.in/"
              onClick={(e) => openConfirm(e, 'https://cdac.in/', { external: true })}
            >
              {' '}
              C-DAC, MTG
            </Link>
          </Typography>
          <Box
            sx={{
              borderRight: '1px solid white',
              height: 15,
              display: { xs: 'none', md: 'block' },
            }}
          />
          <Stack
            sx={{
              flexDirection: 'row',
              gap: 0.5,
              justifyContent: { xs: 'center', [layoutQuery]: 'center' },
            }}
          >
            <Typography variant="body2">Last Updated :</Typography>
            <CurrentMonthYear variant="body2" />
          </Stack>
          {renderConfirmDialog(confirmDialog, confirmAndNavigate)}
        </Stack>

        {/* <Typography variant="body2" sx={{ mt: 10 }}>
          © All rights reserved.
        </Typography> */}
      </Container>
    </FooterRoot>
    // </Box>
  );
}

function SocialIcon({ image }) {
  // console.log(image);
  return (
    <Box
      component="img"
      src={`${CONFIG.assetsDir}/assets/images/footer/logo/${image}`}
      alt={image}
      sx={{
        width: 20,
        height: 20,
      }}
    />
  );
}

{
  /* <Grid size={{ xs: 12, [layoutQuery]: 6 }}>
  <Box
    sx={(theme) => ({
      gap: {
        xs: 4,
        md: 5,
      },

      display: 'flex',

      flexDirection: {
        xs: 'column',
        [layoutQuery]: 'row',
      },

      alignItems: {
        xs: 'center',
        [layoutQuery]: 'flex-start',
      },

      justifyContent: 'space-between',
    })}
  >
   
    // LINKS SECTION
    {LINKS.filter((list) => list.children?.length > 0).map((list) => (
      <Box
        key={list.headline}
        sx={{
          width: {
            xs: '100%',
            [layoutQuery]: 'auto',
          },

          display: 'flex',
          flexDirection: 'column',

          gap: 1,

          alignItems: {
            xs: 'center',
            [layoutQuery]: 'flex-start',
          },
        }}
      >
       
        // HEADING
        <Typography component="div" variant="overline">
          {list.headline}
        </Typography>

     
        // LINKS
        <Box
          sx={{
            width: '100%',

            display: 'grid',

            gridTemplateColumns: {
              xs: 'repeat(2, minmax(0, 1fr))',
              [layoutQuery]: '1fr',
            },

            gap: 1,

            textAlign: {
              xs: 'center',
              [layoutQuery]: 'left',
            },
          }}
        >
          {list.children.map((link) => (
            <Link
              key={link.name}
              component={RouterLink}
              href={link.href}
              color="inherit"
              variant="body2"
              underline="hover"
            >
              {link.name}
            </Link>
          ))}
        </Box>
      </Box>
    ))}


    // LOGOS SECTION
    <Box
      sx={{
        display: 'flex',

        flexDirection: {
          xs: 'row',
          [layoutQuery]: 'row',
        },

        alignItems: 'center',

        justifyContent: {
          xs: 'center',
          [layoutQuery]: 'flex-start',
        },

        gap: {
          xs: 4,
          md: 5,
        },

        flexWrap: 'wrap',
      }}
    >
      {LINKS.filter((list) => !list.children?.length && list.image).map((list) => (
        <Box
          key={list.headline}
          sx={{
            display: 'flex',
            flexDirection: 'column',

            alignItems: 'center',

            gap: 1,
          }}
        >
         
          // HEADING
          <Typography component="div" variant="overline">
            {list.headline}
          </Typography>


          // LOGO
          <IconButton
            component="a"
            href={list.href}
            onClick={(e) =>
              openConfirm(e, list.href, {
                external: true,
              })
            }
            target="_blank"
            rel="noopener noreferrer"
            color="inherit"
            sx={{
              p: 0,

              '&:hover': {
                bgcolor: 'transparent',
              },
            }}
          >
            <Box
              component="img"
              src={`${CONFIG.assetsDir}/assets/images/footer/logo/${list.image}`}
              alt={list.label}
              sx={{
                width: list.label === 'Meity' ? 270 : 100,

                maxWidth: '100%',

                objectFit: 'contain',
              }}
            />
          </IconButton>
        </Box>
      ))}
    </Box>
  </Box>
</Grid> */
}
