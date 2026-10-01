// import Box from '@mui/material/Box';
// import Chip from '@mui/material/Chip';
// import Grid from '@mui/material/Grid';
// import Stack from '@mui/material/Stack';
// import Avatar from '@mui/material/Avatar';
// import Button from '@mui/material/Button';
// import Divider from '@mui/material/Divider';
// import Checkbox from '@mui/material/Checkbox';
// import Container from '@mui/material/Container';
// import Typography from '@mui/material/Typography';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import AvatarGroup, { avatarGroupClasses } from '@mui/material/AvatarGroup';

// import { paths } from 'src/routes/paths';
// import { RouterLink } from 'src/routes/components';

// import { fShortenNumber } from 'src/utils/format-number';

// import { Iconify } from 'src/components/iconify';
// import { Markdown } from 'src/components/markdown';
// import { EmptyContent } from 'src/components/empty-content';
// import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

// import { PostItem } from '../post-item';
// import { PostDetailsSkeleton } from '../post-skeleton';
// import { PostCommentList } from '../post-comment-list';
// import { PostCommentForm } from '../post-comment-form';
// import { PostDetailsHero } from '../post-details-hero';

// // ----------------------------------------------------------------------

// export function PostDetailsHomeView({ post, latestPosts = [], loading, error }) {
//   if (loading) {
//     return <PostDetailsSkeleton />;
//   }

//   if (error) {
//     return (
//       <Container sx={{ mt: 5, mb: 10 }}>
//         <EmptyContent
//           filled
//           title="Post not found!"
//           action={
//             <Button
//               component={RouterLink}
//               href={paths.post.root}
//               startIcon={<Iconify width={16} icon="eva:arrow-ios-back-fill" />}
//               sx={{ mt: 3 }}
//             >
//               Back to list
//             </Button>
//           }
//           sx={{ py: 10 }}
//         />
//       </Container>
//     );
//   }

//   return (
//     <>
//       <Container
//         maxWidth={false}
//         sx={[
//           (theme) => ({ py: 3, mb: 5, borderBottom: `solid 1px ${theme.vars.palette.divider}` }),
//         ]}
//       >
//         <CustomBreadcrumbs
//           links={[
//             { name: 'Home', href: '/' },
//             { name: 'Blog', href: paths.post.root },
//             { name: post?.title },
//           ]}
//          sx={{ width: '100%', px: { xs: 2, md: 8 } }}
//         />
//       </Container>
      
// <Box
//   sx={{
//     display: 'flex',
//     justifyContent: 'center',
//     my: { xs: 2, md: 4 },   // responsive spacing
//     px: { xs: 1, sm: 2 },   // prevent edge overflow on mobile
//   }}
// >
//   <img
//     src={`http://10.208.10.194:82${post?.imageUrl}`}
//     alt={post?.title}
//     style={{
//       width: '100%',        // full width
//       maxWidth: '900px',    // limit on large screens
//       height: 'auto',       // ✅ maintain aspect ratio
//       objectFit: 'cover',
//       borderRadius: '8px',
//       display: 'block',
//     }}
//   />
// </Box>

//       <Container maxWidth={false}>
//         <Stack sx={{ width: '100%', px: { xs: 2, md: 8 } }}>
// <Box
//   sx={{
//   width: '100%',           // full container width
//     maxWidth: 1000,          // reasonable max width
//     mx: 'auto',              // center horizontally
//     px: { xs: 2, sm: 3, md: 4 }, // responsive padding
//     py: { xs: 2, sm: 3, md: 5 },

//     fontFamily: '"Public Sans Variable", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
//     fontSize: '15px',        // reduced font size
//     lineHeight: 1.5,         // normal readable spacing
//     color: '#1d1d1d',

//     border: '1px solid #eee',
//     borderRadius: 2,
//     backgroundColor: '#fff',
//     boxShadow: '0 4px 12px rgba(0,0,0,0.05)',

//     overflowWrap: 'break-word',

//     // headings (reduced spacing)
//     '& h1': { fontSize: '32px', fontWeight: 700, mt: 3, mb: 2 },
//     '& h2': { fontSize: '26px', fontWeight: 600, mt: 3, mb: 2 },
//     '& h3': { fontSize: '22px', fontWeight: 500, mt: 2, mb: 1.5 },

//     // paragraphs
//     '& p': { mb: 2 },

//     // lists
//     '& ul, & ol': { pl: 4, mb: 2 },
//     '& li': { mb: 1 },

//     // images
//     '& img': {
//       display: 'block',
//       maxWidth: '100%',
//       height: 'auto',
//       margin: '20px auto',
//       borderRadius: 6,
//     },

//     // tables
//     '& table': {
//       width: '100%',
//       borderCollapse: 'collapse',
//       my: 3,
//     },
//     '& th, & td': {
//       border: '1px solid #ddd',
//       padding: '10px',
//     },
//   }}
//   dangerouslySetInnerHTML={{ __html: post?.wordContent || '' }}
// />
//           <Stack
//             spacing={3}
//             sx={[
//               (theme) => ({
//                 py: 3,
//                 borderTop: `dashed 1px ${theme.vars.palette.divider}`,
//                 borderBottom: `dashed 1px ${theme.vars.palette.divider}`,
//               }),
//             ]}
//           >
         

