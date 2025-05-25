import { setupWorker } from "msw/browser";
 
import handlers from "@/app/api/mock";
 
const worker = setupWorker(...handlers);

export default worker;
