// import { useState, useEffect, useCallback } from 'react';

// import Box from '@mui/material/Box';
// import Chip from '@mui/material/Chip';
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

// import { POST_PUBLISH_OPTIONS } from 'src/_mock';
// import { DashboardContent } from 'src/layouts/dashboard';

// import { Iconify } from 'src/components/iconify';
// import { Markdown } from 'src/components/markdown';
// import { EmptyContent } from 'src/components/empty-content';

// import { PostDetailsSkeleton } from '../post-skeleton';
// import { PostDetailsHero } from '../post-details-hero';
// import { PostCommentList } from '../post-comment-list';
// import { PostCommentForm } from '../post-comment-form';
// import { PostDetailsToolbar } from '../post-details-toolbar';

// // ----------------------------------------------------------------------

// export function PostDetailsView({ post, loading, error }) {
//   const [publish, setPublish] = useState('');

//   const handleChangePublish = useCallback((newValue) => {
//     setPublish(newValue);
//   }, []);

//   useEffect(() => {
//     if (post) {
//       setPublish(post?.publish);
//     }
//   }, [post]);

//   if (loading) {
//     return (
//       <DashboardContent maxWidth={false} disablePadding>
//         <PostDetailsSkeleton />
//       </DashboardContent>
//     );
//   }

//   if (error) {
//     return (
//       <DashboardContent maxWidth={false}>
//         <EmptyContent
//           filled
//           title="Post not found!"
//           action={
//             <Button
//               component={RouterLink}
//               href={paths.dashboard.post.root}
//               startIcon={<Iconify width={16} icon="eva:arrow-ios-back-fill" />}
//               sx={{ mt: 3 }}
//             >
//               Back to list
//             </Button>
//           }
//           sx={{ py: 10, height: 'auto', flexGrow: 'unset' }}
//         />
//       </DashboardContent>
//     );
//   }

//   return (
//     <DashboardContent maxWidth={false} disablePadding>
//       <Container maxWidth={false} sx={{ px: { sm: 5 } }}>
//         <PostDetailsToolbar
//           backHref={paths.dashboard.post.root}
//           editHref={paths.dashboard.post.edit(`${post?.title}`)}
//           liveHref={paths.post.details(`${post?.title}`)}
//           publish={`${publish}`}
//           onChangePublish={handleChangePublish}
//           publishOptions={POST_PUBLISH_OPTIONS}
//         />
//       </Container>

//       <PostDetailsHero title={`${post?.title}`} coverUrl={`${post?.coverUrl}`} />

//       <Box
//         sx={{
//           pb: 5,
//           mx: 'auto',
//           maxWidth: 720,
//           mt: { xs: 5, md: 10 },
//           px: { xs: 2, sm: 3 },
//         }}
//       >
//         <Typography variant="subtitle1">{post?.description}</Typography>

//         <Markdown children={post?.content} />

//         <Stack
//           spacing={3}
//           sx={[
//             (theme) => ({
//               py: 3,
//               borderTop: `dashed 1px ${theme.vars.palette.divider}`,
//               borderBottom: `dashed 1px ${theme.vars.palette.divider}`,
//             }),
//           ]}
//         >
//           <Box sx={{ gap: 1, display: 'flex', flexWrap: 'wrap' }}>
//             {post?.tags.map((tag) => (
//               <Chip key={tag} label={tag} variant="soft" />
//             ))}
//           </Box>

//           <Box sx={{ display: 'flex', alignItems: 'center' }}>
//             <FormControlLabel
//               label={fShortenNumber(post?.totalFavorites)}
//               control={
//                 <Checkbox
//                   defaultChecked
//                   size="small"
//                   color="error"
//                   icon={<Iconify icon="solar:heart-bold" />}
//                   checkedIcon={<Iconify icon="solar:heart-bold" />}
//                   slotProps={{
//                     input: {
//                       id: 'favorite-checkbox',
//                       'aria-label': 'Favorite checkbox',
//                     },
//                   }}
//                 />
//               }
//               sx={{ mr: 1 }}
//             />

//             <AvatarGroup
//               sx={{
//                 [`& .${avatarGroupClasses.avatar}`]: {
//                   width: 32,
//                   height: 32,
//                 },
//               }}
//             >
//               {post?.favoritePerson.map((person) => (
//                 <Avatar key={person.name} alt={person.name} src={person.avatarUrl} />
//               ))}
//             </AvatarGroup>
//           </Box>
//         </Stack>

//         <Box sx={{ mb: 3, mt: 5, display: 'flex' }}>
//           <Typography variant="h4">Comments</Typography>

//           <Typography variant="subtitle2" sx={{ color: 'text.disabled' }}>
//             ({post?.comments.length})
//           </Typography>
//         </Box>

//         <PostCommentForm />

//         <Divider sx={{ mt: 5, mb: 2 }} />

//         <PostCommentList comments={post?.comments ?? []} />
//       </Box>
//     </DashboardContent>
//   );
// }


import { orderBy } from 'es-toolkit';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import CardContent from '@mui/material/CardContent';
import DialogContent from '@mui/material/DialogContent';
import CardActionArea from '@mui/material/CardActionArea';
// import VisibilityIcon from '@mui/icons-material/Visibility';


const API_URL = 'https://localhost:7077/api/events';
//const BLOG_ID = 'ee962a3b-1406-47e5-a8fd-748ae3308243'; // your working blog ID

export function PostDetailsView() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    setLoading(true);
    try {
      // const res = await fetch(`${API_URL}/${BLOG_ID}`);
      // const data = await res.json();
      // setPosts([data]); // single blog in array
      const res = await fetch(API_URL); // GET ALL BLOGS
      const data = await res.json();
      setPosts(data); // directly set array
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const dataFiltered = orderBy(posts, ['createdAt'], ['desc']);

  return (
    <Container sx={{ mb: 10 }}>
      <Typography variant="h4" sx={{ mb: 3, mt: { xs: 1, md: 3 } }}>
        Blog
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
        }}
      >
        {loading
          ? 'Loading...'
          : dataFiltered.map((post) => (
            <Card key={post.id}>
              <CardActionArea onClick={() => navigate(`/post/${post.id}`)}>
                {post.imageUrl && (
                  <CardMedia
                    component="img"
                    // height="160"
                    // image={`http://10.208.10.194:82${post.imageUrl}`}
                    image={`https://cipie.in${post?.imageUrl}`}
                    alt={post.title}
                  />
                )}
                <CardContent>
                  <Typography gutterBottom variant="h6">
                    {post.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 5,        // The magic number of lines
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {post.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
      </Box>
    </Container>
  );
}