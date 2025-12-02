import apiClient, {_cleanParams, _route, type PaginationResponse} from "@/framework/api/BaseApiClient";;

export enum LessonsApi {
	// index = "/subjects/:subjectId/lessons",
	// create = "/subjects/:subjectId/lessons", 
	index = "/lessons",
	create = "/lessons", 
	show = "/lessons/:id",
	update = "/lessons/:id",
	delete = "/lessons/:id",
}

export interface CreateRequest extends Partial<Lesson>{ 
} 

const get = (params: {[key:string]:unknown}) => apiClient.get<PaginationResponse<Lesson>>({ url:LessonsApi.index, params: _cleanParams(params), headers: {'ngrok-skip-browser-warning': 'true'} });
const show = (id: number|string) => apiClient.get<Lesson>({ url: _route(LessonsApi.show, {id}) });
const create = (data: CreateRequest) => apiClient.post<Lesson>({ url: LessonsApi.create, data });
const update = (id: number|string, data: CreateRequest) => apiClient.put({ url: _route(LessonsApi.update, {id}), data });
const destroy = (id: number|string) => apiClient.delete({ url: _route(LessonsApi.delete, {id}) });

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

export interface Lesson {
	id: string
	subjectId: string
	title: string
	type: string
	url: string
  }
  