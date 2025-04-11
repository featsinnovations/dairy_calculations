'use client';

import React from 'react';
import { CacheProvider } from '@emotion/react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import createEmotionCache from '../lib/createEmotionCache';

const clientSideEmotionCache = createEmotionCache();

export default function Providers({ children }) {
  return (
   <div className="bg-gray-100 min-h-screen"> <CacheProvider value={clientSideEmotionCache}>
        
        <CssBaseline />
        {children}
     
    </CacheProvider> </div>
  );
}
