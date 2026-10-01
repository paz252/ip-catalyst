import { orderBy } from 'es-toolkit';
import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import { Alert } from '@mui/material';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';

import { endpoints } from 'src/lib/axios';
import { CONFIG } from 'src/global-config';

import { EmptyContent } from 'src/components/empty-content';

import EventsListSkeleton from './EventsListSkeleton';

const API_URL = endpoints.event.list;

// console.log("Event Url", eventUrl)

export function EventListView() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(6); // 6 cards per page

  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();

      const sanitizedData = data.map((post) => ({
        id: post.id ?? null,
        title: post.title ?? '',
        description: post.description ?? '',
        location: post.location ?? '',
        imagePath: post.imagePath ?? '',
        date: post.date ?? null,
        externalUrl: post.externalUrl ?? null,
      }));

      setPosts(sanitizedData);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError(err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }

  function formatEventDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate();
    const year = date.getFullYear();
    const month = date.toLocaleString('default', { month: 'long' });

    const getSuffix = (d) => {
      if (d > 3 && d < 21) return 'th';
      switch (d % 10) {
        case 1:
          return 'st';
        case 2:
          return 'nd';
        case 3:
          return 'rd';
        default:
          return 'th';
      }
    };

    return `${day}${getSuffix(day)} ${month} ${year}`;
  }

  // 1. FILTER
  const dataFiltered = orderBy(
    posts.filter(
      (post) =>
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.description.toLowerCase().includes(search.toLowerCase()) ||
        post.location.toLowerCase().includes(search.toLowerCase())
    ),
    ['date'],
    ['desc']
  );

  // 2. PAGINATION CALC
  const totalPages = Math.max(1, Math.ceil(dataFiltered.length / rowsPerPage));

  const paginatedData = dataFiltered.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  // 3. EFFECT (AFTER everything is declared)
  useEffect(() => {
    if (page > totalPages) {
      setPage(1);
    }
  }, [dataFiltered, totalPages, page]);

  return (
    <Container sx={{ mb: 10 }}>
      <Typography variant="h4" sx={{ mb: 3, mt: { xs: 1, md: 3 } }}>
        Events
      </Typography>

      <input
        type="text"
        placeholder="Search events..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        style={{
          padding: '8px 12px',
          marginBottom: '20px',
          width: '250px', // 👈 make it small
          borderRadius: '6px',
          border: '1px solid #ccc',
          fontSize: '14px',
        }}
      />
      {loading ? (
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
          <EventsListSkeleton />
        </Box>
      ) : error ? (
        <Box sx={{ py: 6 }}>
          <Alert
            severity="error"
            action={
              <Button size="small" color="inherit" onClick={fetchPosts}>
                Retry
              </Button>
            }
          >
            Unable to load events. Please try again later.
          </Alert>
        </Box>
      ) : paginatedData.length === 0 ? (
        <EmptyContent
          title="No events found"
          description="There are no events available at the moment."
        />
      ) : (
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
          {/* dataFiltered.map((post) => ( */}
          {paginatedData.map((post) => (
            <Card key={post.id}>
              <CardActionArea
                onClick={() => {
                  if (post.externalUrl) {
                    window.open(post.externalUrl, '_blank');
                  } else if (post.id) {
                    navigate(`/events/${post.id}`);
                  } else {
                    console.error('Missing post.id', post);
                  }
                }}
              >
                {post.imagePath && (
                  <CardMedia
                    component="img"
                    image={`${CONFIG.event}${post.imagePath}`}
                    // image={post.imagePath}
                    alt={post.title}
                    sx={{
                      height: 220,
                      objectFit: 'cover',
                    }}
                  />
                )}

                <CardContent>
                  <Typography gutterBottom variant="h6">
                    {post.title}
                  </Typography>
                  {/* 
                {post.date && (
                  <Typography variant="body2" color="text.secondary">
                    📅 {formatEventDate(post.date)}
                  </Typography>
                )}

                {post.location && (
                  <Typography variant="body2" color="text.secondary">
                    📍 {post.location}
                  </Typography>
                )} */}

                  {post.date && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                    >
                      <Icon icon="solar:calendar-date-bold" width="18" height="18" />
                      {formatEventDate(post.date)}
                    </Typography>
                  )}

                  {post.location && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                    >
                      <Icon icon="mingcute:location-fill" width="18" height="18" />
                      {post.location}
                    </Typography>
                  )}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 5,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      mt: 1,
                    }}
                  >
                    {post.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Box>
      )}
      {!loading && !error && totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, gap: 1 }}>
          <Button disabled={page === 1} onClick={() => setPage((prev) => prev - 1)}>
            Prev
          </Button>

          <Typography sx={{ px: 2 }}>
            Page {page} of {totalPages}
          </Typography>

          <Button disabled={page === totalPages} onClick={() => setPage((prev) => prev + 1)}>
            Next
          </Button>
        </Box>
      )}
    </Container>
  );
}
