import apiClient, {_route, type PaginationResponse} from "@/framework/api/BaseApiClient";;  

export enum SubscriptionsApi {
	index = "/subscriptions/v2",
	create = "/subscriptions", 
	show = "/subscriptions/:id",
	update = "/subscriptions/:id",
	delete = "/subscriptions/:id",
}

export interface CreateRequest extends Partial<Subscription>{ 
} 

const get = (params: {[key:string]:unknown}) => apiClient.get<PaginationResponse<Subscription>>({ url: SubscriptionsApi.index, params, headers: {'ngrok-skip-browser-warning': 'true'} });
const create = (data: CreateRequest) => apiClient.post<Subscription>({ url: SubscriptionsApi.create, data });
const show = (id: number|string) => apiClient.get<Subscription>({ url: _route(SubscriptionsApi.show, {id}) });
const update = (id: number|string, data: CreateRequest) => apiClient.put({ url: _route(SubscriptionsApi.update, {id}), data });
const destroy = (id: number|string) => apiClient.delete({ url: _route(SubscriptionsApi.delete, {id}) });

export default {
	get,
	show,
	create,
	update,
	destroy,
};

//
//
// TYPES
//
//

export interface SubscriptionSearch {
	id: string
	programId: string
	subscriberId: string
	levelId: string
	subscriptionDate: string
	state: string
	notes: string
}
export interface Subscription {
	id: string
	program: Program
	subscriber: Subscriber
	level: Level
	subscriptionDate: string
	state: string
	notes: string
}
interface Subscriber {
	name: string
	email: string
}
interface Program {
	id: string
	name: string
}
interface Level {
	id: string
	name: string 
}
   
  