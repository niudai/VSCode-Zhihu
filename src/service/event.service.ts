
import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import { MediaTypes } from "../const/ENUM";
import { EventsPath } from "../const/PATH";

export interface IEvent {

	type: MediaTypes,

	/**
	 * id is optional because the new article has no id
	 */
	id?: string,
	content: string,

	/**
	 * the publishing time
	 */
	date: Date,
	title?: string,

	/**
	 * used to cancel the event
	 */
	timeoutId?: NodeJS.Timeout,

	/**
	 * the handler to be excuted in the due time.
	 */
	handler(t?: string): any;
}

export class EventService {
	private events: IEvent[];
	constructor (
		protected context: vscode.ExtensionContext) {
		if(fs.existsSync(path.join(context.extensionPath, EventsPath))) {
			let _events: any[] = JSON.parse(fs.readFileSync(path.join(context.extensionPath, EventsPath), 'utf8'));
			this.events = _events.map(e => { e.time = new Date(e.time);
				return e});
		} else {
			this.events = [];
		}
		this.events.forEach(e => {
			e.timeoutId = setTimeout(e.handler, e.date.getTime() - Date.now());
		})
	}

	getEvents(): IEvent[] {
		return this.events;
	}

	/**
	 * Set events to observed proxy events
	 * @param evts the observed proxy evts 
	 */
	setEvents(evts: IEvent[]) {
		this.events = evts;
	}

	registerEvent(e: IEvent) {
		e.timeoutId = setTimeout(e.handler, e.date.getTime() - Date.now());
		if(!this.events.find(v => v.id == e.id && v.type == e.type)) {
			this.events.push(e);
			this.persist();
			return true;
		} else return false;
	}

	destroyEvent(event: IEvent) {
		// find the target event and destroy its timeout event
		let eventTarget = this.events.find(c => (c.id == event.id && c.type == event.type))
		if (eventTarget.timeoutId) clearTimeout(eventTarget.timeoutId);

		// filter the target out
		this.events = this.events.filter(c => !(c.id == event.id && c.type == event.type));
		this.persist();
	}

	persist() {
		fs.writeFileSync(path.join(this.context.extensionPath, EventsPath), JSON.stringify(this.events, (k, v) => {
			if (k == 'timeoutId') return undefined;
			else return v;
		}), 'utf8');
	}

}