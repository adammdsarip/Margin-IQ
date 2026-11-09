import { useEffect } from 'react';
import { navigate, useParams } from '../app/router.jsx';
import { useAppState } from '../state/AppStateContext.jsx';

/**
 * Resolves :profileId / :offerId route params to saved records and
 * redirects when they don't exist (deleted, or from another device).
 * An offer is only returned if it belongs to the profile in the URL.
 */
export default function useRouteRecords() {
  const { profileId, offerId } = useParams();
  const { getProfile, getOffer } = useAppState();

  const profile = profileId ? getProfile(profileId) : null;
  const rawOffer = offerId ? getOffer(offerId) : null;
  const offer = rawOffer && profile && rawOffer.profileId === profile.id ? rawOffer : null;

  const missingProfile = Boolean(profileId) && !profile;
  const missingOffer = Boolean(offerId) && !offer;

  useEffect(() => {
    if (missingProfile) navigate('/');
    else if (missingOffer) navigate(`/business/${profileId}`);
  }, [missingProfile, missingOffer, profileId]);

  return { profile, offer, ready: !missingProfile && !missingOffer };
}
