import { NextRequest, NextResponse } from 'next/server';
import { cognitoAdapter } from '@/lib/aws/cognito-auth';
import logger from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, confirmationCode } = body;

    // Validate required fields
    if (!email || !confirmationCode) {
      return NextResponse.json(
        { 
          error: 'Campos obrigatórios faltando',
          message: 'Email e código de confirmação são obrigatórios',
          field: !email ? 'email' : 'confirmationCode'
        },
        { status: 400 }
      );
    }

    // Validate confirmation code format (6 digits)
    if (!/^\d{6}$/.test(confirmationCode)) {
      return NextResponse.json(
        { 
          error: 'Código inválido',
          message: 'O código deve ter 6 dígitos',
          field: 'confirmationCode'
        },
        { status: 400 }
      );
    }

    // Check if we should use Cognito or mock
    const isMockMode = process.env.NEXT_PUBLIC_ENABLE_MOCK_AUTH === 'true';
    const hasCognitoConfig = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID && process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID;

    if (!isMockMode && cognitoAdapter && hasCognitoConfig) {
      try {
        // Use real Cognito confirmation
        logger.info('Confirming user with AWS Cognito:', { email });
        
        const confirmed = await cognitoAdapter.confirmSignUp(email, confirmationCode);

        if (confirmed) {
          logger.info('Cognito confirmation successful:', { email });

          return NextResponse.json({
            success: true,
            message: 'Email confirmado com sucesso!',
            data: {
              email,
              confirmed: true
            }
          });
        } else {
          return NextResponse.json(
            { 
              error: 'Falha na confirmação',
              message: 'Não foi possível confirmar o email'
            },
            { status: 400 }
          );
        }

      } catch (error: any) {
        logger.error('Cognito confirmation failed:', error);

        // Handle specific Cognito errors
        let errorMessage = 'Erro ao confirmar email. Tente novamente.';
        let errorField = undefined;

        if (error.name === 'CodeMismatchException') {
          errorMessage = 'Código de confirmação inválido';
          errorField = 'confirmationCode';
        } else if (error.name === 'ExpiredCodeException') {
          errorMessage = 'Código expirado. Solicite um novo código.';
          errorField = 'confirmationCode';
        } else if (error.name === 'UserNotFoundException') {
          errorMessage = 'Usuário não encontrado';
          errorField = 'email';
        } else if (error.name === 'NotAuthorizedException') {
          errorMessage = 'Usuário já confirmado ou código inválido';
        } else if (error.name === 'TooManyFailedAttemptsException') {
          errorMessage = 'Muitas tentativas falharam. Tente novamente mais tarde.';
        }

        return NextResponse.json(
          { 
            error: 'Falha na confirmação',
            message: errorMessage,
            field: errorField,
            cognitoError: error.name
          },
          { status: 400 }
        );
      }
    }

    // Mock implementation - only if explicitly enabled
    if (!isMockMode) {
      return NextResponse.json(
        { 
          error: 'Serviço indisponível',
          message: 'Sistema de confirmação não configurado'
        },
        { status: 503 }
      );
    }

    // Mock confirmation for development
    logger.warn('Using mock confirmation for development:', { email });

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock validation - accept specific codes for testing
    const validMockCodes = ['123456', '000000', '111111'];
    
    if (!validMockCodes.includes(confirmationCode)) {
      return NextResponse.json(
        { 
          error: 'Código inválido',
          message: 'Código de confirmação inválido (Mock: use 123456)',
          field: 'confirmationCode'
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Email confirmado com sucesso! (Modo desenvolvimento)',
      data: {
        email,
        confirmed: true,
        mock: true
      }
    });

  } catch (error) {
    logger.error('Confirmation API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Erro interno',
        message: 'Erro interno do servidor. Tente novamente.',
      },
      { status: 500 }
    );
  }
}

// POST method for resending confirmation code
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { 
          error: 'Email obrigatório',
          message: 'Email é obrigatório para reenviar código',
          field: 'email'
        },
        { status: 400 }
      );
    }

    const isMockMode = process.env.NEXT_PUBLIC_ENABLE_MOCK_AUTH === 'true';
    const hasCognitoConfig = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID && process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID;

    if (!isMockMode && cognitoAdapter && hasCognitoConfig) {
      try {
        logger.info('Resending confirmation code with AWS Cognito:', { email });
        
        const result = await cognitoAdapter.resendConfirmationCode(email);

        return NextResponse.json({
          success: true,
          message: 'Código de confirmação reenviado!',
          data: {
            email,
            codeDeliveryDetails: result.codeDeliveryDetails
          }
        });

      } catch (error: any) {
        logger.error('Cognito resend confirmation failed:', error);

        let errorMessage = 'Erro ao reenviar código. Tente novamente.';

        if (error.name === 'UserNotFoundException') {
          errorMessage = 'Usuário não encontrado';
        } else if (error.name === 'InvalidParameterException') {
          errorMessage = 'Usuário já confirmado';
        } else if (error.name === 'TooManyRequestsException') {
          errorMessage = 'Muitas tentativas. Aguarde antes de tentar novamente.';
        }

        return NextResponse.json(
          { 
            error: 'Falha ao reenviar',
            message: errorMessage,
            cognitoError: error.name
          },
          { status: 400 }
        );
      }
    }

    // Mock resend
    if (isMockMode) {
      logger.warn('Using mock resend confirmation for development:', { email });
      
      await new Promise(resolve => setTimeout(resolve, 500));

      return NextResponse.json({
        success: true,
        message: 'Código reenviado! (Modo desenvolvimento - use 123456)',
        data: {
          email,
          mock: true,
          codeDeliveryDetails: {
            DeliveryMedium: 'EMAIL',
            Destination: email.replace(/(.{2}).*(@.*)/, '$1***$2')
          }
        }
      });
    }

    return NextResponse.json(
      { 
        error: 'Serviço indisponível',
        message: 'Sistema de confirmação não configurado'
      },
      { status: 503 }
    );

  } catch (error) {
    logger.error('Resend confirmation API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Erro interno',
        message: 'Erro interno do servidor. Tente novamente.',
      },
      { status: 500 }
    );
  }
}
