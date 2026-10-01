import { useState } from 'react';
import { useNavigate } from 'react-router';

import { Box, Card, Chip, Stack, TextField, Typography } from '@mui/material';

import { NEWS_DATA } from 'src/config/news-data';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

export default function NewsListPage() {
  const [search, setSearch] = useState('');

  // const filteredNews = [...NEWS_DATA]
  //   .sort((a, b) => new Date(b.date) - new Date(a.date))
  //   .filter((item) => item.title.toLowerCase().includes(search.toLowerCase()));

  const filteredNews = [...NEWS_DATA]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .filter((item) => {
      const searchTerm = search.toLowerCase();

      const titleMatch = item.title.toLowerCase().includes(searchTerm);

      const descriptionText = Array.isArray(item.description)
        ? item.description.join(' ')
        : item.description || '';

      const descriptionMatch = descriptionText.toLowerCase().includes(searchTerm);

      return titleMatch || descriptionMatch;
    });

  return (
    <Box sx={{ py: { xs: 4, md: 6 }, px: { xs: 2, md: 6 } }}>
      {/* Header */}

      <CustomBreadcrumbs links={[{ name: 'Home', href: '/' }, { name: 'News' }]} sx={{ mb: 3 }} />

      <Typography variant="h4" fontWeight={700} mb={1}>
        News & Announcements
      </Typography>

      <Typography variant="body2" color="text.secondary" mb={3}>
        Stay updated with the latest patent grants, innovations, and announcements.
      </Typography>

      {/* 🔍 Search */}
      <TextField
        fullWidth
        placeholder="Search news..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 4 }}
      />

      {/* News List */}
      <Stack spacing={2}>
        {filteredNews.map((news) => (
          <NewsListItem key={news.slug} news={news} />
        ))}
      </Stack>

      {/* Empty State */}
      {!filteredNews.length && (
        <Typography sx={{ mt: 4 }} color="text.secondary">
          No news found.
        </Typography>
      )}
    </Box>
  );
}

function NewsListItem({ news }) {
  const navigate = useNavigate();
  const descriptionPreview = Array.isArray(news.description)
    ? news.description[0]
    : news.description;

  return (
    <Card
      onClick={() => navigate(`/news/${news.slug}`)}
      sx={{
        p: 2.5,
        borderRadius: 3,
        cursor: 'pointer',
        transition: 'all 0.25s ease',

        '&:hover': {
          boxShadow: 6,
          transform: 'translateY(-4px)',
        },
      }}
    >
      {/* Title + Badge */}
      <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
        <Typography variant="subtitle1" fontWeight={700}>
          {news.title}
        </Typography>

        {news.isNew && <BlinkBadge />}
      </Stack>

      {/* Description */}
      <Typography
        variant="body2"
        sx={{
          mb: 1,
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: 1,
          overflow: 'hidden',
        }}
      >
        {descriptionPreview}
      </Typography>

      {/* Metadata */}
      {(news.patentNo || news.applicationNo || news.patentStatus) && (
        <Stack direction="row" spacing={2} flexWrap="wrap" mb={1}>
          {news.patentNo && (
            <Chip size="small" label={`Patent: ${news.patentNo}`} color="primary" />
          )}
          {news.applicationNo && (
            <Chip size="small" label={`App: ${news.applicationNo}`} color="info" />
          )}
          {news.patentStatus && (
            <Chip label={`Status: ${news.patentStatus}`} color="warning" size="small" />
          )}
        </Stack>
      )}

      {/* Footer */}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="caption" color="text.secondary">
          {news.date}
        </Typography>

        {/* <Box
          sx={{
            fontSize: 12,
            fontWeight: 700,
            color: 'primary.main',
          }}
        >
          View Details →
        </Box> */}
      </Stack>
    </Card>
  );
}

export function BlinkBadge() {
  return (
    <Box
      sx={{
        px: 0.8,
        py: 0.2,
        fontSize: 10,
        fontWeight: 700,
        borderRadius: 1,
        bgcolor: 'error.main',
        color: '#fff',
        animation: 'blink 1.2s infinite',
        '@keyframes blink': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.3 },
        },
      }}
    >
      NEW
    </Box>
  );
}
