'use client'

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { X } from 'lucide-react'
import { supabaseClient } from '@/lib/supabase-client'

interface AuthModalProps {
  onClose: () => void
}

export function AuthModal({ onClose }: AuthModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-sm rounded-2xl border border-border/50 bg-card p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-foreground">Welcome</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Sign in, create an account, or reset your password.
          </p>
        </div>
        <Auth
          supabaseClient={supabaseClient}
          view="sign_in"
          redirectTo={
            typeof window !== 'undefined'
              ? window.location.origin + '/auth/callback'
              : '/auth/callback'
          }
          showLinks={true}
          appearance={{
            theme: ThemeSupa,
            style: {
              input: {
                color: 'white',
                backgroundColor: '#1f2937',
                borderColor: '#374151',
              },
              label: {
                color: '#d1d5db',
              },
              button: {
                backgroundColor: '#7c3aed',
                color: 'white',
              },
              anchor: {
                color: '#a78bfa',
              },
            },
          }}
          providers={[]}
        />
      </div>
    </div>
  )
}
