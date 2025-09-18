export const getFriendlyErrorMessage = (error: any): string => {
  if (!error) return '';

  switch (error.message) {
    case 'Invalid login credentials':
      return 'E-mail ou senha incorretos.';
    case 'User not confirmed':
      return 'Usuário não confirmado. Verifique seu e-mail.';
    case 'Password should be at least 6 characters':
      return 'A senha deve ter pelo menos 6 caracteres.';
    default:
      return 'Ocorreu um erro inesperado. Tente novamente.';
  }
};