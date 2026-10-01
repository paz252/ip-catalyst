import * as z from 'zod';
import { useCallback } from 'react';
import { uuidv4 } from 'minimal-shared/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DialogActions from '@mui/material/DialogActions';

import { fIsAfter } from 'src/utils/format-time';

import { replyToQuery } from 'src/admin/actions/application';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { Form, Field } from 'src/components/hook-form';
import { ColorPicker } from 'src/components/color-utils';

// ----------------------------------------------------------------------

export const QuerySchema = z.object({
    replyText: z
        .string()
        .min(1, { error: 'Reply is required!' })
        .max(1000, { error: 'Reply must be less than 1000 characters' }),
});

// ----------------------------------------------------------------------

export function QueryForm({ currentQuery, onClose }) {
    const methods = useForm({
        mode: 'all',
        resolver: zodResolver(QuerySchema),
        defaultValues: currentQuery,
    });

    const {
        reset,
        watch,
        control,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const values = watch();

    const onSubmit = handleSubmit(async (data) => {
        const queryData = {
            applicationId: currentQuery?.applicationId,
            replyText: data?.replyText,
        };

        try {

            await replyToQuery(queryData);
            onClose();
            toast.success('Query replied!');
            reset();
            //   if (!dateError) {
            //     if (currentQuery?.id) {
            //       await updateEvent(eventData);
            //       toast.success('Update success!');
            //     } else {
            //       await createEvent(eventData);
            //       toast.success('Create success!');
            //     }
            //     onClose();
            //     reset();
            //   }
        } catch (error) {
            console.error(error);
        }
    });

    return (
        <Form methods={methods} onSubmit={onSubmit}>
            <Scrollbar sx={{ p: 3 }}>
                <Stack spacing={3}>
                    {/* <Field.Text name="query" label="Query" disabled multiline value={currentQuery.message} /> */}
                    <Box sx={{ position: 'relative', mt: 2 }}>
                        <Typography
                            variant="caption"
                            sx={{
                                position: 'absolute',
                                top: -10,
                                left: 12,
                                px: 0.5,
                                bgcolor: 'background.paper',
                            }}
                        >
                            Query
                        </Typography>

                        <Box
                            sx={{
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 1,
                                p: 2,
                                minHeight: 56,
                                bgcolor: 'background.neutral'
                            }}
                        >
                            <Typography>{currentQuery.message}</Typography>

                            {/* <TextField
                                fullWidth
                                multiline
                                minRows={4}
                                value={currentQuery.message || ''}
                                InputProps={{
                                    readOnly: true,
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        bgcolor: 'background.neutral',
                                    },
                                }}
                            /> */}
                        </Box>
                    </Box>
                    <Field.Text name="replyText" label="Reply" multiline rows={3} />
                </Stack>
            </Scrollbar>

            <DialogActions sx={{ flexShrink: 0 }}>
                {/* {!!currentQuery?.id && (
          <Tooltip title="Delete event">
            <IconButton color="error" onClick={onDelete} edge="start">
              <Iconify icon="solar:trash-bin-trash-bold" />
            </IconButton>
          </Tooltip>
        )} */}

                <Box component="span" sx={{ flexGrow: 1 }} />

                <Button variant="outlined" color="inherit" onClick={onClose}>
                    Cancel
                </Button>
                <Button type="submit" variant="contained" loading={isSubmitting}>
                    {currentQuery?.id ? 'Save changes' : 'Reply'}
                </Button>
            </DialogActions>
        </Form>
    );
}
