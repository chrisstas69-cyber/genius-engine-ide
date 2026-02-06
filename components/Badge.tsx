'use client';

import { ReactNode } from 'react';

type BadgeVariant = 'status' | 'mindset' | 'term';

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
  score?: number;
}

const variantStyles: Record<BadgeVariant, string> = {
  // Status Badge: Success green for scores
  status: 'bg-success-muted text-success px-2.5 py-1 rounded-full text-sm font-semibold',
  // Mindset Badge: Dark hover background with icon
  mindset: 'bg-dark-hover text-text-secondary px-2 py-1 rounded-full text-xs flex items-center gap-1.5',
  // Term Badge: Rounded pill for smart suggestions
  term: 'bg-dark-hover border border-border-subtle text-text-secondary px-3 py-1.5 rounded-full text-xs brightness-hover cursor-pointer hover:text-text-primary hover:border-border-hover',
};

export default function Badge({ variant = 'status', children, icon, className = '', score }: BadgeProps) {
  // Special handling for status badges with scores
  if (variant === 'status' && score !== undefined) {
    return (
      <span className={`${variantStyles[variant]} ${className}`}>
        {score}/100
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center ${variantStyles[variant]} ${className}`}>
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  );
}

// Convenience components for common badge types
export function ScoreBadge({ score, className = '' }: { score: number; className?: string }) {
  return (
    <span className={`bg-success-muted text-success px-2.5 py-1 rounded-full text-sm font-semibold ${className}`}>
      {score}/100
    </span>
  );
}

export function MindsetBadge({ 
  icon, 
  name, 
  className = '' 
}: { 
  icon: string; 
  name: string; 
  className?: string;
}) {
  return (
    <span className={`bg-dark-hover text-text-secondary px-2 py-1 rounded-full text-xs flex items-center gap-1.5 ${className}`}>
      <span className="text-sm">{icon}</span>
      <span>{name}</span>
    </span>
  );
}

export function TermBadge({ 
  term, 
  onClick,
  className = '' 
}: { 
  term: string;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`bg-dark-hover border border-border-subtle text-text-secondary px-3 py-1.5 rounded-full text-xs brightness-hover hover:text-text-primary hover:border-border-hover transition-colors ${className}`}
    >
      {term}
    </button>
  );
}
