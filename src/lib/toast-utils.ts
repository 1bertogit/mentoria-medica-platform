import { toastHelpers } from '@/hooks/use-toast';

/**
 * Utilitários para padronizar mensagens de toast em todo o projeto
 */

export const ToastMessages = {
  // Mensagens de sucesso
  success: {
    saved: 'Dados salvos com sucesso!',
    updated: 'Atualizado com sucesso!',
    deleted: 'Removido com sucesso!',
    uploaded: 'Upload realizado com sucesso!',
    sent: 'Enviado com sucesso!',
    published: 'Publicado com sucesso!',
    login: 'Login realizado com sucesso!',
    logout: 'Logout realizado com sucesso!',
    registered: 'Cadastro realizado com sucesso!',
    passwordReset: 'Senha redefinida com sucesso!',
    profileUpdated: 'Perfil atualizado com sucesso!',
    settingsSaved: 'Configurações salvas com sucesso!',
  },

  // Mensagens de erro
  error: {
    general: 'Ocorreu um erro inesperado. Tente novamente.',
    network: 'Erro de conexão. Verifique sua internet.',
    unauthorized: 'Você não tem permissão para esta ação.',
    notFound: 'Conteúdo não encontrado.',
    validation: 'Dados inválidos. Verifique os campos.',
    upload: 'Erro no upload. Tente novamente.',
    fileSize: 'Arquivo muito grande. Tamanho máximo: 5MB.',
    fileType: 'Tipo de arquivo não suportado.',
    login: 'Erro no login. Verifique suas credenciais.',
    register: 'Erro no cadastro. Tente novamente.',
    passwordReset: 'Erro ao redefinir senha. Tente novamente.',
    duplicate: 'Este item já existe.',
    required: 'Campos obrigatórios não preenchidos.',
    sessionExpired: 'Sessão expirada. Faça login novamente.',
  },

  // Mensagens de warning
  warning: {
    unsavedChanges: 'Você tem alterações não salvas.',
    longOperation: 'Esta operação pode demorar alguns minutos.',
    deleteConfirm: 'Esta ação não pode ser desfeita.',
    quota: 'Você está próximo do limite de uso.',
    outdated: 'Dados podem estar desatualizados.',
    beta: 'Esta funcionalidade está em beta.',
    maintenance: 'Sistema em manutenção programada.',
  },

  // Mensagens de info
  info: {
    loading: 'Carregando...',
    processing: 'Processando...',
    saving: 'Salvando...',
    uploading: 'Fazendo upload...',
    analyzing: 'Analisando com IA...',
    generating: 'Gerando conteúdo...',
    syncing: 'Sincronizando dados...',
    welcome: 'Bem-vindo ao VisionCare Mentorship!',
    tutorial: 'Dica: Use os atalhos para navegar mais rápido.',
    newFeature: 'Nova funcionalidade disponível!',
    backup: 'Dados salvos automaticamente.',
  },

  // Mensagens de loading
  loading: {
    authenticating: 'Autenticando...',
    loadingData: 'Carregando dados...',
    uploadingFile: 'Enviando arquivo...',
    generatingReport: 'Gerando relatório...',
    processingImage: 'Processando imagem...',
    savingChanges: 'Salvando alterações...',
    deletingItem: 'Removendo item...',
    sendingEmail: 'Enviando email...',
    analyzing: 'Analisando caso médico...',
    generating: 'Gerando diagnóstico...',
  }
} as const;

/**
 * Funções utilitárias para operações comuns
 */
