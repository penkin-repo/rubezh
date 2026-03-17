'use client';
import { Studio } from 'sanity';
import config from '../../sanity.config';

// Компонент рендерится только в браузере
export default function SanityStudio() {
    return <Studio config={config} />;
}
