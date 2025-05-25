 
import { useState } from "react";
import type { ProgramModalProps } from "./program-form-modal";
import type { CreateRequest, Program } from "@/app/api/services/programs";
import   api from "@/app/api/services/programs";
import { useMutation } from "@tanstack/react-query";
import { t } from "i18next";

const defaultProgramValue: CreateRequest = {
	name: "", // "test",
	description: "", // "test desc",
	start: "", // "2025-02-28T23:00:00.000Z",
	end: "", // "2025-03-30T23:00:00.000Z",
	registrationStart: "", // "2025-03-31T23:00:00.000Z",
	registrationEnd: "", // "2025-04-29T23:00:00.000Z"
 };
export function useProgramModal(forUpload:boolean, onSuccess:CallableFunction){ //
	const mutation = useMutation({
		mutationFn: (obj:{id:string|undefined,data:any}) => {
			// console.log('mutationFn', obj);
			return (obj.id!==undefined ? api.update(  obj.id, obj.data ) : api.create( obj.data  ));
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
	

	const [modalProps, setModalProps] = useState<ProgramModalProps>({
		formValue: { ...defaultProgramValue },
		title: t('common.create'),
		forUpload: forUpload,
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

	const onCreate = (record?: Program) => {
		setModalProps((prev) => ({
			...prev,
			show: true,
			...defaultProgramValue,
			title: t('common.create'),
			formValue: { ...defaultProgramValue, parentId: record?.id ?? "" },
		}));
	};

	const onEdit = (data: Program, title: string | undefined = undefined) => {
		setModalProps((prev) => ({
			...prev,
			show: true,
			title: title ?? t('common.edit'),
			formValue:data,
		}));
	};

    return {modalProps, setModalProps, onCreate, onEdit, mutation}
}