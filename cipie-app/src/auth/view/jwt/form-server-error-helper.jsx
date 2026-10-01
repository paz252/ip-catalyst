export function old_setFormServerErrors(error, setError) {
  if (error?.errors && typeof error.errors === 'object' && !Array.isArray(error.errors)) {
    Object.entries(error.errors).forEach(([field, messages]) => {
      const message = Array.isArray(messages) ? messages.join(', ') : messages;

      setError(field, {
        type: 'server',
        message,
      });
    });

    return true;
  }

  return false;
}

export function setFormServerErrors(error, setError, fieldMap = {}) {
  if (error?.errors && typeof error.errors === 'object' && !Array.isArray(error.errors)) {
    Object.entries(error.errors).forEach(([field, messages]) => {
      const formField = fieldMap[field] || field;

      const message = Array.isArray(messages) ? messages.join(', ') : messages;

      setError(formField, {
        type: 'server',
        message,
      });
    });

    return true;
  }

  return false;
}
