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

  const EVENT_DETAILS_URL = endpoints.event.details(id);

  const EVENT_REGISTER_URL = endpoints.event.register;

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

    const [time, modifier] = timeStr.trim().split(' ');
    let [hours, minutes] = time.split(':');

    hours = parseInt(hours);
    minutes = parseInt(minutes);

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
          //  src={`${CONFIG.event}${event.bannerImagePath}`}
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
          fontWeight: 700,
          color: '#0b4f9c',
          mb: 2,
        }}
      >
        About Event
      </Typography>

      <Typography sx={{ lineHeight: 1.8, mb: 2 }}>{event.aboutEvent}</Typography>

      <Button
        variant="contained"
        sx={{ mb: 5, backgroundColor: '#0b4f9c' }}
        onClick={handleOpenRegister}
      >
        Register
      </Button>

      {/* AGENDA */}

      <Typography
        variant="h4"
        sx={{ fontWeight: 700, color: '#0b4f9c', mb: 3, fontSize: '2.3rem' }}
      >
        Agenda
      </Typography>

      <Paper elevation={1} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#0b4f9c' }}>
              <TableCell sx={{ color: 'black', fontWeight: 600, width: 200, fontSize: '1.1rem' }}>
                Time
              </TableCell>

              <TableCell sx={{ color: 'black', fontWeight: 600, fontSize: '1.1rem' }}>
                Event
              </TableCell>

              <TableCell sx={{ color: 'black', fontWeight: 600, width: 300, fontSize: '1.1rem' }}>
                Speaker
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {sortedAgenda.map((item, index) => {
              const title = (item.eventTitle || '').toLowerCase();

              const isBreak = title.includes('tea break') || title.includes('lunch break');

              const isInaugural = title.includes('inaugur') || title.includes('inaugural');
              return (
                <TableRow
                  key={index}
                  sx={{
                    backgroundColor: isBreak ? '#e8f3ff' : 'white',
                  }}
                >
                  <TableCell>
                    {item.startTime} - {item.endTime}
                  </TableCell>

                  <TableCell>
                    {item.eventTitle}

                    {isInaugural && (
                      <Box
                        sx={{
                          mt: 1,
                          pl: 2,
                          borderLeft: '3px solid #0b4f9c',
                        }}
                      >
                        {event.welcomeAddressBy && (
                          <Typography variant="body2">
                            <b>Welcome Address by:</b> {event.welcomeAddressBy}
                          </Typography>
                        )}

                        {event.cdacAddressBy && (
                          <Typography variant="body2">
                            <b>Address by C-DAC official:</b> {event.cdacAddressBy}
                          </Typography>
                        )}

                        {event.keynoteAddressBy && (
                          <Typography variant="body2">
                            <b>Keynote address by:</b> {event.keynoteAddressBy}
                          </Typography>
                        )}

                        {event.chiefGuestAddressBy && (
                          <Typography variant="body2">
                            <b>Address by the Chief Guest:</b> {event.chiefGuestAddressBy}
                          </Typography>
                        )}
                      </Box>
                    )}
                  </TableCell>

                  <TableCell>{item.speakerName || '-'}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>

      {/* SPEAKERS */}

      <Typography
        variant="h4"
        sx={{ fontWeight: 700, color: '#0b4f9c', mb: 4, fontSize: '2.3rem' }}
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
              flexDirection: { xs: 'column', md: reverse ? 'row-reverse' : 'row' },
              mb: 8,
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                flex: '0 0 35%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#f5f5f5',
                p: 1,
              }}
            >
              <Box
                component="img"
                src={`${CONFIG.event}${speaker.imagePath}`}
                // src={`${CONFIG.event}${speaker.imagePath}`}
                loading="lazy"
                sx={{
                  width: '60%',
                  maxHeight: 350,
                  objectFit: 'cover',
                  borderRadius: 1,
                }}
              />
            </Box>

            <Box
              sx={{
                flex: 1,
                p: { xs: 2, md: 3 },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                backgroundColor: '#fff',
              }}
            >
              <Typography
                variant="h6"
                sx={{ color: '#0b4f9c', fontWeight: 600, mb: 1, fontSize: '1.3rem' }}
              >
                {speaker.name}
              </Typography>

              <Typography variant="body2" sx={{ color: '#6b6b6b', mb: 1, fontSize: '1rem' }}>
                {speaker.designation}
              </Typography>

              <Typography variant="body2" sx={{ lineHeight: 1.5, fontSize: '0.95rem' }}>
                {speaker.bio}
              </Typography>
            </Box>
          </Card>
        );
      })}

      {/* VENUE */}

      {(event.venueName || event.address || event.city || event.mapEmbedUrl) && (
        <>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#0b4f9c', mt: 7, mb: 4 }}>
            Venue
          </Typography>

          <Grid container spacing={4} alignItems="center">
            {/* LEFT SIDE - VENUE INFO */}
            <Grid xs={12} md={5}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Iconify icon="mdi:map-marker" />
                <Box>
                  {event.venueName && (
                    <Typography variant="h6" fontWeight={600}>
                      {event.venueName}
                    </Typography>
                  )}

                  {event.address && <Typography sx={{ mt: 1 }}>{event.address}</Typography>}

                  {(event.city || event.state || event.pincode) && (
                    <Typography sx={{ mt: 0.5 }}>
                      {event.city}, {event.state} - {event.pincode}
                    </Typography>
                  )}
                </Box>
              </Box>

              {/* Open Map Button if embed not available */}
              {event.mapEmbedUrl && !event.mapEmbedUrl.includes('embed') && (
                <Button
                  variant="contained"
                  href={event.mapEmbedUrl}
                  target="_blank"
                  sx={{
                    mt: 3,
                    backgroundColor: '#0b4f9c',
                  }}
                >
                  Open in Google Maps
                </Button>
              )}
            </Grid>

            {/* RIGHT SIDE - MAP */}
            {event.mapEmbedUrl && event.mapEmbedUrl.includes('embed') && (
              <Grid xs={12} md={7}>
                <Box
                  component="iframe"
                  src={event.mapEmbedUrl}
                  width="100%"
                  height="320"
                  sx={{
                    border: 0,
                    borderRadius: 3,
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                  }}
                />
              </Grid>
            )}
          </Grid>
        </>
      )}

      {/* GALLERY */}

      <Grid container spacing={2}>
        {/* {event.galleryImages.map((img, i) => ( */}
        {(event.galleryImages || []).map((img, i) => (
          <Grid item xs={6} sm={4} md={3} key={i}>
            <Box
              sx={{
                marginTop: 10,
                width: '100%',
                height: 200,
                overflow: 'hidden',
                borderRadius: 2,
                cursor: 'pointer',
              }}
            >
              <Box
                component="img"
                src={`${CONFIG.event}${event.imagePath}`}
                // src={`${CONFIG.event}${img}`}
                loading="lazy"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: '0.4s',
                  '&:hover': {
                    transform: 'scale(1.1)',
                  },
                }}
              />
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* REGISTER POPUP */}
      {/* 
      <Dialog open={openRegister} onClose={handleCloseRegister} fullWidth maxWidth="sm">
        <DialogTitle>Event Registration</DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={submitted && !!errors.name}
            helperText={submitted ? errors.name : ""}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Organization"
            name="organization"
            value={formData.organization}
            onChange={handleChange}
            error={submitted && !!errors.organization}
            helperText={submitted ? errors.organization : ""}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={submitted && !!errors.email}
            helperText={submitted ? errors.email : ""}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Mobile Number"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            error={submitted && !!errors.mobile}
            helperText={submitted ? errors.mobile : ""}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseRegister}>Cancel</Button>

          <Button variant="contained" sx={{ backgroundColor: '#0b4f9c' }} onClick={handleSubmit}>
            Submit
          </Button>
        </DialogActions>
      </Dialog> */}

      <Dialog open={openRegister} onClose={handleCloseRegister} fullWidth maxWidth="sm">
        <DialogTitle>Event Registration</DialogTitle>

        <DialogContent>
          {submitStatus === 'success' && (
            <Typography sx={{ color: 'green', mb: 2 }}>Registration successful!</Typography>
          )}

          {submitStatus === 'error' && (
            <Typography sx={{ color: 'red', mb: 2 }}>
              Registration failed. Please try again.
            </Typography>
          )}

          {/* your TextFields below */}
          <TextField
            fullWidth
            margin="normal"
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={submitted && !!errors.name}
            helperText={submitted && errors.name ? errors.name : ''}
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
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseRegister}>Cancel</Button>

          <Button variant="contained" sx={{ backgroundColor: '#0b4f9c' }} onClick={handleSubmit}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
