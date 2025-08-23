export interface Result<T = any> {
	status: number;
	message: string|string[];
	data?: T;
}
