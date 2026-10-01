// import { useState } from 'react';
// import { orderBy } from 'es-toolkit';

// import Box from '@mui/material/Box';
// import Container from '@mui/material/Container';
// import Typography from '@mui/material/Typography';

// import { paths } from 'src/routes/paths';

// import { POST_SORT_OPTIONS } from 'src/_mock';

// import { EmptyContent } from 'src/components/empty-content';

// import { PostList } from '../post-list';
// import { PostSort } from '../post-sort';
// import { PostSearch } from '../post-search';

// // ----------------------------------------------------------------------

// export function PostListHomeView({ posts, loading }) {
//   const [sortBy, setSortBy] = useState('latest');

//   const dataFiltered = applyFilter({ inputData: posts, sortBy });

//   const renderNoData = () => <EmptyContent filled sx={{ py: 10 }} />;

//   const isEmpty = !loading && !posts.length;

//   return (
//     <Container sx={{ mb: 10 }}>
//       <Typography variant="h4" sx={[{ mb: 3, mt: { xs: 1, md: 3 } }]}>
//         Blog
//       </Typography>

//       <Box
//         sx={[
//           {
//             gap: 3,
//             display: 'flex',
//             mb: { xs: 3, md: 5 },
//             justifyContent: 'space-between',
//             flexDirection: { xs: 'column', sm: 'row' },
//             alignItems: { xs: 'flex-end', sm: 'center' },
//           },
//         ]}
//       >
//         <PostSearch redirectPath={(title) => paths.post.details(title)} />

//         <PostSort
//           sort={sortBy}
//           onSort={(newValue) => setSortBy(newValue)}
//           sortOptions={POST_SORT_OPTIONS}
//         />
//       </Box>

//       {isEmpty ? renderNoData() : <PostList posts={dataFiltered} loading={loading} />}
//     </Container>
//   );
// }

// // ----------------------------------------------------------------------

// function applyFilter({ inputData, sortBy }) {
//   if (sortBy === 'latest') {
//     return orderBy(inputData, ['createdAt'], ['desc']);
//   }

//   if (sortBy === 'oldest') {
//     return orderBy(inputData, ['createdAt'], ['asc']);
//   }

//   if (sortBy === 'popular') {
//     return orderBy(inputData, ['totalViews'], ['desc']);
//   }

//   return inputData;
// }
// import { useState } from 'react';
// import { orderBy } from 'es-toolkit';

// import Box from '@mui/material/Box';
// import Container from '@mui/material/Container';
// import Typography from '@mui/material/Typography';

// import { paths } from 'src/routes/paths';

// import { POST_SORT_OPTIONS } from 'src/_mock';

// import { EmptyContent } from 'src/components/empty-content';

// import { PostList } from '../post-list';
// import { PostSort } from '../post-sort';
// import { PostSearch } from '../post-search';

// // ----------------------------------------------------------------------

// export function PostListHomeView({ posts, loading }) {
//   const [sortBy, setSortBy] = useState('latest');

//   const dataFiltered = applyFilter({ inputData: posts, sortBy });

//   const renderNoData = () => <EmptyContent filled sx={{ py: 10 }} />;

//   const isEmpty = !loading && !posts.length;

//   return (
//     <Container sx={{ mb: 10 }}>
//       <Typography variant="h4" sx={[{ mb: 3, mt: { xs: 1, md: 3 } }]}>
//         Blog
//       </Typography>

//       <Box
//         sx={[
//           {
//             gap: 3,
//             display: 'flex',
//             mb: { xs: 3, md: 5 },
//             justifyContent: 'space-between',
//             flexDirection: { xs: 'column', sm: 'row' },
//             alignItems: { xs: 'flex-end', sm: 'center' },
//           },
//         ]}
//       >
//         <PostSearch redirectPath={(title) => paths.post.details(title)} />

//         <PostSort
//           sort={sortBy}
//           onSort={(newValue) => setSortBy(newValue)}
//           sortOptions={POST_SORT_OPTIONS}
//         />
//       </Box>

//       {isEmpty ? renderNoData() : <PostList posts={dataFiltered} loading={loading} />}
//     </Container>
//   );
// }

// // ----------------------------------------------------------------------

// function applyFilter({ inputData, sortBy }) {
//   if (sortBy === 'latest') {
//     return orderBy(inputData, ['createdAt'], ['desc']);
//   }

//   if (sortBy === 'oldest') {
//     return orderBy(inputData, ['createdAt'], ['asc']);
//   }

//   if (sortBy === 'popular') {
//     return orderBy(inputData, ['totalViews'], ['desc']);
//   }

