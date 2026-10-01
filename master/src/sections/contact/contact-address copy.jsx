import { Box, Link, Stack, Typography } from '@mui/material';

const LocationIcon = ({ width, height }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24">
    <path
      fill="none"
      stroke="#1a1a1a"
      strokeDasharray="54"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 4c4.42 0 8 3.58 8 8c0 4.42 -3.58 8 -8 8c-4.42 0 -8 -3.58 -8 -8c0 -4.42 3.58 -8 8 -8Z"
    >
      <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="54;0" />
    </path>
    <circle cx="12" cy="12" fill="#1a1a1a">
      <animate fill="freeze" attributeName="r" begin="0.9s" dur="0.2s" to="4" />
    </circle>
    <path
      fill="none"
      stroke="#1a1a1a"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 4v-2M20 12h2M12 20v2M4 12h-2"
      opacity="0"
    >
      <set fill="freeze" attributeName="opacity" begin="0.7s" to="1" />
      <animate
        fill="freeze"
        attributeName="d"
        begin="0.7s"
        dur="0.2s"
        values="M12 4v0M20 12h0M12 20v0M4 12h0;M12 4v-2M20 12h2M12 20v2M4 12h-2"
      />
      <animateTransform
        attributeName="transform"
        begin="0.7s"
        dur="30s"
        repeatCount="indefinite"
        type="rotate"
        values="0 12 12;360 12 12"
      />
    </path>
  </svg>
);

const EmailIcon_old = ({ width, height }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24">
    <path fill="#1a1a1a" fillOpacity={0} d="M12 11l-8 -5h16l-8 5Z">
      <animate fill="freeze" attributeName="fill-opacity" begin="0.9s" dur="0.4s" to={1} />
    </path>
    <g fill="none" stroke="#1a1a1a" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
      <path
        strokeDasharray={66}
        d="M4 5h16c0.55 0 1 0.45 1 1v12c0 0.55 -0.45 1 -1 1h-16c-0.55 0 -1 -0.45 -1 -1v-12c0 -0.55 0.45 -1 1 -1Z"
      >
        <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="66;0" />
      </path>
      <path strokeDasharray={24} strokeDashoffset={24} d="M3 6.5l9 5.5l9 -5.5">
        <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.3s" to={0} />
      </path>
    </g>
  </svg>
);

const EmailIcon = ({ width = 40, height = 40, color = '#1a1a1a' }) => (
  <div
    style={{
      display: 'inline-block',
      color: color, // controls icon color
      cursor: 'pointer',
      transition: 'transform 0.3s, color 0.3s',
    }}
    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--palette-primary-main)')}
    onMouseLeave={(e) => (e.currentTarget.style.color = color)}
  >
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24">
      <path
        fill={color ? 'var(--palette-primary-main)' : color}
        fillOpacity={0}
        d="M12 11l-8 -5h16l-8 5Z"
      >
        <animate fill="freeze" attributeName="fill-opacity" begin="0.9s" dur="0.4s" to={1} />
      </path>
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      >
        <path
          strokeDasharray={66}
          d="M4 5h16c0.55 0 1 0.45 1 1v12c0 0.55 -0.45 1 -1 1h-16c-0.55 0 -1 -0.45 -1 -1v-12c0 -0.55 0.45 -1 1 -1Z"
        >
          <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="66;0" />
        </path>
        <path strokeDasharray={24} strokeDashoffset={24} d="M3 6.5l9 5.5l9 -5.5">
          <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.3s" to={0} />
        </path>
      </g>
    </svg>
  </div>
);

function EmailLink() {
  return (
    <Link href="mailto:ipcell@cdac.in" underline="hover" color="text.primary">
      ipcell@cdac.in
    </Link>
  );
}

export function ContactAddress() {
  return (
    <Stack spacing={1}>
      <LocationIcon width={50} height={50} />

      <Stack spacing={1}>
        <Box
          component="span"
          sx={{
            background:
              'linear-gradient(300deg, var(--palette-primary-main) 0%, var(--palette-warning-main) 93%, var(--palette-primary-main) 50%, var(--palette-warning-main) 75%, var(--palette-primary-main) 100%)',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            color: 'transparent',
            backgroundSize: '400%',
            fontWeight: 'bold',
            typography: 'h3',
          }}
        >
          IP Catalyst
        </Box>
        <Typography>5th Floor, MTG Group, 5W,</Typography>
        <Typography>Centre for Development of Advanced Computing (C-DAC),</Typography>
        <Typography>Innovation Park, Panchavati,</Typography>
        <Typography>Pashan, Pune - 411008,</Typography>
        <Typography>Maharashtra, India</Typography>

        <Stack direction="row" spacing={1} alignItems="stretch">
          <EmailIcon width={24} height={24} />
          <EmailLink />
        </Stack>
      </Stack>
    </Stack>
  );
}
