import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import { endpoints } from 'src/lib/axios';
import { CONFIG } from 'src/global-config';

import { Iconify } from 'src/components/iconify';

import EventDetailsSkeleton from './EventDetailsSkeleton';

export function EventDetailsView() {
  const { id } = useParams();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitStatus, setSubmitStatus] = useState(null);
  // null | 'success' | 'error'

  const [openRegister, setOpenRegister] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    organization: '',
  });
  const [isMobile, setIsMobile] = useState(false);

  const EVENT_DETAILS_URL = endpoints.event.details(id);

  const EVENT_REGISTER_URL = endpoints.event.register;

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 600);

    check(); // initial check
    window.addEventListener('resize', check);

    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    fetch(EVENT_DETAILS_URL)
      .then((res) => res.json())
      .then((data) => {
        setEvent(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const parseTime = (timeStr) => {
    if (!timeStr) return 0;

    // split "01:15PM - 02:00 PM"
    const start = timeStr.split('-')[0].trim();

    // normalize: 01:15PM → 01:15 PM
    const match = start.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);

    if (!match) return 0;

    let hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    const modifier = match[3].toUpperCase();

    if (modifier === 'PM' && hours !== 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;

    return hours * 60 + minutes;
  };

  const getEmbedUrl = (url) => {
    if (!url) return '';

    if (url.includes('embed')) {
      return url;
    }

    if (url.includes('maps.app.goo.gl')) {
      return '';
    }

    if (url.includes('google.com/maps')) {
      return url.replace('/maps/', '/maps/embed?');
    }

    return url;
  };
  const handleOpenRegister = () => setOpenRegister(true);
  const handleCloseRegister = () => setOpenRegister(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    // 👇 LIVE VALIDATION (ADD THIS)
    setErrors((prev) => {
      const newErrors = { ...prev };

      const nameRegex = /^[a-zA-Z\s]{2,50}$/;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const mobileRegex = /^[6-9]\d{9}$/;
      const orgRegex = /^[a-zA-Z0-9\s,.&-]{2,100}$/;

      if (name === 'name') {
        if (!value) newErrors.name = 'Name is required';
        else if (!nameRegex.test(value)) newErrors.name = 'Invalid name';
        else delete newErrors.name;
      }

      if (name === 'email') {
        if (!value) newErrors.email = 'Email is required';
        else if (!emailRegex.test(value)) newErrors.email = 'Invalid email';
        else delete newErrors.email;
      }

      if (name === 'mobile') {
        if (!value) newErrors.mobile = 'Mobile is required';
        else if (!mobileRegex.test(value)) newErrors.mobile = 'Invalid mobile';
        else delete newErrors.mobile;
      }

      if (name === 'organization') {
        if (!value) newErrors.organization = 'Organization is required';
        else if (!orgRegex.test(value)) newErrors.organization = 'Invalid organization';
        else delete newErrors.organization;
      }

      return newErrors;
    });
  };

  const validateForm = () => {
    const nameRegex = /^[a-zA-Z\s]{2,50}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[6-9]\d{9}$/;
    const orgRegex = /^[a-zA-Z0-9\s,.&-]{2,100}$/;

    const newErrors = {};

    if (!formData.name) newErrors.name = 'Name is required';
    else if (!nameRegex.test(formData.name)) newErrors.name = 'Invalid name';

    if (!formData.email) newErrors.email = 'Email is required';
    else if (!emailRegex.test(formData.email)) newErrors.email = 'Invalid email';

    if (!formData.mobile) newErrors.mobile = 'Mobile is required';
    else if (!mobileRegex.test(formData.mobile)) newErrors.mobile = 'Invalid mobile';

    if (!formData.organization) newErrors.organization = 'Organization is required';
    else if (!orgRegex.test(formData.organization)) newErrors.organization = 'Invalid organization';

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // const handleSubmit = async () => {
  //   setSubmitted(true); // 👈 KEY FIX

  //   if (!validateForm()) return;

  //   const payload = {
  //     Name: formData.name.trim(),
  //     Email: formData.email.trim(),
  //     MobileNumber: formData.mobile.trim(),
  //     Organization: formData.organization.trim(),
  //     EventId: id,
  //   };

  //   const res = await fetch(`${CONFIG.event}/api/Events/register`, {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify(payload),
  //   });

  //   if (res.ok) {
  //     setOpenRegister(false);
  //     setFormData({ name: '', email: '', mobile: '', organization: '' });
  //     setErrors({});
  //     setSubmitted(false); // reset
  //   }
  // };

  const handleSubmit = async () => {
    setSubmitted(true);
    setSubmitStatus(null); // reset old message

    const isValid = validateForm();
    if (!isValid) return; // 👈 if invalid, STOP here

    try {
      const res = await fetch(EVENT_REGISTER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Name: formData.name.trim(),
          Email: formData.email.trim(),
          MobileNumber: formData.mobile.trim(),
          Organization: formData.organization.trim(),
          EventId: id,
        }),
      });

      const result = await res.json().catch(() => null);

      if (res.ok) {
        setSubmitStatus('success');

        // 👇 show success for a short moment (optional but nice UX)
        setTimeout(() => {
          setOpenRegister(false); // ✅ CLOSE DIALOG AUTOMATICALLY
        }, 800);

        setFormData({
          name: '',
          email: '',
          mobile: '',
          organization: '',
        });

        setErrors({});
        setSubmitted(false);
      } else {
        setSubmitStatus('error');
      }
    } catch (err) {
      setSubmitStatus('error');
    }
  };

  // if (loading) return <EventDetailsSkeleton />;
  // if (!event) return null;

  if (loading) return <EventDetailsSkeleton />;

  if (
    !event ||
    Object.keys(event).length === 0 ||
    (!event.aboutEvent &&
      !(event.agendaSlots && event.agendaSlots.length) &&
      !(event.speakers && event.speakers.length) &&
      !(event.galleryImages && event.galleryImages.length))
  ) {
    return (
      <Container sx={{ py: 10, textAlign: 'center' }}>
        <Typography variant="h5">No information available for this event.</Typography>
      </Container>
    );
  }

  const sortedAgenda = [...(event.agendaSlots || [])].sort(
    (a, b) => parseTime(a.startTime) - parseTime(b.startTime)
  );

  const groupedAgenda =
    id === 'c8daec56-f37f-4f6d-813c-aa3243044820'
      ? Object.values(
          sortedAgenda.reduce((acc, item) => {
            const key = `${item.startTime}_${item.endTime}_${item.eventTitle}`;

            if (!acc[key]) {
              acc[key] = {
                ...item,
                speakers: [],
              };
            }

            if (item.speakerName) {
              acc[key].speakers.push(item.speakerName);
            }

            return acc;
          }, {})
        )
      : sortedAgenda;

  return (
    <Container maxWidth="xl" sx={{ px: { xs: 2, md: 6 }, py: 4 }}>
      <Box
        sx={{
          width: '100%',
          height: { xs: 'auto', md: 800 },
          overflow: 'hidden',
          borderRadius: 3,
          mb: 4,
        }}
      >
        <Box
          component="img"
          src={`${CONFIG.event}${event.bannerImagePath}`}
          loading="lazy"
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'contain', // 👈 KEY FIX
            display: 'block',
          }}
        />
      </Box>

      {/* ABOUT EVENT */}

      <Typography
        variant="h4"
        sx={{
          fontWeight: 800,
          color: '#0b4f9c',
          mb: 4,
          fontSize: {
            xs: '1.35rem',
            sm: '1.7rem',
            md: '2.1rem',
          },
        }}
      >
        About Event
      </Typography>

      <Typography
        sx={{
          lineHeight: 2,
          mb: 4,
          color: '#374151',
          fontSize: { xs: '0.95rem', md: '1.05rem' },
        }}
      >
        {event.aboutEvent}
      </Typography>

      {/* <Button
      variant="contained"
      sx={{
        mb: 7,
        px: 5,
        py: 1.5,
        borderRadius: '14px',
        background: 'linear-gradient(135deg, #0b4f9c, #1565c0)',
        fontWeight: 700,
        fontSize: '1rem',
        textTransform: 'none',
        boxShadow: '0 8px 24px rgba(11,79,156,0.25)',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 12px 28px rgba(11,79,156,0.35)',
        },
      }}
      onClick={handleOpenRegister}
    >
      Register Now
    </Button> */}
      <br />
      {/* AGENDA */}

      <Typography
        variant="h4"
        sx={{
          fontWeight: 800,
          color: '#0b4f9c',
          mb: 4,
          fontSize: {
            xs: '1.35rem',
            sm: '1.7rem',
            md: '2.1rem',
          },
        }}
      >
        Agenda
      </Typography>

      {/* MOBILE RESPONSIVE TABLE */}

      <Box
        sx={{
          width: '100%',
          borderRadius: 4,
          mb: 7,
          overflowX: 'auto',
        }}
      >
        <Paper
          elevation={0}
          sx={{
            minWidth: '100%',
            borderRadius: 4,
            overflow: 'hidden',
            border: '1px solid #e5e7eb',
            boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
          }}
        >
          <Table>
            <TableHead
              sx={{
                '& .MuiTableCell-head': {
                  backgroundColor: '#0b4f9c !important',
                  color: '#ffffff !important',
                  fontWeight: '800 !important',
                  fontSize: {
                    xs: '0.9rem',
                    sm: '1rem',
                  },
                  borderBottom: 'none !important',
                },
              }}
            >
              <TableRow>
                <TableCell
                  sx={{
                    width: '18%',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Time
                </TableCell>

                <TableCell
                  sx={{
                    width: '37%',
                  }}
                >
                  Event
                </TableCell>

                <TableCell
                  sx={{
                    width: '45%',
                  }}
                >
                  Speaker
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {/* {sortedAgenda.map((item, index) => { */}
              {groupedAgenda.map((item, index) => {
                const title = (item.eventTitle || '').toLowerCase();

                const isBreak = title.includes('tea break') || title.includes('lunch break');

                const isInaugural = title.includes('inaugur') || title.includes('inaugural');

                return (
                  <TableRow
                    key={index}
                    sx={{
                      backgroundColor: isBreak ? '#eef6ff' : 'white',
                      '&:hover': {
                        backgroundColor: '#f8fbff',
                      },
                    }}
                  >
                    {/* TIME */}
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        verticalAlign: 'top',
                      }}
                    >
                      {item.startTime} - {item.endTime}
                    </TableCell>

                    {/* EVENT */}
                    <TableCell sx={{ verticalAlign: 'top' }}>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          color: '#111827',
                        }}
                      >
                        {item.eventTitle}
                      </Typography>

                      {/* INAUGURAL SECTION */}
                      {isInaugural && (
                        <Box
                          sx={{
                            mt: 2,
                            borderRadius: 3,
                            overflow: 'hidden',
                            border: '1px solid #dbe4ee',
                            background: '#ffffff',
                          }}
                        >
                          {event.welcomeAddressBy && (
                            <Box
                              sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', sm: 'row' },
                                borderBottom: '1px solid #e5e7eb',
                              }}
                            >
                              <Box
                                sx={{
                                  width: { xs: '100%', sm: '35%' },
                                  p: 1.5,
                                  fontWeight: 700,
                                  background: '#f4f7fb',
                                  color: '#0b4f9c',
                                }}
                              >
                                Welcome Address by
                              </Box>

                              <Box sx={{ flex: 1, p: 1.5, color: '#374151' }}>
                                {event.welcomeAddressBy}
                              </Box>
                            </Box>
                          )}

                          {event.cdacAddressBy && (
                            <Box
                              sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', sm: 'row' },
                                borderBottom: '1px solid #e5e7eb',
                              }}
                            >
                              <Box
                                sx={{
                                  width: { xs: '100%', sm: '35%' },
                                  p: 1.5,
                                  fontWeight: 700,
                                  background: '#f4f7fb',
                                  color: '#0b4f9c',
                                }}
                              >
                                Address by C-DAC Official
                              </Box>

                              <Box sx={{ flex: 1, p: 1.5 }}>{event.cdacAddressBy}</Box>
                            </Box>
                          )}

                          {event.keynoteAddressBy && (
                            <Box
                              sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', sm: 'row' },
                                borderBottom: '1px solid #e5e7eb',
                              }}
                            >
                              <Box
                                sx={{
                                  width: { xs: '100%', sm: '35%' },
                                  p: 1.5,
                                  fontWeight: 700,
                                  background: '#f4f7fb',
                                  color: '#0b4f9c',
                                }}
                              >
                                Keynote Address by
                              </Box>

                              <Box sx={{ flex: 1, p: 1.5 }}>{event.keynoteAddressBy}</Box>
                            </Box>
                          )}

                          {event.chiefGuestAddressBy && (
                            <Box
                              sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', sm: 'row' },
                              }}
                            >
                              <Box
                                sx={{
                                  width: { xs: '100%', sm: '35%' },
                                  p: 1.5,
                                  fontWeight: 700,
                                  background: '#f4f7fb',
                                  color: '#0b4f9c',
                                }}
                              >
                                Address by the Chief Guest
                              </Box>

                              <Box sx={{ flex: 1, p: 1.5 }}>{event.chiefGuestAddressBy}</Box>
                            </Box>
                          )}

                          {event.keynoteAddressBy && (
                            <Box
                              sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', sm: 'row' },
                                borderBottom: '1px solid #e5e7eb',
                              }}
                            >
                              <Box
                                sx={{
                                  width: { xs: '100%', sm: '35%' },
                                  p: 1.5,
                                  fontWeight: 700,
                                  background: '#f4f7fb',
                                  color: '#0b4f9c',
                                }}
                              >
                                Vote Of Thanks
                              </Box>

                              <Box sx={{ flex: 1, p: 1.5 }}>
                                Shri. Sanjay Wandhekar, Centre Head, C-DAC Pune
                              </Box>
                            </Box>
                          )}
                        </Box>
                      )}
                    </TableCell>

                    {/* SPEAKER - FIXED (VERTICAL ALIGN) */}
                    <TableCell
                      sx={{
                        color: '#374151',
                        verticalAlign: 'top',
                        wordBreak: 'break-word',
                      }}
                    >
                      {id === 'c8daec56-f37f-4f6d-813c-aa3243044820' ? (
                        isMobile ? (
                          // ✅ MOBILE: SIMPLE SAFE VIEW (prevents table break)
                          item.speakers?.length ? (
                            <Typography sx={{ fontSize: '0.9rem' }}>
                              {item.speakers.join(', ')}
                            </Typography>
                          ) : item.speakerName ? (
                            <Typography sx={{ fontSize: '0.9rem' }}>{item.speakerName}</Typography>
                          ) : (
                            '-'
                          )
                        ) : // ✅ DESKTOP: YOUR EXISTING DESIGN (UNCHANGED)
                        item.speakers?.length ? (
                          <Box
                            sx={{
                              borderRadius: 2,
                              overflow: 'hidden',
                              border: '1px solid #e5e7eb',
                            }}
                          >
                            {item.speakers.map((sp, i) => (
                              <Box
                                key={i}
                                sx={{
                                  display: 'flex',
                                  gap: 1.5,
                                  p: 1,
                                  borderBottom:
                                    i !== item.speakers.length - 1 ? '1px solid #f1f5f9' : 'none',
                                  backgroundColor: i % 2 === 0 ? '#fafcff' : '#ffffff',
                                }}
                              >
                                <Typography
                                  sx={{
                                    color: '#0b4f9c',
                                    fontWeight: 700,
                                    minWidth: 24,
                                  }}
                                >
                                  {i + 1}.
                                </Typography>

                                <Typography sx={{ fontSize: '0.92rem' }}>{sp}</Typography>
                              </Box>
                            ))}
                          </Box>
                        ) : (
                          '-'
                        )
                      ) : // ✅ ALL OTHER EVENTS (UNCHANGED EXACTLY)
                      item.speakerName ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          {item.speakerName.split(',').map((sp, i) => (
                            <Typography key={i} sx={{ fontSize: '0.95rem' }}>
                              {sp.trim()}
                            </Typography>
                          ))}
                        </Box>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
      </Box>
      {/* SPEAKERS */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: 800,
          color: '#0b4f9c',
          mb: 4,
          fontSize: {
            xs: '1.35rem',
            sm: '1.7rem',
            md: '2.1rem',
          },
        }}
      >
        Speakers
      </Typography>

      {event.speakers?.map((speaker, i) => {
        const reverse = i % 2 === 1;

        return (
          <Card
            key={i}
            sx={{
              display: 'flex',
              flexDirection: {
                xs: 'column',
                md: reverse ? 'row-reverse' : 'row',
              },
              mb: 4,
              borderRadius: 4,
              overflow: 'hidden',
              background: '#fff',
              border: '1px solid #eef2f7',
              boxShadow: '0 6px 24px rgba(0,0,0,0.06)',
              transition: '0.3s',
              '&:hover': {
                transform: 'translateY(-2px)',
              },
            }}
          >
            <Box
              sx={{
                flex: { md: '0 0 32%' },
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#f8fafc',
                p: 3,
              }}
            >
              <Box
                sx={{
                  width: 220,
                  height: 260,
                  borderRadius: 3,
                  overflow: 'hidden',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Box
                  component="img"
                  src={`${CONFIG.event}${speaker.imagePath}`}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center top',
                    display: 'block',
                  }}
                />
              </Box>
            </Box>

            <Box
              sx={{
                flex: 1,
                p: { xs: 2.2, md: 3.2 },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: '#0b4f9c',
                  fontWeight: 800,
                  mb: 0.8,
                  fontSize: {
                    xs: '1rem',
                    md: '1.25rem',
                  },
                }}
              >
                {speaker.name}
              </Typography>

              <Typography
                sx={{
                  color: '#101011',
                  mb: 1.2,
                  fontWeight: 600,
                  fontSize: {
                    xs: '0.82rem',
                    md: '0.92rem',
                  },
                }}
              >
                {speaker.designation}
              </Typography>

              <Typography
                sx={{
                  lineHeight: 1.7,
                  color: '#4b5563',
                  fontSize: {
                    xs: '0.82rem',
                    md: '0.92rem',
                  },
                }}
              >
                {speaker.bio}
              </Typography>
            </Box>
          </Card>
        );
      })}

      {/* VENUE */}

      {(event.venueName || event.address || event.city || event.mapEmbedUrl) && (
        <>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: '#0b4f9c',
              mt: 4,
              mb: 1,
              fontSize: {
                xs: '1.8rem',
                sm: '2.2rem',
                md: '2.7rem',
              },
            }}
          >
            Venue
          </Typography>
          <Grid
            container
            spacing={2}
            alignItems="stretch"
            sx={{
              mt: 0,
              width: '100%',
              mx: 0,
            }}
          >
            <Grid
              item
              xs={12}
              md={5}
              sx={{
                pr: { md: 1 },
              }}
            >
              <Box
                sx={{
                  p: 3,
                  borderRadius: 4,
                  background: '#fff',
                  boxShadow: '0 6px 24px rgba(0,0,0,0.06)',
                  height: '100%',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    gap: 2,
                  }}
                >
                  <Iconify icon="mdi:map-marker" />

                  <Box>
                    {event.venueName && (
                      <Typography variant="h6" fontWeight={700}>
                        {event.venueName}
                      </Typography>
                    )}

                    {event.address && (
                      <Typography
                        sx={{
                          mt: 1,
                          lineHeight: 1.8,
                        }}
                      >
                        {event.address}
                      </Typography>
                    )}

                    {(event.city || event.state || event.pincode) && (
                      <Typography sx={{ mt: 1 }}>
                        {event.city}, {event.state} - {event.pincode}
                      </Typography>
                    )}
                  </Box>
                </Box>

                {event.mapEmbedUrl && !event.mapEmbedUrl.includes('embed') && (
                  <Button
                    variant="contained"
                    href={event.mapEmbedUrl}
                    target="_blank"
                    sx={{
                      mt: 3,
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #0b4f9c, #1565c0)',
                    }}
                  >
                    Open in Google Maps
                  </Button>
                )}
              </Box>
            </Grid>

            {event.mapEmbedUrl && event.mapEmbedUrl.includes('embed') && (
              <Grid
                item
                xs={12}
                md={7}
                sx={{
                  pl: { md: 1 },
                }}
              >
                <Box
                  component="iframe"
                  src={event.mapEmbedUrl}
                  width="100%"
                  height="340"
                  sx={{
                    border: 0,
                    borderRadius: 4,
                    boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
                  }}
                />
              </Grid>
            )}
          </Grid>
        </>
      )}

      {/* GALLERY */}
      {event?.galleryImages?.length > 0 && (
        <Grid
          container
          spacing={2}
          sx={{ mt: 7, justifyContent: 'center' }}
          className="gallery-img"
        >
          {Array.from(
            new Map(
              event.galleryImages.map((img) => {
                const key = typeof img === 'string' ? img : img?.imagePath || img?.path;

                return [key, img];
              })
            ).values()
          ).map((img, i) => {
            const imageUrl = typeof img === 'string' ? img : img?.imagePath || img?.path || '';

            return (
              <Grid item xs={12} sm={4} md={4} key={i}>
                <Box
                  sx={{
                    width: '100%',
                    height: 220,
                    overflow: 'hidden',
                    borderRadius: 3,
                    boxShadow: '0 6px 20px rgba(0,0,0,0.10)',
                  }}
                >
                  <Box
                    component="img"
                    src={`${CONFIG.event}${imageUrl}`}
                    loading="lazy"
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: '0.4s ease',
                      '&:hover': {
                        transform: 'scale(1.07)',
                      },
                    }}
                  />
                </Box>
              </Grid>
            );
          })}
        </Grid>
      )}
      {/* REGISTRATION DIALOG */}

      <Dialog open={openRegister} onClose={handleCloseRegister} fullWidth maxWidth="sm">
        <DialogTitle
          sx={{
            fontWeight: 800,
            fontSize: '1.8rem',
            color: '#0b4f9c',
          }}
        >
          Event Registration
        </DialogTitle>

        <DialogContent>
          {submitStatus === 'success' && (
            <Typography
              sx={{
                color: 'green',
                mb: 2,
                fontWeight: 600,
              }}
            >
              Registration successful!
            </Typography>
          )}

          {submitStatus === 'error' && (
            <Typography
              sx={{
                color: 'red',
                mb: 2,
                fontWeight: 600,
              }}
            >
              Registration failed. Please try again.
            </Typography>
          )}

          <TextField
            fullWidth
            margin="normal"
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={submitted && !!errors.name}
            helperText={submitted && errors.name ? errors.name : ''}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '14px',
                backgroundColor: '#fafafa',
              },
            }}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Organization"
            name="organization"
            value={formData.organization}
            onChange={handleChange}
            error={submitted && !!errors.organization}
            helperText={submitted && errors.organization ? errors.organization : ''}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '14px',
                backgroundColor: '#fafafa',
              },
            }}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={submitted && !!errors.email}
            helperText={submitted && errors.email ? errors.email : ''}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '14px',
                backgroundColor: '#fafafa',
              },
            }}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Mobile Number"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            error={submitted && !!errors.mobile}
            helperText={submitted && errors.mobile ? errors.mobile : ''}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '14px',
                backgroundColor: '#fafafa',
              },
            }}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseRegister}>Cancel</Button>

          <Button
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #0b4f9c, #1565c0)',
              borderRadius: '10px',
              px: 3,
              py: 1,
              fontWeight: 700,
              textTransform: 'none',
            }}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
