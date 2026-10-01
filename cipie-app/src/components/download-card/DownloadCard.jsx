import PropTypes from "prop-types";

import {
  Box,
  Card,
  Stack,
  Button,
  Typography,
} from "@mui/material";

import { Iconify } from "src/components/iconify";

// ----------------------------------------------------------------------

export function DownloadCard({
  title,
  description,
  items = [],
  fileLabel = "ZIP • Ready to use",
  downloadUrl,
  fileName = "download.zip",
  icon = "eva:archive-fill",
  iconBg = "warning.lighter",
  buttonText = "Download",
  buttonVariant = "outlined",
  buttonColor = "primary",
}) {
  return (
    <Card
      sx={{
        p: { xs: 2, sm: 2.5 },
        borderRadius: 3,
        background: (theme) =>
          `linear-gradient(180deg, ${theme.palette.background.paper}, ${theme.palette.grey[50]})`,
        // border: (theme) => `1px solid ${theme.palette.divider}`,
        // "&:hover": {
        //   boxShadow: (theme) => theme.shadows[4],
        // },
      }}
    >
      <Stack spacing={1.5}>

        {/* HEADER */}
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
        >
          <Box
            sx={{
              width: { xs: 36, sm: 40 },
              height: { xs: 36, sm: 40 },
              borderRadius: 2,
              bgcolor: iconBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Iconify icon={icon} width={18} />
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="subtitle2"
              noWrap
            >
              {title}
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {description}
            </Typography>
          </Box>
        </Stack>

        {/* CONTENT */}
        {/* {items.length > 0 && (
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: "grey.lighter",
              border: (theme) => `1px dashed ${theme.palette.divider}`,
            }}
          >
            <Stack spacing={0.8}>
              <Typography variant="caption" color="text.secondary">
                Includes:
              </Typography>

              <Stack spacing={0.5}>
                {items.map((item, index) => (
                  <Typography
                    key={index}
                    variant="caption"
                    sx={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    • {item}
                  </Typography>
                ))}
              </Stack>
            </Stack>
          </Box>
        )} */}

        {/* FOOTER */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          alignItems={{ xs: "stretch", sm: "center" }}
          justifyContent="space-between"
        >
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ textAlign: { xs: "center", sm: "left" } }}
          >
            {fileLabel}
          </Typography>
          <Button
            fullWidth={{ xs: true, sm: false }}
            variant={buttonVariant}
            color={buttonColor}
            size="small"
            startIcon={<Iconify icon="eva:download-fill" />}
            href={downloadUrl}
            download={fileName}
            target="_blank"
            rel="noopener"
            sx={{
              textTransform: "none",
              fontWeight: 600,
              // borderRadius: 2,
              py: { xs: 1, sm: 0.5 },
            }}
          >
            {buttonText}
          </Button>
        </Stack>

      </Stack>
    </Card>
  );
}

// ----------------------------------------------------------------------

DownloadCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  items: PropTypes.array,
  fileLabel: PropTypes.string,
  downloadUrl: PropTypes.string.isRequired,
  fileName: PropTypes.string,
  icon: PropTypes.string,
  iconBg: PropTypes.string,
  buttonText: PropTypes.string,
  buttonVariant: PropTypes.string,
  buttonColor: PropTypes.string,
};