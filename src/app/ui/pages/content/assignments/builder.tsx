
import {FormBuilder} from 'json-form-builder';
import type { FormDefinition } from 'json-form-builder';
import 'json-form-builder/style.css';
import { useSearchParams } from 'react-router';
import api from "@/app/api/services/assignments";
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { CircleLoading } from '@/app/ui/components/loading';
// import PageError from '../../sys/error/PageError';

// // --- MOCK ASYNC FUNCTIONS ---
// const getRemoteData = async (): Promise<FormDefinition> => {
//   console.log("Fetching data from server...");
  
//   await new Promise(resolve => setTimeout(resolve, 1000));
  
//   const mockData: FormDefinition = {
//     settings: { id: 'loaded-from-server', postUrl: '/api/server-endpoint' },
//     options: {},
//     slides: [{ elements: [{ id: '12345', type: 'h1', text: 'This Form Was Loaded from a Server!' }] }],
//   };
  
//   // To simulate a failure, you could uncomment this:
//   // throw new Error("Could not connect to the database.");

//   return mockData;
// };

// const saveRemoteData = async (data: FormDefinition): Promise<string | null> => {
//   console.log("Saving data to server:", data);
  
//   await new Promise(resolve => setTimeout(resolve, 1500));
  
//   // To simulate a validation error from the server, you could uncomment this:
//   // return "The form ID 'loaded-from-server' is already taken. Please choose another.";

//   // On success, return null
//   return null; 
// };
// // --- END MOCK FUNCTIONS ---



function AssignmentBuilder() {
  const [, setForm] = useState<FormDefinition | undefined>(undefined);
  const [searchParams] = useSearchParams();
  const assignmentId = searchParams.get('id') ?? undefined;

  // reusable fetcher
  const fetchAssignment = async () => {
    if (!assignmentId) return undefined;
    const res = await api.get({ id: assignmentId });
    const assignmentData = res?.items?.[0];
    if (!assignmentData?.form) return undefined;

    return {
      settings: assignmentData.form.settings ?? {},
      options: assignmentData.form.options ?? {},
      slides: assignmentData.form.slides ?? [],
      startSlide: assignmentData.form.startSlide,
      endSlide: assignmentData.form.endSlide
    } satisfies FormDefinition;
  };

  // useQuery for initial data
  const { data: initialData, isLoading } = useQuery({
    queryKey: ['assignments', assignmentId],
    queryFn: fetchAssignment,
    refetchOnWindowFocus: false,
    retry: false,
  });

  // useMutation for saving
  const mutation = useMutation({
    mutationFn: async (obj: { id: string | undefined; data: FormDefinition }) => {
      console.log('mutationFn', obj);
      setForm(obj.data);
      return api.update(obj.id!, { form: obj.data });
    },
  });

  async function saveRemoteData(data: FormDefinition) {
    try {
      // await new Promise(resolve => setTimeout(resolve, 3000));
      await mutation.mutateAsync({ id: assignmentId, data });
      return null;
    } catch (err: any) {
      return err.message ?? "Failed to save form";
    }
  }

  async function loadRemoteData() : Promise<FormDefinition> {
    try {
      return await fetchAssignment() ?? {
        settings:  {},
        options:  {},
        slides:  [], 
      } satisfies FormDefinition;
    } catch (err: any) {
      console.error("Load error", err);
      return {
        settings:  {},
        options:  {},
        slides:  [], 
      } satisfies FormDefinition;
    }
  }

  // if(isError) {
  //   return <PageError error={"| Can't Load Data |"} resetErrorBoundary={()=>null} />
  // }

  return (
    <div className="h-screen w-screen">
      {isLoading && <CircleLoading/>}
      {!isLoading && (
        <FormBuilder
          initialData={initialData}
          onLoad={loadRemoteData}
          onSave={saveRemoteData}
        />
      )}
    </div>
  );
}



export default AssignmentBuilder;


// function AssignmentBuilder() {
//   const [form, setForm] = useState<FormDefinition | undefined>(undefined);
// 	const [searchParams] = useSearchParams();
// 	const assignmentId = searchParams.get('id') ?? undefined
//   const {data, isLoading} = useQuery({queryKey: ['assignments'], queryFn: () => api.get({id:assignmentId}), refetchOnWindowFocus:false}); 
// 	const mutation = useMutation({
// 		mutationFn: (obj:{id:string|undefined,data:any}) => {
// 			console.log('mutationFn', obj);
//       setForm(obj.data)
// 			return api.update(  obj.id!, {form:obj.data} )
// 		},
// 		onSuccess : ()=>{
// 			console.log('onSuccess');
// 		},
// 		onError(error, variables, context) {
// 			console.log('onError',error, variables, context);
// 		},
// 	})
//   const assignmentData = data?.items[0] ?? undefined;
  
//   // let form : FormDefinition|undefined = undefined
//   if(form==null && assignmentData?.form !== undefined){
//     setForm({
//       settings: assignmentData?.form.settings ?? {},
//       options: assignmentData?.form.options ?? {},
//       slides: assignmentData?.form.slides ?? [],
//       startSlide: assignmentData?.form.startSlide,
//       endSlide: assignmentData?.form.endSlide
//     })
//   }

  
//   async function   saveRemoteData(data: FormDefinition) {
//       console.log("Saving data to server:", data);
       

// 			mutation.mutate({id:assignmentId, data});
//       await new Promise(resolve => setTimeout(resolve, 1500));
      
//       // To simulate a validation error from the server, you could uncomment this:
//       // return "The form ID 'loaded-from-server' is already taken. Please choose another.";

//       // On success, return null
//       return null; 
//     }
//   return (
//     <div className="h-screen w-screen">
//       {isLoading && <p>Loading data...</p>}
//       {!isLoading && <FormBuilder
//         initialData={form}  
//         // onLoad={getRemoteData}
//         onSave={saveRemoteData}
//       />
//       }
      
//     </div>
//   );
// }