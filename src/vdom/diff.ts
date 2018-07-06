import { ReactElement } from "../ReactElement";

// https://reactjs.org/docs/reconciliation.html#the-diffing-algorithm
export function diff(oldEle: ReactElement, newEle: ReactElement) {
    if (oldEle.type === newEle.type) {

    } else {
        return
    }
}
