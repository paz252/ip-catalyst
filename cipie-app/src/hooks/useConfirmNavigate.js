import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useBoolean } from 'src/hooks/use-boolean';

export function useConfirmNavigate() {
    const navigate = useNavigate();
    const confirmDialog = useBoolean(false);

    const openConfirm = (event) => {
        event?.preventDefault();
        confirmDialog.onTrue();
    };

    const confirmAndNavigate = (to) => {
        confirmDialog.onFalse();
        navigate(to);
        // window.open(to, '_blank');
    };

    return {
        confirmDialog,
        openConfirm,
        confirmAndNavigate,
    };
}

