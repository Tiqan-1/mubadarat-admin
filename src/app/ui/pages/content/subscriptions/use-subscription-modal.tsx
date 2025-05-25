 
import { useState } from "react";
import type { SubscriptionModalProps } from "./subscription-form-modal";
import type { CreateRequest, Subscription } from "@/app/api/services/subscriptions";
import   api from "@/app/api/services/subscriptions";
import { useMutation } from "@tanstack/react-query";
import { t } from "i18next";

const defaultSubscriptionValue: CreateRequest = {
    state: "",
    notes: "",
};
export function useSubscriptionModal(onSuccess:CallableFunction){ //
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
	

	const [modalProps, setModalProps] = useState<SubscriptionModalProps>({
		formValue: { ...defaultSubscriptionValue },
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

	const onCreate = (record?: Subscription) => {
		setModalProps((prev) => ({
			...prev,
			show: true,
			...defaultSubscriptionValue,
			title: t('common.create'),
			formValue: { ...defaultSubscriptionValue, parentId: record?.id ?? "" },
		}));
	};

	const onEdit = (data: Subscription) => {
		setModalProps((prev) => ({
			...prev,
			show: true,
			title: t('common.edit'),
			formValue:data,
		}));
	};

    return {modalProps, setModalProps, onCreate, onEdit, mutation}
}