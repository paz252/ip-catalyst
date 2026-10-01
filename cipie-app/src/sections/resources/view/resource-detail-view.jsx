import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import AvatarGroup, { avatarGroupClasses } from '@mui/material/AvatarGroup';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { CONFIG } from 'src/global-config';

import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { PostItem } from '../post-item';
import { PostDetailsSkeleton } from '../post-skeleton';

// ----------------------------------------------------------------------

export function ResourceDetailView({ post, latestPosts = [], loading, error }) {
  if (loading) {
    return <PostDetailsSkeleton />;
  }

  if (error) {
    return (
      <Container sx={{ py: 10, px: { xs: 2, sm: 4, md: '20%' } }}>
        <EmptyContent
          filled
          title="Post not found!"
          action={
            <Button
              component={RouterLink}
              href={paths.resources.root}
              startIcon={<Iconify width={16} icon="eva:arrow-ios-back-fill" />}
              sx={{ mt: 3 }}
            >
              Back to list
            </Button>
          }
          sx={{ py: 10 }}
        />
      </Container>
    );
  }

  return (
    <>
      {/* 1. Breadcrumbs Container: Responsive padding */}
      <Container maxWidth={false} sx={{ py: 2, px: { xs: 2, sm: 4, md: '15%', lg: '20%' } }}>
        <CustomBreadcrumbs
          links={[
            { name: 'Home', href: '/' },
            { name: 'Resource', href: paths.resources.root },
            { name: post?.title },
          ]}
          sx={{
            width: '100%',
            // Prevents breadcrumbs from breaking layout on very small screens
            '& .MuiBreadcrumbs-ol': { flexWrap: 'nowrap', overflow: 'hidden' },
          }}
        />
      </Container>

      {/* 2. Main Hero Image: Full width on mobile, centered on desktop */}
      <Box sx={{ mb: 4, px: { xs: 0, sm: 4, md: '15%', lg: '20%' } }}>
        <img
          src={`${CONFIG.blog}${
            post?.imageUrl?.startsWith('/') ? post.imageUrl : `/${post.imageUrl}`
          }`}
          alt={post?.title}
          style={{
            width: '100%',
            height: 'auto',
            borderRadius: { xs: 0, sm: 12 }, // Sharp edges on mobile looks more "app-like"
            display: 'block',
            boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
          }}
        />
      </Box>

      {/* 3. Article Content: Adaptive Width & Typography */}
      <Box
        sx={{
          width: '100%',
          // Use more screen real estate on mobile (px: 2), breathe more on desktop
          //   px: { xs: 2, sm: 4, md: 6 },
          //   px: { xs: 2, sm: 3, md: 4 },
          px: { xs: 1.5, sm: 2, md: 3 },
          py: { xs: 4, md: 8 },
          //   maxWidth: { xs: '100%', sm: '95%', md: '800px' }, // Set a max-width for readability
          maxWidth: { xs: '100%', sm: '100%', md: '1150px', lg: '1300px' },
          mx: 'auto',
          backgroundColor: '#fff',
          borderRadius: { xs: 0, sm: 4 },
          boxShadow: { xs: 'none', sm: '0 8px 30px rgba(0,0,0,0.05)' },
          fontSize: { xs: 16, md: 18 }, // Slightly larger for better readability
          lineHeight: 1.8,
          color: '#1d1d1d',
          mb: 8,
          // 4. Responsive HTML Content Styling
          '& h1': {
            fontSize: { xs: '28px', md: '40px' },
            fontWeight: 800,
            mt: 4,
            mb: 2,
            lineHeight: 1.2,
          },
          '& h2': { fontSize: { xs: '22px', md: '32px' }, fontWeight: 700, mt: 4, mb: 2 },
          '& h3': { fontSize: { xs: '20px', md: '26px' }, fontWeight: 600, mt: 3, mb: 1.5 },
          '& p': { mb: 2.5 },
          '& ul, & ol': { pl: { xs: 2, sm: 4 }, mb: 3 },
          '& li': { mb: 1.5 },
          '& img': {
            display: 'block',
            maxWidth: '100%',
            height: 'auto',
            mx: 'auto',
            my: 4,
            borderRadius: 8,
          },
          // Responsive Tables: Make them scrollable on mobile
          '& table': {
            display: 'block',
            width: '100%',
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
            borderCollapse: 'collapse',
            my: 4,
          },
          '& th, & td': { border: '1px solid #eee', padding: 1.5, minWidth: '120px' },
          '& a': {
            // color: 'primary.main',
            textDecoration: 'underline',
            wordBreak: 'break-all', // Forces long URLs to wrap to the next line
            overflowWrap: 'break-word', // Alternative support for wrapping
            display: 'inline-block', // Helps with certain layout edge cases
            maxWidth: '100%', // Ensures the link cannot exceed the container width
          },
        }}
        dangerouslySetInnerHTML={{ __html: post?.wordContent || '' }}
      />

      {/* 5. Recent Posts: Grid adjustments */}
      {!!latestPosts?.length && (
        <Box sx={{ width: '100%', px: { xs: 2, sm: 4, md: '10%', lg: '15%' }, mb: 10 }}>
          <Typography variant="h4" sx={{ mb: 5, textAlign: { xs: 'center', sm: 'left' } }}>
            Recent Posts
          </Typography>
          <Grid container spacing={3}>
            {latestPosts.slice(0, 4).map((latestPost) => (
              <Grid key={latestPost.id} item xs={12} sm={6} md={3}>
                <PostItem post={latestPost} detailsHref={paths.post.details(latestPost.title)} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </>
  );
}
