import apiClient, {_cleanParams, _route, type PaginationResponse} from "@/framework/api/BaseApiClient"; 

export enum AssignmentsApi {
	index = "/assignments",
	create = "/assignments", 
	show = "/assignments/:id",
	update = "/assignments/:id",
	delete = "/assignments/:id",
}

export interface CreateRequest extends Partial<Assignment>{ 
} 

const get = (params: {[key:string]:unknown}) => apiClient.get<PaginationResponse<Assignment>>({ url:AssignmentsApi.index, params: _cleanParams(params), headers: {'ngrok-skip-browser-warning': 'true'} });
const show = (id: number|string) => apiClient.get<Assignment>({ url: _route(AssignmentsApi.show, {id}) });
const create = (data: CreateRequest) => apiClient.post<Assignment>({ url: AssignmentsApi.create, data });
const update = (id: number|string, data: CreateRequest) => apiClient.put({ url: _route(AssignmentsApi.update, {id}), data });
const destroy = (id: number|string) => apiClient.delete({ url: _route(AssignmentsApi.delete, {id}) });
const publishGrades = (id: string) => apiClient.patch({ url: `/assignments/${id}/publish-grades` });

export default {
	get,
	show,
	create,
	update,
	destroy,
  publishGrades,
};

//
//
// TYPES
//
//
 
  export enum AssignmentState {
    draft = 'draft',
    published = 'published',
    canceled = 'canceled',
    closed = 'closed',
    deleted = 'deleted',
}
export enum AssignmentType {
    exam = 'exam',
    homework = 'homework',
}
export enum AssignmentGradingState {
    PENDING = 'pending',
    PUBLISHED = 'published',
}

interface Relation {
	id: string
	name: string 
}
  export interface Assignment{ 
    id: string 
    title: string 
    programId?: string 
    levelId: string 
    subjectId: string 
    level: Relation 
    subject: Relation 
    createdBy: Relation 
    state: AssignmentState 
    gradingState: AssignmentGradingState;
    type: AssignmentType 
    durationInMinutes: number 
    passingScore: number 
    availableFrom: string
    availableUntil: string
    form: any;
    createdAt: string
    updatedAt: string 
}