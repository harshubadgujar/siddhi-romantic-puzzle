export const resolveAssetUrl = (path: string): string => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  
  // Strip leading slash if present
  let cleanPath = path;
  if (cleanPath.startsWith('/')) {
    cleanPath = cleanPath.slice(1);
  }
  
  // Strip any old prepended path like 'siddhi-romantic-puzzle/' if present
  if (cleanPath.startsWith('siddhi-romantic-puzzle/')) {
    cleanPath = cleanPath.replace('siddhi-romantic-puzzle/', '');
  }

  // Get current base pathname from window.location.pathname
  let baseDir = window.location.pathname;
  if (!baseDir.endsWith('/')) {
    const lastIndex = baseDir.lastIndexOf('/');
    baseDir = baseDir.substring(0, lastIndex + 1);
  }

  return `${baseDir}${cleanPath}`;
};
