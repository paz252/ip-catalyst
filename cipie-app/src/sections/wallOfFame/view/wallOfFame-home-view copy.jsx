import { useState } from 'react';
import { orderBy } from 'es-toolkit';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
// import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import CardContent from '@mui/material/CardContent';
import DialogContent from '@mui/material/DialogContent';
import CardActionArea from '@mui/material/CardActionArea';

import { Iconify } from 'src/components/iconify';

export function WallOfFameHomeView() {
  const [selectedPost, setSelectedPost] = useState(null);

  // ✅ Static Hardcoded Data
  const [posts] = useState([
    {
      id: 1,
      title: 'Dr. A. Seema – Nari Shakti Puraskar (2019)',
      description:
        'Dr. A. Seema is an eminent Indian scientist from the Centre for Materials for Electronics Technology (CMET), Thrissur, Kerala. She led a pioneering research team that developed an innovative wearable device—a smart bra capable of indicating the presence of breast cancer by detecting abnormalities in breast tissue.Her breakthrough contribution in the field of sensors and healthcare technology earned her national recognition, and she was conferred the prestigious Nari Shakti Puraskar in 2019 for her outstanding scientific achievement and societal impact.',
      imagePath: '/assets/images/fame/wall-of-fame1.png',
      createdAt: '2019-01-01',
    },
    {
      id: 2,
      title: 'C-DAC Chennai Signs Technology Transfer Agreement for NLOS VICINITY and ILLUMINATE',
      description:
        'The Centre for Development of Advanced Computing (C-DAC), Chennai, under the Ministry of Electronics & Information Technology (MeitY), has signed a Transfer of Technology (ToT) agreement with Nav Wireless Technologies Pvt. Ltd. for commercialization of two innovative technologies — NLOS VICINITY and ILLUMINATE. The agreement was formalized on 28 November 2024 at Electronics Niketan, New Delhi by Dr. D. Ethirajan, Scientist-F and Centre Head of C-DAC Chennai, and Hardik Raval, Head of Embedded Department, Nav Wireless Technologies Pvt. Ltd',
      imagePath: '/assets/images/fame/wall-of-fame2.jpg',
      createdAt: '2024-11-28',
      link: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2078861&reg=3&lang=2',
    },
    {
      id: 3,
      title: `Prama India and Government of India's C-DAC (MeitY) Announce Partnership for Thermal Camera Technology`,
      description:
        'Prama India and Government of India’s C-DAC (MeitY) recently announced a technology partnership through the ‘Transfer of Technology’ (ToT) Pact for Thermal Cameras with Centre for Development of Advanced Computing (C-DAC), Ministry of Electronics & Information Technology (MeitY), Government of India. The ToT (Transfer of Technology) agreement with (C-DAC) enables Prama India as a technology partner to manufacture, market and support the innovative solutions. With this significant initiative, Prama India has created a new benchmark in the Indian Security Industry. This new initiative by Prama India will bolster R&D and help to develop innovative thermal technology applications.',
      imagePath: '/assets/images/fame/wall-of-fame3.jpg',
      imagePath2: '/assets/images/fame/wall-of-fame3.2.jpg',
      createdAt: '2024-02-09',
      link: 'https://www.newsvoir.com/release/prama-india-and-government-of-india-s-c-dac-meity-announce-partnership-for-thermal-camera-technology-27338.html',
    },
    {
      id: 4,
      title: `C-DAC Completes Transfer of Technology for VIVAN – Brain-Computer Interface (BCI) to Aerobe Pvt. Ltd.
`,
      description:
        'Prama India and Government of India’s C-DAC (MeitY) recently announced a technology partnership through the ‘Transfer of Technology’ (ToT) Pact for Thermal Cameras with Centre for Development of Advanced Computing (C-DAC), Ministry of Electronics & Information Technology (MeitY), Government of India. The ToT (Transfer of Technology) agreement with (C-DAC) enables Prama India as a technology partner to manufacture, market and support the innovative solutions. With this significant initiative, Prama India has created a new benchmark in the Indian Security Industry. This new initiative by Prama India will bolster R&D and help to develop innovative thermal technology applications.',
      imagePath: '/assets/images/fame/wall-of-fame3.jpg',
      imagePath2: '/assets/images/fame/wall-of-fame3.2.jpg',
      createdAt: '2024-02-09',
      link: 'https://www.newsvoir.com/release/prama-india-and-government-of-india-s-c-dac-meity-announce-partnership-for-thermal-camera-technology-27338.html',
    },
  ]);

  const dataFiltered = orderBy(posts, ['createdAt'], ['desc']);

  return (
    <Container sx={{ mb: 10, mt: { xs: 3, md: 5 } }}>
      {/* <Typography variant="h4" sx={{ mb: 3, mt: { xs: 1, md: 3 } }}>
        Wall of Fame
      </Typography> */}

      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)',
          },
        }}
      >
        {dataFiltered.map((post) => (
          <Card key={post.id}>
            <CardActionArea>
              {post.imagePath && (
                <CardMedia component="img" image={post.imagePath} alt={post.title} />
              )}

              <CardContent sx={{ p: 2 }}>
                <Typography gutterBottom variant="body2" fontWeight="600">
                  {post.title}
                </Typography>

                {/* <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {post.description}
                </Typography> */}

                {/* {(post.imagePath2) && (
                  <CardMedia
                    component="img"
                    image={post.imagePath2}
                    alt={post.title}
                  />
                )
                } */}

                {/* <Button
                  size="small"
                  sx={{ mt: 2, color: '#1976d2', fontWeight: '600' }}
                  onClick={() => setSelectedPost(post)}
                >
                  Read More
                </Button> */}

                {/* <Button
                  size="small"
                  sx={{ mt: 2, color: '#1976d2', fontWeight: '600' }}
                  onClick={() => setSelectedPost(post)}
                  endIcon={<Iconify icon="flowbite:arrow-right-outline" width={20} />}
                >
                  Read More
                </Button> */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    // gap: 0.5,
                    // mt: 2,
                    cursor: 'pointer',
                  }}
                >
                  <Typography variant="body2" fontWeight={500} sx={{ color: '#2085e8' }}>
                    Read More
                  </Typography>
                  <IconButton onClick={() => setSelectedPost(post)} edge="end">
                    <Iconify
                      icon="flowbite:arrow-right-outline"
                      width={25}
                      sx={{ color: '#2085e8' }}
                    />
                  </IconButton>
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>
      <Dialog
        open={Boolean(selectedPost)}
        onClose={() => setSelectedPost(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedPost && (
          <>
            <DialogTitle
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              {selectedPost.title}

              <IconButton onClick={() => setSelectedPost(null)}>
                <Iconify icon="mdi:close" />
                {/* <Iconify icon="solar:close-circle-bold" /> */}
              </IconButton>
            </DialogTitle>

            <DialogContent dividers>
              {selectedPost.imagePath && (
                <Box
                  component="img"
                  src={selectedPost.imagePath}
                  alt={selectedPost.title}
                  sx={{
                    width: '100%',
                    height: 'auto', // ✅ very important
                    objectFit: 'contain', // ✅ show full image
                    mb: 3,
                    borderRadius: 2,
                  }}
                />
              )}

              <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                {selectedPost.description}
              </Typography>

              {selectedPost.link && (
                <Button sx={{ mt: 3 }} onClick={() => window.open(selectedPost.link, '_blank')}>
                  Read Official Release
                </Button>
              )}
            </DialogContent>
          </>
        )}
      </Dialog>
    </Container>
  );
}
