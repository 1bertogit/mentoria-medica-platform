import {
  SignUpCommand,
  InitiateAuthCommand,
  ConfirmSignUpCommand,
  ResendConfirmationCodeCommand,
  ForgotPasswordCommand,
  ConfirmForgotPasswordCommand,
  ChangePasswordCommand,
  GetUserCommand,
  UpdateUserAttributesCommand,
  AdminGetUserCommand,
  AdminCreateUserCommand,
  AdminSetUserPasswordCommand,
  AuthFlowType,
  ChallengeNameType,
  MessageActionType
} from '@aws-sdk/client-cognito-identity-provider';
import { getCognitoClient, publicAwsConfig } from './config';
import logger from '@/lib/logger';

// Helper function to get client safely
function getClient() {
  return getCognitoClient();
}

export interface CognitoUser {
  sub: string;
  email: string;
  name: string;
  role: string;
  email_verified: boolean;
  phone_number?: string;
  avatar_url?: string;
}

export interface AuthResult {
  accessToken: string;
  refreshToken: string;
  idToken: string;
  user: CognitoUser;
}

export interface SignUpData {
  email: string;
  password: string;
  name: string;
  role?: 'student' | 'mentor';
  phone_number?: string;
}

export const cognitoAuthService = {
  /**
   * Sign up a new user
   */
  async signUp(userData: SignUpData): Promise<{ userSub: string; codeDeliveryDetails: any }> {
    const { email, password, name, role = 'student', phone_number } = userData;

    try {
      const command = new SignUpCommand({
        ClientId: publicAwsConfig.cognito.clientId,
        Username: email,
        Password: password,
        UserAttributes: [
          { Name: 'email', Value: email },
          { Name: 'name', Value: name },
          { Name: 'custom:role', Value: role },
          ...(phone_number ? [{ Name: 'phone_number', Value: phone_number }] : [])
        ]
      });

      const client = getCognitoClient();
      const response = await client.send(command);
      
      return {
        userSub: response.UserSub!,
        codeDeliveryDetails: response.CodeDeliveryDetails
      };
    } catch (error) {
      logger.error('Cognito sign up error:', error);
      throw this.handleCognitoError(error);
    }
  },

  /**
   * Confirm sign up with verification code
   */
  async confirmSignUp(email: string, confirmationCode: string): Promise<void> {
    try {
      const command = new ConfirmSignUpCommand({
        ClientId: publicAwsConfig.cognito.clientId,
        Username: email,
        ConfirmationCode: confirmationCode
      });

      await getClient().send(command);
    } catch (error) {
      logger.error('Confirm sign up error:', error);
      throw this.handleCognitoError(error);
    }
  },

  /**
   * Resend confirmation code
   */
  async resendConfirmationCode(email: string): Promise<unknown> {
    try {
      const command = new ResendConfirmationCodeCommand({
        ClientId: publicAwsConfig.cognito.clientId,
        Username: email
      });

      return await getClient().send(command);
    } catch (error) {
      logger.error('Resend confirmation error:', error);
      throw this.handleCognitoError(error);
    }
  },

  /**
   * Sign in user
   */
  async signIn(email: string, password: string): Promise<AuthResult> {
    try {
      const command = new InitiateAuthCommand({
        ClientId: publicAwsConfig.cognito.clientId,
        AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
        AuthParameters: {
          USERNAME: email,
          PASSWORD: password
        }
      });

      const response = await getClient().send(command);

      if (response.ChallengeName) {
        throw new Error(`Authentication challenge required: ${response.ChallengeName}`);
      }

      if (!response.AuthenticationResult) {
        throw new Error('Authentication failed');
      }

      const { AccessToken, RefreshToken, IdToken } = response.AuthenticationResult;

      if (!AccessToken || !RefreshToken || !IdToken) {
        throw new Error('Invalid authentication response');
      }

      // Get user details
      const user = await this.getCurrentUser(AccessToken);

      return {
        accessToken: AccessToken,
        refreshToken: RefreshToken,
        idToken: IdToken,
        user
      };
    } catch (error) {
      logger.error('Sign in error:', error);
      throw this.handleCognitoError(error);
    }
  },

  /**
   * Get current user details
   */
  async getCurrentUser(accessToken: string): Promise<CognitoUser> {
    try {
      const command = new GetUserCommand({
        AccessToken: accessToken
      });

      const response = await getClient().send(command);
      const attributes = response.UserAttributes || [];

      const getAttribute = (name: string) =>
        attributes.find(attr => attr.Name === name)?.Value || '';

      return {
        sub: response.Username!,
        email: getAttribute('email'),
        name: getAttribute('name'),
        role: getAttribute('custom:role') || 'student',
        email_verified: getAttribute('email_verified') === 'true',
        phone_number: getAttribute('phone_number'),
        avatar_url: getAttribute('picture')
      };
    } catch (error) {
      logger.error('Get current user error:', error);
      throw this.handleCognitoError(error);
    }
  },

  /**
   * Forgot password
   */
  async forgotPassword(email: string): Promise<unknown> {
    try {
      const command = new ForgotPasswordCommand({
        ClientId: publicAwsConfig.cognito.clientId,
        Username: email
      });

      return await getClient().send(command);
    } catch (error) {
      logger.error('Forgot password error:', error);
      throw this.handleCognitoError(error);
    }
  },

  /**
   * Confirm forgot password
   */
  async confirmForgotPassword(email: string, confirmationCode: string, newPassword: string): Promise<void> {
    try {
      const command = new ConfirmForgotPasswordCommand({
        ClientId: publicAwsConfig.cognito.clientId,
        Username: email,
        ConfirmationCode: confirmationCode,
        Password: newPassword
      });

      await getClient().send(command);
    } catch (error) {
      logger.error('Confirm forgot password error:', error);
      throw this.handleCognitoError(error);
    }
  },

  /**
   * Change password
   */
  async changePassword(accessToken: string, oldPassword: string, newPassword: string): Promise<void> {
    try {
      const command = new ChangePasswordCommand({
        AccessToken: accessToken,
        PreviousPassword: oldPassword,
        ProposedPassword: newPassword
      });

      await getClient().send(command);
    } catch (error) {
      logger.error('Change password error:', error);
      throw this.handleCognitoError(error);
    }
  },

  /**
   * Update user attributes
   */
  async updateUserAttributes(accessToken: string, attributes: Record<string, string>): Promise<void> {
    try {
      const userAttributes = Object.entries(attributes).map(([name, value]) => ({
        Name: name,
        Value: value
      }));

      const command = new UpdateUserAttributesCommand({
        AccessToken: accessToken,
        UserAttributes: userAttributes
      });

      await getClient().send(command);
    } catch (error) {
      logger.error('Update user attributes error:', error);
      throw this.handleCognitoError(error);
    }
  },

  /**
   * Handle Cognito errors
   */
  handleCognitoError(error: unknown): Error {
    const errorMessage = error.message || 'Authentication error occurred';
    const errorCode = error.name || 'UnknownError';

    switch (errorCode) {
      case 'UserNotFoundException':
        return new Error('Usuário não encontrado');
      case 'NotAuthorizedException':
        return new Error('Email ou senha incorretos');
      case 'UserNotConfirmedException':
        return new Error('Usuário não confirmado. Verifique seu email');
      case 'CodeMismatchException':
        return new Error('Código de verificação inválido');
      case 'ExpiredCodeException':
        return new Error('Código de verificação expirado');
      case 'LimitExceededException':
        return new Error('Muitas tentativas. Tente novamente mais tarde');
      case 'InvalidPasswordException':
        return new Error('Senha não atende aos requisitos de segurança');
      case 'UsernameExistsException':
        return new Error('Este email já está sendo usado');
      default:
        return new Error(errorMessage);
    }
  }
};

// Export alias for backward compatibility
export const cognitoAdapter = cognitoAuthService;