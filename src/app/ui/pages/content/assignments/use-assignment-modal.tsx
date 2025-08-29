import { useState } from "react";
import type { AssignmentModalProps } from "./assignment-form-modal";
import type { CreateRequest, Assignment } from "@/app/api/services/assignments";
import   api, { AssignmentState, AssignmentType } from "@/app/api/services/assignments";
import { useMutation } from "@tanstack/react-query";
import { t } from "i18next";
import { useSearchParams } from "react-router";

const defaultAssignmentValue: CreateRequest = { 
	programId: "", 
	levelId: "", 
	subjectId: "", 
	title: "", 
	state: AssignmentState.draft, 
	type: AssignmentType.exam, 
	passingScore: 10,
	durationInMinutes: 60, 
	availableFrom: "",
	availableUntil: "",
};
export function useAssignmentModal(onSuccess:CallableFunction){
	const [searchParams] = useSearchParams();
	defaultAssignmentValue.levelId = searchParams.get('levelId') ?? undefined
	defaultAssignmentValue.subjectId = searchParams.get('subjectId') ?? undefined

	const mutation = useMutation({
		mutationFn: (obj:{id:string|undefined,data:any}) => {
			console.log('mutationFn', obj);
			return (obj.id!==undefined ? api.update(  obj.id, obj.data ) : api.create( obj.data  ));
		},
		onSuccess : ()=>{
			setModalProps((prev) => ({ ...prev, show: false, okDisabled :false }));
			onSuccess();
		},
		onError(error, variables, context) {
			console.log('onError',error, variables, context);
			setModalProps((prev) => ({ ...prev, okDisabled :false }));
		},
	})
	

	const [modalProps, setModalProps] = useState<AssignmentModalProps>({
		initialValues: { ...defaultAssignmentValue },
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

	const onCreate = (record?: Assignment) => {
		setModalProps((prev) => ({
			...prev,
			show: true,
			...defaultAssignmentValue,
			title: t('common.create'),
			initialValues: { ...defaultAssignmentValue, parentId: record?.id ?? "" },
		}));
	};

	const onEdit = (data: Assignment) => {
		setModalProps((prev) => ({
			...prev,
			show: true,
			title: t('common.edit'),
			initialValues:data,
		}));
	};

    return {modalProps, setModalProps, onCreate, onEdit, mutation}
}