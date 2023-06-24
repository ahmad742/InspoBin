import { HAS_SESSION } from '../Types/Index'


export const onLogin = (payload) => ({
    type: HAS_SESSION,
    payload
}) 