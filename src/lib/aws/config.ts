import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { S3Client } from '@aws-sdk/client-s3';
import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';
import { CloudWatchClient } from '@aws-sdk/client-cloudwatch';

// ✅ SEGURO: Apenas configurações públicas no cliente
export const publicAwsConfig = {
  region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1',
  s3: {
    bucketName: process.env.NEXT_PUBLIC_S3_BUCKET || '',
  },
  cognito: {
    userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || '',
    clientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || '',
  },
  cloudfront: {
    distributionDomain: process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN || '',
  },
  apiGateway: {
    url: process.env.NEXT_PUBLIC_API_GATEWAY_URL || '',
  }
};

// Alias para compatibilidade com outros arquivos
export const getPublicConfig = () => publicAwsConfig;

// ✅ SEGURO: Função server-side only
export function getServerConfig() {
  if (typeof window !== 'undefined') {
    throw new Error('❌ getServerConfig pode ser usado apenas no servidor!');
  }
  
  // Validação obrigatória de variáveis
  const required = ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`❌ Variáveis obrigatórias faltando: ${missing.join(', ')}`);
  }
  
  return {
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
    dynamodb: {
      coursesTable: process.env.DYNAMODB_COURSES_TABLE || 'plataforma-courses',
      libraryTable: process.env.DYNAMODB_LIBRARY_TABLE || 'plataforma-library',
      usersTable: process.env.DYNAMODB_USERS_TABLE || 'plataforma-users',
      enrollmentsTable: process.env.DYNAMODB_ENROLLMENTS_TABLE || 'plataforma-enrollments',
      progressTable: process.env.DYNAMODB_PROGRESS_TABLE || 'plataforma-progress',
      videoProgressTable: process.env.DYNAMODB_VIDEO_PROGRESS_TABLE || 'plataforma-video-progress',
    },
    ses: {
      senderEmail: process.env.SES_SENDER_EMAIL || '',
      region: process.env.SES_REGION || process.env.AWS_REGION || 'us-east-1',
    },
    lambda: {
      emailNotificationArn: process.env.LAMBDA_EMAIL_NOTIFICATION_ARN || '',
      processPaymentArn: process.env.LAMBDA_PROCESS_PAYMENT_ARN || '',
      generateCertificateArn: process.env.LAMBDA_GENERATE_CERTIFICATE_ARN || '',
      createEnrollmentArn: process.env.LAMBDA_CREATE_ENROLLMENT_ARN || '',
      validateEnrollmentArn: process.env.LAMBDA_VALIDATE_ENROLLMENT_ARN || '',
      checkEligibilityArn: process.env.LAMBDA_CHECK_ELIGIBILITY_ARN || '',
      updateMetricsArn: process.env.LAMBDA_UPDATE_METRICS_ARN || '',
      imageProcessorArn: process.env.LAMBDA_IMAGE_PROCESSOR_ARN || '',
    },
    redis: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD || '',
    }
  };
}

// ✅ SEGURO: Factory functions para criar clientes AWS
export function createDynamoClient() {
  const config = getServerConfig();
  return new DynamoDBClient({
    region: publicAwsConfig.region,
    credentials: config.credentials,
  });
}

export function createS3Client() {
  const config = getServerConfig();
  return new S3Client({
    region: publicAwsConfig.region,
    credentials: config.credentials,
    forcePathStyle: false,
  });
}

export function createCognitoClient() {
  // Only create on server-side
  if (typeof window !== 'undefined') {
    throw new Error('CognitoClient should only be created on server-side');
  }

  const config = getServerConfig();
  return new CognitoIdentityProviderClient({
    region: publicAwsConfig.region,
    credentials: config.credentials,
  });
}

// Lazy singleton - only created when needed on server-side
let _cognitoClient: CognitoIdentityProviderClient | null = null;
export function getCognitoClient() {
  if (typeof window !== 'undefined') {
    throw new Error('CognitoClient should only be accessed on server-side');
  }

  if (!_cognitoClient) {
    _cognitoClient = createCognitoClient();
  }
  return _cognitoClient;
}

// Backward compatibility - but will throw error on client-side
export const cognitoClient = typeof window === 'undefined' ? getCognitoClient() : null;

export function createCloudWatchClient() {
  const config = getServerConfig();
  return new CloudWatchClient({
    region: publicAwsConfig.region,
    credentials: config.credentials,
  });
}

// Lazy singletons for backward compatibility
let _dynamoClient: DynamoDBClient | null = null;
let _s3Client: S3Client | null = null;

export function getDynamoClient() {
  if (typeof window !== 'undefined') {
    throw new Error('DynamoClient should only be accessed on server-side');
  }
  if (!_dynamoClient) {
    _dynamoClient = createDynamoClient();
  }
  return _dynamoClient;
}

export function getS3Client() {
  if (typeof window !== 'undefined') {
    throw new Error('S3Client should only be accessed on server-side');
  }
  if (!_s3Client) {
    _s3Client = createS3Client();
  }
  return _s3Client;
}

// Backward compatibility exports
export const dynamoClient = typeof window === 'undefined' ? getDynamoClient() : null;
export const s3Client = typeof window === 'undefined' ? getS3Client() : null;

// Helper para verificar ambiente
export const isBrowser = typeof window !== 'undefined';

// Helper para URLs de assets (seguro para cliente)
export const getAssetUrl = (key: string): string => {
  if (publicAwsConfig.cloudfront.distributionDomain) {
    return `https://${publicAwsConfig.cloudfront.distributionDomain}/${key}`;
  }
  return `https://${publicAwsConfig.s3.bucketName}.s3.${publicAwsConfig.region}.amazonaws.com/${key}`;
};

// ⚠️ DEPRECATED: Manter temporariamente para compatibilidade
// REMOVER após migração completa
export const awsConfig = publicAwsConfig;
