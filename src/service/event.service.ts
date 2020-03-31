
import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import { MediaTypes } from "../const/ENUM";
import { EventsPath } from "../const/PATH";
import { getExtensionPath } from "../global/globa-var";

export interface IEvent {

	type: MediaTypes,

	/**
	 * id is optional because the new article has no id
	 */
	id?: string,

	content: string,

	/**
	 * md5 hash used to identify the publish event. 
	 * Since the collision possibility is almost zero, (1/2^128), 
	 * so in 10s scale we could convince every hash is unique.
	 */
	hash: string,

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
	constructor () {
		if(fs.existsSync(path.join(getExtensionPath(), EventsPath))) {
			let _events: any[] = JSON.parse(fs.readFileSync(path.join(getExtensionPath(), EventsPath), 'utf8'));
			this.events = _events.map(e => { e.date = new Date(e.date);
				return e});
		} else {
			this.events = [];
		}
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
		if(!this.events.find(v => v.hash == e.hash)) {
			this.events.push(e);
			this.persist();
			return true;
		} else return false;
	}

	/**
	 * destroy an event. This could be called normally when event occured, 
	 * but also called intendedly for deletion.
	 * @param hash the hash of the event
	 */
	destroyEvent(hash: string) {
		// find the target event and destroy its timeout event
		let eventTarget = this.events.find(c => (c.hash == hash))

		// if the timeout handler still registerd, remove it. 
		if (eventTarget.timeoutId) clearTimeout(eventTarget.timeoutId);

		// filter the target out
		this.events = this.events.filter(c => !(c.hash == hash));
		this.persist();
	}

	persist() {
		fs.writeFileSync(path.join(getExtensionPath(), EventsPath), JSON.stringify(this.events, (k, v) => {
			if (k == 'timeoutId') return undefined;
			else return v;
		}), 'utf8');
	}

}