import React, { useRef } from 'react';

export default function ImageUploader({ value, onChange }) {
  const inputRef = useRef(null);

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      alert('Please choose an image under 3MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result);
    reader.readAsDataURL(file);
  }

  return (
    <div className="image-uploader">
      {value ? (
        <div className="preview-wrap">
          <img src={value} alt="Selected preview" />
          <button type="button" className="btn btn-outline btn-sm" onClick={() => onChange('')}>
            Remove photo
          </button>
        </div>
      ) : (
        <button type="button" className="upload-box" onClick={() => inputRef.current?.click()}>
          <span className="upload-icon" aria-hidden="true">
            +
          </span>
          Add a photo
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        style={{ display: 'none' }}
      />

      <style>{`
        .upload-box {
          width: 100%;
          border: 1.5px dashed var(--line-strong);
          background: var(--card);
          border-radius: var(--radius-m);
          padding: 34px 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          color: var(--ink-soft);
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
        }
        .upload-box:hover { border-color: var(--teal); color: var(--teal-dark); }
        .upload-icon {
          font-family: var(--font-head);
          font-size: 1.6rem;
          line-height: 1;
        }
        .preview-wrap {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .preview-wrap img {
          width: 92px;
          height: 92px;
          object-fit: cover;
          border-radius: var(--radius-s);
          border: 1px solid var(--line);
        }
      `}</style>
    </div>
  );
}
