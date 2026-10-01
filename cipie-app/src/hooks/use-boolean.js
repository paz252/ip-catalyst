import { useState, useCallback } from 'react';

export function useBoolean(initialValue = false) {
    const [value, setValue] = useState(initialValue);

    const onTrue = useCallback(() => {
        setValue(true);
    }, []);

    const onFalse = useCallback(() => {
        setValue(false);
    }, []);

    const toggle = useCallback(() => {
        setValue((prev) => !prev);
    }, []);

    return {
        value,     // boolean state
        onTrue,    // set true
        onFalse,   // set false
        toggle,    // toggle value
        setValue,  // optional: direct control if ever needed
    };
}
