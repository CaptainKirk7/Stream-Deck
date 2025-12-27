import { action, KeyDownEvent, SingletonAction, WillAppearEvent, streamDeck } from "@elgato/streamdeck";

// The UUID must match your manifest.json
@action({ UUID: "com.kirk-nunn.toggle-button.website-toggle" })
export class IncrementCounter extends SingletonAction<ToggleSettings> {
    
    /**
     * Set the initial visual state when the action appears on the Stream Deck.
     */
    override onWillAppear(ev: WillAppearEvent<ToggleSettings>): void | Promise<void> {
        const state = ev.payload.settings.currentState ?? 0;
        
        // We check if setState exists to satisfy the TypeScript compiler
        if ("setState" in ev.action) {
            return ev.action.setState(state);
        }
    }

    /**
     * Toggles state and opens the URL when the key is pressed.
     */
    override async onKeyDown(ev: KeyDownEvent<ToggleSettings>): Promise<void> {
        let state = ev.payload.settings.currentState ?? 0;

        // Toggle: 0 -> 1, 1 -> 0
        state = state === 0 ? 1 : 0;

        const urlOff = "https://www.google.com"; 
        const urlOn = "https://www.elgato.com";

        // Open the URL based on the new state
        await streamDeck.system.openUrl(state === 1 ? urlOn : urlOff);

        // Save the state in settings and update the icon state
        await ev.action.setSettings({ currentState: state });
        
        if ("setState" in ev.action) {
            await ev.action.setState(state);
        }
    }
}

type ToggleSettings = {
    currentState?: number;
};