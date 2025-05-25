 
import { useState } from "react";
import type { LessonModalProps } from "./lesson-form-modal";
import type { CreateRequest, Lesson } from "@/app/api/services/lessons";
import   api from "@/app/api/services/lessons";
import { useMutation } from "@tanstack/react-query";
import { t } from "i18next";
import { useSearchParams } from "react-router";

const defaultLessonValue: CreateRequest = {
    title: "",
	type: "",
	url: "",
};
export function useLessonModal(onSuccess:CallableFunction){ //
	const [searchParams] = useSearchParams();
	defaultLessonValue.subjectId = searchParams.get('programId') ?? undefined
	// console.log('params', Object.fromEntries(searchParams.entries()))

	const mutation = useMutation({
		mutationFn: (obj:{id:string|undefined,data:any}) => {
			console.log('mutationFn', obj);
			return (obj.id!==undefined ? api.update(  obj.id, obj.data ) : api.create( obj.data  ));
		},
		onSuccess : ()=>{
			console.log('onSuccess');
			setModalProps((prev) => ({ ...prev, show: false, okDisabled :false }));
			onSuccess();
		},
		onError(error, variables, context) {
			console.log('onError',error, variables, context);
			setModalProps((prev) => ({ ...prev, okDisabled :false }));
		},
	})
	

	const [modalProps, setModalProps] = useState<LessonModalProps>({
		formValue: { ...defaultLessonValue },
		title: t('common.create'),
		show: false,
		okDisabled: false,
		onOk: (id, data) => {
			console.log('onOk', id, data);
			mutation.mutate({id, data});
			setModalProps((prev) => ({ ...prev, okDisabled :true }));
		},
		onCancel: () => {
			setModalProps((prev) => ({ ...prev, show: false }));
		},
	}); 

	const onCreate = (record?: Lesson) => {
		setModalProps((prev) => ({
			...prev,
			show: true,
			...defaultLessonValue,
			title: t('common.create'),
			formValue: { ...defaultLessonValue, parentId: record?.id ?? "" },
		}));
	};

	const onEdit = (data: Lesson) => {
		setModalProps((prev) => ({
			...prev,
			show: true,
			title: t('common.edit'),
			formValue:data,
		}));
	};

    return {modalProps, setModalProps, onCreate, onEdit, mutation}
}