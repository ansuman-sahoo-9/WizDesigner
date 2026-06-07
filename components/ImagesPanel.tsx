'use client';

import { useState } from 'react';
import { useDesign } from '@/lib/DesignContext';
import { copyText } from '@/lib/download';

export function ImagesPanel() {
  const { images, addImage, removeImage, renameImage, setField, state } = useDesign();
  const [url, setUrl] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState('');

  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => addImage({ name: file.name.replace(/\.[^.]+$/, ''), url: String(reader.result) });
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const addByUrl = () => {
    const u = url.trim();
    if (!u) return;
    addImage({ name: u.split('/').pop()?.split('?')[0] || 'image', url: u });
    setUrl('');
  };

  return (
    <div className="flex h-full flex-col overflow-y-auto wd-scroll px-5 py-5">
      <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--chrome-muted)]">Image Library</div>
      <p className="mt-1 text-[11px] leading-snug text-[var(--chrome-muted)]">
        Upload or link images, then reuse them as the brand logo or as product images in the Catalog tab.
      </p>

      <label className="mt-3 flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-md border border-dashed border-[var(--chrome-line)] py-5 text-center hover:border-[var(--chrome-muted)]">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="text-[var(--chrome-muted)]"><path d="M12 16V4M8 8l4-4 4 4M4 20h16" /></svg>
        <span className="text-[11px] font-medium text-[var(--chrome-muted)]">Upload images (multiple OK)</span>
        <input type="file" accept="image/*" multiple className="hidden" onChange={onUpload} />
      </label>

      <div className="mt-2 flex gap-2">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addByUrl()}
          placeholder="…or paste an image URL"
          className="min-w-0 flex-1 rounded-md border border-[var(--chrome-line)] bg-white px-2.5 py-1.5 text-[12px] outline-none focus:border-[var(--chrome-ink)]"
        />
        <button onClick={addByUrl} className="flex-none rounded-md border border-[var(--chrome-line)] px-3 py-1.5 text-[12px] font-medium hover:border-[var(--chrome-muted)]">Add</button>
      </div>

      <div className="mt-4 text-[11px] text-[var(--chrome-muted)]">{images.length} {images.length === 1 ? 'asset' : 'assets'}</div>

      {images.length === 0 ? (
        <p className="mt-3 rounded-md border border-dashed border-[var(--chrome-line)] px-3 py-5 text-center text-[12px] text-[var(--chrome-muted)]">
          No images yet. Upload a logo or product photos to build your asset library.
        </p>
      ) : (
        <div className="mt-2 grid grid-cols-2 gap-2">
          {images.map((im) => {
            const isLogo = state.logoUrl === im.url;
            return (
              <div key={im.id} className="overflow-hidden rounded-md border border-[var(--chrome-line)]">
                <div className="relative aspect-[4/3] bg-[var(--chrome-bg)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={im.url} alt={im.name} className="h-full w-full object-contain" />
                  {isLogo && <span className="absolute left-1 top-1 rounded bg-[var(--chrome-ink)] px-1.5 py-0.5 text-[8px] font-bold uppercase text-[var(--chrome-accent)]">Logo</span>}
                </div>
                <div className="p-1.5">
                  {editing === im.id ? (
                    <input
                      value={draft}
                      autoFocus
                      onChange={(e) => setDraft(e.target.value)}
                      onBlur={() => { renameImage(im.id, draft); setEditing(null); }}
                      onKeyDown={(e) => { if (e.key === 'Enter') { renameImage(im.id, draft); setEditing(null); } }}
                      className="w-full rounded border border-[var(--chrome-ink)] px-1 py-0.5 text-[11px] outline-none"
                    />
                  ) : (
                    <button onClick={() => { setEditing(im.id); setDraft(im.name); }} className="block w-full truncate text-left text-[11px] font-medium hover:underline" title={im.name}>
                      {im.name}
                    </button>
                  )}
                  <div className="mt-1 flex items-center justify-between text-[10px]">
                    <button onClick={() => setField('logoUrl', im.url)} className="font-medium text-[var(--chrome-ink)] hover:underline">Use as logo</button>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={async () => { if (await copyText(im.url)) { setCopiedId(im.id); setTimeout(() => setCopiedId(null), 1200); } }}
                        className="font-medium text-[var(--chrome-muted)] hover:text-[var(--chrome-ink)]"
                      >
                        {copiedId === im.id ? 'Copied' : 'Copy URL'}
                      </button>
                      <button onClick={() => removeImage(im.id)} className="text-[var(--chrome-muted)] hover:text-red-600" title="Delete">✕</button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
