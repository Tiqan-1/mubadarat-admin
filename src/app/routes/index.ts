
import type { Permission } from "@/framework/types/entity";
import { PermissionType } from "@/framework/types/enum"; 
 
const routes : Permission[] = [
	{
		order: 1,
		id: "programs",
		parentId: "",
		label: "app.programs.title",
		name: "Programs",
		icon: "ic-management",
		type: PermissionType.MENU,
		route: "programs",
		component: "/content/programs/index.tsx",
	},
	{
		order: 1,
		id: "levels",
		parentId: "",
		label: "app.levels.title",
		name: "Levels",
		icon: "solar:layers-minimalistic-broken",
		type: PermissionType.MENU,
		route: "levels",
		component: "/content/levels/index.tsx",
	},
	{
		order: 1,
		id: "subjects",
		parentId: "",
		label: "app.subjects.title",
		name: "Subjects",
		icon: "solar:book-2-broken",
		type: PermissionType.MENU,
		route: "subjects",
		component: "/content/subjects/index.tsx",
	},
	{
		order: 1,
		id: "lessons",
		parentId: "",
		label: "app.lessons.title",
		name: "Lessons",
		icon: "solar:video-frame-play-horizontal-broken",
		type: PermissionType.MENU,
		route: "lessons",
		component: "/content/lessons/index.tsx",
	},
	{
		order: 1,
		id: "tasks",
		parentId: "",
		label: "app.tasks.title",
		name: "Tasks",
		icon: "solar:bill-list-broken",
		type: PermissionType.MENU,
		route: "tasks",
		component: "/content/tasks/index.tsx",
	},
	{
		order: 1,
		id: "subscriptions",
		parentId: "",
		label: "app.subscriptions.title",
		name: "Tasks",
		icon: "solar:people-nearby-broken",
		type: PermissionType.MENU,
		route: "subscriptions",
		component: "/content/subscriptions/index.tsx",
	},
]  ; 

export default routes;
 