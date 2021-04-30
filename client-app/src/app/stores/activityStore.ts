import { action, makeAutoObservable, makeObservable, observable } from "mobx";

export default class ActivityStore{
	title = 'Hello from MobX!';
	constructor(){
		// makeObservable(this, {
		// 	title: observable,
		// 	setTitle: action
		// });
		makeAutoObservable(this);
	}
	
	setTitle = () => {
		this.title += '!';
	}
}