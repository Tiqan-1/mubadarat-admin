import apiClient, {_cleanParams, _route, type PaginationResponse} from "@/framework/api/BaseApiClient";;  

export enum LevelsApi {
	index = "/levels",
	create = "/levels", 
	show = "/levels/:id",
	update = "/levels/:id",
	delete = "/levels/:id",
}

export interface CreateRequest extends Partial<Level>{ 
} 

const get = (params: {[key:string]:unknown}) => apiClient.get<PaginationResponse<Level>>({ url:LevelsApi.index, params: _cleanParams(params), headers: {'ngrok-skip-browser-warning': 'true'} });
const show = (id: number|string) => apiClient.get<Level>({ url: _route(LevelsApi.show, {id}) });
const create = (data: CreateRequest) => apiClient.post<Level>({ url: LevelsApi.create, data });
const update = (id: number|string, data: CreateRequest) => apiClient.put({ url: _route(LevelsApi.update, {id}), data });
const destroy = (id: number|string) => apiClient.delete({ url: _route(LevelsApi.delete, {id}) });

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

export interface Level {
	programId: string
	id: string
	name: string
	start: string
	end: string
	// tasks: Task[]
  }
  
//   export interface Task {
// 	id: string
// 	date: string
// 	lessons: Lesson[]
//   }
  
//   export interface Lesson {
// 	id: string
// 	title: string
// 	type: string
// 	url: string
//   }
  