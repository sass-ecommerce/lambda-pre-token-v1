import { PreTokenGenerationV2TriggerEvent } from 'aws-lambda';
import { buildClaims } from './preToken.service';

export const preToken = async (
  event: PreTokenGenerationV2TriggerEvent,
): Promise<PreTokenGenerationV2TriggerEvent> => {
  console.log('Received pre-token generation event', { event });
  const userId = event.request.userAttributes['custom:id'];
  const sub = event.request.userAttributes['sub'];
  const claims = await buildClaims(userId, sub);

  return {
    ...event,
    response: {
      claimsAndScopeOverrideDetails: {
        accessTokenGeneration: {
          claimsToAddOrOverride: claims,
        },
      },
    },
  };
};
