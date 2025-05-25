import apiClient, {_cleanParams, _route, type PaginationResponse} from "@/framework/api/BaseApiClient";;  

export enum TasksApi {
	index = "/tasks",
	create = "/tasks", 
	show = "/tasks/:id",
	update = "/tasks/:id",
	delete = "/tasks/:id",
}

const get = (params: {[key:string]:unknown}) => apiClient.get<PaginationResponse<Task>>({ url: TasksApi.index, params: _cleanParams(params), headers: {'ngrok-skip-browser-warning': 'true'} });
const show = (id: number|string) => apiClient.get<Task>({ url: _route(TasksApi.show, {id}) });
const create = (data: CreateRequest) => apiClient.post<Task>({ url: TasksApi.create, data });
const update = (id: number|string, data: CreateRequest) => apiClient.put({ url: _route(TasksApi.update, {id}), data });
const destroy = (id: number|string) => apiClient.delete({ url: _route(TasksApi.delete, {id}) });

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

// export type B = Omit<Partial<Task>, 'lessons'> & { lessons: string[] };
export interface CreateRequest extends Omit<Partial<Task>, 'lessons'> { 
	lessonIds: string[]
}

export interface Task { 
	id: string
	note: string
	programId: string
	levelId: string
	subjectId: string
	date: string
	lessons: Lesson[]
}

export interface Lesson {
	id: string
	title: string
	type: string
	url: string
}
  