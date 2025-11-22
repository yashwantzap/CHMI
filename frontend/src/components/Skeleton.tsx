import React from 'react';

export function SkeletonLine({ width='100%', height=12 }: { width?: string; height?: number }) {
  return <div className="skeleton-line" style={{ width, height }} />;
}

export function SkeletonCard({ lines=4 }: { lines?: number }) {
  return (
    <div className="card skeleton-card">
      <div className="skeleton-header" />
      {Array.from({ length: lines }).map((_, i) => <SkeletonLine key={i} />)}
    </div>
  );
}
