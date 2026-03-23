import '../styles/globals.css';
import { useEffect } from 'react';
import type { AppProps } from 'next/app';

// Context
import { StyleProvider } from '../contexts/StyleContext';
import { TimerProvider } from '../contexts/TimerContext';
import { SoundsProvider } from '../contexts/SoundsContext';

// Utils
import { registerServiceWorker } from '../utils/notification';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return (
    <StyleProvider>
      <TimerProvider>
        <SoundsProvider>
          <Component {...pageProps} />
        </SoundsProvider>
      </TimerProvider>
    </StyleProvider>
  );
}
