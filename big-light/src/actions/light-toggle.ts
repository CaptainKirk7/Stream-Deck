import { action, KeyDownEvent, SingletonAction, WillAppearEvent, streamDeck } from "@elgato/streamdeck";

/**
 * Settings for the Light Toggle action.
 */
type ToggleSettings = {
    currentState?: number;
    urlOff?: string;
    urlOn?: string;
};

@action({ UUID: "com.kirk-nunn.big-light.toggle" })
export class LightToggle extends SingletonAction<ToggleSettings> {
    
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
        // 1. Get settings, but provide hardcoded fallbacks so it NEVER calls openUrl(undefined)
        const settings = ev.payload.settings || {};
        const currentState = settings.currentState ?? 0;
        
        // Use the URLs from the UI, or fallback to these defaults if the UI is empty
        const urlOff = settings.urlOff || "https://www.google.com";
        const urlOn = settings.urlOn || "https://www.elgato.com";
    
        const newState = currentState === 0 ? 1 : 0;
    
        try {
            // 2. Open the URL
            await streamDeck.system.openUrl(newState === 1 ? urlOn : urlOff);
    
            // 3. Save the NEW state back to the Stream Deck
            await ev.action.setSettings({ 
                ...settings, 
                currentState: newState 
            });
    
            // 4. Change the icon state
            if ("setState" in ev.action) {
                await ev.action.setState(newState);
            }
        } catch (err) {
            console.error("Failed to toggle light:", err);
        }
    }
}