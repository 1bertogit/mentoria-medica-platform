'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { GlassCard } from '@/components/shared/glass-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  Camera,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Globe,
  Instagram,
  Linkedin,
  Twitter,
  Save,
  ArrowLeft,
  Upload,
  X,
  Crop,
  ZoomIn,
  ZoomOut,
  Check,
} from 'lucide-react';
import { toastHelpers } from '@/hooks/use-toast';

// Mock user data
const initialUserData = {
  name: 'Dr. João Silva',
  email: 'joao.silva@example.com',
  phone: '+55 11 99999-9999',
  location: 'São Paulo, SP',
  role: 'Cardiologista',
  hospital: 'Hospital Albert Einstein',
  education: 'USP - Faculdade de Medicina',
  bio: 'Cardiologista com mais de 15 anos de experiência em medicina cardiovascular. Especializado em tratamento de arritmias e doenças coronárias.',
  website: 'https://drjoaosilva.com.br',
  instagram: '@drjoaosilva',
  linkedin: 'joao-silva-cardio',
  twitter: '@drjoao_cardio',
  avatar: '/images/doctors/doctor1.jpg',
  notifications: {
    email: true,
    push: false,
    sms: false,
  },
};

export default function ProfileSettingsPage() {
  const router = useRouter();
  const [userData, setUserData] = useState(initialUserData);
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [cropScale, setCropScale] = useState(1);
  const [cropPosition, setCropPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleInputChange = (field: string, value: string) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNotificationChange = (type: string, value: boolean) => {
    setUserData((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, [type]: value },
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toastHelpers.error(
          'Arquivo muito grande',
          'O arquivo deve ter no máximo 5MB'
        );
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
        setShowCropModal(true);
        setCropScale(1);
        setCropPosition({ x: 0, y: 0 });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarPreview(null);
    setShowCropModal(false);
  };

  const handleCropConfirm = () => {
    setShowCropModal(false);
    toastHelpers.success(
      'Imagem ajustada',
      'A imagem foi ajustada com sucesso'
    );
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - cropPosition.x,
      y: e.clientY - cropPosition.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setCropPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    toastHelpers.success(
      'Perfil atualizado',
      'Suas informações foram salvas com sucesso'
    );
  };

  return (
    <div className="min-h-screen space-y-6">
      {/* Header */}
      <GlassCard className="relative overflow-hidden bg-black/90 p-6">
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className="border-white/20 bg-white/10 text-white hover:bg-white/20"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white">
                Configurações do Perfil
              </h1>
              <p className="mt-1 text-sm text-white/60">
                Gerencie suas informações pessoais e preferências
              </p>
            </div>
          </div>
        </div>
      </GlassCard>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Avatar Section */}
        <div className="lg:col-span-1">
          <GlassCard className="bg-black/80 p-6">
            <h3 className="mb-4 text-lg font-semibold text-white">
              Foto de Perfil
            </h3>
            <div className="space-y-4">
              <div className="relative mx-auto h-40 w-40">
                <div className="relative h-full w-full overflow-hidden rounded-full border-4 border-white/10 bg-black">
                  <Image
                    src={avatarPreview || userData.avatar}
                    alt="Avatar"
                    fill
                    className="object-cover"
                  />
                  {avatarPreview && (
                    <button
                      onClick={handleRemoveAvatar}
                      className="absolute right-2 top-2 rounded-full bg-red-500/80 p-1.5 backdrop-blur-sm transition-colors hover:bg-red-500/90"
                    >
                      <X className="h-4 w-4 text-white" />
                    </button>
                  )}
                </div>
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-2 right-2 cursor-pointer rounded-full bg-cyan-500/80 p-2.5 backdrop-blur-sm transition-colors hover:bg-cyan-500/90"
                >
                  <Camera className="h-5 w-5 text-white" />
                  <input
                    id="avatar-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleAvatarChange}
                  />
                </label>
              </div>
              <div className="text-center">
                <p className="text-sm text-white/60">
                  Clique no ícone da câmera para alterar
                </p>
                <p className="mt-1 text-xs text-white/40">
                  JPG, PNG ou GIF - Máximo 5MB
                </p>
              </div>
            </div>
          </GlassCard>

          {/* Quick Stats */}
          <GlassCard className="mt-6 bg-black/80 p-6">
            <h3 className="mb-4 text-lg font-semibold text-white">
              Notificações
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="email-notif" className="text-white/80">
                  Email
                </Label>
                <Switch
                  id="email-notif"
                  checked={userData.notifications.email}
                  onCheckedChange={(value) =>
                    handleNotificationChange('email', value)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="push-notif" className="text-white/80">
                  Push
                </Label>
                <Switch
                  id="push-notif"
                  checked={userData.notifications.push}
                  onCheckedChange={(value) =>
                    handleNotificationChange('push', value)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="sms-notif" className="text-white/80">
                  SMS
                </Label>
                <Switch
                  id="sms-notif"
                  checked={userData.notifications.sms}
                  onCheckedChange={(value) =>
                    handleNotificationChange('sms', value)
                  }
                />
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Form Section */}
        <div className="lg:col-span-2">
          <GlassCard className="bg-black/80 p-6">
            <h3 className="mb-6 text-lg font-semibold text-white">
              Informações Pessoais
            </h3>
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white/80">
                    Nome Completo
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                    <Input
                      id="name"
                      value={userData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="bg-white/5 pl-10 text-white placeholder:text-white/40"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white/80">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                    <Input
                      id="email"
                      type="email"
                      value={userData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="bg-white/5 pl-10 text-white placeholder:text-white/40"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-white/80">
                    Telefone
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                    <Input
                      id="phone"
                      value={userData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="bg-white/5 pl-10 text-white placeholder:text-white/40"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="text-white/80">
                    Localização
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                    <Input
                      id="location"
                      value={userData.location}
                      onChange={(e) =>
                        handleInputChange('location', e.target.value)
                      }
                      className="bg-white/5 pl-10 text-white placeholder:text-white/40"
                    />
                  </div>
                </div>
              </div>

              {/* Professional Info */}
              <div>
                <h4 className="mb-4 text-base font-medium text-white">
                  Informações Profissionais
                </h4>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-white/80">
                      Especialidade
                    </Label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                      <Input
                        id="role"
                        value={userData.role}
                        onChange={(e) => handleInputChange('role', e.target.value)}
                        className="bg-white/5 pl-10 text-white placeholder:text-white/40"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hospital" className="text-white/80">
                      Instituição
                    </Label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                      <Input
                        id="hospital"
                        value={userData.hospital}
                        onChange={(e) =>
                          handleInputChange('hospital', e.target.value)
                        }
                        className="bg-white/5 pl-10 text-white placeholder:text-white/40"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="education" className="text-white/80">
                      Formação
                    </Label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                      <Input
                        id="education"
                        value={userData.education}
                        onChange={(e) =>
                          handleInputChange('education', e.target.value)
                        }
                        className="bg-white/5 pl-10 text-white placeholder:text-white/40"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="bio" className="text-white/80">
                      Biografia
                    </Label>
                    <Textarea
                      id="bio"
                      value={userData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      className="min-h-[100px] bg-white/5 text-white placeholder:text-white/40"
                      placeholder="Fale um pouco sobre você..."
                    />
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div>
                <h4 className="mb-4 text-base font-medium text-white">
                  Redes Sociais
                </h4>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="website" className="text-white/80">
                      Website
                    </Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                      <Input
                        id="website"
                        value={userData.website}
                        onChange={(e) =>
                          handleInputChange('website', e.target.value)
                        }
                        className="bg-white/5 pl-10 text-white placeholder:text-white/40"
                        placeholder="https://"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="instagram" className="text-white/80">
                      Instagram
                    </Label>
                    <div className="relative">
                      <Instagram className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                      <Input
                        id="instagram"
                        value={userData.instagram}
                        onChange={(e) =>
                          handleInputChange('instagram', e.target.value)
                        }
                        className="bg-white/5 pl-10 text-white placeholder:text-white/40"
                        placeholder="@username"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="linkedin" className="text-white/80">
                      LinkedIn
                    </Label>
                    <div className="relative">
                      <Linkedin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                      <Input
                        id="linkedin"
                        value={userData.linkedin}
                        onChange={(e) =>
                          handleInputChange('linkedin', e.target.value)
                        }
                        className="bg-white/5 pl-10 text-white placeholder:text-white/40"
                        placeholder="seu-perfil"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="twitter" className="text-white/80">
                      Twitter
                    </Label>
                    <div className="relative">
                      <Twitter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                      <Input
                        id="twitter"
                        value={userData.twitter}
                        onChange={(e) =>
                          handleInputChange('twitter', e.target.value)
                        }
                        className="bg-white/5 pl-10 text-white placeholder:text-white/40"
                        placeholder="@username"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  variant="outline"
                  className="border-white/20 bg-white/10 text-white hover:bg-white/20"
                  onClick={() => router.back()}
                >
                  Cancelar
                </Button>
                <Button
                  className="bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30"
                  onClick={handleSave}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-cyan-300 border-t-transparent" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Salvar Alterações
                    </>
                  )}
                </Button>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Crop Modal */}
      {showCropModal && avatarPreview && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => {
            setShowCropModal(false);
            setAvatarPreview(null);
          }}
        >
          <GlassCard 
            className="relative max-w-lg w-full mx-4 bg-black/90 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-4 text-lg font-semibold text-white">
              Ajustar Imagem
            </h3>
            
            {/* Preview Container */}
            <div className="relative mb-6">
              <div className="relative mx-auto h-64 w-64 overflow-hidden rounded-full border-4 border-white/20 bg-black">
                <div
                  className="absolute inset-0 cursor-move"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                >
                  <Image
                    src={avatarPreview}
                    alt="Crop preview"
                    fill
                    className="object-cover"
                    style={{
                      transform: `scale(${cropScale}) translate(${cropPosition.x}px, ${cropPosition.y}px)`,
                      transition: isDragging ? 'none' : 'transform 0.2s',
                    }}
                    draggable={false}
                  />
                </div>
                
                {/* Crop Guide Circle */}
                <div className="pointer-events-none absolute inset-0 rounded-full border-2 border-white/50" />
              </div>
            </div>

            {/* Zoom Controls */}
            <div className="mb-6 space-y-2">
              <Label className="text-white/80">Zoom</Label>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="border-white/20 bg-white/10 text-white hover:bg-white/20"
                  onClick={() => setCropScale(Math.max(0.5, cropScale - 0.1))}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.1"
                  value={cropScale}
                  onChange={(e) => setCropScale(parseFloat(e.target.value))}
                  className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${((cropScale - 0.5) / 2.5) * 100}%, rgba(255, 255, 255, 0.2) ${((cropScale - 0.5) / 2.5) * 100}%, rgba(255, 255, 255, 0.2) 100%)`,
                  }}
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="border-white/20 bg-white/10 text-white hover:bg-white/20"
                  onClick={() => setCropScale(Math.min(3, cropScale + 0.1))}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-center text-xs text-white/40">
                Arraste a imagem para posicionar
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                className="border-white/20 bg-white/10 text-white hover:bg-white/20"
                onClick={() => {
                  setShowCropModal(false);
                  setAvatarPreview(null);
                }}
              >
                <X className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
              <Button
                className="bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30"
                onClick={handleCropConfirm}
              >
                <Check className="mr-2 h-4 w-4" />
                Confirmar
              </Button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}