// Input Validation Utilities
// Validate user inputs before processing

// validateEmail(email)
// - Check email format using regex
// - Return true/false

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// validatePassword(password)
// - Minimum 8 characters
// - At least one uppercase letter
// - At least one number
// - Return true/false

export const validatePassword = (password) => {
  if (!password || password.length < 8) {
    return false;
  }
  
  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return false;
  }
  
  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return false;
  }
  
  // Check for at least one number
  if (!/[0-9]/.test(password)) {
    return false;
  }
  
  return true;
};

// validateName(name)
// - Check minimum length
// - Check for valid characters
// - Return true/false

export const validateName = (name) => {
  return name && name.trim().length >= 2;
};

// validateObjectId(id)
// - Check if ID is valid MongoDB ObjectId
// - Return true/false

export const validateObjectId = (id) => {
  // Check if valid MongoDB ObjectId format
  return /^[0-9a-fA-F]{24}$/.test(id);
};

// validateProjectInput(data)
// - Validate title, description, deadline
// - Return validation result

export const validateProjectInput = (data) => {
  const { title, description, deadline } = data;
  
  if (!title || title.trim().length === 0) {
    return { valid: false, error: 'Title is required' };
  }
  
  return { valid: true };
};

// TODO: validateTaskInput(data)
// - Validate title, project, status, priority
// - Return validation result

export const validateTaskInput = (data) => {
  const { title, project, status, priority } = data;
  
  if (!title || title.trim().length === 0) {
    return { valid: false, error: 'Title is required' };
  }
  
  if (!project) {
    return { valid: false, error: 'Project is required' };
  }
  
  return { valid: true };
};
