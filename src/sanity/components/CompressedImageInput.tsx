import { useCallback, useState, type ChangeEvent } from 'react';
import { set, unset, useClient, type ObjectInputProps } from 'sanity';
import imageCompression from 'browser-image-compression';

const boxStyle: React.CSSProperties = {
    padding: '10px 12px',
    borderRadius: 6,
    border: '1px solid',
    fontSize: 13,
};
const btnStyle: React.CSSProperties = {
    padding: '8px 14px',
    borderRadius: 6,
    border: 'none',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
};

/**
 * Кастомный input для image-полей: сжимает картинку в браузере (webp, <=1920px, q0.8)
 * ПЕРЕД загрузкой в Sanity. Защищает хранилище бесплатного тарифа.
 * Заменяет стандартный UI картинки на простой и понятный (без hotspot).
 */
export function CompressedImageInput(props: ObjectInputProps) {
    const { onChange, value } = props;
    const client = useClient({ apiVersion: '2025-03-05' });
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [info, setInfo] = useState<string | null>(null);

    const assetRef = (value as { asset?: { _ref?: string } } | undefined)?.asset?._ref;

    const handleFile = useCallback(
        async (e: ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setBusy(true);
            setError(null);
            setInfo(null);
            try {
                const compressed = await imageCompression(file, {
                    maxWidthOrHeight: 1920,
                    maxSizeMB: 1.5,
                    useWebWorker: true,
                    fileType: 'image/webp',
                    initialQuality: 0.8,
                });
                const filename = file.name.replace(/\.[^.]+$/, '') + '.webp';
                const asset = await client.assets.upload('image', compressed, { filename });
                onChange(
                    set({
                        _type: 'image',
                        asset: { _type: 'reference', _ref: asset._id },
                    }),
                );
                const origKb = (file.size / 1024).toFixed(0);
                const newKb = (compressed.size / 1024).toFixed(0);
                setInfo(`Сжато: ${origKb} КБ → ${newKb} КБ`);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Ошибка загрузки');
            } finally {
                setBusy(false);
                e.target.value = '';
            }
        },
        [client, onChange],
    );

    const handleRemove = useCallback(() => {
        onChange(unset());
        setInfo(null);
    }, [onChange]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div
                style={{
                    ...boxStyle,
                    borderColor: assetRef ? '#43d675' : '#f5a623',
                    color: assetRef ? '#1a7f4b' : '#9a6500',
                    background: assetRef ? '#eafff2' : '#fff7e6',
                }}
            >
                {assetRef ? 'Изображение загружено ✓' : 'Фото не выбрано'}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFile}
                        disabled={busy}
                        style={{ display: 'none' }}
                    />
                    <span
                        style={{
                            ...btnStyle,
                            display: 'inline-block',
                            background: busy ? '#9bbcf0' : '#2276fc',
                            color: '#fff',
                            pointerEvents: busy ? 'none' : 'auto',
                        }}
                    >
                        {assetRef ? 'Заменить фото' : 'Загрузить фото'}
                    </span>
                </label>
                {assetRef && !busy ? (
                    <button
                        type="button"
                        onClick={handleRemove}
                        style={{ ...btnStyle, background: 'transparent', color: '#e03e3e' }}
                    >
                        Удалить
                    </button>
                ) : null}
            </div>

            {busy ? <div style={{ fontSize: 12, color: '#777' }}>Сжатие и загрузка…</div> : null}
            {info ? <div style={{ fontSize: 12, color: '#777' }}>{info}</div> : null}
            {error ? <div style={{ fontSize: 12, color: 'red' }}>{error}</div> : null}
        </div>
    );
}
