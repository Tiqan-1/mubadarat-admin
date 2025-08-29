import apiClient, {_cleanParams, _route, type PaginationResponse} from "@/framework/api/BaseApiClient"; 


export enum AssignmentResponsesApi {
    index = 'assignment-responses',
    show = '/assignment-responses/:id',
    grade = '/assignment-responses/:id/grade',
}

// interface GetResponsesParams {
//     assignmentId: string;
//     page?: number;
//     pageSize?: number;
// }

const get = (params: {[key:string]:unknown}) => apiClient.get<PaginationResponse<AssignmentResponse>>({ url:AssignmentResponsesApi.index, params: _cleanParams(params), headers: {'ngrok-skip-browser-warning': 'true'} });
// const get = (params: GetResponsesParams) => {
//     const { assignmentId, ...queryParams } = params;
//     return apiClient.get<PaginationResponse<AssignmentResponse>>({ 
//         url: AssignmentResponsesApi.index,
//         params: _cleanParams({assignmentId}) 
//     });
// }; 
const show = (id: string) => {
    return apiClient.get<DetailedAssignmentResponse>({ 
        url: _route(AssignmentResponsesApi.show, { id }) 
    });
};

const grade = (id: string, data: GradeDto) => {
    return apiClient.patch({ 
        url: _route(AssignmentResponsesApi.grade, { id }), 
        data 
    });
};
export default {
	get,
    show,
    grade,
};


export enum AssignmentResponseStatus {
    IN_PROGRESS = 'in-progress',
    SUBMITTED = 'submitted',
    GRADED = 'graded',
    PUBLISHED = 'published',
}

interface Relation {
	id: string
	name: string 
}

export interface AssignmentResponse {
    id: string;
    student: Relation;
    assignmentId: string;
    status: AssignmentResponseStatus;
    score?: number;
    startedAt: string;
    submittedAt?: string;
}



export interface DetailedAssignmentResponse {
    id: string;
    student: Relation;
    assignmentId: string;
    assignment: { id: string; title: string }; 
    status: AssignmentResponseStatus;
    score?: number;
    notes?: string;
    startedAt: string;
    submittedAt?: string;
    replies: Record<string, any>;
    individualScores: Record<string, number>;
}

export interface GradeDto {
    scores: Record<string, number>;
    notes?: string;
}