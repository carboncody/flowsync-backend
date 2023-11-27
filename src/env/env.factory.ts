import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { z } from 'zod';

const runtimeStringLiteral = z.union([
  z.literal('test'),
  z.literal('development'),
  z.literal('staging'),
  z.literal('production'),
]);
export const Environment = z.object({
  baseDevUrl: z.string(),
  frontendUrl: z.string(),
  port: z.string(),
  runtime: runtimeStringLiteral,
  auth0: z.object({
    clientId: z.string(),
    clientSecret: z.string(),
    issuerBaseUrl: z.string(),
    publicCertificate: z.string(),
  }),
  postmark: z.object({
    serverToken: z.string(),
  }),
});

export type Environment = z.infer<typeof Environment>;

function createGetMacro(configService: ConfigService) {
  return (key: string): string | undefined => {
    return configService.get<string | undefined>(key);
  };
}

async function getAuthPublicCertificate(authUrl: string): Promise<string> {
  const response = await axios.get<string>(`${authUrl}/pem`);
  return response.data;
}

export async function createEnvironment(
  configService: ConfigService,
): Promise<Environment> {
  const getEnv = createGetMacro(configService);
  const runtime = getEnv('NODE_ENV') ?? 'development';
  const port = getEnv('PORT') ?? '4000';

  let baseDevUrl = getEnv('BASE_URL');
  if (baseDevUrl === undefined) {
    if (getEnv('NODE_ENV') === 'production') {
      throw new Error('Error while loading base url in production.');
    }

    baseDevUrl = `http://localhost:${port}`;
  }

  const issuerBaseUrl = getEnv('AUTH0_ISSUER_BASE_URL');
  if (!issuerBaseUrl) {
    throw new Error('No base url');
  }

  const publicCertificate = await getAuthPublicCertificate(issuerBaseUrl);

  const result = Environment.safeParse({
    baseDevUrl,
    port,
    frontendUrl: getEnv('FRONTEND_URL'),
    runtime,
    auth0: {
      clientId: getEnv('AUTH0_CLIENT_ID'),
      clientSecret: getEnv('AUTH0_CLIENT_SECRET'),
      issuerBaseUrl,
      publicCertificate,
    },
    postmark: {
      serverToken: getEnv('POSTMARK_SERVER_TOKEN'),
    },
  });

  if (!result.success) {
    console.error(
      'Failed to initialise env file - This is usually because the key is missing',
    );
    for (const err of result.error.errors) {
      const { code, message, path } = err;
      console.error(
        `Zod error "${code}": ${message} - For variable path: ${path.join(
          '.',
        )} - Full error: ${JSON.stringify(err)}`,
      );
    }

    throw new Error('Could not create Environment from env file');
  }

  return result.data;
}
