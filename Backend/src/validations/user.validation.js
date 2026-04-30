import { z } from "zod";


// We are keeping it because our project structure is 
// validation --> controller --> service
export const requestInstructorSchema = z.object({})

// in future if we need to validate someting we will already have validation schema.