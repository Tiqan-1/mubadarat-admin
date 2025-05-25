 
import { faker } from "@faker-js/faker";
 
import DEFAULT_PERMISSION from "@/app/routes";
  

import { BasicStatus } from "@/framework/types/enum";
import type { Permission, Role } from "@/framework/types/entity";


export const PERMISSION_LIST : Permission[] = [
	...DEFAULT_PERMISSION,
]; 

/**
 * User roles mock
 */
export const ADMIN_ROLE: Role = {
	id: "1",
	name: "Admin",
	label: "admin",
	status: BasicStatus.ENABLE,
	order: 1,
	desc: "Super Admin",
	permission: PERMISSION_LIST,
};
const TEST_ROLE = {
	id: "2",
	name: "Test",
	label: "test",
	status: BasicStatus.ENABLE,
	order: 2,
	desc: "test",
	permission: PERMISSION_LIST.slice(0,1),
}; 


/**
 * User accounts mock
 */

export const ADMIN_USER = {
	id: 1,
	username: "admin",
	password: "123456",
	email: 'admin@gmail.com',
	avatar: faker.image.avatarGitHub(),
	createdAt: faker.date.anytime(),
	updatedAt: faker.date.recent(),
	role: ADMIN_ROLE,
	permissions: ADMIN_ROLE.permission,
}; 
export const TEST_USER = {
	id: 2,
	username: "test",
	password: "123456",
	email: 'test@gmail.com',
	avatar: faker.image.avatarGitHub(),
	createdAt: faker.date.anytime(),
	updatedAt: faker.date.recent(),
	role: TEST_ROLE,
	permissions: TEST_ROLE.permission,
}; 


export const USER_LIST = [ADMIN_USER, TEST_USER];