export const TODO_MAX_LENGTH = 100;
export const EMAIL_MAX_LENGTH = 254;
export const PASSWORD_MAX_LENGTH = 128;
export const PASSWORD_MIN_LENGTH = 6;

export function sanitizeText(input) {
  if (typeof input !== 'string') {
    return '';
  }

  return input
    .trim()
    .replace(/<[^>]*>?/gm, '')
    .replace(/\s+/g, ' ');
}

export function isValidTodoTitle(title) {
  if (typeof title !== 'string') {
    return false;
  }

  const trimmed = title.trim();
  return trimmed.length > 0 && trimmed.length <= TODO_MAX_LENGTH;
}

export function isValidEmail(email) {
  if (typeof email !== 'string') {
    return false;
  }

  const trimmed = email.trim();
  if (trimmed.length === 0 || trimmed.length > EMAIL_MAX_LENGTH) {
    return false;
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(trimmed);
}

export function isValidPassword(password) {
  if (typeof password !== 'string') {
    return false;
  }

  return password.length >= PASSWORD_MIN_LENGTH && password.length <= PASSWORD_MAX_LENGTH;
}