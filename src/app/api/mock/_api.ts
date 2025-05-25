import { faker } from "@faker-js/faker";
import { http, HttpResponse, delay } from "msw";
 
import { USER_LIST } from "./assets";
import type { UserInfo } from "@/framework/types/entity";
import { AuthApi } from "@/app/api/services/auth"; 

const tokenExpired = http.post(`/api${AuthApi.tokenExpired}`, () => {
	return new HttpResponse(null, { status: 401 });
});

const signIn = http.post(`/api${AuthApi.signIn}`, async ({ request }) => {
	const { email, password } = await request.json() as any;

	const user = USER_LIST.find((item) => item.email === email);

	if (!user || user.password !== password) {
		return HttpResponse.json({
			status: 10001,
			message: "Incorrect email or password.",
		}, { status: 401 });
	}

	return HttpResponse.json({
		...user,
		accessToken: faker.string.uuid(),
		refreshToken: faker.string.uuid(),
	});
});


const usersList = http.get(`/api${AuthApi.users}`, async () => {
	await delay(1000); 
	return HttpResponse.json(
		Array.from({ length: 10 }).map(() :Partial<UserInfo> => ({
			id: faker.git.commitSha(),
			username: faker.person.firstName(),
			email: faker.internet.email(),
			avatar: faker.image.avatarGitHub()
		})),
		{
			status: 200,
		},
	);
});
 
export default [signIn, tokenExpired, usersList];
