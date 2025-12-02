 
import { useState } from "react";
import type { TaskModalProps } from "./task-form-modal";
import type { CreateRequest, Task } from "@/app/api/services/tasks";
import   api from "@/app/api/services/tasks";
import { useMutation } from "@tanstack/react-query";
import { t } from "i18next";
import { useSearchParams } from "react-router";
import { removeEmptyValues } from "@/framework/api/helpers";

const defaultTaskValue: CreateRequest = { 
	date: "", // "2025-02-28T23:00:00.000Z",
	lessonIds: [],
	assignmentId: ""
};
export function useTaskModal(onSuccess:CallableFunction){ //
	const [searchParams] = useSearchParams();
	defaultTaskValue.levelId = searchParams.get('levelId') ?? undefined
	// console.log('params', Object.fromEntries(searchParams.entries()))

	const mutation = useMutation({
		mutationFn: (obj:{id:string|undefined,data:any}) => {
			// console.log('mutationFn', obj);
			const cleanData = removeEmptyValues(obj.data)
			return (obj.id!==undefined ? api.update(  obj.id, cleanData as any ) : api.create( cleanData as any  ));
		},
		onSuccess : ()=>{
			// console.log('onSuccess');
			setModalProps((prev) => ({ ...prev, show: false, okDisabled :false }));
			onSuccess();
		},
		onError(error, variables, context) {
			console.log('onError',error, variables, context);
			setModalProps((prev) => ({ ...prev, okDisabled :false }));
		},
	})
	

	const [modalProps, setModalProps] = useState<TaskModalProps>({
		formValue: { ...defaultTaskValue },
		title: t('common.create'),
		show: false,
		okDisabled: false,
		onOk: (id, data) => {
			// console.log('onOk', id, data);
			mutation.mutate({id, data});
			setModalProps((prev) => ({ ...prev, okDisabled :true }));
		},
		onCancel: () => {
			setModalProps((prev) => ({ ...prev, show: false }));
		},
	}); 

	const onCreate = (record?: Task) => {
		setModalProps((prev) => ({
			...prev,
			show: true,
			...defaultTaskValue,
			title: t('common.create'),
			formValue: { ...defaultTaskValue, parentId: record?.id ?? "" },
		}));
	};

	const onEdit = (data: Task) => {
		setModalProps((prev) => ({
			...prev,
			show: true,
			title: t('common.edit'),
			formValue:data,
		}));
	};

    return {modalProps, setModalProps, onCreate, onEdit, mutation}
}