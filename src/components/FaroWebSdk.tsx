'use client';

import { useEffect } from 'react';

export function FaroWebSdk() {
    useEffect(() => {
        // Nur im Browser und wenn URL konfiguriert ist
        const faroUrl = process.env.NEXT_PUBLIC_GRAFANA_FARO_URL;

        if (typeof window !== 'undefined' && faroUrl) {
            Promise.all([
                import('@grafana/faro-web-sdk'),
                import('@grafana/faro-web-tracing')
            ]).then(([faroSdk, faroTracing]) => {
                faroSdk.initializeFaro({
                    url: faroUrl,
                    app: {
                        name: 'testshop',
                        version: '1.0.0',
                        environment: process.env.NODE_ENV || 'production',
                    },
                    instrumentations: [
                        ...faroSdk.getWebInstrumentations(),
                        new faroTracing.TracingInstrumentation(),
                    ],
                });
                console.log('[Faro] Grafana monitoring initialized');
            }).catch((err) => {
                console.warn('[Faro] Failed to initialize:', err);
            });
        }
    }, []);

    return null;
}