//   return inputData;
// }
// import { orderBy } from 'es-toolkit';
// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// import Box from '@mui/material/Box';
// import Card from '@mui/material/Card';
// import Chip from '@mui/material/Chip';
// import Dialog from '@mui/material/Dialog';
// import Button from '@mui/material/Button';
// import Container from '@mui/material/Container';
// import CardMedia from '@mui/material/CardMedia';
// import Typography from '@mui/material/Typography';
// import DialogTitle from '@mui/material/DialogTitle';
// import CardContent from '@mui/material/CardContent';
// import DialogContent from '@mui/material/DialogContent';
// import CardActionArea from '@mui/material/CardActionArea';
// import VisibilityIcon from '@mui/icons-material/Visibility';


// const API_URL = 'http://10.208.10.194:82/blogs';
// //const BLOG_ID = 'ee962a3b-1406-47e5-a8fd-748ae3308243'; // your working blog ID

// export function PostListHomeView() {
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchPosts();
//   }, []);

//   async function fetchPosts() {
//     setLoading(true);
//     try {
//       // const res = await fetch(`${API_URL}/${BLOG_ID}`);
//       // const data = await res.json();
//       // setPosts([data]); // single blog in array
//       const res = await fetch(API_URL); // GET ALL BLOGS
//       const data = await res.json();
//     setPosts(data); // directly set array
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   }

//   const dataFiltered = orderBy(posts, ['createdAt'], ['desc']);

//   return (
//     <Container sx={{ mb: 10 }}>
//       <Typography variant="h4" sx={{ mb: 3, mt: { xs: 1, md: 3 } }}>
//         Blog
//       </Typography>

//       <Box
//         sx={{
//           display: 'grid',
//           gap: 3,
//           gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
//         }}
//       >
//         {loading
//           ? 'Loading...'
//           : dataFiltered.map((post) => (
//               <Card key={post.id}>
//                 <CardActionArea onClick={() => navigate(`/post/${post.id}`)}>
//                   {post.imageUrl && (
//                     <CardMedia
//                       component="img"
//                       // height="160"
//                       image={`http://10.208.10.194:82${post.imageUrl}`}
//                       alt={post.title}
//                     />
//                   )}
//                   <CardContent>
//                     <Typography gutterBottom variant="h6">
//                       {post.title}
//                     </Typography>
//                     <Typography
//                       variant="body2"
//                       color="text.secondary"
//                       sx={{
//                         display: '-webkit-box',
//                         WebkitLineClamp: 5,        // The magic number of lines
//                         WebkitBoxOrient: 'vertical',
//                         overflow: 'hidden',
//                         textOverflow: 'ellipsis',
//                       }}
//                     >
//                       {post.description}
//                     </Typography>
//                   </CardContent>
//                 </CardActionArea>
//               </Card>
//             ))}
//       </Box>
//     </Container>
//   );
// }

import { orderBy } from 'es-toolkit';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import CardMedia from '@mui/material/CardMedia';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';

import PostListHomeSkeleton from './post-home-view-skeleton';


// const API_URL = 'http://10.208.10.194:82/blogs';
const API_URL = 'https://cipie.in/blogs';

export function PostListHomeView() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6; // posts per page

  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // Filter by search term
  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.description.toLowerCase().includes(search.toLowerCase())
  );

  // Sort
  const sortedPosts = orderBy(filteredPosts, ['createdAt'], [sortOrder]);

  // Pagination
  const totalPages = Math.ceil(sortedPosts.length / pageSize);
  const paginatedPosts = sortedPosts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <Container sx={{ mb: 10 }}>
      <Typography variant="h4" sx={{ mb: 3, mt: { xs: 1, md: 3 } }}>
        Blog
      </Typography>

      {/* Search & Sort Controls */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <TextField
          label="Search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1); // reset page on search
          }}
        />
        <Select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <MenuItem value="desc">Newest First</MenuItem>
          <MenuItem value="asc">Oldest First</MenuItem>
        </Select>
      </Stack>

      {/* Blog Grid */}
      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
        }}
      >
        {loading ? (
       <PostListHomeSkeleton/>
        ) : paginatedPosts.length === 0 ? (
          <Typography>No posts found</Typography>
        ) : (
          paginatedPosts.map((post) => (
            <Card key={post.id}>
              <CardActionArea onClick={() => navigate(`/post/${post.id}`)}>
                {post.imageUrl && (
                  <CardMedia
                    component="img"
                    // image={`http://10.208.10.194:82${post.imageUrl}`}
                    image={`https://cipie.in${post.imageUrl}`}
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
                      WebkitLineClamp: 5,
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
          ))
        )}
      </Box>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <Stack alignItems="center" sx={{ mt: 4 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(e, page) => setCurrentPage(page)}
            color="primary"
          />
        </Stack>
      )}
    </Container>
  );
}