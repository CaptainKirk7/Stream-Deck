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
		let state = ev.payload.settings.currentState ?? 0;
		state = state === 0 ? 1 : 0;

		const urlOff = "https://www.google.com"; 
		const urlOn = "https://www.elgato.com";

		await streamDeck.system.openUrl(state === 1 ? urlOn : urlOff);

		await ev.action.setSettings({ currentState: state });
		
		if ("setState" in ev.action) {
			await ev.action.setState(state);
		}
	}
}

type ToggleSettings = {
	currentState?: number;
};