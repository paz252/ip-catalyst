import { orderBy } from 'es-toolkit';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';

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

import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/global-config';
import { useGetBlogs } from 'src/actions/resource_';
import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import ResourceListSkeleton from './ResourceListSkeleton';

export function ResourceListView() {
  const navigate = useNavigate();

  // ✅ ONLY USE HOOK
  const { blogs = [], blogsLoading } = useGetBlogs();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(6);

  const dataFiltered = useMemo(() => {
    const blogList = Array.isArray(blogs) ? blogs : [];

    const filtered = blogList.filter(
      (post) =>
        post.title?.toLowerCase().includes(search.toLowerCase()) ||
        post.description?.toLowerCase().includes(search.toLowerCase())
    );

    return orderBy(filtered, ['createdAt'], ['desc']);
  }, [blogs, search]);

  const totalPages = Math.max(1, Math.ceil(dataFiltered.length / rowsPerPage));

  const paginatedData = dataFiltered.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  useEffect(() => {
    if (page > totalPages) {
      setPage(1);
    }
  }, [dataFiltered, totalPages]);

  return (
    <DashboardContent sx={{ mb: 10 }}>
      <CustomBreadcrumbs
        heading="Resources"
        links={[
          { name: 'Home', href: '/' },
          { name: 'Resource', href: paths.resources.root },
          { name: 'List' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <Box sx={{ mb: 3 }}>
        <input
          type="text"
          placeholder="Search resources..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          style={{
            padding: '8px 12px',
            width: '100%',
            maxWidth: '300px',
            borderRadius: '6px',
            border: '1px solid #ccc',
          }}
        />
      </Box>

      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          },
        }}
      >
        {/* ✅ Skeleton */}
        {blogsLoading && <ResourceListSkeleton />}

        {/* ✅ Data */}
        {!blogsLoading &&
          paginatedData.map((post) => (
            <Card key={post.id}>
              <CardActionArea onClick={() => navigate(`/resources/${post.id}`)}>
                {post.imageUrl && (
                  <CardMedia
                    component="img"
                    // image={`${CONFIG.blog}${post.imageUrl}`}
                    image={`${CONFIG.blog}${post.imageUrl}`}
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
                    }}
                  >
                    {post.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, gap: 2 }}>
        <Button
          variant="outlined"
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
        >
          Prev
        </Button>

        <Typography>
          Page {page} of {totalPages}
        </Typography>

        <Button
          variant="outlined"
          disabled={page === totalPages}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </Button>
      </Box>
    </DashboardContent>
  );
}
