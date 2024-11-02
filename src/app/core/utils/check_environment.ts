export function getEnvironmentName() {
    const hostname = window.location.hostname;
  
    if (hostname.includes('localhost') || hostname.includes('staging')) {
      return 'test';
    }else {
      return 'prod';
    }
  }
  
  