// plugins/toast.client.ts

// Define the expected type of your $toast object for TypeScript
interface CustomToast {
  show: (options: any) => void;
  info: (message: string, title?: string) => void;
  success: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
}

// Nuxt plugins MUST have a default export that is defineNuxtPlugin
export default defineNuxtPlugin(async (nuxtApp) => { // Make the plugin function async
  // Dynamically import iziToast here.
  // This ensures the iziToast module and its dependencies are only loaded
  // and evaluated when running in the browser environment (since this is a .client.ts plugin).
  const { default: iziToast } = await import('izitoast');
  // Also import the CSS
  await import('izitoast/dist/css/iziToast.min.css');

  // Configure iziToast globally (or pass options via provide)
  iziToast.settings({
    position: 'topRight', // 'topRight', 'bottomRight', 'bottomLeft', 'topLeft', 'topCenter', 'bottomCenter', 'center'
    timeout: 5000,        // Duration in milliseconds
    progressBar: true,
    progressBarColor: 'rgba(255,255,255,.5)',
    transitionIn: 'fadeInUp',
    transitionOut: 'fadeOutDown',
    closeOnClick: true,
    pauseOnHover: true,
    // Add any other default settings you like
  });

  // Define a wrapper object for iziToast methods for consistency
  const customToast: CustomToast = { // Explicitly type customToast
    show: (options: any) => iziToast.show(options),
    info: (message: string, title?: string) => iziToast.info({ message, title, position: 'bottomCenter' }),
    success: (message: string, title?: string) => iziToast.success({ message, title, position: 'bottomCenter' }),
    warning: (message: string, title?: string) => iziToast.warning({ message, title, position: 'bottomCenter' }),
    error: (message: string, title?: string) => iziToast.error({ message, title, position: 'bottomCenter' }),
  };

  // Provide the customToast instance to the Nuxt app context
  // It will be accessible as nuxtApp.$toast or useNuxtApp().$toast
  nuxtApp.provide('toast', customToast);
});

// Augment NuxtApp interface for TypeScript (moved outside the defineNuxtPlugin call)
declare module '#app' {
  interface NuxtApp {
    $toast: CustomToast; // Use the CustomToast interface here
  }
}

// Augment Vue runtime-core for Options API (optional, but good practice)
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $toast: CustomToast; // Use the CustomToast interface here
  }
}