import { useEffect } from 'react';

const SendinpulseChatbot = () => {
    useEffect(() => {
        // Check if script is already loaded
        const existingScript = document.querySelector('script[src*="webformscr.com"]');
        
        if (!existingScript) {
            const script = document.createElement('script');
            script.charset = 'UTF-8';
            script.src = '//web.webformscr.com/apps/fc3/build/loader.js';
            script.async = true;
            script.setAttribute('sp-form-id', '69b073cd490de457d902d78f');
            
            document.head.appendChild(script);
            
            // Cleanup function
            return () => {
                if (script.parentNode) {
                    script.parentNode.removeChild(script);
                }
            };
        }
    }, []);

    return null; // This component doesn't render anything visible
};

export default SendinpulseChatbot;
