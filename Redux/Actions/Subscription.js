import { SUBSCRIPTION, SUBSCRIBED_PACKAGE, RECEIPT, STORAGE } from '../Types/Index'


const Packages = (payload) => ({
    type: SUBSCRIPTION,
    payload
})

const Subscribed_Package = (payload) => ({
    type: SUBSCRIBED_PACKAGE,
    payload
})
const Receipt = (payload) => ({
    type: RECEIPT,
    payload
})
const Storage = (payload) => ({
    type: STORAGE,
    payload
})


export { Packages, Subscribed_Package, Receipt, Storage }