/**
 * Bypasses the intermediate WhatsApp web landing pages and opens WhatsApp directly.
 * On mobile devices, this uses the native `whatsapp://` protocol to instantly launch the app.
 * On desktop, it falls back to the official API route which launches the desktop/web client directly.
 */
export function openWhatsApp(phone: string, text: string = "") {
  // Report conversion to Google Ads if configured
  if (typeof window !== 'undefined' && typeof (window as any).gtag_report_conversion === 'function') {
    try {
      (window as any).gtag_report_conversion();
    } catch {
      // Ignore if analytics blocked by user ad-blocker
    }
  }

  // Clean phone number: remove any non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');
  const encodedText = encodeURIComponent(text);

  // Check if the user agent is a mobile browser
  const isMobile = typeof navigator !== 'undefined' && 
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  if (isMobile) {
    // Mobile: direct protocol
    window.open(`whatsapp://send?phone=${cleanPhone}&text=${encodedText}`, '_blank');
  } else {
    // Desktop: standard api link which automatically requests launching the desktop app
    window.open(`https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`, '_blank');
  }
}

/**
 * Generates the best static link for WhatsApp that targets direct app launching.
 */
export function getWhatsAppUrl(phone: string, text: string = ""): string {
  const cleanPhone = phone.replace(/\D/g, '');
  const encodedText = encodeURIComponent(text);
  
  const isMobile = typeof navigator !== 'undefined' && 
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
  if (isMobile) {
    return `whatsapp://send?phone=${cleanPhone}&text=${encodedText}`;
  } else {
    return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`;
  }
}