export const ToastUtils = {
  // Para operações de CRUD
  crud: {
    create: (itemName: string) => 
      toastHelpers.success('Criado com sucesso!', `${itemName} foi criado com sucesso.`),
    
    update: (itemName: string) => 
      toastHelpers.success('Atualizado!', `${itemName} foi atualizado com sucesso.`),
    
    delete: (itemName: string) => 
      toastHelpers.success('Removido!', `${itemName} foi removido com sucesso.`),
    
    error: (action: string, itemName: string) => 
      toastHelpers.error('Erro na operação', `Não foi possível ${action} ${itemName}.`),
  },

  // Para operações de arquivo
  file: {
    uploadSuccess: (fileName: string) => 
      toastHelpers.success('Upload concluído!', `${fileName} foi enviado com sucesso.`),
    
    uploadError: (fileName: string) => 
      toastHelpers.error('Erro no upload', `Falha ao enviar ${fileName}.`),
    
    downloadStart: (fileName: string) => 
      toastHelpers.info('Download iniciado', `Baixando ${fileName}...`),
    
    invalidType: (allowedTypes: string[]) => 
      toastHelpers.warning('Tipo de arquivo inválido', `Tipos permitidos: ${allowedTypes.join(', ')}`),
    
    sizeExceeded: (maxSize: string) => 
      toastHelpers.warning('Arquivo muito grande', `Tamanho máximo permitido: ${maxSize}`),
  },

  // Para operações de autenticação
  auth: {
    loginSuccess: () => toastHelpers.success(ToastMessages.success.login),
    loginError: () => toastHelpers.error(ToastMessages.error.login),
    logoutSuccess: () => toastHelpers.success(ToastMessages.success.logout),
    registerSuccess: () => toastHelpers.success(ToastMessages.success.registered),
    registerError: () => toastHelpers.error(ToastMessages.error.register),
    sessionExpired: () => toastHelpers.warning(ToastMessages.error.sessionExpired),
    unauthorized: () => toastHelpers.error(ToastMessages.error.unauthorized),
  },

  // Para operações assíncronas com promise
  async: {
    withToast: <T>(
      promise: Promise<T>,
      messages: {
        loading: string;
        success: string;
        error?: string;
      }
    ) => {
      return toastHelpers.promise(promise, {
        loading: messages.loading,
        success: messages.success,
        error: messages.error || 'Operação falhou'
      });
    },

    // Casos específicos
    uploadFile: <T>(promise: Promise<T>, fileName: string) => {
      return ToastUtils.async.withToast(promise, {
        loading: `Enviando ${fileName}...`,
        success: `${fileName} enviado com sucesso!`,
        error: `Falha ao enviar ${fileName}`
      });
    },

    saveData: <T>(promise: Promise<T>, dataType: string) => {
      return ToastUtils.async.withToast(promise, {
        loading: `Salvando ${dataType}...`,
        success: `${dataType} salvo com sucesso!`,
        error: `Falha ao salvar ${dataType}`
      });
    },

    deleteData: <T>(promise: Promise<T>, dataType: string) => {
      return ToastUtils.async.withToast(promise, {
        loading: `Removendo ${dataType}...`,
        success: `${dataType} removido com sucesso!`,
        error: `Falha ao remover ${dataType}`
      });
    },

    aiAnalysis: <T>(promise: Promise<T>) => {
      return ToastUtils.async.withToast(promise, {
        loading: 'Analisando com IA...',
        success: 'Análise concluída com sucesso!',
        error: 'Falha na análise. Tente novamente.'
      });
    },
  },

  // Para feedback do usuário
  feedback: {
    copied: () => toastHelpers.success('Copiado!', 'Conteúdo copiado para a área de transferência.'),
    shared: () => toastHelpers.success('Compartilhado!', 'Link compartilhado com sucesso.'),
    bookmarked: () => toastHelpers.success('Favoritado!', 'Item adicionado aos favoritos.'),
    unbookmarked: () => toastHelpers.info('Removido dos favoritos', 'Item removido dos favoritos.'),
    subscribed: () => toastHelpers.success('Inscrito!', 'Você está inscrito nas notificações.'),
    unsubscribed: () => toastHelpers.info('Desinscrito', 'Você não receberá mais notificações.'),
  },

  // Para validação de formulários
  validation: {
    fieldRequired: (fieldName: string) => 
      toastHelpers.warning('Campo obrigatório', `${fieldName} é obrigatório.`),
    
    invalidFormat: (fieldName: string, expectedFormat: string) => 
      toastHelpers.warning('Formato inválido', `${fieldName} deve estar no formato: ${expectedFormat}`),
    
    minLength: (fieldName: string, minLength: number) => 
      toastHelpers.warning('Muito curto', `${fieldName} deve ter pelo menos ${minLength} caracteres.`),
    
    maxLength: (fieldName: string, maxLength: number) => 
      toastHelpers.warning('Muito longo', `${fieldName} deve ter no máximo ${maxLength} caracteres.`),
    
    passwordWeak: () => 
      toastHelpers.warning('Senha fraca', 'Use pelo menos 8 caracteres com letras, números e símbolos.'),
    
    emailInvalid: () => 
      toastHelpers.warning('Email inválido', 'Verifique o formato do email.'),
  }
};

export default ToastUtils;