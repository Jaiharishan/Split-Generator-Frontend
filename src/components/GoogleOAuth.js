import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const GOOGLE_CLIENT_ID = '678327383387-fubsd17htt4s2u2n0gsag71vjng8s7gt.apps.googleusercontent.com';

function GoogleOAuth({ onSuccess, onError, className = '' }) {
  const { googleLogin } = useAuth();

  useEffect(() => {
    // Load Google Identity Services script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        window.google.accounts.id.renderButton(
          document.getElementById('google-signin-button'),
          {
            theme: 'outline',
            size: 'large',
            type: 'standard',
            text: 'signin_with',
            shape: 'rectangular',
            logo_alignment: 'left',
            width: '100%',
            height: '48px',
          }
        );
      }
    };

    return () => {
      // Cleanup
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const handleCredentialResponse = async (response) => {
    try {
      // Decode the JWT token to get user info
      const payload = JSON.parse(atob(response.credential.split('.')[1]));
      
      const userData = {
        provider: 'google',
        providerId: payload.sub,
        email: payload.email,
        name: payload.name,
        avatarUrl: payload.picture
      };

      await googleLogin(userData);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Google OAuth error:', error);
      if (onError) onError(error.message);
    }
  };

  return (
    <div className={`${className}`}>
      <div id="google-signin-button" className="w-full"></div>
    </div>
  );
}

export default GoogleOAuth; 