//             {/* <Box sx={{ display: 'flex', alignItems: 'center' }}>
//               <FormControlLabel
//                 label={fShortenNumber(post?.totalFavorites)}
//                 control={
//                   <Checkbox
//                     defaultChecked
//                     size="small"
//                     color="error"
//                     icon={<Iconify icon="solar:heart-bold" />}
//                     checkedIcon={<Iconify icon="solar:heart-bold" />}
//                     slotProps={{
//                       input: {
//                         id: 'favorite-checkbox',
//                         'aria-label': 'Favorite checkbox',
//                       },
//                     }}
//                   />
//                 }
//                 sx={{ mr: 1 }}
//               />

//               <AvatarGroup
//                 sx={{
//                   [`& .${avatarGroupClasses.avatar}`]: {
//                     width: 32,
//                     height: 32,
//                   },
//                 }}
//               >
//                 {post?.favoritePerson.map((person) => (
//                   <Avatar key={person.name} alt={person.name} src={person.avatarUrl} />
//                 ))}
//               </AvatarGroup>
//             </Box> */}
//           </Stack>

//           {/* <Box sx={{ mb: 3, mt: 5, display: 'flex' }}>
//             <Typography variant="h4">Comments</Typography>

//             <Typography variant="subtitle2" sx={{ color: 'text.disabled' }}>
//               ({post?.comments.length})
//             </Typography>
//           </Box> */}

//           {/* <PostCommentForm />

//           <Divider sx={{ mt: 5, mb: 2 }} /> */}

//           {/* <PostCommentList comments={post?.comments} /> */}
//         </Stack>
//       </Container>

//       {!!latestPosts?.length && (
//         <Container sx={{ pb: 15 }}>
//           <Typography variant="h4" sx={{ mb: 5 }}>
//             Recent Posts
//           </Typography>

//           <Grid container spacing={3}>
//             {latestPosts?.slice(latestPosts.length - 4).map((latestPost) => (
//               <Grid
//                 key={latestPost.id}
//                 size={{
//                   xs: 12,
//                   sm: 6,
//                   md: 4,
//                   lg: 3,
//                 }}
//               >
//                 <PostItem post={latestPost} detailsHref={paths.post.details(latestPost.title)} />
//               </Grid>
//             ))}
//           </Grid>
//         </Container>
//       )}
//     </>
//   );
// }

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { PostItem } from '../post-item';
import { PostDetailsSkeleton } from '../post-skeleton';

export function PostDetailsHomeView({ post, latestPosts = [], loading, error }) {
  if (loading) return <PostDetailsSkeleton />;

  if (error) {
    return (
      <Container maxWidth={false} sx={{ py: 10, px: { xs: 2, sm: 4, md: '20%' } }}>
        <EmptyContent
          filled
          title="Post not found!"
          action={
            <Button
              component={RouterLink}
              href={paths.post.root}
              startIcon={<Iconify width={16} icon="eva:arrow-ios-back-fill" />}
              sx={{ mt: 3 }}
            >
              Back to list
            </Button>
          }
        />
      </Container>
    );
  }

  return (
    <>
      {/* Breadcrumbs */}
      <Container maxWidth={false} sx={{ py: 3, px: { xs: 2, sm: 4, md: '20%' } }}>
        <CustomBreadcrumbs
          links={[
            { name: 'Home', href: '/' },
            { name: 'Blog', href: paths.post.root },
            { name: post?.title },
          ]}
          sx={{ width: '100%' }}
        />
      </Container>

      {/* Post Image */}
      {post?.imageUrl && (
        <Box sx={{ my: 4, px: { xs: 2, sm: 4, md: '20%' } }}>
          <img
            // src={`http://10.208.10.194:82${post?.imageUrl}`}
            src={`https://cipie.in${post?.imageUrl}`}
            alt={post?.title}
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: 12,
              display: 'block',
              boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
            }}
          />
        </Box>
      )}

      {/* Post Content */}
      <Box
        sx={{
          width: '100%',
          px: { xs: 2, sm: 3, md: 4 },
          py: { xs: 3, sm: 4, md: 5 },
          maxWidth: { xs: '100%', sm: '90%', md: '60%' },
          mx: 'auto',
          backgroundColor: '#fff',
          borderRadius: 4,
          boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
          fontSize: { xs: 14, sm: 15, md: 16 },
          lineHeight: 1.7,
          color: '#1d1d1d',
          mb: 8,
          '& h1': { fontSize: { xs: '24px', sm: '28px', md: '34px' }, fontWeight: 700, mt: 3, mb: 2 },
          '& h2': { fontSize: { xs: '20px', sm: '24px', md: '28px' }, fontWeight: 600, mt: 3, mb: 2 },
          '& h3': { fontSize: { xs: '18px', sm: '20px', md: '22px' }, fontWeight: 500, mt: 2, mb: 1.5 },
          '& p': { mb: 2 },
          '& ul, & ol': { pl: 4, mb: 2 },
          '& li': { mb: 1 },
          '& img': { display: 'block', maxWidth: '100%', height: 'auto', margin: '20px 0', borderRadius: 6 },
          '& table': { width: '100%', borderCollapse: 'collapse', my: 3 },
          '& th, & td': { border: '1px solid #ddd', padding: 10 },
        }}
        dangerouslySetInnerHTML={{ __html: post?.wordContent || '' }}
      />

      {/* Latest Posts */}
      {latestPosts?.length > 0 && (
        <Box sx={{ width: '100%', px: { xs: 2, sm: 3, md: '20%' }, mb: 10 }}>
          <Typography variant="h4" sx={{ mb: 5 }}>
            Recent Posts
          </Typography>
          <Grid container spacing={3}>
            {latestPosts.slice(-4).map((latestPost) => (
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