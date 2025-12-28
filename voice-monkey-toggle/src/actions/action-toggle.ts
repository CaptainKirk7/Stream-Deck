import { action, KeyDownEvent, SingletonAction, WillAppearEvent } from "@elgato/streamdeck";

/**
 * Settings for the Light Toggle action.
 */
type ToggleSettings = {
    currentState?: number;
    urlOff?: string;
    urlOn?: string;
};

@action({ UUID: "com.kirk-nunn.voice-monkey-toggle-button.toggle" })
export class ActionToggle extends SingletonAction<ToggleSettings> {
    
    /**
     * Ensures the Stream Deck hardware state matches the internal setting when the action appears.
     */
    override onWillAppear(ev: WillAppearEvent<ToggleSettings>): void | Promise<void> {
        const state = ev.payload.settings.currentState ?? 0;
        if ("setState" in ev.action) {
            return ev.action.setState(state);
        }
    }

    override async onKeyDown(ev: KeyDownEvent<ToggleSettings>): Promise<void> {
        const settings = ev.payload.settings || {};
        const currentState = settings.currentState ?? 0;
        
        const urlOff = settings.urlOff || "";
        const urlOn = settings.urlOn || "";
    
        const newState = currentState === 0 ? 1 : 0;
        const targetUrl = newState === 1 ? urlOn : urlOff;
    
        try {
            // 1. Fetch the URL in the background instead of opening a browser
            const response = await fetch(targetUrl);
    
            if (!response.ok) {
                throw new Error(`Background fetch failed with status: ${response.status}`);
            }
    
            // 2. Save the NEW state back to the Stream Deck
            await ev.action.setSettings({ 
                ...settings, 
                currentState: newState 
            });
    
            // 3. Change the icon state
            if ("setState" in ev.action) {
                await ev.action.setState(newState);
            }
        } catch (err) {
            // If the fetch fails (e.g., network error), the warning triangle will appear
            console.error("Background fetch failed:", err);
            await ev.action.showAlert(); 
        }
    }
}



