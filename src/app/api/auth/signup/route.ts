import { NextRequest, NextResponse } from 'next/server';
import { cognitoAdapter } from '@/lib/aws/cognito-auth';
import { getServerConfig } from '@/lib/aws/config';
import logger from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, confirmPassword } = body;

    // Validate required fields
    if (!email || !password || !name) {
      return NextResponse.json(
        { 
          error: 'Campos obrigatórios faltando',
          message: 'Email, senha e nome são obrigatórios',
          field: !email ? 'email' : !password ? 'password' : 'name'
        },
        { status: 400 }
      );
    }

    // Validate password confirmation
    if (password !== confirmPassword) {
      return NextResponse.json(
        { 
          error: 'Senhas não coincidem',
          message: 'A confirmação de senha deve ser igual à senha',
          field: 'confirmPassword'
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { 
          error: 'Email inválido',
          message: 'Por favor, insira um email válido',
          field: 'email'
        },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { 
          error: 'Senha muito fraca',
          message: 'A senha deve ter pelo menos 8 caracteres',
          field: 'password'
        },
        { status: 400 }
      );
    }

    // Check if we should use Cognito or fallback
    const isMockMode = process.env.NEXT_PUBLIC_ENABLE_MOCK_AUTH === 'true';
    const hasCognitoConfig = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID && process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID;

    if (!isMockMode && cognitoAdapter && hasCognitoConfig) {
      try {
        // Use real Cognito signup
        logger.info('Creating user with AWS Cognito:', { email, name });
        
        const cognitoResponse = await cognitoAdapter.signUp({
          email,
          password,
          name,
          role: 'student' // Default role for new users
        });

        logger.info('Cognito signup successful:', { 
          userSub: cognitoResponse.userSub,
          codeDeliveryDetails: cognitoResponse.codeDeliveryDetails 
        });

        return NextResponse.json({
          success: true,
          message: 'Conta criada com sucesso!',
          data: {
            userSub: cognitoResponse.userSub,
            email,
            name,
            confirmationRequired: !cognitoResponse.userConfirmed,
            codeDeliveryDetails: cognitoResponse.codeDeliveryDetails
          }
        }, { status: 201 });

      } catch (error: any) {
        logger.error('Cognito signup failed:', error);

        // Handle specific Cognito errors
        let errorMessage = 'Erro ao criar conta. Tente novamente.';
        let errorField = undefined;

        if (error.name === 'UsernameExistsException') {
          errorMessage = 'Este email já está cadastrado';
          errorField = 'email';
        } else if (error.name === 'InvalidPasswordException') {
          errorMessage = 'Senha não atende aos critérios de segurança';
          errorField = 'password';
        } else if (error.name === 'InvalidParameterException') {
          errorMessage = 'Dados inválidos fornecidos';
        } else if (error.name === 'TooManyRequestsException') {
          errorMessage = 'Muitas tentativas. Tente novamente em alguns minutos.';
        }

        // Only fall through to mock if explicitly enabled
        if (!isMockMode) {
          return NextResponse.json(
            { 
              error: 'Falha no cadastro',
              message: errorMessage,
              field: errorField,
              cognitoError: error.name
            },
            { status: 400 }
          );
        }
      }
    }

    // Mock implementation - only if explicitly enabled
    if (!isMockMode) {
      return NextResponse.json(
        { 
          error: 'Serviço indisponível',
          message: 'Sistema de cadastro não configurado'
        },
        { status: 503 }
      );
    }

    // Mock signup for development
    logger.warn('Using mock signup for development:', { email, name });

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simulate random failure (5% chance)
    if (Math.random() < 0.05) {
      return NextResponse.json(
        { 
          error: 'Falha temporária',
          message: 'Erro temporário no servidor. Tente novamente.'
        },
        { status: 500 }
      );
    }

    // Check for mock duplicate email
    if (email === 'admin@example.com' || email === 'test@example.com') {
      return NextResponse.json(
        { 
          error: 'Email já cadastrado',
          message: 'Este email já está cadastrado',
          field: 'email'
        },
        { status: 409 }
      );
    }

    const mockUserSub = `mock-user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    return NextResponse.json({
      success: true,
      message: 'Conta criada com sucesso! (Modo desenvolvimento)',
      data: {
        userSub: mockUserSub,
        email,
        name,
        confirmationRequired: false,
        mock: true,
        codeDeliveryDetails: {
          DeliveryMedium: 'EMAIL',
          Destination: email.replace(/(.{2}).*(@.*)/, '$1***$2')
        }
      }
    }, { status: 201 });

  } catch (error) {
    logger.error('Signup API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Erro interno',
        message: 'Erro interno do servidor. Tente novamente.',
      },
      { status: 500 }
    );
  }
}

// GET method for testing API availability
export async function GET() {
  return NextResponse.json({
    message: 'Signup API is available',
    timestamp: new Date().toISOString(),
    cognitoConfigured: !!(process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID && process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID),
    mockMode: process.env.NEXT_PUBLIC_ENABLE_MOCK_AUTH === 'true'
  });
}
