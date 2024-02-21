import nextAuth from "next-auth"
import { nextAuthOptions } from "./authOptions"

const handler = nextAuth(nextAuthOptions)

export { handler as GET, handler as POST}