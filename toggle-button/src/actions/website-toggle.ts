import { action, KeyDownEvent, SingletonAction, WillAppearEvent, streamDeck } from "@elgato/streamdeck";

@action({ UUID: "com.kirk-nunn.toggle-button.website-toggle" })
export class ToggleButton extends SingletonAction<ToggleSettings> {
	
	override onWillAppear(ev: WillAppearEvent<ToggleSettings>): void | Promise<void> {
		const state = ev.payload.settings.currentState ?? 0;
		if ("setState" in ev.action) {
			return ev.action.setState(state);
		}
	}

	override async onKeyDown(ev: KeyDownEvent<ToggleSettings>): Promise<void> {
		// Destructure settings to get user-defined URLs
		const { 
			currentState = 0, 
			urlOff = "https://www.google.com", 
			urlOn = "https://www.elgato.com" 
		} = ev.payload.settings;
	
		const newState = currentState === 0 ? 1 : 0;
	
		// Use the settings from the UI
		await streamDeck.system.openUrl(newState === 1 ? urlOn : urlOff);
	
		await ev.action.setSettings({ ...ev.payload.settings, currentState: newState });
		
		if ("setState" in ev.action) {
			await ev.action.setState(newState);
		}
	}
}

type ToggleSettings = {
    currentState?: number;
    urlOff?: string; // Add these to your type
    urlOn?: string;
};