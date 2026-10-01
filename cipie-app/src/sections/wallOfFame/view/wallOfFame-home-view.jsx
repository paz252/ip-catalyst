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

import { Iconify } from 'src/components/iconify';

export function WallOfFameHomeView() {
  const [selectedPost, setSelectedPost] = useState(null);

  // ✅ Static Hardcoded Data
  const [posts] = useState([
    {
      id: 1,
      title: 'Dr. A. Seema – Nari Shakti Puraskar (2019)',
      description: [
        'Dr. A. Seema is an eminent Indian scientist from the Centre for Materials for Electronics Technology (CMET), Thrissur, Kerala. She led a pioneering research team that developed an innovative wearable device—a smart bra capable of indicating the presence of breast cancer by detecting abnormalities in breast tissue.Her breakthrough contribution in the field of sensors and healthcare technology earned her national recognition, and she was conferred the prestigious Nari Shakti Puraskar in 2019 for her outstanding scientific achievement and societal impact.',
      ],
      imagePath: '/assets/images/fame/wall-of-fame1.png',
      createdAt: '2019-01-01',
    },
    {
      id: 2,
      title: 'C-DAC Chennai Signs Technology Transfer Agreement for NLOS VICINITY and ILLUMINATE',
      description: [
        'The Centre for Development of Advanced Computing (C-DAC), Chennai, under the Ministry of Electronics & Information Technology (MeitY), has signed a Transfer of Technology (ToT) agreement with Nav Wireless Technologies Pvt. Ltd. for commercialization of two innovative technologies — NLOS VICINITY and ILLUMINATE. The agreement was formalized on 28 November 2024 at Electronics Niketan, New Delhi by Dr. D. Ethirajan, Scientist-F and Centre Head of C-DAC Chennai, and Hardik Raval, Head of Embedded Department, Nav Wireless Technologies Pvt. Ltd',
      ],
      imagePath: '/assets/images/fame/wall-of-fame2.jpg',
      createdAt: '2024-11-28',
      link: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2078861&reg=3&lang=2',
    },
    {
      id: 3,
      title: `Prama India and Government of India's C-DAC (MeitY) Announce Partnership for Thermal Camera Technology`,
      description: [
        'Prama India and Government of India’s C-DAC (MeitY) recently announced a technology partnership through the ‘Transfer of Technology’ (ToT) Pact for Thermal Cameras with Centre for Development of Advanced Computing (C-DAC), Ministry of Electronics & Information Technology (MeitY), Government of India. The ToT (Transfer of Technology) agreement with (C-DAC) enables Prama India as a technology partner to manufacture, market and support the innovative solutions. With this significant initiative, Prama India has created a new benchmark in the Indian Security Industry. This new initiative by Prama India will bolster R&D and help to develop innovative thermal technology applications.',
      ],
      imagePath: '/assets/images/fame/wall-of-fame3.jpg',
      imagePath2: '/assets/images/fame/wall-of-fame3.2.jpg',
      createdAt: '2024-02-09',
      link: 'https://www.newsvoir.com/release/prama-india-and-government-of-india-s-c-dac-meity-announce-partnership-for-thermal-camera-technology-27338.html',
    },
    {
      id: 4,
      title: `C-DAC Completes Transfer of Technology for VIVAN – Brain-Computer Interface (BCI) to Aerobe Pvt. Ltd.
`,
      description: [
        'Not only advancing the frontiers of technology but equally committed to creating change at the grassroot level, C-DAC has always believed in bridging the gap between laboratory research and real-world impact. True to this spirit, C-DAC Delhi has achieved a significant milestone with the successful Transfer of Technology (ToT) of VIVAN – Brain-Computer Interface (BCI) to Aerobe Pvt. Ltd. — placing the institute firmly at the neural frontier of assistive neurotechnology and reinforcing its commitment to inclusive, indigenous innovation.',
        'A Transfer of Technology is one of the most significant benchmarks in the lifecycle of any C-DAC project — it is the moment when years of rigorous research, iterative development, and institutional commitment culminate in a technology deemed ready to create impact beyond the laboratory. For C-DAC Delhi, this ToT for VIVAN – BCI is a great milestone and validation of its research excellence and its resolve to deliver indigenous innovations that matter.',
        'VIVAN – BCI is one of the well-functioning BCI in real-time, as reported by Experts’ testimonies.  This is a non-invasive brain-computer interface system developed by the Neurocognitive & AI Group at C-DAC Delhi. Having achieved huge popularity in Global AI Impact Summit, it has variant of applications like day-to-day need, mobile based communication and cognitive rehabilitation. ',
        "The technology was realised through the strategic direction of Sh. Jitender Singh, Centre Head, focused leadership of Dr. Priyanka Jain, Scientist 'F' & Head, Neurocognitive & AI Group, and the dedicated contributions of Mr. Rohit, Mr. Harsh Koria, Ms. Saumya Kushwaha and Mr. Abhijit Das — who remained the backbone of the team through every phase of the project. The process was further strengthened by the advisory role of and the valuable expertise of Sh. Subodh, C-DAC Thiruvananthapuram, whose contributions as part of the external committee were integral to the successful completion of the transfer. Sh. Chandan Kumar, Finance Manager and Mr. Apoorva Kohli, Scientist 'E' ensured seamless execution as core members of the ToT Committee, while the HR, Administration, and MMG Teams provided steadfast support throughout. ",
        'At the MoU Signing and ToT Ceremony, Mr. Anirudh Singhal, Founder & Managing Director, Aerobe Pvt. Ltd., shared his vision for deploying VIVAN – BCI at scale. The formal handover the technical resources was conducted in a structured session, marking the transition of this indigenous innovation into industry hands.',
      ],
      imagePath: '/assets/images/fame/wof-4.jpg',
      createdAt: '2026-02-09',
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
            md: 'repeat(3, 1fr)',
          },
        }}
      >
        {dataFiltered.map((post) => (
          <Card
            key={post.id}
            className="card-hover"
            sx={{
              // height: '100%',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              borderRadius: 1,
              border: (theme) => `1px solid ${theme.palette.divider}`,
              transition: 'all 0.25s ease',
              bgcolor: 'background.paper',

              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: (theme) => theme.shadows[8],
                bgcolor: 'grey.100',
              },
            }}
          >
            {post.imagePath && (
              <Box
                sx={{
                  overflow: 'hidden',
                }}
              >
                <CardMedia
                  component="img"
                  image={post.imagePath}
                  alt={post.title}
                  sx={{
                    height: 220,
                    objectFit: 'cover',
                    transition: 'transform 0.4s ease',

                    '.MuiCard-root:hover &': {
                      transform: 'scale(1.05)',
                    },
                  }}
                />
              </Box>
            )}

            <CardContent
              sx={{
                p: 2.5,
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 500,
                  lineHeight: 1.5,
                  mb: 2,
                  minHeight: 48,
                }}
              >
                {post.title}
              </Typography>

              <Box
                sx={{
                  mt: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  pt: 1.5,
                  borderTop: (theme) => `1px dashed ${theme.palette.divider}`,
                }}
              >
                <Typography
                  variant="body2"
                  fontWeight={600}
                  sx={{
                    color: '#1976d2',
                  }}
                >
                  Read More
                </Typography>

                <IconButton
                  onClick={() => setSelectedPost(post)}
                  edge="end"
                  size="small"
                  sx={{
                    // bgcolor: 'primary.lighter',

                    '&:hover': {
                      bgcolor: '#ddeeff',
                      transform: 'translateX(2px)',
                    },
                  }}
                >
                  <Iconify
                    icon="flowbite:arrow-right-outline"
                    width={20}
                    sx={{ color: '#1976d2' }}
                  />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
      <Dialog
        open={Boolean(selectedPost)}
        onClose={() => setSelectedPost(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            overflow: 'hidden',
            boxShadow: (theme) => theme.shadows[24],
          },
        }}
      >
        {selectedPost && (
          <>
            <DialogTitle
              sx={{
                px: 3,
                py: 2.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
                bgcolor: 'background.neutral',
              }}
            >
              <Typography variant="h6" fontWeight={700}>
                {selectedPost.title}
              </Typography>

              <IconButton
                onClick={() => setSelectedPost(null)}
                sx={{
                  bgcolor: 'background.paper',

                  '&:hover': {
                    bgcolor: 'grey.200',
                  },
                }}
              >
                <Iconify icon="mdi:close" width={20} />
              </IconButton>
            </DialogTitle>

            <DialogContent
              sx={{
                px: { xs: 2, md: 4 },
                py: 4,
              }}
            >
              {selectedPost.imagePath && (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    mb: 4,
                    mt: 4,
                  }}
                >
                  <Box
                    component="img"
                    src={selectedPost.imagePath}
                    alt={selectedPost.title}
                    sx={{
                      width: '100%',
                      maxWidth: 500,
                      maxHeight: 350,
                      objectFit: 'contain',
                      borderRadius: 3,
                      border: (theme) => `1px solid ${theme.palette.divider}`,
                      bgcolor: 'grey.100',
                      p: 1,
                    }}
                  />
                </Box>
              )}

              {/* <Typography
                variant="body1"
                sx={{
                  whiteSpace: 'pre-line',
                  lineHeight: 1.9,
                  color: 'text.secondary',
                  textAlign: 'justify',
                }}
              >
                {selectedPost.description}
              </Typography> */}

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2.5,
                }}
              >
                {selectedPost.description.map((paragraph, index) => (
                  <Typography
                    key={index}
                    variant="body1"
                    sx={{
                      lineHeight: 1.9,
                      color: 'text.secondary',
                      textAlign: 'justify',
                    }}
                  >
                    {paragraph}
                  </Typography>
                ))}
              </Box>

              {selectedPost.link && (
                <Box
                  sx={{
                    mt: 4,
                    pt: 3,
                    borderTop: (theme) => `1px dashed ${theme.palette.divider}`,
                  }}
                >
                  <Button
                    variant="contained"
                    // endIcon={<Iconify icon="solar:arrow-right-up-linear" width={18} />}
                    onClick={() => window.open(selectedPost.link, '_blank')}
                    sx={{
                      borderRadius: 2,
                      px: 2.5,
                      color: '#1976d2',
                      bgcolor: 'transparent',
                      '&:hover': { bgcolor: '#ddeeff' },
                    }}
                  >
                    Read Official Release
                  </Button>
                </Box>
              )}
            </DialogContent>
          </>
        )}
      </Dialog>
    </Container>
  );
}
