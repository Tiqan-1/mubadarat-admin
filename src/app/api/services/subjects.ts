import apiClient, {_route, type PaginationResponse} from "@/framework/api/BaseApiClient";;  

export enum SubjectsApi {
	index = "/subjects",
	create = "/subjects",
	show = "/subjects/:id",
	update = "/subjects/:id",
	delete = "/subjects/:id",
}

export interface CreateRequest extends Partial<Subject>{ 
} 

const get = (params: {[key:string]:unknown}) => apiClient.get<PaginationResponse<Subject>>({ url: SubjectsApi.index, params, headers: {'ngrok-skip-browser-warning': 'true'} });
const show = (id: number|string) => apiClient.get<Subject>({ url: _route(SubjectsApi.show, {id}) });
const create = (data: CreateRequest) => apiClient.post<Subject>({ url: SubjectsApi.create, data });
const update = (id: number|string, data: CreateRequest) => apiClient.put({ url: _route(SubjectsApi.update, {id}), data });
const destroy = (id: number|string) => apiClient.delete({ url: _route(SubjectsApi.delete, {id}) });

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

export interface Subject {
	id: string
	programId: string
	name: string
	// createdBy: CreatedBy
	description: string
	lessons: Lesson[]
	
  }
  
//   export interface CreatedBy {
// 	name: string
// 	email: string
//   }
  
  export interface Lesson {
	id: string
	title: string
	type: string
	url: string
  }