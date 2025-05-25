 
import { useState } from "react";
import type { LevelModalProps } from "./level-form-modal";
import type { CreateRequest, Level } from "@/app/api/services/levels";
import   api from "@/app/api/services/levels";
import { useMutation } from "@tanstack/react-query";
import { t } from "i18next";
import { useSearchParams } from "react-router";

const defaultLevelValue: CreateRequest = {
    name: "",
	start: "", // "2025-02-28T23:00:00.000Z",
	end: "", // "2025-03-30T23:00:00.000Z",
};
export function useLevelModal(onSuccess:CallableFunction){ //
	const [searchParams] = useSearchParams();
	defaultLevelValue.programId = searchParams.get('programId') ?? undefined
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
	

	const [modalProps, setModalProps] = useState<LevelModalProps>({
		formValue: { ...defaultLevelValue },
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

	const onCreate = (record?: Level) => {
		setModalProps((prev) => ({
			...prev,
			show: true,
			...defaultLevelValue,
			title: t('common.create'),
			formValue: { ...defaultLevelValue, parentId: record?.id ?? "" },
		}));
	};

	const onEdit = (data: Level) => {
		setModalProps((prev) => ({
			...prev,
			show: true,
			title: t('common.edit'),
			formValue:data,
		}));
	};

    return {modalProps, setModalProps, onCreate, onEdit, mutation}
}