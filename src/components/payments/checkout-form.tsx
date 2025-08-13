'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CreditCard, Smartphone, FileText } from 'lucide-react';
import logger from '@/lib/logger';

interface CheckoutFormProps {
  courseId: string;
  courseName: string;
  coursePrice: number;
  userId: string;
  onSuccess: (result: any) => void;
  onError: (error: string) => void;
}

export function CheckoutForm({
  courseId,
  courseName,
  coursePrice,
  userId,
  onSuccess,
  onError
}: CheckoutFormProps) {
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'pix' | 'boleto'>('credit_card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvv: '',
    installments: '1',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // First check eligibility
      const eligibilityResponse = await fetch('/api/eligibility/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          courseId,
          userProfile: {} // Could include user profile data
        }),
      });

      const eligibilityResult = await eligibilityResponse.json();

      if (!eligibilityResult.success || !eligibilityResult.eligible) {
        throw new Error(eligibilityResult.message || 'User not eligible for this course');
      }

      // Prepare payment data
      const paymentData = {
        method: paymentMethod,
        amount: coursePrice,
        currency: 'BRL',
        ...(paymentMethod === 'credit_card' && {
          cardNumber: formData.cardNumber,
          cardName: formData.cardName,
          cardExpiry: formData.cardExpiry,
          cardCvv: formData.cardCvv,
          installments: parseInt(formData.installments),
        }),
      };

      // Process payment
      const paymentResponse = await fetch('/api/payments/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          courseId,
          paymentData,
        }),
      });

      const paymentResult = await paymentResponse.json();

      if (!paymentResult.success) {
        throw new Error(paymentResult.message || 'Payment processing failed');
      }

      // Create enrollment
      const enrollmentResponse = await fetch('/api/enrollments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          courseId,
          paymentDetails: paymentResult.paymentDetails,
          eligibilityDetails: eligibilityResult,
        }),
      });

      const enrollmentResult = await enrollmentResponse.json();

      if (!enrollmentResult.success) {
        throw new Error(enrollmentResult.message || 'Enrollment creation failed');
      }

      // Send notification
      await fetch('/api/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'enrollment_success',
          userId,
          data: {
            courseName,
            enrollmentId: enrollmentResult.enrollmentId,
            transactionId: paymentResult.transactionId,
          },
        }),
      });

      onSuccess({
        payment: paymentResult,
        enrollment: enrollmentResult,
      });

    } catch (error) {
      logger.error('Checkout error:', error);
      onError(error instanceof Error ? error.message : 'Checkout failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Finalizar Compra</CardTitle>
        <CardDescription>
          {courseName} - {formatPrice(coursePrice)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Payment Method Selection */}
          <div className="space-y-2">
            <Label>Método de Pagamento</Label>
            <Select value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="credit_card">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Cartão de Crédito
                  </div>
                </SelectItem>
                <SelectItem value="pix">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4" />
                    PIX
                  </div>
                </SelectItem>
                <SelectItem value="boleto">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Boleto Bancário
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Credit Card Fields */}
          {paymentMethod === 'credit_card' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Número do Cartão</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={formData.cardNumber}
                  onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cardName">Nome no Cartão</Label>
                <Input
                  id="cardName"
                  placeholder="João Silva"
                  value={formData.cardName}
                  onChange={(e) => handleInputChange('cardName', e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cardExpiry">Validade</Label>
                  <Input
                    id="cardExpiry"
                    placeholder="MM/AA"
                    value={formData.cardExpiry}
                    onChange={(e) => handleInputChange('cardExpiry', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardCvv">CVV</Label>
                  <Input
                    id="cardCvv"
                    placeholder="123"
                    value={formData.cardCvv}
                    onChange={(e) => handleInputChange('cardCvv', e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Parcelas</Label>
                <Select value={formData.installments} onValueChange={(value) => handleInputChange('installments', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1x {formatPrice(coursePrice)}</SelectItem>
                    <SelectItem value="2">2x {formatPrice(coursePrice / 2)}</SelectItem>
                    <SelectItem value="3">3x {formatPrice(coursePrice / 3)}</SelectItem>
                    <SelectItem value="6">6x {formatPrice(coursePrice / 6)}</SelectItem>
                    <SelectItem value="12">12x {formatPrice(coursePrice / 12)}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {/* PIX Instructions */}
          {paymentMethod === 'pix' && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                Após confirmar, você receberá um código PIX para pagamento instantâneo.
              </p>
            </div>
          )}

          {/* Boleto Instructions */}
          {paymentMethod === 'boleto' && (
            <div className="p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-800">
                O boleto será gerado e enviado por email. Vencimento em 3 dias úteis.
              </p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processando...
              </>
            ) : (
              `Pagar ${formatPrice(coursePrice)}`
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
