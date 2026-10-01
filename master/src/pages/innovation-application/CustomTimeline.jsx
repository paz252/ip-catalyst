import { Box, Tooltip, Typography } from '@mui/material';

const trlStatus = [
  { status: 'TRL 3-4', title: 'Proof of concept', min: 3, max: 4 },
  { status: 'TRL 5-6', title: 'Technology development / prototype', min: 5, max: 6 },
  {
    status: 'TRL 7',
    title: 'Technology optimization / prototype validated in operational environment',
    min: 7,
    max: 7,
  },
  {
    status: 'TRL 8',
    title: 'Early commercial demonstration / adoption / dissemination',
    min: 8,
    max: 8,
  },
  { status: 'TRL 9', title: 'Scaling up', min: 9, max: 9 },
];

export default function CustomTimeline({ trlLevel = 0 }) {
  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
        }}
      >
        {trlStatus.map((step, index) => {
          const isActive = trlLevel >= step.min && trlLevel <= step.max;
          const isCurrent = trlLevel >= step.min && trlLevel <= step.max;

          const isCompleted = trlLevel > step.max;

          return (
            <Box
              key={index}
              sx={{
                flex: 1,
                textAlign: 'center',
                position: 'relative',
              }}
            >
              {/* Line */}
              {index !== trlStatus.length - 1 && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 6,
                    left: '50%',
                    right: '-50%',
                    height: 3,
                    borderRadius: 10,
                    bgcolor: isCompleted ? 'primary.main' : 'divider',
                    zIndex: 0,
                  }}
                />
              )}

              {/* Dot */}
              <Tooltip
                arrow
                placement="top"
                title={
                  <>
                    <Typography variant="subtitle2">{step.status}</Typography>

                    <Typography variant="caption">{step.title}</Typography>
                  </>
                }
              >
                <Box
                  sx={{
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    bgcolor: isCurrent || isCompleted ? 'primary.main' : 'background.paper',

                    border: 3,

                    borderColor: isCurrent || isCompleted ? 'primary.main' : 'grey.400',

                    mx: 'auto',

                    position: 'relative',

                    zIndex: 2,

                    transition: 'all .3s',

                    boxShadow: isCurrent ? '0 0 0 6px rgba(33,150,243,.12)' : 'none',
                    '&:hover': {
                      transform: 'scale(1.2)',
                    },
                  }}
                />
              </Tooltip>

              {/* Label */}
              <Typography
                variant="body2"
                sx={{
                  mt: 1.25,
                  fontSize: 12,
                  fontWeight: isCurrent ? 700 : 500,
                  color: isCurrent || isCompleted ? 'text.primary' : 'text.secondary',
                }}
              >
                {step.status}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
