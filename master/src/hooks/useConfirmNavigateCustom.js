import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useBoolean } from 'src/hooks/use-boolean';


export function useConfirmNavigate() {
    const navigate = useNavigate();
    const confirmDialog = useBoolean(false);

    const [target, setTarget] = useState(null);

    const openConfirm = (event, to, options = {}) => {
        event?.preventDefault();
        setTarget({ to, ...options }); // store url + type
        confirmDialog.onTrue();
    };

    const confirmAndNavigate = () => {
        if (!target) return;

        const { to, external } = target;

        confirmDialog.onFalse();

        if (external) {
            window.open(to, '_blank', 'noopener,noreferrer'); // ✅ new tab
        } else {
            navigate(to); // ✅ same tab (internal)
        }
    };

    return {
        confirmDialog,
        openConfirm,
        confirmAndNavigate,
    };
}