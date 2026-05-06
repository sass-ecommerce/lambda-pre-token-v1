import { PreTokenGenerationV2TriggerEvent } from 'aws-lambda';
import { buildClaims } from './preToken.service';

export const preToken = async (
  event: PreTokenGenerationV2TriggerEvent,
): Promise<PreTokenGenerationV2TriggerEvent> => {
  console.log('Received pre-token generation event', { event });
  console.log('User attributes', { userAttributes: event.request.userAttributes });

  const userId = event.request.userAttributes['custom:id'];
  const sub = event.request.userAttributes['sub'];

  let claims: Record<string, string> = {};
  if (userId && sub) {
    try {
      claims = await buildClaims(userId, sub);
    } catch (error) {
      console.error('Failed to build claims, returning minimal claims', { userId, sub, error });
    }
  }

  return {
    ...event,
    response: {
      claimsAndScopeOverrideDetails: {
        accessTokenGeneration: {
          claimsToAddOrOverride: { ...claims, ...(userId ? { id: userId } : {}) },
        },
      },
    },
  };
};
