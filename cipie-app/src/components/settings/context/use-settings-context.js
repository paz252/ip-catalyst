import { use } from 'react';

import { SettingsContext } from './settings-context';

// ----------------------------------------------------------------------

export function useSettingsContext() {
  const context = use(SettingsContext);
  // console.log('context', context);

  if (!context) throw new Error('useSettingsContext must be use inside SettingsProvider');

  return context;
}
