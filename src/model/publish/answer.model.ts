export interface IPostAnswer {

	/**
	 * main content
	 */
	content: string;

	/**
	 * Default as 'allowed'
	 */
	reshipment_settings?: string;

	/**
	 * Default as 'all'
	 */
	comment_permission?: string;

	/**
	 * reward setting
	 */
	reward_setting?: {
		/**
		 * default as false
		 */
		can_reward: boolean;
	}
}

export class PostAnswer implements IPostAnswer {
	constructor(
		public content: string,
		public reshipment_settings?: string,
		public comment_permission?: string,
		public reward_setting?: {
			can_reward: boolean
		}
	) {
		if (!this.reshipment_settings) this.reshipment_settings = 'allowed'
		if (!this.comment_permission) this.comment_permission = 'all';
		if (!this.reward_setting) this.reward_setting = {
			can_reward: false
		}
	}

}